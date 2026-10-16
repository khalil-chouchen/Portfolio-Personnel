# api/scrape.py
# Live demo of the 3M Consulting lead finder, served as a Vercel Python function.
# GET /api/scrape?url=example.com
#   -> crawls the homepage plus up to two contact/careers pages and returns
#      company name, emails, phones, WhatsApp, social links and a lead score.
#
# Extraction logic is ported from the healthcare-lead-finder CLI
# (scrapers/parser.py, utils/email_utils.py, utils/lead_scorer.py), made
# sector-neutral and hardened for a public endpoint (no private IPs,
# hard time budget, size cap, per-IP rate limit, robots.txt respected).

import ipaddress
import json
import re
import socket
import time
import urllib.parse
import urllib.robotparser
from http.server import BaseHTTPRequestHandler

import phonenumbers
import requests
from bs4 import BeautifulSoup

USER_AGENT = "KhalilLeadFinderDemo/1.0 (+https://khalilchouchen.me)"
TIME_BUDGET = 8.0          # seconds for the whole request
REQUEST_TIMEOUT = 4.0      # seconds per HTTP call
MAX_BYTES = 1_500_000      # per page
MAX_SUBPAGES = 2
MAX_REDIRECTS = 4
RATE_LIMIT = 8             # requests per IP per window
RATE_WINDOW = 60.0

_EMAIL_RE = re.compile(
    r"(?<![a-zA-Z0-9._%+\-])[a-zA-Z0-9._%+\-]{1,64}@[a-zA-Z0-9.\-]{1,253}\.[a-zA-Z]{2,}(?![a-zA-Z0-9._%+\-])"
)
_WHATSAPP_RE = re.compile(r"(?:wa\.me/|api\.whatsapp\.com/send/?\?phone=|whatsapp://send\?phone=)\+?(\d{6,15})", re.IGNORECASE)

_CONTACT_KW = {"contact", "about", "reach", "get-in-touch", "getintouch", "nous-contacter", "a-propos", "اتصل"}
_CAREERS_KW = {"career", "careers", "job", "jobs", "vacancy", "vacancies", "recruitment", "hiring", "join-us", "work-with-us", "emploi", "recrutement", "carriere", "توظيف", "وظائف"}
_GENERIC_TITLE = {"home", "contact", "about", "us", "welcome", "index", "main", "page", "site", "official", "website", "accueil"}

JUNK_PREFIXES = {"test", "example", "noreply", "no-reply", "webmaster", "postmaster", "donotreply", "do-not-reply", "bounce", "mailer-daemon"}
JUNK_DOMAINS = {"example.com", "test.com", "domain.com", "yourdomain.com", "email.com", "sample.com", "placeholder.com", "yourcompany.com", "yoursite.com", "company.com", "sentry.io", "wixpress.com", "sentry-next.wixpress.com"}
JUNK_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".css", ".js")
HR_PREFIXES = {"hr", "careers", "career", "recruitment", "recruit", "jobs", "talent", "employment", "hiring", "rh", "emploi"}
GENERAL_PREFIXES = {"info", "contact", "hello", "enquiries", "enquiry", "admin", "sales", "apply", "support"}
FREE_MAIL_DOMAINS = {"gmail.com", "yahoo.com", "yahoo.fr", "hotmail.com", "hotmail.fr", "outlook.com", "live.com", "icloud.com", "mail.com", "protonmail.com", "ymail.com"}

SOCIALS = {
    "linkedin": ("linkedin.com/company/", "linkedin.com/in/", "linkedin.com/school/"),
    "facebook": ("facebook.com/", "fb.com/"),
    "instagram": ("instagram.com/",),
    "x": ("twitter.com/", "x.com/"),
    "tiktok": ("tiktok.com/@",),
    "youtube": ("youtube.com/",),
}
_SOCIAL_SKIP = ("sharer", "share?", "/share", "intent/", "login", "dialog/", "plugins/", "/watch?", "/embed/")

# Country-code TLD -> default phone region for numbers written without "+".
TLD_REGION = {"tn": "TN", "sa": "SA", "fr": "FR", "dz": "DZ", "ma": "MA", "qa": "QA", "ae": "AE", "kw": "KW", "eg": "EG", "uk": "GB", "de": "DE", "it": "IT", "es": "ES", "ca": "CA", "be": "BE", "ch": "CH", "al": "AL", "ro": "RO"}

_hits: dict[str, list[float]] = {}


class ScrapeError(Exception):
    def __init__(self, code: str, status: int = 400):
        super().__init__(code)
        self.code = code
        self.status = status


# ---------------------------------------------------------------------------
# Safe fetching
# ---------------------------------------------------------------------------

def normalize_url(raw: str) -> str:
    raw = (raw or "").strip()
    if not raw or len(raw) > 300:
        raise ScrapeError("invalid_url")
    if not re.match(r"^https?://", raw, re.IGNORECASE):
        raw = "https://" + raw
    parsed = urllib.parse.urlparse(raw)
    if parsed.scheme not in ("http", "https") or not parsed.hostname or "." not in parsed.hostname:
        raise ScrapeError("invalid_url")
    if parsed.username or parsed.password or (parsed.port and parsed.port not in (80, 443)):
        raise ScrapeError("invalid_url")
    return urllib.parse.urlunparse((parsed.scheme.lower(), parsed.netloc.lower(), parsed.path or "/", "", parsed.query, ""))


def assert_public_host(host: str) -> None:
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        raise ScrapeError("dns_failed", 422)
    for info in infos:
        ip = ipaddress.ip_address(info[4][0].split("%")[0])
        if not ip.is_global or ip.is_multicast:
            raise ScrapeError("blocked_host", 422)


def fetch(url: str, deadline: float) -> tuple[str, str]:
    """GET with manual redirects so every hop is checked against private IPs."""
    current = url
    for _ in range(MAX_REDIRECTS + 1):
        remaining = deadline - time.monotonic()
        if remaining <= 0.5:
            raise ScrapeError("timeout", 504)
        host = urllib.parse.urlparse(current).hostname or ""
        assert_public_host(host)
        try:
            resp = requests.get(current, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"}, timeout=min(REQUEST_TIMEOUT, remaining), allow_redirects=False, stream=True)
        except requests.exceptions.Timeout:
            raise ScrapeError("timeout", 504)
        except requests.exceptions.RequestException:
            raise ScrapeError("fetch_failed", 502)
        if resp.is_redirect or resp.is_permanent_redirect:
            location = resp.headers.get("Location", "")
            resp.close()
            nxt = urllib.parse.urljoin(current, location)
            if urllib.parse.urlparse(nxt).scheme not in ("http", "https"):
                raise ScrapeError("fetch_failed", 502)
            current = nxt
            continue
        if resp.status_code >= 400:
            resp.close()
            raise ScrapeError("http_error", 502)
        ctype = resp.headers.get("Content-Type", "")
        if "html" not in ctype and "xml" not in ctype:
            resp.close()
            raise ScrapeError("not_html", 422)
        body = b""
        for chunk in resp.iter_content(32_768):
            body += chunk
            if len(body) > MAX_BYTES or time.monotonic() > deadline:
                break
        resp.close()
        return current, body.decode(resp.encoding or "utf-8", errors="replace")
    raise ScrapeError("too_many_redirects", 502)


def robots_allows(url: str, deadline: float) -> bool:
    parsed = urllib.parse.urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    try:
        assert_public_host(parsed.hostname or "")
        resp = requests.get(robots_url, headers={"User-Agent": USER_AGENT}, timeout=min(2.5, max(0.5, deadline - time.monotonic())), allow_redirects=False)
        if resp.status_code != 200:
            return True
        rp = urllib.robotparser.RobotFileParser()
        rp.parse(resp.text[:200_000].splitlines())
        return rp.can_fetch(USER_AGENT, url)
    except Exception:
        return True


# ---------------------------------------------------------------------------
# Extraction (ported from scrapers/parser.py)
# ---------------------------------------------------------------------------

def _json_ld_items(soup):
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
        except (json.JSONDecodeError, TypeError):
            continue
        items = data if isinstance(data, list) else [data]
        for item in items:
            if isinstance(item, dict):
                yield item
                for sub in item.get("@graph", []) if isinstance(item.get("@graph"), list) else []:
                    if isinstance(sub, dict):
                        yield sub


def extract_company_name(soup, url: str) -> tuple[str, str]:
    for item in _json_ld_items(soup):
        kind = item.get("@type", "")
        kind = " ".join(kind) if isinstance(kind, list) else str(kind)
        if any(t in kind for t in ("Organization", "LocalBusiness", "Corporation", "School", "CollegeOrUniversity")):
            name = str(item.get("name", "")).strip()
            if name:
                return name, "schema.org"
    og = soup.find("meta", property="og:site_name")
    if og and og.get("content", "").strip():
        return og["content"].strip(), "og:site_name"
    title = soup.find("title")
    if title and title.string:
        parts = [s.strip() for s in re.split(r"\s*[|\-–—:·]\s*", title.string.strip())]
        parts = [s for s in parts if len(s) > 2 and s.lower() not in _GENERIC_TITLE]
        if parts:
            return min(parts, key=len) if len(parts) > 1 else parts[0], "title"
    host = (urllib.parse.urlparse(url).hostname or "").removeprefix("www.")
    return host.split(".")[0].replace("-", " ").title() or "Unknown", "domain"


def is_valid_email(email: str) -> bool:
    if email.count("@") != 1:
        return False
    local, domain = email.rsplit("@", 1)
    if local in JUNK_PREFIXES or domain in JUNK_DOMAINS or "." not in domain:
        return False
    if email.endswith(JUNK_SUFFIXES) or re.fullmatch(r"[0-9a-f]{16,}", local):
        return False
    return True


def email_type(email: str) -> str:
    local, domain = email.rsplit("@", 1)
    free = domain in FREE_MAIL_DOMAINS
    if free:
        return "personal"
    if local in HR_PREFIXES:
        return "hr"
    return "business"


def email_rank(email: str) -> int:
    local, domain = email.rsplit("@", 1)
    if domain in FREE_MAIL_DOMAINS:
        return 3
    if local in HR_PREFIXES:
        return 0
    return 1 if local in GENERAL_PREFIXES else 2


def extract_emails(soup) -> list[str]:
    found: list[str] = []
    for a in soup.find_all("a", href=True):
        if a["href"].lower().startswith("mailto:"):
            found.append(urllib.parse.unquote(a["href"][7:].split("?")[0]).strip().lower())
    found += [m.group(0).lower() for m in _EMAIL_RE.finditer(soup.get_text(" "))]
    return [e for e in dict.fromkeys(found) if is_valid_email(e)]


def extract_phones(soup, region: str | None) -> list[str]:
    candidates: list[str] = []
    for a in soup.find_all("a", href=True):
        if a["href"].lower().startswith("tel:"):
            candidates.append(urllib.parse.unquote(a["href"][4:]))
    out: list[str] = []
    for raw in candidates:
        try:
            parsed = phonenumbers.parse(raw, region)
            if phonenumbers.is_valid_number(parsed):
                out.append(phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164))
        except phonenumbers.NumberParseException:
            pass
    text = soup.get_text(" ")[:200_000]
    # Unknown region ("ZZ") only accepts numbers written in international +XX form.
    for match in phonenumbers.PhoneNumberMatcher(text, region or "ZZ", leniency=phonenumbers.Leniency.VALID):
        out.append(phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164))
    return list(dict.fromkeys(out))


def extract_whatsapp(soup) -> list[str]:
    hits = [m.group(1) for a in soup.find_all("a", href=True) for m in [_WHATSAPP_RE.search(a["href"])] if m]
    hits += [m.group(1) for m in _WHATSAPP_RE.finditer(soup.get_text(" "))]
    return ["+" + h for h in dict.fromkeys(hits)]


def extract_socials(soup) -> dict[str, str]:
    out: dict[str, str] = {}
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith("//"):
            href = "https:" + href
        low = href.lower()
        if not low.startswith("http") or any(s in low for s in _SOCIAL_SKIP):
            continue
        for network, needles in SOCIALS.items():
            if network not in out and any(n in low for n in needles):
                path = urllib.parse.urlparse(href).path.strip("/")
                if path:
                    out[network] = href.split("?")[0]
    return out


def _matching_links(soup, base_url: str, keywords: set[str]) -> list[str]:
    base_host = urllib.parse.urlparse(base_url).netloc.lower().removeprefix("www.")
    links: list[str] = []
    for a in soup.find_all("a", href=True):
        combined = (a["href"] + " " + a.get_text(" ")).lower()
        if not any(kw in combined for kw in keywords):
            continue
        full = urllib.parse.urljoin(base_url, a["href"]).split("#")[0]
        if full.startswith("http") and urllib.parse.urlparse(full).netloc.lower().removeprefix("www.") == base_host and full.rstrip("/") != base_url.rstrip("/"):
            links.append(full)
    return list(dict.fromkeys(links))[:3]


# ---------------------------------------------------------------------------
# Scoring (sector-neutral version of utils/lead_scorer.py)
# ---------------------------------------------------------------------------

def score_lead(lead: dict) -> tuple[int, list[dict]]:
    business_email = any(e["type"] != "personal" for e in lead["emails"])
    checks = [
        ("email", 20, bool(lead["emails"])),
        ("business_email", 10, business_email),
        ("phone", 20, bool(lead["phones"])),
        ("whatsapp", 15, bool(lead["whatsapp"])),
        ("contact_page", 10, bool(lead["contactPage"])),
        ("socials", 10, bool(lead["socials"])),
        ("careers_page", 5, bool(lead["careersPage"])),
        ("verified_name", 10, lead["nameSource"] in ("schema.org", "og:site_name")),
    ]
    breakdown = [{"key": k, "points": p, "hit": hit} for k, p, hit in checks]
    return min(100, sum(p for _, p, hit in checks if hit)), breakdown


def scrape(raw_url: str) -> dict:
    started = time.monotonic()
    deadline = started + TIME_BUDGET
    url = normalize_url(raw_url)
    if not robots_allows(url, deadline):
        raise ScrapeError("robots_disallowed", 403)
    final_url, html = fetch(url, deadline)
    soup = BeautifulSoup(html, "html.parser")
    host = (urllib.parse.urlparse(final_url).hostname or "")
    region = TLD_REGION.get(host.rsplit(".", 1)[-1])

    name, name_source = extract_company_name(soup, final_url)
    contact_links = _matching_links(soup, final_url, _CONTACT_KW)
    careers_links = _matching_links(soup, final_url, _CAREERS_KW)
    emails, phones, whatsapp, socials = extract_emails(soup), extract_phones(soup, region), extract_whatsapp(soup), extract_socials(soup)
    pages = [final_url]

    for sub in (contact_links[:1] + careers_links[:1])[:MAX_SUBPAGES]:
        if sub in pages or deadline - time.monotonic() < 1.5:
            continue
        try:
            sub_url, sub_html = fetch(sub, deadline)
        except ScrapeError:
            continue
        pages.append(sub_url)
        sub_soup = BeautifulSoup(sub_html, "html.parser")
        emails += extract_emails(sub_soup)
        phones += extract_phones(sub_soup, region)
        whatsapp += extract_whatsapp(sub_soup)
        for network, link in extract_socials(sub_soup).items():
            socials.setdefault(network, link)

    emails = sorted(dict.fromkeys(emails), key=email_rank)[:8]
    lead = {
        "url": final_url,
        "domain": host.removeprefix("www."),
        "name": name,
        "nameSource": name_source,
        "emails": [{"value": e, "type": email_type(e)} for e in emails],
        "phones": list(dict.fromkeys(phones))[:6],
        "whatsapp": list(dict.fromkeys(whatsapp))[:3],
        "socials": socials,
        "contactPage": contact_links[0] if contact_links else None,
        "careersPage": careers_links[0] if careers_links else None,
        "pagesCrawled": pages,
    }
    lead["score"], lead["breakdown"] = score_lead(lead)
    lead["elapsedMs"] = int((time.monotonic() - started) * 1000)
    return lead


def rate_limited(ip: str) -> bool:
    now = time.monotonic()
    recent = [t for t in _hits.get(ip, []) if now - t < RATE_WINDOW]
    recent.append(now)
    _hits[ip] = recent
    if len(_hits) > 5000:
        _hits.clear()
    return len(recent) > RATE_LIMIT


class handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Robots-Tag", "noindex")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        ip = (self.headers.get("x-forwarded-for") or self.client_address[0]).split(",")[0].strip()
        if rate_limited(ip):
            return self._send(429, {"error": "rate_limited"})
        query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        try:
            return self._send(200, scrape(query.get("url", [""])[0]))
        except ScrapeError as exc:
            return self._send(exc.status, {"error": exc.code})
        except Exception:
            return self._send(500, {"error": "internal"})

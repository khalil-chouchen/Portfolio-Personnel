import { FormEvent, useEffect, useState } from "react";
import { Download, ExternalLink, Search } from "lucide-react";
import { profile, type Locale } from "@/data/profile";
import "./portfolio.css";

type Lead = {
  url: string;
  domain: string;
  name: string;
  nameSource: string;
  emails: { value: string; type: "hr" | "business" | "personal" }[];
  phones: string[];
  whatsapp: string[];
  socials: Record<string, string>;
  contactPage: string | null;
  careersPage: string | null;
  pagesCrawled: string[];
  score: number;
  breakdown: { key: string; points: number; hit: boolean }[];
  elapsedMs: number;
};

const SAMPLES = ["esprit.tn", "pnu.edu.sa", "python.org"];
const NETWORKS: Record<string, string> = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram", x: "X", tiktok: "TikTok", youtube: "YouTube" };

function toCsv(lead: Lead) {
  const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = ["company_name", "website", "email", "phone", "whatsapp", "linkedin", "facebook", "instagram", "contact_page", "careers_page", "confidence_score"];
  const row = [lead.name, lead.url, lead.emails.map(e => e.value).join(" | "), lead.phones.join(" | "), lead.whatsapp.join(" | "), lead.socials.linkedin ?? "", lead.socials.facebook ?? "", lead.socials.instagram ?? "", lead.contactPage ?? "", lead.careersPage ?? "", String(lead.score)];
  return `${header.join(",")}\n${row.map(cell).join(",")}\n`;
}

export default function LeadScraperDemo({ locale }: { locale: Locale }) {
  const ui = profile.scraperDemo[locale];
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (state !== "loading") return;
    setStage(0);
    const timer = window.setInterval(() => setStage(value => Math.min(value + 1, ui.stages.length - 1)), 1100);
    return () => window.clearInterval(timer);
  }, [state, ui.stages.length]);

  const run = async (target: string) => {
    if (!target.trim() || state === "loading") return;
    setUrl(target);
    setState("loading");
    setLead(null);
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(target.trim())}`);
      const data = await response.json().catch(() => ({ error: "unavailable" }));
      if (!response.ok || data.error) throw new Error(data.error || "internal");
      setLead(data as Lead);
      setState("done");
    } catch (err) {
      const code = err instanceof Error ? err.message : "internal";
      setError(ui.errors[code as keyof typeof ui.errors] ?? ui.errors.internal);
      setState("error");
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); run(url); };

  const download = () => {
    if (!lead) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["﻿" + toCsv(lead)], { type: "text/csv;charset=utf-8" }));
    link.download = `lead-${lead.domain}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return <div className="scraper-demo">
    <div className="live-bar"><span className="dots"><i /><i /><i /></span><span className="url"><b className="live-dot" />{ui.bar}</span></div>
    <div className="scraper-body">
      <form className="scraper-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="scraper-url">{ui.placeholder}</label>
        <input id="scraper-url" value={url} onChange={event => setUrl(event.target.value)} placeholder={ui.placeholder} inputMode="url" autoComplete="off" spellCheck={false} />
        <button type="submit" disabled={state === "loading"}><Search size={14} /> {state === "loading" ? ui.scanning : ui.scan}</button>
      </form>
      <div className="scraper-samples"><span>{ui.try}</span>{SAMPLES.map(sample => <button key={sample} type="button" onClick={() => run(sample)} disabled={state === "loading"}>{sample}</button>)}</div>
      <div className="scraper-output" aria-live="polite">
        {state === "idle" && <p className="scraper-hint">{ui.hint}</p>}
        {state === "loading" && <div className="scraper-loading"><div className="scraper-progress" />{ui.stages.slice(0, stage + 1).map((line, index) => <p key={line}><b>{index < stage ? "✓" : "›"}</b> {line}</p>)}</div>}
        {state === "error" && <p className="scraper-error">{error}</p>}
        {state === "done" && lead && <div className="scraper-result">
          <div className="scraper-head">
            <div><h4>{lead.name}</h4><a href={lead.url} target="_blank" rel="noopener noreferrer nofollow">{lead.domain} <ExternalLink size={11} /></a></div>
            <div className="scraper-score" style={{ "--score": lead.score } as React.CSSProperties}><strong>{lead.score}</strong><span>/100</span></div>
          </div>
          <dl>
            <div><dt>{ui.fields.emails}</dt><dd>{lead.emails.length ? lead.emails.map(email => <span key={email.value}>{email.value}<em>{ui.emailTypes[email.type]}</em></span>) : <i>{ui.none}</i>}</dd></div>
            <div><dt>{ui.fields.phones}</dt><dd>{lead.phones.length ? lead.phones.map(phone => <span key={phone}>{phone}</span>) : <i>{ui.none}</i>}</dd></div>
            <div><dt>WhatsApp</dt><dd>{lead.whatsapp.length ? lead.whatsapp.map(number => <a key={number} href={`https://wa.me/${number.replace("+", "")}`} target="_blank" rel="noopener noreferrer nofollow">{number}</a>) : <i>{ui.none}</i>}</dd></div>
            <div><dt>{ui.fields.socials}</dt><dd>{Object.keys(lead.socials).length ? Object.entries(lead.socials).map(([network, link]) => <a key={network} href={link} target="_blank" rel="noopener noreferrer nofollow">{NETWORKS[network] ?? network}</a>) : <i>{ui.none}</i>}</dd></div>
            <div><dt>{ui.fields.pages}</dt><dd>{lead.contactPage && <a href={lead.contactPage} target="_blank" rel="noopener noreferrer nofollow">{ui.contact}</a>}{lead.careersPage && <a href={lead.careersPage} target="_blank" rel="noopener noreferrer nofollow">{ui.careers}</a>}{!lead.contactPage && !lead.careersPage && <i>{ui.none}</i>}</dd></div>
          </dl>
          <div className="scraper-breakdown">{lead.breakdown.map(item => <span key={item.key} className={item.hit ? "hit" : ""}>{item.hit ? "+" : "·"}{item.points} {ui.checks[item.key as keyof typeof ui.checks] ?? item.key}</span>)}</div>
          <div className="scraper-foot"><span>{lead.pagesCrawled.length} {ui.pagesLabel} · {(lead.elapsedMs / 1000).toFixed(1)}s</span><button type="button" onClick={download}><Download size={13} /> {ui.export}</button></div>
        </div>}
      </div>
      <p className="scraper-note">{ui.note}</p>
    </div>
  </div>;
}

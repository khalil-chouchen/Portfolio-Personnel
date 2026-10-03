import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, Copy, Download, Github, Linkedin, Lock, Mail, Menu, Send, X } from "lucide-react";
import { profile, type Locale } from "@/data/profile";
import LiveSiteFrame from "./LiveSiteFrame";
import "./portfolio.css";

function Mark() { return <span className="wordmark">MKC<span>•</span></span>; }

function Spotlight({ viewLabel }: { viewLabel: string }) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    const move = (event: MouseEvent) => { targetX = event.clientX; targetY = event.clientY; };
    const over = (event: MouseEvent) => { const target = event.target as HTMLElement; const custom = target.closest("[data-cursor-label]") as HTMLElement | null; setLabel(custom?.dataset.cursorLabel || (target.closest("a, button") ? viewLabel : "")); };
    const tick = () => { currentX += (targetX - currentX) * .1; currentY += (targetY - currentY) * .1; root.style.setProperty("--spot-x", `${currentX}px`); root.style.setProperty("--spot-y", `${currentY}px`); frame = requestAnimationFrame(tick); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseover", over); frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); cancelAnimationFrame(frame); };
  }, [viewLabel]);
  return <><div className="spotlight" aria-hidden="true" /><span className={`cursor-orb ${label ? "cursor-active" : ""}`} aria-hidden="true"><span>{label}</span></span></>;
}

function SectionHeader({ number, title, accent, intro }: { number: string; title: string; accent?: string; intro?: string }) {
  return <header className="section-header"><span className="eyebrow">{number} /</span><h2>{title} {accent && <em>{accent}</em>}</h2>{intro && <p>{intro}</p>}</header>;
}

function AbstractVisual({ type, copy, extras }: { type: string; copy: typeof profile.content.en; extras: typeof profile.uiExtras.en }) {
  if (type === "agri") return <div className="abstract-visual visual-agri"><div className="sensor-path path-a" /><div className="sensor-path path-b" /><i /><i /><i /><span>{copy.liveField}</span></div>;
  if (type === "scrape") return <div className="abstract-visual visual-scrape"><div className="scan-beam" /><div className="scan-lines" /><span>{copy.scan}</span></div>;
  return <div className="abstract-visual visual-whatsapp"><div className="chat chat-one">{extras.chatFound}</div><div className="chat chat-two">{extras.chatSent}</div><div className="chat chat-three">{extras.chatPending}</div></div>;
}

function AdminVisual({ locale }: { locale: Locale }) {
  const ui = profile.projectUI[locale];
  return <div className="admin-slide-visual"><span className="admin-slide-chip"><Lock size={13} /> {ui.blurred}</span><div className="admin-slide-stack">{profile.threeMScreens.map((image, index) => <figure key={image}><div className="browser-bar"><i /><i /><i /><span>admin · private</span></div><div className="admin-slide-image"><img src={image} alt={index === 0 ? "3M Consulting client registrations admin screen" : "3M Consulting cash register admin screen"} loading="lazy" sizes="(max-width: 700px) 90vw, 520px" /><span><Lock size={14} /> {ui.internal}</span></div></figure>)}</div></div>;
}

function ProjectPanel({ project, index, type, copy, extras, title, tags, description, locale }: { project: typeof profile.projects[number]; index: number; type: string; copy: typeof profile.content.en; extras: typeof profile.uiExtras.en; title: string; tags: string[]; description: string; locale: Locale }) {
  const liveProject = index === 0;
  const adminProject = index === 3;
  return <article className={`project-panel ${liveProject ? "project-panel-live" : ""} ${adminProject ? "project-panel-admin" : ""}`} data-cursor-label={extras.view}><div className="project-meta"><span>0{index + 1}</span><span>{copy.projectTypes[index] || copy.caseStudy}</span></div>{liveProject ? <LiveSiteFrame url="https://www.3m-consultingcompany.com/" locale={locale} compact /> : adminProject ? <AdminVisual locale={locale} /> : <AbstractVisual type={type} copy={copy} extras={extras} />}<div className="project-copy"><h3>{title}</h3><p>{description}</p><div className="tag-list">{tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-actions">{liveProject && <a href="https://www.3m-consultingcompany.com/" target="_blank" rel="noreferrer">{profile.projectUI[locale].visit} <ArrowRight size={14} /></a>}{project.caseUrl && <a href={project.caseUrl}>{copy.caseStudy} <ArrowRight size={14} /></a>}{project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noreferrer">{copy.source} <ArrowRight size={14} /></a>}</div></div></article>;
}

function CopyContact({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1300); };
  return <button className="copy-contact" onClick={copy} aria-label={label}>{copied ? <Check size={17} /> : <Copy size={17} />}</button>;
}

function PhoneCarousel({ locale }: { locale: Locale }) {
  const track = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef({ start: 0, scroll: 0 });
  const ui = profile.agriUI[locale];
  const begin = (event: React.PointerEvent<HTMLDivElement>) => { if (!track.current) return; setDragging(true); dragState.current = { start: event.clientX, scroll: track.current.scrollLeft }; track.current.setPointerCapture(event.pointerId); };
  const drag = (event: React.PointerEvent<HTMLDivElement>) => { if (!dragging || !track.current) return; track.current.scrollLeft = dragState.current.scroll - (event.clientX - dragState.current.start); };
  return <div className="agri-showcase"><div className="nda-row"><span><Lock size={13} /> {ui.confidential}</span><p>{ui.note}</p></div><div className="phone-track" ref={track} onPointerDown={begin} onPointerMove={drag} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}>{profile.agriScreens.map(screen => { const text = screen[locale]; return <figure className="phone-card" key={screen.image}><div className="phone-image"><img src={screen.image} alt={text.title} loading="lazy" sizes="(max-width: 700px) 70vw, 250px" /><div className="nda-hover"><Lock size={15} /> {ui.details}</div></div><figcaption><b>{screen.step} / {text.title}</b><span>{text.copy}</span></figcaption></figure>; })}</div><p className="phone-scroll-hint"><ArrowRight size={14} /> {ui.scroll}</p></div>;
}

function Portfolio() {
  const [locale, setLocale] = useState<Locale>(() => { if (typeof window === "undefined") return "en"; const saved = window.localStorage.getItem("mkc-locale"); if (saved === "en" || saved === "fr") return saved; return window.navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en"; });
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "sent" | "error">("idle");
  const t = profile.labels[locale];
  const c = profile.content[locale];
  const extras = profile.uiExtras[locale];
  const disciplines = locale === "fr" ? ["Web", "Mobile", "IA", "IoT"] : ["Web", "Mobile", "AI", "IoT"];
  const [discipline, setDiscipline] = useState(0);
  useEffect(() => { setDiscipline(0); const timer = window.setInterval(() => setDiscipline(value => (value + 1) % disciplines.length), 2000); return () => window.clearInterval(timer); }, [locale, disciplines.length]);
  useEffect(() => { document.documentElement.lang = locale; window.localStorage.setItem("mkc-locale", locale); }, [locale]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormState("sent"); event.currentTarget.reset(); };
  const projects = [...profile.projects];
  const workTypes = ["website", "scrape", "whatsapp", "3m"];
  return <div className="portfolio-page">
    <Spotlight viewLabel={extras.view} />
    <header className="site-nav container"><a href="#top" aria-label={c.homeLabel}><Mark /></a><nav className={menuOpen ? "open" : ""}>{t.nav.map((item, index) => <a key={item} href={`#${["about", "skills", "work", "experience", "contact"][index]}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav><div className="nav-tools"><button onClick={() => setLocale(locale === "en" ? "fr" : "en")} aria-label={c.switchLanguage}>{locale === "en" ? "FR" : "EN"}</button><a href={profile.cv[locale]} download={`CV-Mohamed-Khalil-Chouchen-${locale.toUpperCase()}.pdf`} className="nav-cv">{c.cv} <Download size={13} /></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={c.switchLanguage}>{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main id="top">
      <section className="hero container"><div className="hero-noise" /><div className="hero-name" aria-hidden="true"><span>MOHAMED KHALIL</span><span>CHOUCHEN</span></div><div className="hero-glow" /><div className="hero-photo"><img src={profile.images.hero} alt={c.heroAlt} /><div className="hero-ground" /></div><div className="hero-content"><p className="mono-label"><i /> {c.available}</p><h1 className="sr-only">{profile.name}</h1><p className="hero-role">{locale === "fr" ? profile.roleFr : profile.role}<br /><strong>{disciplines[discipline]}</strong></p><div className="hero-buttons"><a className="button button-blue" href={profile.cv[locale]} download={`CV-Mohamed-Khalil-Chouchen-${locale.toUpperCase()}.pdf`}><Download size={15} /> {c.downloadCv}</a><a className="button button-line" href="#work">{c.seeWork} <ArrowDown size={15} /></a></div></div><div className="hero-award"><span>{c.awardPlace}</span><small>{c.awardName}<br />{c.awardEvent}</small></div><span className="hero-index">01 / 09</span></section>
      <div className="marquee" aria-label={c.skillsTitle}><div>{c.marquee}{c.marquee}</div></div>
      <section id="about" className="section container about-section"><SectionHeader number="02" title={c.aboutTitle} accent={c.aboutAccent} intro={c.aboutIntro} /><div className="about-grid"><div className="about-statement"><p>{locale === "fr" ? profile.introFr : profile.intro}</p><div className="fact-tiles"><div><span>{c.basedIn}</span><strong>{extras.location}</strong></div><div><span>{c.languages}</span><strong>{locale === "fr" ? "Arabe · Anglais · Français" : "Arabic · English · French"}</strong></div><div><span>{c.typing}</span><strong>82+ WPM</strong></div></div></div><div className="free-portrait"><img src={profile.images.side} alt={c.aboutAlt} /></div></div></section>
      <section id="work" className="section container work-section"><SectionHeader number="03" title={profile.selectedWork[locale].title} accent={profile.selectedWork[locale].accent} intro={profile.selectedWork[locale].intro} /><div className="projects-track" data-cursor-label={extras.drag}>{projects.map((project, index) => <ProjectPanel key={project.title} project={project} index={index} type={workTypes[index]} copy={c} extras={extras} locale={locale} title={locale === "fr" ? profile.projectTitlesFr[index] : project.title} tags={locale === "fr" ? profile.projectTagsFr[index] : project.tags} description={locale === "fr" ? profile.projectDescriptionsFr[index] : project.description} />)}</div></section>
      <section className="section container case-section"><SectionHeader number="04" title={c.caseTitle} accent={c.caseAccent} /><PhoneCarousel locale={locale} /><div className="case-facts">{c.caseFacts.map(([title, copy]) => <div key={title}><h4>{title}</h4><p>{copy}</p></div>)}</div><div className="system-diagram"><div><b>{c.field}</b><span>{c.sensorNetwork}<br />{c.telemetry}</span></div><i>→</i><div><b>{c.vision}</b><span>{c.aiStudio}<br />{c.cropDetection}</span></div><i>→</i><div><b>{c.control}</b><span>{c.reactNative}<br />{c.remoteControl}</span></div></div></section>
      <section id="skills" className="section container skills-section"><SectionHeader number="05" title={c.skillsTitle} accent={c.skillsAccent} /><div className="skills-columns"><div><h3>{c.infra}</h3>{c.skillsInfra.map(skill => <div className="skill-row" key={skill}>{skill}<ArrowRight size={15} /></div>)}</div><div><h3>{c.software}</h3>{c.skillsSoftware.map(skill => <div className="skill-row" key={skill}>{skill}<ArrowRight size={15} /></div>)}</div></div></section>
      <section id="experience" className="section container experience-section"><SectionHeader number="06" title={c.experienceTitle} accent={c.experienceAccent} intro={c.experienceIntro} /><div className="experience-list">{c.experience.map(item => <article key={`${item.role}-${item.date}`}><time>{item.date}</time><div><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.detail}</p></div></article>)}</div></section>
      <section className="section container awards-section"><SectionHeader number="07" title={c.awardsTitle} accent={c.awardsAccent} /><div className="awards-grid"><div className="award-photo"><img src={profile.images.award} alt={c.awardAlt} /></div><div className="award-list">{c.awards.map((award, index) => <div key={award}><b>{index === 0 || index === 1 ? "1st" : index === 2 ? "Winner" : "CTF"}</b><span>{award}</span></div>)}</div></div></section>
      <section className="section container leadership-section"><div className="leadership-photo"><img src={profile.images.speaker} alt={c.speakerAlt} /></div><div><SectionHeader number="08" title={c.leadershipTitle} accent={c.leadershipAccent} /><p className="leadership-copy">{c.leadershipCopy}</p><div className="leadership-list">{c.leadership.map(item => <span key={item}>{item}</span>)}</div></div></section>
      <section id="contact" className="section container contact-section"><SectionHeader number="09" title={c.contactTitle} accent={c.contactAccent} intro={c.contactIntro} /><div className="contact-grid"><div><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><div className="phone-line">{profile.phone}<CopyContact value={profile.phone} label={c.copyPhone} /></div><div className="socials"><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label={c.linkedin}><Linkedin /></a><a href={profile.github} target="_blank" rel="noreferrer" aria-label={c.github}><Github /></a><a href={`mailto:${profile.email}`} aria-label={c.emailLink}><Mail /></a></div></div><form onSubmit={submit}><label>{c.name}<input required name="name" placeholder={c.namePlaceholder} /></label><label>{c.email}<input required type="email" name="email" placeholder={c.emailPlaceholder} /></label><label>{c.message}<textarea required name="message" rows={4} placeholder={c.messagePlaceholder} /></label><button className="button button-blue" type="submit">{formState === "sent" ? c.sent : c.send} <Send size={15} /></button>{formState === "sent" && <p className="form-status"><Check size={14} /> {c.thanks}</p>}{formState === "error" && <p className="form-status form-error">{c.error}</p>}</form></div></section>
    </main><footer className="site-footer container"><Mark /><span>© {new Date().getFullYear()} {profile.name}</span><span>{c.footerLocation} · <time>{new Date().toLocaleTimeString(locale === "fr" ? "fr-TN" : "en-TN", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Tunis" })}</time></span><a href="#top">{c.backTop}</a></footer>
  </div>;
}

export default Portfolio;

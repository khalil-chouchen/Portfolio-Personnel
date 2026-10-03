import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Check, Copy, Download, Github, Linkedin, Mail, Menu, Send, X } from "lucide-react";
import { profile, type Locale } from "@/data/profile";
import "./portfolio.css";

function Mark() { return <span className="wordmark">MKC<span>•</span></span>; }

function Spotlight() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    const move = (event: MouseEvent) => { targetX = event.clientX; targetY = event.clientY; };
    const over = (event: MouseEvent) => { const target = event.target as HTMLElement; const custom = target.closest("[data-cursor-label]") as HTMLElement | null; setLabel(custom?.dataset.cursorLabel || (target.closest("a, button") ? "VIEW" : "")); };
    const tick = () => { currentX += (targetX - currentX) * .1; currentY += (targetY - currentY) * .1; root.style.setProperty("--spot-x", `${currentX}px`); root.style.setProperty("--spot-y", `${currentY}px`); frame = requestAnimationFrame(tick); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseover", over); frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); cancelAnimationFrame(frame); };
  }, []);
  return <><div className="spotlight" aria-hidden="true" /><span className={`cursor-orb ${label ? "cursor-active" : ""}`} aria-hidden="true"><span>{label}</span></span></>;
}

function SectionHeader({ number, title, accent, intro }: { number: string; title: string; accent?: string; intro?: string }) {
  return <header className="section-header"><span className="eyebrow">{number} /</span><h2>{title} {accent && <em>{accent}</em>}</h2>{intro && <p>{intro}</p>}</header>;
}

function AbstractVisual({ type }: { type: string }) {
  if (type === "agri") return <div className="abstract-visual visual-agri"><div className="sensor-path path-a" /><div className="sensor-path path-b" /><i /><i /><i /><span>LIVE FIELD DATA</span></div>;
  if (type === "scrape") return <div className="abstract-visual visual-scrape"><div className="scan-beam" /><div className="scan-lines" /><span>SCAN / TARGET / EXPORT</span></div>;
  return <div className="abstract-visual visual-whatsapp"><div className="chat chat-one">lead found</div><div className="chat chat-two">message sent</div><div className="chat chat-three">reply pending</div></div>;
}

function ProjectPanel({ project, index, type }: { project: typeof profile.projects[number]; index: number; type: string }) {
  return <article className="project-panel" data-cursor-label="VIEW"><div className="project-meta"><span>0{index + 1}</span><span>{type === "agri" ? "CASE STUDY" : "SYSTEM"}</span></div><div className="project-copy"><h3>{project.title}</h3><p>{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-actions">{project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noreferrer">Source <ArrowRight size={14} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live <ArrowRight size={14} /></a>}</div></div><AbstractVisual type={type} /></article>;
}

function CopyContact({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1300); };
  return <button className="copy-contact" onClick={copy} aria-label={`Copy ${value}`}>{copied ? <Check size={17} /> : <Copy size={17} />}</button>;
}

function Portfolio() {
  const [locale, setLocale] = useState<Locale>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "sent" | "error">("idle");
  const t = profile.labels[locale];
  const disciplines = ["Web", "Mobile", "AI", "IoT"];
  const [discipline, setDiscipline] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setDiscipline(value => (value + 1) % disciplines.length), 2000); return () => window.clearInterval(timer); }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormState("sent"); event.currentTarget.reset(); };
  const projects = [...profile.projects];
  const workTypes = ["website", "scrape", "whatsapp"];
  return <div className="portfolio-page">
    <Spotlight />
    <header className="site-nav container"><a href="#top" aria-label="Mohamed Khalil Chouchen home"><Mark /></a><nav className={menuOpen ? "open" : ""}>{t.nav.map((item, index) => <a key={item} href={`#${["about", "skills", "work", "experience", "contact"][index]}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav><div className="nav-tools"><button onClick={() => setLocale(locale === "en" ? "fr" : "en")} aria-label="Switch language">{locale === "en" ? "FR" : "EN"}</button><a href={profile.cv} download className="nav-cv">CV <Download size={13} /></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main id="top">
      <section className="hero container"><div className="hero-noise" /><div className="hero-name" aria-hidden="true"><span>MOHAMED KHALIL</span><span>CHOUCHEN</span></div><div className="hero-glow" /><div className="hero-photo"><img src={profile.images.hero} alt="Mohamed Khalil Chouchen in a navy suit" /><div className="hero-ground" /></div><div className="hero-content"><p className="mono-label"><i /> Available for work</p><h1 className="sr-only">{profile.name}</h1><p className="hero-role">{profile.role}<br /><strong>{disciplines[discipline]}</strong> <span>· Web · Mobile · AI · IoT</span></p><div className="hero-buttons"><a className="button button-blue" href={profile.cv} download><Download size={15} /> Download CV</a><a className="button button-line" href="#work">See my work <ArrowDown size={15} /></a></div></div><div className="hero-award"><span>1st Place</span><small>Arab AI & IoT Challenge<br />GITEX Global Dubai</small></div><span className="hero-index">01 / 09</span></section>
      <div className="marquee" aria-label="Skills marquee"><div>Full-Stack · IoT · AI · Mobile · IT Infrastructure · Full-Stack · IoT · AI · Mobile · IT Infrastructure ·</div></div>
      <section id="about" className="section container about-section"><SectionHeader number="02" title="Built for" accent="the real world." intro="A technologist who moves comfortably between physical systems, software, and the people who make them matter." /><div className="about-grid"><div className="about-statement"><p>{profile.intro}</p><div className="fact-tiles"><div><span>Based in</span><strong>{profile.location}</strong></div><div><span>Languages</span><strong>Arabic · English · French</strong></div><div><span>Typing speed</span><strong>82+ WPM</strong></div></div></div><div className="free-portrait"><img src={profile.images.side} alt="Mohamed Khalil Chouchen looking to the side" /></div></div></section>
      <section id="work" className="section container work-section"><SectionHeader number="03" title="Selected" accent="work." intro="Systems designed end to end, from a physical signal to a useful interface." /><div className="projects-track" data-cursor-label="DRAG">{projects.map((project, index) => <ProjectPanel key={project.title} project={project} index={index} type={workTypes[index]} />)}</div></section>
      <section className="section container case-section"><SectionHeader number="04" title="AgriNova" accent="in detail." /><div className="case-hero"><div><p className="case-kicker">IoT & Mobile Development · InnoVibe</p><h3>Read the field.<br />Act with clarity.</h3><p>{profile.featuredProject.summary}</p></div><div className="case-visual"><div className="case-phone"><span /><span /><span /><b>AGRI / NOVA</b></div><div className="case-data data-one">soil / 68%</div><div className="case-data data-two">valve / open</div></div></div><div className="case-facts">{[[t.problem, profile.featuredProject.problem], [t.build, profile.featuredProject.build], [t.challenge, profile.featuredProject.challenge], [t.result, profile.featuredProject.result]].map(([title, copy]) => <div key={title}><h4>{title}</h4><p>{copy}</p></div>)}</div><div className="system-diagram"><div><b>FIELD</b><span>Sensor network<br />Telemetry</span></div><i>→</i><div><b>VISION</b><span>AI vision studio<br />Crop detection</span></div><i>→</i><div><b>CONTROL</b><span>React Native<br />Remote valve control</span></div></div></section>
      <section id="skills" className="section container skills-section"><SectionHeader number="05" title="Technical" accent="range." /><div className="skills-columns"><div><h3>IT & Infrastructure</h3>{["TCP/IP · DNS · DHCP", "VPN · Wi-Fi · Firewalls", "Windows · macOS · Linux", "Active Directory", "Microsoft 365", "ESP32 · Arduino", "Sensor systems"].map(skill => <div className="skill-row" key={skill}>{skill}<ArrowRight size={15} /></div>)}</div><div><h3>Software & AI</h3>{profile.skills.slice(0, 8).map(skill => <div className="skill-row" key={skill}>{skill}<ArrowRight size={15} /></div>)}</div></div></section>
      <section id="experience" className="section container experience-section"><SectionHeader number="06" title="The" accent="path." intro="Growing from developer to CTO to COO in three years." /><div className="experience-list">{profile.experience.map(item => <article key={`${item.role}-${item.date}`}><time>{item.date}</time><div><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.detail}</p></div></article>)}</div></section>
      <section className="section container awards-section"><SectionHeader number="07" title="Proof of" accent="pursuit." /><div className="awards-grid"><div className="award-photo"><img src={profile.images.award} alt="Mohamed Khalil Chouchen laughing with an award certificate" /></div><div className="award-list">{profile.awards.map((award, index) => <div key={award}><b>{index === 0 || index === 1 ? "1st" : index === 2 ? "Winner" : "CTF"}</b><span>{award}</span></div>)}</div></div></section>
      <section className="section container leadership-section"><div className="leadership-photo"><img src={profile.images.speaker} alt="Mohamed Khalil Chouchen speaking at a podium" /></div><div><SectionHeader number="08" title="Beyond" accent="the brief." /><p className="leadership-copy">Community Manager, Trainer & Supervisor at ATAST Club, and Project Manager at 3Zero ISITCOM Club. I design, teach, mentor, and help teams navigate the work.</p><div className="leadership-list">{profile.leadership.map(item => <span key={item}>{item}</span>)}</div></div></section>
      <section id="contact" className="section container contact-section"><SectionHeader number="09" title="Let’s work" accent="together." intro="Have a complex problem, an unfinished idea, or a team that needs a technical lead?" /><div className="contact-grid"><div><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><div className="phone-line">{profile.phone}<CopyContact value={profile.phone} /></div><div className="socials"><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a></div></div><form onSubmit={submit}><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@company.com" /></label><label>Message<textarea required name="message" rows={4} placeholder="Tell me what you are building." /></label><button className="button button-blue" type="submit">{formState === "sent" ? "Message ready" : "Send message"} <Send size={15} /></button>{formState === "sent" && <p className="form-status"><Check size={14} /> Thanks. I’ll be in touch.</p>}{formState === "error" && <p className="form-status form-error">Something went wrong. Please email me directly.</p>}</form></div></section>
    </main><footer className="site-footer container"><Mark /><span>© {new Date().getFullYear()} {profile.name}</span><span>Sousse · <time>{new Date().toLocaleTimeString("en-TN", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Tunis" })}</time></span><a href="#top">Back to top ↑</a></footer>
  </div>;
}

export default Portfolio;

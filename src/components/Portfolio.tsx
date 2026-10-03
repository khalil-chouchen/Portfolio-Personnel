import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, Menu, Moon, Send, Sun, X } from "lucide-react";
import { profile, type Locale } from "@/data/profile";
import "./cinema.css";

function MKCLogo({ animated = false }: { animated?: boolean }) {
  return <svg className={`mkc-logo ${animated ? "mkc-logo-animated" : ""}`} viewBox="0 0 120 132" role="img" aria-label="MKC logo">
    <path className="logo-arch" d="M16 116V58a44 44 0 0 1 88 0v58" />
    <path className="logo-trace" d="M27 97V43l17 28 17-28v54M61 70l25-27M61 70l25 27M103 47c-7-6-18-1-18 23s11 29 18 23" />
    <circle className="logo-node" cx="103" cy="93" r="3" />
  </svg>;
}

function MKCWordmark() {
  return <span className="mkc-wordmark">MKC<span>•</span></span>;
}

function ArchImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <div className={`arch-image ${className}`}><img src={src} alt={alt} /><span className="arch-line" /></div>;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1300); };
  return <button className="copy-button" onClick={copy} aria-label={`Copy ${value}`}>{copied ? <Check size={15} /> : <Copy size={15} />}</button>;
}

function NodeCursor() {
  useEffect(() => {
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <span className="node-cursor" aria-hidden="true" />;
}

function HeroScene({ onPhotoClick }: { onPhotoClick: () => void }) {
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scene.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event: MouseEvent) => { const x = (event.clientX / window.innerWidth - .5) * 2; const y = (event.clientY / window.innerHeight - .5) * 2; element.style.setProperty("--parallax-x", `${x * 10}px`); element.style.setProperty("--parallax-y", `${y * 7}px`); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div className="hero-scene" ref={scene}>
    <div className="hero-sun" /><div className="zellige-pattern" />
    <div className="hero-arch"><span className="circuit circuit-one" /><span className="circuit circuit-two" /><span className="circuit circuit-three" /><ArchImage src={profile.images.hero} alt="Mohamed Khalil Chouchen in a navy suit" className="hero-portrait" /></div>
    <div className="dust dust-one" /><div className="dust dust-two" /><div className="dust dust-three" />
    <button className="photo-note" onClick={onPhotoClick} aria-label="Show a note from Khalil">Tap the portrait</button>
  </div>;
}

function CinemaHero({ onPhotoClick }: { onPhotoClick: () => void }) {
  const disciplines = ["Web", "Mobile", "AI", "IoT"];
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => setActiveDiscipline((value) => (value + 1) % disciplines.length), 2000);
    const progress = window.setInterval(() => setIntroProgress((value) => Math.min(value + 10, 100)), 100);
    const finish = window.setTimeout(() => setIntroVisible(false), 1100);
    return () => { window.clearInterval(interval); window.clearInterval(progress); window.clearTimeout(finish); };
  }, [disciplines.length]);

  return <section className="cinema-hero" aria-labelledby="cinema-title">
    {introVisible && <div className="cinema-intro" aria-hidden="true"><span>{introProgress}</span><button onClick={() => setIntroVisible(false)}>Skip</button></div>}
    <div className="cinema-glow" /><div className="cinema-vignette" />
    <div className="cinema-name cinema-name-back" aria-hidden="true"><span>MOHAMED KHALIL</span><span>CHOUCHEN</span></div>
    <div className="cinema-photo"><img src={profile.images.hero} alt="Mohamed Khalil Chouchen in a navy suit" onClick={onPhotoClick} /><div className="ground-reflection" /></div>
    <div className="cinema-name cinema-name-front" aria-hidden="true"><span>MOHAMED KHALIL</span><span>CHOUCHEN</span></div>
    <div className="cinema-content"><p className="cinema-kicker">{profile.location} <i /> Independent technologist</p><h1 id="cinema-title">{profile.name}</h1><p className="cinema-role">{profile.role}<br /><span className="discipline-slide" key={disciplines[activeDiscipline]}>{disciplines[activeDiscipline]}</span><b> · </b><span>Web · Mobile · AI · IoT</span></p><div className="cinema-actions"><a href={profile.cv} download className="cinema-button cinema-button-accent"><Download size={15} /> {profile.labels.en.viewCv}</a><a href="#work" className="cinema-button cinema-button-outline">See my work <ArrowDown size={15} /></a></div></div>
    <div className="cinema-award"><span>01</span><b>1st Place</b><small>Arab AI & IoT Challenge<br />GITEX Global Dubai</small></div><a className="cinema-scroll" href="#about">Scroll to explore <ArrowDown size={14} /></a>
  </section>;
}

export default function Portfolio() {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<"light" | "night">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [note, setNote] = useState(false);
  const t = profile.labels[locale];
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const nav = ["about", "skills", "work", "experience", "contact"];
  return <div className="stone-site">
    <NodeCursor /><header className="stone-header"><a href="#top" className="logo-link"><MKCWordmark /></a><nav className={menuOpen ? "nav-open" : ""}>{t.nav.map((item, index) => <a key={item} href={`#${nav[index]}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav><div className="header-tools"><button onClick={() => setLocale(locale === "en" ? "fr" : "en")} aria-label="Switch language">{locale === "en" ? "FR" : "EN"}</button><button onClick={() => setTheme(theme === "light" ? "night" : "light")} aria-label="Toggle theme">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button><a href="#contact" className="header-cta">{t.contact}<ArrowUpRight size={15} /></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main id="top">
      <CinemaHero onPhotoClick={() => setNote(!note)} />
      <section id="about" className="stone-section about-layout"><div className="section-marker">{t.about}</div><div className="about-copy"><h2>Technology,<br /><em>with warmth.</em></h2><p>{profile.about}</p><div className="fact-row"><span><b>Based in</b>{profile.location}</span><span><b>Languages</b>Arabic · English · French</span><span><b>Typing</b>82+ WPM</span></div></div><ArchImage src={profile.images.side} alt="Mohamed Khalil Chouchen looking toward the page" className="side-portrait" /></section>
      <section id="skills" className="stone-section worlds-section"><div className="section-head"><div className="section-marker">{t.skills}</div><h2>Two worlds,<br /><em>one craft.</em></h2></div><div className="worlds-grid"><div className="world-column"><div className="world-icon">⌁</div><h3>IT & Infrastructure</h3><p>Systems that keep people, devices, and data moving.</p><div className="skill-cloud">{["TCP/IP · DNS · DHCP", "VPN · Wi-Fi · Firewalls", "Windows · macOS · Linux", "Active Directory", "Microsoft 365", "ESP32 · Arduino", "Sensor systems"].map(skill => <span key={skill}>{skill}</span>)}</div></div><div className="world-bridge"><span /><div>MKC</div><span /></div><div className="world-column"><div className="world-icon">⌘</div><h3>Software & AI</h3><p>Interfaces and intelligence that turn signals into action.</p><div className="skill-cloud">{["JavaScript / TypeScript", "Python", "React / Next.js", "React Native", "Node.js / REST APIs", "LLM integration", "Computer vision / OCR", "MongoDB / Firebase"].map(skill => <span key={skill}>{skill}</span>)}</div></div></div></section>
      <section id="work" className="stone-section featured-section"><div className="section-marker">{t.featured} <span>01</span></div><div className="featured-heading"><h2>AgriNova</h2><p>{profile.featuredProject.summary}</p></div><div className="featured-art"><div className="agri-sun" /><div className="agri-field"><i /><i /><i /><i /><i /><i /></div><div className="agri-chip">IoT / AI / MOBILE</div></div><div className="case-grid">{[[t.problem, profile.featuredProject.problem], [t.build, profile.featuredProject.build], [t.challenge, profile.featuredProject.challenge], [t.result, profile.featuredProject.result]].map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div><div className="architecture"><h3>{t.architecture}</h3><div className="architecture-flow"><div><b>FIELD</b><span>Sensor network<br />Telemetry</span></div><i>→</i><div><b>VISION</b><span>AI vision studio<br />Crop detection</span></div><i>→</i><div><b>CONTROL</b><span>React Native<br />Remote valves</span></div></div></div></section>
      <section className="stone-section gallery-section"><div className="section-head gallery-head"><div className="section-marker">{t.projects}</div><p>From websites to internal tools, I carry the work from idea to deployment.</p></div><div className="project-gallery">{profile.projects.map((project, index) => <article className="stone-card" key={project.title}><div className={`card-cover cover-${index + 1}`}><span>0{index + 2}</span><div className="cover-arch" /><ArrowUpRight /></div><div className="card-content"><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></section>
      <section id="experience" className="stone-section path-section"><div className="section-head"><div className="section-marker">{t.experience}</div><h2>The path<br /><em>so far.</em></h2></div><div className="career-path">{profile.experience.map((item, index) => <article key={`${item.role}-${item.date}`} className={index === 0 ? "path-current" : ""}><span className="path-node" /><time>{item.date}</time><div><h3>{item.role}</h3><p className="path-company">{item.company}</p><p>{item.detail}</p></div></article>)}</div></section>
      <section className="stone-section awards-section"><div className="section-marker">Awards & leadership</div><div className="award-layout"><ArchImage src={profile.images.award} alt="Mohamed Khalil Chouchen holding an award certificate" className="award-portrait" /><div><h2>Proof in the<br /><em>pursuit.</em></h2><div className="award-list">{profile.awards.map(award => <p key={award}><span>✦</span>{award}</p>)}</div><h3>Leadership & community</h3>{profile.leadership.map(item => <p className="leadership-line" key={item}>{item}</p>)}</div></div></section>
      <section className="stone-section leadership-section"><div className="leadership-photo"><ArchImage src={profile.images.speaker} alt="Mohamed Khalil Chouchen speaking at an event" className="speaker-portrait" /></div><div><div className="section-marker">Community</div><h2>Make the room<br /><em>brighter.</em></h2><p>Community Manager, Trainer & Supervisor at ATAST Club, and Project Manager at 3Zero ISITCOM Club. I design, teach, mentor, and help teams find their way through the work.</p></div></section>
      <section id="contact" className="stone-section contact-section"><div className="section-marker">08 / Contact</div><h2>Let's build something<br /><em>that connects.</em></h2><div className="contact-grid"><div className="contact-info"><p>{t.contactBody}</p><div className="contact-line"><span>Email</span><strong>{profile.email}</strong><CopyButton value={profile.email} /></div><div className="contact-line"><span>Phone</span><strong>{profile.phone}</strong><CopyButton value={profile.phone} /></div><div className="socials"><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a></div></div><form action="https://formspree.io/f/your-form-id" method="POST"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input type="email" name="email" required placeholder="you@company.com" /></label><label>Message<textarea name="message" required rows={3} placeholder="Tell me what you are building." /></label><button className="button button-blue" type="submit">{t.send} <Send size={15} /></button></form></div><div className="closing-arch"><MKCLogo /></div></section>
    </main><footer><span><MKCLogo /> © {new Date().getFullYear()} {profile.name}</span><span>Signal & Stone</span><a href="#top">Back to light ↑</a></footer>
  </div>;
}

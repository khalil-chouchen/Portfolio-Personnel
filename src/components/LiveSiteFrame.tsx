import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { profile, type Locale } from "@/data/profile";
import "./portfolio.css";

const SIZES = { desktop: 1440, tablet: 820, mobile: 390 } as const;
type Mode = keyof typeof SIZES;

export default function LiveSiteFrame({ url, locale, compact = false }: { url: string; locale: Locale; compact?: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>(() => compact && typeof window !== "undefined" && window.innerWidth <= 700 ? "mobile" : "desktop");
  const [scale, setScale] = useState(1);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(0);
  const copy = profile.liveFrameUI[locale];
  useEffect(() => { const update = () => setScale(Math.min(1, (boxRef.current?.clientWidth ?? SIZES[mode]) / SIZES[mode])); update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }, [mode]);
  useEffect(() => { setLoaded(false); setFailed(false); const timer = window.setTimeout(() => setFailed(true), 10000); return () => window.clearTimeout(timer); }, [key]);
  const width = SIZES[mode];
  const height = 900;
  return <div className={`live-frame ${compact ? "live-frame-compact" : ""}`}><div className="live-bar"><span className="dots"><i /><i /><i /></span><span className="url"><b className="live-dot" />{copy.label}</span><div className="modes">{(Object.keys(SIZES) as Mode[]).map(item => <button key={item} onClick={() => setMode(item)} aria-pressed={mode === item}>{copy[item]}</button>)}<button onClick={() => setKey(value => value + 1)} aria-label={copy.reload}><RotateCw size={13} /> <span>{copy.reload}</span></button><a href={url} target="_blank" rel="noopener noreferrer">{copy.open}</a></div></div><div ref={boxRef} className="live-viewport" style={{ height: height * scale }} onMouseLeave={() => setActive(false)}>{(!failed || loaded) && <iframe key={key} src={url} title={copy.label} loading="lazy" onLoad={() => setLoaded(true)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" style={{ width, height, left: "50%", transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center", pointerEvents: active ? "auto" : "none" }} />}{!loaded && !failed && <div className="live-skeleton" />}{failed && !loaded && <a className="live-fallback" href={url} target="_blank" rel="noopener noreferrer">{copy.unavailable}</a>}{!active && loaded && <button className="live-overlay" onClick={() => setActive(true)}>{copy.explore}</button>}</div></div>;
}

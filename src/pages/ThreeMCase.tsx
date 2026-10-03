import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { profile, type Locale } from "@/data/profile";
import LiveSiteFrame from "@/components/LiveSiteFrame";
import "@/components/portfolio.css";

export default function ThreeMCase() {
  const [locale, setLocale] = useState<Locale>(() => (typeof window !== "undefined" && window.localStorage.getItem("mkc-locale") === "fr" ? "fr" : "en"));
  const page = profile.threeMPage[locale];
  const features = profile.threeMFeatures[locale];
  useEffect(() => { document.documentElement.lang = locale; window.localStorage.setItem("mkc-locale", locale); }, [locale]);
  return <div className="case-page portfolio-page"><header className="site-nav container"><a href="/#top" aria-label="Mohamed Khalil Chouchen home"><span className="wordmark">MKC<span>•</span></span></a><div className="nav-tools"><button onClick={() => setLocale(locale === "en" ? "fr" : "en")} aria-label={locale === "en" ? "Switch language" : "Changer de langue"}>{locale === "en" ? "FR" : "EN"}</button><a href="/#work" className="nav-cv"><ArrowLeft size={13} /> {page.back}</a></div></header><main className="case-main container"><p className="case-route">03 / SELECTED WORK</p><h1>{page.title}<br /><em>{page.accent}</em></h1><p className="case-role">{page.role}</p><p className="case-intro">{page.intro}</p><div className="case-actions"><a className="button button-blue" href="https://www.3m-consultingcompany.com/" target="_blank" rel="noreferrer">{page.live} <ArrowUpRight size={15} /></a><span className="nda-chip"><Lock size={13} /> {page.confidential}</span></div><div className="case-live-site"><LiveSiteFrame url="https://www.3m-consultingcompany.com/" locale={locale} /></div><section className="admin-showcase"><div className="admin-note"><span><Lock size={13} /> {page.confidential}</span><small>{page.note}</small></div><div className="browser-stack"><figure><div className="browser-bar"><i /><i /><i /><span>{page.browserUrl}</span></div><img src={profile.threeMScreens[0]} alt={page.altOne} loading="lazy" sizes="(max-width: 700px) 92vw, 620px" /></figure><figure><div className="browser-bar"><i /><i /><i /><span>{page.browserUrl}</span></div><img src={profile.threeMScreens[1]} alt={page.altTwo} loading="lazy" sizes="(max-width: 700px) 92vw, 620px" /></figure></div></section><section className="case-features"><h2>{page.featuresTitle}</h2><div>{features.map((feature, index) => <p key={feature}><b>0{index + 1}</b>{feature}</p>)}</div></section></main></div>;
}

import { Trophy, Medal, Flag } from "lucide-react";

const awards = [
  {
    icon: Trophy,
    title: "1st place — Arab AI & IoT Challenge",
    detail: "GITEX Global Dubai, 600+ participants",
  },
  {
    icon: Trophy,
    title: "1st place — B-Tech",
    detail: null,
  },
  {
    icon: Medal,
    title: "Winner — Nuit de l'Info",
    detail: null,
  },
  {
    icon: Medal,
    title: "Winner — IEEE hackathon",
    detail: null,
  },
  {
    icon: Flag,
    title: "CTF competitor",
    detail: null,
  },
];

export const Awards = () => {
  return (
    <section
      className="section"
      aria-labelledby="awards-title"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 id="awards-title" className="section-title">
            Awards & <span className="gradient-text">recognition</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Competitions I've placed in or won
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {awards.map((award) => (
            <article
              key={award.title}
              className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border card-hover"
            >
              <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                <award.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{award.title}</h3>
                {award.detail && (
                  <p className="text-sm text-muted-foreground mt-1">{award.detail}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

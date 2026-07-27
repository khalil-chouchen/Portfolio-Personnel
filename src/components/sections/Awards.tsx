import { Trophy } from "lucide-react";

const otherAwards = [
  "1st place — B-Tech Competition",
  "Winner — Nuit de l'Info",
  "Winner — IEEE hackathon",
  "Cybersecurity CTF competitor",
];

export const Awards = () => {
  return (
    <section
      className="section bg-card/50"
      aria-labelledby="awards-title"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 id="awards-title" className="section-title">
            Awards & <span className="accent">recognition</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Competitions I've placed in or won
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* Featured: GITEX win */}
          <article className="p-6 md:p-8 rounded-md bg-primary/10 border border-primary/40 flex items-start gap-5">
            <Trophy className="h-8 w-8 text-primary flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-mono text-xs text-primary mb-1">GITEX GLOBAL DUBAI · 600+ PARTICIPANTS</p>
              <h3 className="text-xl font-bold text-foreground">
                1st place — Arab AI & IoT Challenge
              </h3>
            </div>
          </article>

          {/* Everything else, as a plain list */}
          <div className="border border-border rounded-md divide-y divide-border">
            {otherAwards.map((award) => (
              <p key={award} className="px-6 py-4 text-muted-foreground text-sm">
                {award}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

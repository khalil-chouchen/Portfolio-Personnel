import { Users } from "lucide-react";

const roles = [
  {
    title: "Community Manager, Trainer & Supervisor",
    org: "ATAST Club, ISITCOM",
    period: "Sep 2023 – Jun 2026",
    bullets: [
      "Community Manager: designed posts, flyers, and visual content for 2 years, and built app prototypes for national competitions.",
      "Trainer: ran UI/UX and cybersecurity CTF workshops.",
      "Supervisor: mentored new board members on leadership, project management, and workflows.",
    ],
  },
  {
    title: "Project Manager",
    org: "3Zero ISITCOM Club",
    period: "Jan 2024 – Jun 2024",
    bullets: [
      "Led student teams building open-source and IoT prototypes for 50+ members.",
    ],
  },
];

export const Leadership = () => {
  return (
    <section
      className="section"
      aria-labelledby="leadership-title"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 id="leadership-title" className="section-title">
            Leadership & <span className="accent">community</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Three years at ISITCOM's student tech clubs
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {roles.map((role) => (
            <article
              key={role.title}
              className="p-6 rounded-md bg-card border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-primary/10 flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                    <h3 className="font-semibold text-foreground">
                      {role.org} — {role.title}
                    </h3>
                    <span className="text-sm text-primary font-medium whitespace-nowrap">
                      {role.period}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="text-muted-foreground text-sm">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

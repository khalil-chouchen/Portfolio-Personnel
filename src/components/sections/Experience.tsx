const experience = [
  {
    role: "Freelance Developer & Designer",
    org: "Self-employed",
    period: "2023 – Present",
    bullets: [
      "Delivered web, mobile, and AI projects for clients end to end.",
      "Handled UI/UX and graphic design alongside development.",
    ],
  },
  {
    role: "IT & Full-Stack Developer",
    org: "3M Consulting",
    period: "Jun 2025 – Present",
    bullets: [
      "Designed and built the company's official website end to end, from UI/UX through deployment.",
      "Built two internal automation tools: a lead-scraping app for email and WhatsApp outreach, and a WhatsApp auto-messaging system for outreach at scale.",
      "Owned client relations and after-sales support, and acted as the team's technical reference across dev, design, and marketing.",
    ],
  },
  {
    role: "IoT & Mobile Development Intern",
    org: "InnoVibe",
    period: "Jan 2026 – Jun 2026",
    bullets: [
      "Built AgriNova, an intelligent agriculture system combining IoT telemetry with mobile control.",
      "Built the React Native app for farmers, including a vision studio for real-time crop-disease detection.",
      "Engineered the farm sensor network and remote valve control from the mobile interface.",
    ],
  },
  {
    role: "Computer Science Instructor",
    org: "Private School, Monastir",
    period: "Sep 2025 – Jun 2026",
    bullets: [
      "Taught Baccalaureate-level algorithms, logic, ICT, and core science subjects.",
      "Built hands-on lesson plans that simplified data structures for exam prep.",
    ],
  },
  {
    role: "Frontend Developer Intern",
    org: "TYM Solutions",
    period: "Jun 2025 – Aug 2025",
    bullets: [
      "Designed and built responsive pages for the company's official website.",
      "Applied UI/UX practices to improve performance and cross-device compatibility.",
    ],
  },
];

export const Experience = () => {
  return (
    <section
      className="section bg-card/50"
      aria-labelledby="experience-title"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 id="experience-title" className="section-title">
            <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Where I've worked over the past three years
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {experience.map((item) => (
            <article
              key={`${item.role}-${item.org}`}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                <h3 className="font-semibold text-foreground">
                  {item.org} — {item.role}
                </h3>
                <span className="text-sm text-primary font-medium whitespace-nowrap">
                  {item.period}
                </span>
              </div>
              <ul className="space-y-1.5">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="text-muted-foreground text-sm">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

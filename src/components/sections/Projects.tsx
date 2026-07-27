import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const featured = [
  {
    title: "AgriNova",
    description:
      "An intelligent agriculture system built during my internship at InnoVibe: IoT telemetry combined with mobile control. Includes a React Native app for farmers with a built-in vision studio for real-time crop-disease detection, backed by a sensor network and remote valve control.",
    stack: ["React Native", "ESP32", "Computer Vision", "IoT"],
    github: null,
  },
  {
    title: "Bebe Taxi",
    description:
      "A real-time taxi booking MVP. Clients request a ride, nearby drivers see it live on the map and send offers, and the trip is tracked in real time until drop-off — runs on a physical phone via Expo Go, no native build required.",
    stack: ["React Native", "Expo", "Next.js", "Socket.IO", "MongoDB"],
    github: "https://github.com/khalil-chouchen/Bebe_Taxi",
  },
  {
    title: "ContractZenith",
    description:
      "A full-stack contract management platform: automated contract status tracking, secure file uploads, and an admin dashboard with real-time analytics and Excel export.",
    stack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/khalil-chouchen/contractini",
  },
];

const tools = [
  {
    title: "Saudi Education Lead Intelligence Tool",
    description: "Scraper built for 3M Consulting — finds, scores, and exports education-sector leads.",
    stack: ["Python"],
    github: "https://github.com/khalil-chouchen/Web-Scrapting",
  },
  {
    title: "WhatsApp CSV Sender",
    description: "3M Consulting's outreach tool, built on the WhatsApp Business Cloud API. Dry-run safe by default.",
    stack: ["Python", "WhatsApp Business API"],
    github: "https://github.com/khalil-chouchen/auto_whts",
  },
];

export const Projects = () => {
  return (
    <section
      id="projects"
      className="section bg-card/50"
      aria-labelledby="projects-title"
    >
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 id="projects-title" className="section-title">
            <span className="accent">Projects</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A selection of what I've built
          </p>
        </div>

        {/* Featured projects */}
        <div className="max-w-3xl mx-auto space-y-6">
          {featured.map((project) => (
            <article
              key={project.title}
              className="rounded-md bg-card border border-border overflow-hidden card-hover"
            >
              {/* Window chrome header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code on GitHub`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="skill-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Smaller internal tools */}
        <div className="max-w-3xl mx-auto mt-10">
          <p className="mono-label mb-3">Also built at 3M Consulting</p>
          <div className="border border-border rounded-md divide-y divide-border">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{tool.title}</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">{tool.description}</p>
                </div>
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${tool.title} source code on GitHub`}
                  className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-10">
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/khalil-chouchen" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              More on GitHub
            </a>
          </Button>
        </p>
      </div>
    </section>
  );
};

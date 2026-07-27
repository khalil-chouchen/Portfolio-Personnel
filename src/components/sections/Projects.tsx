import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "AgriNova",
    description:
      "An intelligent agriculture system I built during my internship at InnoVibe. IoT telemetry combined with mobile control: a React Native app for farmers with a built-in vision studio for real-time crop-disease detection, backed by a sensor network for farm telemetry and remote valve control.",
    stack: ["React Native", "ESP32", "Computer Vision", "IoT"],
    github: null,
    demo: null,
  },
  {
    id: 2,
    title: "Company Website & Automation Tools — 3M Consulting",
    description:
      "Designed and built 3M Consulting's official website end to end, then followed it with two internal tools: a lead-scraping app that collects targeted email and WhatsApp contacts, and a WhatsApp auto-messaging system for outreach at scale.",
    stack: ["React", "Node.js", "Web Scraping", "Automation"],
    github: null,
    demo: null,
  },
  {
    id: 3,
    title: "Freelance Web & Mobile Projects",
    description:
      "Client work since 2023 — web and mobile builds where I've handled everything from UI/UX design to deployment.",
    stack: ["React", "Next.js", "React Native", "Figma"],
    github: null,
    demo: null,
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
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A selection of what I've built
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group rounded-2xl bg-card border border-border overflow-hidden card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project image placeholder */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Folder className="h-16 w-16 text-primary/30" aria-hidden="true" />
                </div>
                {(project.github || project.demo) && (
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} source code on GitHub`}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button size="sm" asChild>
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} live demo`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Project content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-12 text-sm">
          More on{" "}
          <a
            href="https://github.com/khalil-chouchen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
};

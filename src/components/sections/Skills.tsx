import {
  Code,
  Smartphone,
  Database,
  Brain,
  Cpu,
  Wrench,
} from "lucide-react";

const technicalSkills = [
  {
    category: "Languages",
    icon: Code,
    skills: ["JavaScript", "TypeScript", "Python", "C/C++", "SQL"],
  },
  {
    category: "Web & Mobile",
    icon: Smartphone,
    skills: ["React", "Next.js", "React Native", "Node.js"],
  },
  {
    category: "Data & Cloud",
    icon: Database,
    skills: ["MongoDB", "Firebase", "REST APIs"],
  },
  {
    category: "AI / ML",
    icon: Brain,
    skills: ["LLM Integration", "Computer Vision", "Model Training", "OCR"],
  },
  {
    category: "IoT & Hardware",
    icon: Cpu,
    skills: ["ESP32", "Arduino", "Microcontrollers", "Sensor Systems"],
  },
  {
    category: "Tools & Design",
    icon: Wrench,
    skills: ["Git", "Linux", "UI/UX Design", "Figma", "Automation"],
  },
];

export const Skills = () => {
  return (
    <section
      id="skills"
      className="section"
      aria-labelledby="skills-title"
    >
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 id="skills-title" className="section-title">
            Technical <span className="gradient-text">skills</span>
          </h2>
          <p className="section-subtitle mx-auto">
            The stack I build with day to day
          </p>
        </div>

        {/* Technical Skills */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalSkills.map((group, index) => (
            <article
              key={group.category}
              className="p-6 rounded-2xl bg-card border border-border card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <group.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{group.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

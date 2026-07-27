const technicalSkills = [
  {
    category: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "C/C++", "SQL"],
  },
  {
    category: "Web & Mobile",
    skills: ["React", "Next.js", "React Native", "Node.js"],
  },
  {
    category: "Data & Cloud",
    skills: ["MongoDB", "Firebase", "REST APIs"],
  },
  {
    category: "AI / ML",
    skills: ["LLM Integration", "Computer Vision", "Model Training", "OCR"],
  },
  {
    category: "IoT & Hardware",
    skills: ["ESP32", "Arduino", "Microcontrollers", "Sensor Systems"],
  },
  {
    category: "Tools & Design",
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
            Technical <span className="accent">skills</span>
          </h2>
          <p className="section-subtitle mx-auto">
            The stack I build with day to day
          </p>
        </div>

        {/* Technical Skills — grouped rows, not a repeated card grid */}
        <div className="max-w-4xl mx-auto border border-border rounded-md divide-y divide-border">
          {technicalSkills.map((group) => (
            <div
              key={group.category}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 p-5"
            >
              <h3 className="font-mono text-sm text-muted-foreground w-40 flex-shrink-0">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

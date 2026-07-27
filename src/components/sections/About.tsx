import { MapPin, Mail, Phone, Globe } from "lucide-react";

const personalInfo = [
  { icon: MapPin, label: "Location", value: "Sousse, Tunisia" },
  { icon: Mail, label: "Email", value: "khalilchouchen112@gmail.com", href: "mailto:khalilchouchen112@gmail.com" },
  { icon: Phone, label: "Phone", value: "+216 56 747 765", href: "tel:+21656747765" },
];

const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Fluent" },
  { name: "French", level: "Fluent" },
];

export const About = () => {
  return (
    <section
      id="about"
      className="section bg-card/50"
      aria-labelledby="about-title"
    >
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 id="about-title" className="section-title">
            About <span className="accent">me</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Where I've worked and what I build
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-none">
            <div className="relative w-64 md:w-80">
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-primary" />
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-md border border-border overflow-hidden">
                <img
                  src="/pdp.jpeg"
                  alt="Photo of Mohamed Khalil Chouchen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* About content */}
          <div className="space-y-6">
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                I'm <strong className="text-foreground">Mohamed Khalil Chouchen</strong>, a
                full-stack developer based in Sousse, Tunisia, with 3 years of experience
                building web, mobile, and AI-driven products. Freelance since 2023.
              </p>
              <p>
                I've been an <strong className="text-foreground">IT & full-stack developer at 3M Consulting</strong>{" "}
                since June 2025, where I built the company's official website end to end and
                two internal automation tools. In parallel, I just wrapped up an{" "}
                <strong className="text-foreground">IoT & mobile internship at InnoVibe</strong>,
                where I built AgriNova, an intelligent agriculture system with a React Native
                app and real-time crop-disease detection. I've also taught computer science
                at a private school in Monastir and interned as a frontend developer at
                TYM Solutions.
              </p>
              <p>
                Most of my work is <strong className="text-foreground">React and Next.js</strong>{" "}
                on the frontend, Node.js with MongoDB or Firebase on the backend, and{" "}
                <strong className="text-foreground">React Native</strong> when it needs to
                run on a phone. On the hardware side I build on ESP32 and Arduino, and a good
                chunk of my recent work involves wiring LLMs into products or using computer
                vision and OCR to pull structured data out of images.
              </p>
              <p>
                I hold an engineering degree in{" "}
                <strong className="text-foreground">Computer Engineering & IoT</strong> from
                ISITCOM (2023–2026), and I'm open to remote roles where I can own features
                end to end.
              </p>
            </div>

            {/* Personal info cards */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {personalInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-center gap-3 p-4 rounded-md bg-secondary/50 border border-border/50"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <info.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-foreground font-medium hover:text-primary transition-colors text-sm"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium text-sm">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="px-4 py-2 rounded-md bg-secondary/50 border border-border/50"
                  >
                    <span className="text-foreground font-medium">{lang.name}</span>
                    <span className="text-muted-foreground text-sm"> – {lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

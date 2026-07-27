import { Button } from "@/components/ui/button";
import { Download, Zap, Heart } from "lucide-react";

const strengths = [
  "End-to-end product delivery",
  "Fast, self-directed learner",
  "Clean, maintainable code",
  "Client communication",
];

const interests = [
  "Building smart, connected products",
  "Mentoring & running workshops",
  "Hackathons & competitive programming",
];

export const CV = () => {
  return (
    <section
      id="cv"
      className="section"
      aria-labelledby="cv-title"
    >
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 id="cv-title" className="section-title">
            <span className="accent">CV</span>
          </h2>
          <p className="section-subtitle mx-auto">
            The full picture, in one PDF
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* CV Download Card */}
          <div className="p-8 rounded-md bg-card border border-border flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-md bg-primary/10">
                <Download className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Download my CV</h3>
                <p className="text-muted-foreground">PDF, ready to print</p>
              </div>
            </div>
            <Button variant="hero" className="w-full" asChild>
              <a href="/cv.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download CV (PDF)
              </a>
            </Button>
          </div>

          {/* Strengths & Interests */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {strengths.map((item) => (
                  <li key={item} className="text-muted-foreground text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">Interests</h3>
              </div>
              <ul className="space-y-2">
                {interests.map((item) => (
                  <li key={item} className="text-muted-foreground text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

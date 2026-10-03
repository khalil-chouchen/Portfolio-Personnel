import { Button } from "@/components/ui/button";
import { Download, Play, ChevronDown, Trophy } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-24 grid-backdrop"
      aria-labelledby="hero-title"
    >
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <p
              className="font-mono text-sm text-primary mb-5 opacity-0 animate-fade-in"
              aria-hidden="true"
            >
              // full-stack developer
            </p>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold mb-4 leading-[1.02] tracking-tight opacity-0 animate-fade-in animation-delay-100"
            >
              Mohamed Khalil
              <br />
              Chouchen
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 opacity-0 animate-fade-in animation-delay-200">
              Web · Mobile · AI
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-primary/30 mb-6 opacity-0 animate-fade-in animation-delay-300">
              <Trophy className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">
                1st place, Arab AI & IoT Challenge — GITEX Global Dubai
              </span>
            </div>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 opacity-0 animate-fade-in animation-delay-400">
              3 years building production web, mobile, and AI-driven apps across React, Next.js,
              and React Native. I own projects end to end — UI/UX through deployment. Based in
              Sousse, Tunisia. Open to remote roles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in animation-delay-500">
              <Button variant="hero" asChild>
                <a href="/cv.pdf" download aria-label="Download my CV as PDF">
                  <Download className="mr-2 h-5 w-5" />
                  Download CV
                </a>
              </Button>
              <Button
                variant="heroOutline"
                onClick={() => setIsVideoOpen(true)}
                aria-haspopup="dialog"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch 1-min video intro
              </Button>
            </div>
          </div>

          {/* Portrait */}
          <div className="hidden lg:flex justify-center opacity-0 animate-fade-in-right animation-delay-300">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-primary" />
              <div className="aspect-[4/5] rounded-md overflow-hidden border border-border">
                  <img
                    src="/images/khalil-hero-front.png"
                  alt="Mohamed Khalil Chouchen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-float cursor-pointer"
        aria-label="Scroll to About section"
      >
        <ChevronDown className="h-6 w-6" />
      </button>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Video intro</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              A one-minute walkthrough of my background and what I'm looking for.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
            <video controls className="w-full h-full rounded-md">
              <source src="/cvvd.mp4" type="video/mp4" />
              Your browser doesn't support video playback.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

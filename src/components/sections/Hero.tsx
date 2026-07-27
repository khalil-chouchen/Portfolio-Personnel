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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--gradient-hero)" }}
      aria-labelledby="hero-title"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float animation-delay-500" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        {/* Main heading */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 opacity-0 animate-fade-in"
        >
          <span className="gradient-text">Mohamed Khalil</span>
          <br />
          <span className="text-foreground">Chouchen</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 opacity-0 animate-fade-in animation-delay-200">
          Full-Stack Developer — Web, Mobile, AI
        </p>

        {/* Award callout */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 opacity-0 animate-fade-in animation-delay-200">
          <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            1st place, Arab AI & IoT Challenge — GITEX Global Dubai
          </span>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in animation-delay-300">
          3 years building production web, mobile, and AI-driven apps across React, Next.js,
          and React Native. I own projects end to end — UI/UX through deployment. Based in
          Sousse, Tunisia. Open to remote roles.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animation-delay-400">
          <Button
            variant="hero"
            asChild
          >
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

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-float cursor-pointer"
        aria-label="Scroll to About section"
      >
        <ChevronDown className="h-8 w-8" />
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
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <video controls className="w-full h-full rounded-lg">
              <source src="/cvvd.mp4" type="video/mp4" />
              Your browser doesn't support video playback.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Awards } from "@/components/sections/Awards";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Leadership } from "@/components/sections/Leadership";
import { CV } from "@/components/sections/CV";
import { Contact } from "@/components/sections/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background custom-scrollbar">
      <Header />
      <main>
        <Hero />
        <About />
        <Awards />
        <Experience />
        <Skills />
        <Projects />
        <Leadership />
        <CV />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

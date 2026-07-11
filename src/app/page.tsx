import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechGrid } from "@/components/sections/TechGrid";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Focus } from "@/components/sections/Focus";
import { GitHubStats } from "@/components/sections/GitHubStats";
import { StreamSection } from "@/components/sections/StreamSection";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { StructuredData } from "@/components/seo/StructuredData";
import { NEXUSChat } from "@/components/sections/NEXUSChat";

export default function Home() {
  return (
    <>
      <StructuredData />
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <TechGrid />
        <Projects />
        <Experience />
        <Focus />
        <GitHubStats />
        <StreamSection />
        <Contact />
      </main>
      <Footer />
      <NEXUSChat />
    </>
  );
}

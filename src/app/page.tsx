import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechGrid } from "@/components/sections/TechGrid";
import { Focus } from "@/components/sections/Focus";
import { StreamSection } from "@/components/sections/StreamSection";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { StructuredData } from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <>
      {/* JSON-LD structured data — injected into <head> by Next.js */}
      <StructuredData />
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <TechGrid />
        <Focus />
        <StreamSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

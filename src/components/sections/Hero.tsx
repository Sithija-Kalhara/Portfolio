"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, ChevronDown } from "lucide-react";
import { HeroSceneCanvas } from "@/components/three/HeroSceneCanvas";
import { TypewriterRoles } from "@/components/ui/TypewriterRoles";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28"
    >
      {/* backdrop layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal-violet/40 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4 lg:px-10">
        {/* left: copy */}
        <div className="relative z-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-panel-border bg-panel/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-crimson" />
            Available for select projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-[13vw] font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            {profile.name.split(" ")[0]}
            <br />
            <span className="text-gradient-violet-cyan">
              {profile.name.split(" ")[1]}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex h-8 items-center font-mono text-base text-signal-cyan sm:text-lg"
          >
            <span className="mr-2 text-ink-faint">{">"}</span>
            <TypewriterRoles roles={profile.roles} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-dim sm:text-lg"
          >
            Founder of{" "}
            <span className="font-medium text-ink">Eyerone</span> — building
            scalable platforms and interactive 3D applications where
            high-performance engineering meets gaming culture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              href="#contact"
              external={false}
              icon={<ArrowUpRight size={16} />}
            >
              Start a Project
            </MagneticButton>
            <MagneticButton
              href="https://github.com/Sithija-Kalhara"
              variant="secondary"
              icon={<Github size={16} />}
            >
              View GitHub
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-14 flex max-w-md items-center gap-6 border-t border-panel-border pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint"
          >
            <span>Sri Lanka</span>
            <span className="h-3 w-px bg-panel-border" />
            <span>Full-Stack · AI · Streaming</span>
          </motion.div>
        </div>

        {/* right: 3D canvas */}
        <div className="relative order-1 z-10 mx-auto h-[340px] w-full max-w-[440px] sm:h-[420px] lg:order-2 lg:h-[560px] lg:max-w-none">
          <div className="bracket-frame absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] sm:inset-8 sm:h-[calc(100%-4rem)] sm:w-[calc(100%-4rem)]">
            <HeroSceneCanvas />
          </div>

        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-ink-faint transition-colors hover:text-signal-cyan"
        aria-label="Scroll to about section"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { profile, stats } from "@/data/profile";
import ProfilePic from "../assist/avatar.jpg";

export function About() {
  return (
    <section id="about" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionTag index="01" label="About" accent="violet" />
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          {/* ── Left: text content ── */}
          <div>
            <Reveal delay={0.05}>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Engineering by discipline.{" "}
                <span className="text-ink-dim">
                  Gaming culture by passion.
                </span>
              </h2>
            </Reveal>

            {/* Photo + bio row */}
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">

                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="relative mx-auto shrink-0 sm:mx-0"
                >
                  {/* outer glow ring */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-signal-violet via-signal-cyan to-signal-violet opacity-60 blur-sm" />
                  {/* bracket corners */}
                  <div className="relative rounded-2xl border border-panel-border bg-panel overflow-hidden"
                       style={{ width: 160, height: 180 }}>
                    <Image
                      src={ProfilePic}
                      alt="Sithija Kalhara"
                      fill
                      className="object-cover object-center"
                      sizes="160px"
                      priority
                    />
                    {/* scan line effect */}
                    <motion.div
                      className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-signal-cyan/8 to-transparent pointer-events-none"
                      animate={{ y: ["-100%", "300%"] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                    />
                    {/* status badge */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-void/80 border border-panel-border px-2.5 py-1 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-crimson" />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">Online</span>
                    </div>
                  </div>
                </motion.div>

                {/* Bio */}
                <div className="flex-1">
                  <p className="text-base leading-relaxed text-ink-dim sm:text-lg">
                    {profile.bio}
                  </p>
                  <div className="mt-5 flex items-start gap-4 rounded-2xl border border-panel-border bg-panel/40 p-5 backdrop-blur-sm">
                    <span className="mt-1 font-mono text-xs text-signal-cyan">{"//"}</span>
                    <p className="font-mono text-sm leading-relaxed text-ink sm:text-base">
                      {profile.mission}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Right: stats grid ── */}
          <Reveal delay={0.2} className="lg:pt-2">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-panel-border bg-panel/40 p-5 backdrop-blur-sm transition-colors hover:border-signal-violet/40"
                >
                  <div className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase leading-tight tracking-[0.1em] text-ink-faint">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

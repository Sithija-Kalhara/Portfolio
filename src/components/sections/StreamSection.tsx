"use client";

import { motion } from "framer-motion";
import { Youtube, Radio, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { channelStats } from "@/data/profile";

export function StreamSection() {
  return (
    <section id="stream" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60 [background-position:50%_100%]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionTag index="04" label="On Air" accent="crimson" />
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
            Off the keyboard, behind the mic.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-panel-border bg-panel/40 backdrop-blur-sm">
            {/* scanline sweep */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
              <motion.div
                className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-signal-crimson/10 to-transparent"
                animate={{ y: ["-30%", "130%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1px_0.85fr]">
              {/* ── Left: brand block ── */}
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3">
                  <span className="flex h-2.5 w-2.5 items-center justify-center">
                    <span className="h-2 w-2 animate-pulse-dot rounded-full bg-signal-crimson" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal-crimson">
                    Live Now · Stream Persona
                  </span>
                </div>

                <h3 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  Mr. Flexy
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-dim sm:text-base">
                  Gaming content creator and live streamer, bringing the same
                  intensity from production codebases to competitive
                  gameplay. Real-time systems, real-time reactions.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <MagneticButton
                    href="https://www.youtube.com/@mrflexy1"
                    icon={<Youtube size={16} />}
                  >
                    Watch on YouTube
                  </MagneticButton>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 border-t border-panel-border pt-6 sm:grid-cols-4">
                  {channelStats.map((stat, index) => (
                    <div key={index}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                        {stat.label}
                      </div>
                      <div className={`mt-1.5 font-display text-sm font-semibold sm:text-base ${
                        stat.value === "ON AIR"
                          ? "text-signal-crimson"
                          : "text-ink"
                      }`}>
                        {"link" in stat && stat.link ? (
                          <a
                            href={stat.link as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-signal-cyan transition-colors"
                          >
                            {stat.value}
                          </a>
                        ) : (
                          stat.value
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden bg-panel-border lg:block" />

              {/* ── Right: smart YouTube embed ── */}
              <div className="relative flex flex-col justify-center gap-5 border-t border-panel-border p-8 sm:p-12 lg:border-t-0">

                {/* Smart embed: LIVE if streaming, latest video otherwise */}
                <YouTubeEmbed />

                <div className="flex items-center gap-4 rounded-xl border border-panel-border bg-void/60 p-4">
                  <Radio size={18} className="shrink-0 text-signal-cyan" />
                  <p className="font-mono text-xs leading-relaxed text-ink-dim">
                    Live gameplay sessions blended with dev commentary —
                    where the build process becomes the show.
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-panel-border bg-void/60 p-4">
                  <Users size={18} className="shrink-0 text-signal-violet-light" />
                  <p className="font-mono text-xs leading-relaxed text-ink-dim">
                    Growing a community around gaming tech, real systems, and
                    honest creative process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube, Radio, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { YouTubeEmbed } from "./YouTubeEmbed";

// ── Static channel info ───────────────────────────────────────────────────────
const CHANNEL_STATS = [
  { label: "Platform",  value: "YouTube",    link: "https://www.youtube.com/@mrflexy1" },
  { label: "Username",  value: "@mrflexy1",  link: "https://www.youtube.com/@mrflexy1" },
  { label: "TikTok",   value: "@mr._.flexy", link: "https://www.tiktok.com/@mr._.flexy" },
  { label: "Status",   value: "STATUS",      dynamic: true },
] as const;

// ── Live status badge ─────────────────────────────────────────────────────────
function LiveStatusBadge() {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((d) => setIsLive(d.type === "live"))
      .catch(() => setIsLive(false));
  }, []);

  if (isLive === null) {
    return (
      <span className="font-display text-sm font-semibold text-ink-faint sm:text-base animate-pulse">
        Checking…
      </span>
    );
  }

  if (isLive) {
    return (
      <motion.span
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-signal-crimson sm:text-base"
      >
        <span className="h-2 w-2 rounded-full bg-signal-crimson" />
        ON AIR
      </motion.span>
    );
  }

  return (
    <span className="font-display text-sm font-semibold text-ink-faint sm:text-base">
      OFF AIR
    </span>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export function StreamSection() {
  return (
    <section id="stream" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60 [background-position:50%_100%]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        

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

                  {/* TikTok button */}
                  <MagneticButton
                    href="https://www.tiktok.com/@mr._.flexy"
                    variant="secondary"
                    icon={
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                      </svg>
                    }
                  >
                    Follow on TikTok
                  </MagneticButton>
                </div>

                {/* ── Stats grid ── */}
                <div className="mt-10 grid grid-cols-2 gap-4 border-t border-panel-border pt-6 sm:grid-cols-4">
                  {CHANNEL_STATS.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                        {stat.label}
                      </div>
                      <div className="mt-1.5">
                        {"dynamic" in stat && stat.dynamic ? (
                          <LiveStatusBadge />
                        ) : "link" in stat && stat.link ? (
                          <a
                            href={stat.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-display text-sm font-semibold text-ink transition-colors hover:text-signal-cyan sm:text-base"
                          >
                            {stat.value}
                          </a>
                        ) : (
                          <span className="font-display text-sm font-semibold text-ink sm:text-base">
                            {stat.value}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden bg-panel-border lg:block" />

              {/* ── Right: YouTube embed ── */}
              <div className="relative flex flex-col justify-center gap-5 border-t border-panel-border p-8 sm:p-12 lg:border-t-0">
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

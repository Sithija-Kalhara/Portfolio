"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { profile, stats } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">


        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <Reveal delay={0.05}>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Engineering by discipline.{" "}
                <span className="text-ink-dim">
                  Gaming culture by passion.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-dim sm:text-lg">
                {profile.bio}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex items-start gap-4 rounded-2xl border border-panel-border bg-panel/40 p-6 backdrop-blur-sm">
                <span className="mt-1 font-mono text-xs text-signal-cyan">
                  {"//"}
                </span>
                <p className="font-mono text-sm leading-relaxed text-ink sm:text-base">
                  {profile.mission}
                </p>
              </div>
            </Reveal>
          </div>

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

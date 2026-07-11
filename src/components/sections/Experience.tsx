"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Rocket, Trophy } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { timeline, type TimelineItem } from "@/data/projects";
import { cn } from "@/lib/utils";

const typeConfig = {
  education: {
    icon: GraduationCap,
    accent: "text-signal-cyan border-signal-cyan/50 bg-signal-cyan/10",
    line: "bg-signal-cyan",
    label: "Education",
  },
  work: {
    icon: Briefcase,
    accent: "text-signal-violet-light border-signal-violet/50 bg-signal-violet/10",
    line: "bg-signal-violet",
    label: "Work",
  },
  project: {
    icon: Rocket,
    accent: "text-emerald-400 border-emerald-400/50 bg-emerald-400/10",
    line: "bg-emerald-400",
    label: "Project",
  },
  milestone: {
    icon: Trophy,
    accent: "text-signal-crimson border-signal-crimson/50 bg-signal-crimson/10",
    line: "bg-signal-crimson",
    label: "Milestone",
  },
};

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-5"
    >
      {/* icon */}
      <div className="relative flex flex-col items-center">
        <div className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          config.accent
        )}>
          <Icon size={16} />
          {item.current && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-cyan opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-signal-cyan" />
            </span>
          )}
        </div>
        {index < timeline.length - 1 && (
          <div className="mt-2 w-px flex-1 bg-panel-border" />
        )}
      </div>

      {/* content */}
      <div className="flex-1 pb-10">
        <div className="group rounded-2xl border border-panel-border bg-panel/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-signal-violet/30 hover:bg-panel/50">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-base font-semibold text-ink sm:text-lg">
                  {item.title}
                </h3>
                {item.current && (
                  <span className="rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-signal-cyan">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                {item.org}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {item.year}
              </span>
              <span className={cn(
                "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                config.accent
              )}>
                {config.label}
              </span>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            {item.description}
          </p>

          {item.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-panel-border bg-void/60 px-2 py-0.5 font-mono text-[10px] text-ink-faint"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            The journey so far.
          </h2>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {timeline.map((item, index) => (
            <TimelineCard key={`${item.year}-${item.title}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

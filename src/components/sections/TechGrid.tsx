"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { TechCard } from "./TechCard";
import { techStack, techCategories } from "@/data/profile";
import { cn } from "@/lib/utils";

type CategoryKey = (typeof techCategories)[number]["key"] | "all";

export function TechGrid() {
  const [active, setActive] = useState<CategoryKey>("all");

  const filtered =
    active === "all"
      ? techStack
      : techStack.filter((item) => item.category === active);

  return (
    <section id="stack" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.25] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionTag index="02" label="Tech Stack" accent="cyan" />
        </Reveal>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal delay={0.05}>
            <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              The console behind every build.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {(["all", ...techCategories.map((c) => c.key)] as CategoryKey[]).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300",
                      active === key
                        ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                        : "border-panel-border bg-panel/40 text-ink-faint hover:text-ink"
                    )}
                  >
                    {key === "all"
                      ? "All"
                      : techCategories.find((c) => c.key === key)?.label}
                  </button>
                )
              )}
            </div>
          </Reveal>
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((item, index) => (
            <TechCard key={item.name} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

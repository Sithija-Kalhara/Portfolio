"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { focusAreas } from "@/data/profile";

export function Focus() {
  return (
    <section id="focus" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">


        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
            Where I spend my cycles.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-panel-border bg-panel-border sm:grid-cols-2">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ backgroundColor: "rgba(124,58,237,0.04)" }}
              className="group relative bg-void p-8 transition-colors duration-300 sm:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-panel-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint transition-colors group-hover:border-signal-cyan/40 group-hover:text-signal-cyan">
                  {area.tag}
                </span>
                <span className="font-mono text-xs text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold text-ink sm:text-2xl">
                {area.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-dim sm:text-base">
                {area.description}
              </p>

              <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-signal-violet-light to-signal-cyan transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

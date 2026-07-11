"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const statusConfig = {
  active:    { label: "Active",    class: "text-signal-cyan border-signal-cyan/40 bg-signal-cyan/10" },
  live:      { label: "Live",      class: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
  building:  { label: "Building",  class: "text-signal-violet-light border-signal-violet/40 bg-signal-violet/10" },
  planning:  { label: "Planning",  class: "text-ink-dim border-panel-border bg-panel/40" },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const status = statusConfig[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-panel-border bg-panel/30 backdrop-blur-sm transition-all duration-300",
        hovered && "border-signal-violet/40 shadow-glow-violet"
      )}
    >
      {/* top accent line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-signal-violet via-signal-cyan to-signal-violet"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
                {project.name}
              </h3>
              {project.featured && (
                <span className="flex items-center gap-1 rounded-full border border-signal-violet/40 bg-signal-violet/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-signal-violet-light">
                  <Star size={8} fill="currentColor" /> Featured
                </span>
              )}
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
              {project.tagline}
            </p>
          </div>
          <span className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
            status.class
          )}>
            {status.label}
          </span>
        </div>

        {/* description */}
        <p className="mt-4 text-sm leading-relaxed text-ink-dim line-clamp-3">
          {project.description}
        </p>

        {/* highlights */}
        <ul className="mt-4 space-y-1.5">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 font-mono text-[11px] text-ink-dim">
              <span className="mt-0.5 text-signal-cyan">▸</span>
              {h}
            </li>
          ))}
        </ul>

        {/* stack tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-panel-border bg-void/60 px-2 py-0.5 font-mono text-[10px] text-ink-faint"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* footer */}
        <div className="mt-6 flex items-center justify-between border-t border-panel-border pt-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            {project.year}
          </span>
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-panel-border text-ink-faint transition-colors hover:border-signal-violet/40 hover:text-ink"
              >
                <Github size={14} />
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-panel-border bg-panel/40 px-3 py-1.5 font-mono text-[11px] text-ink-dim transition-all hover:border-signal-cyan/40 hover:text-signal-cyan"
              >
                Visit <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const filtered = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.2] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal delay={0.05}>
            <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Things I&apos;ve built.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex gap-2">
              {(["all", "featured"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-all",
                    filter === f
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "border-panel-border bg-panel/40 text-ink-faint hover:text-ink"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

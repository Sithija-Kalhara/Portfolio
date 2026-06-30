"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TechItem } from "@/data/profile";
import { techIcons } from "./TechIcons";

const accentStyles: Record<string, { glow: string; bar: string; text: string; iconBg: string }> = {
  frontend: {
    glow:   "group-hover:shadow-glow-violet group-hover:border-signal-violet/50",
    bar:    "from-signal-violet to-signal-violet-light",
    text:   "group-hover:text-signal-violet-light",
    iconBg: "bg-signal-violet/10 group-hover:bg-signal-violet/20",
  },
  backend: {
    glow:   "group-hover:shadow-glow-cyan group-hover:border-signal-cyan/50",
    bar:    "from-signal-cyan to-signal-cyan",
    text:   "group-hover:text-signal-cyan",
    iconBg: "bg-signal-cyan/10 group-hover:bg-signal-cyan/20",
  },
  tools: {
    glow:   "group-hover:shadow-glow-crimson group-hover:border-signal-crimson/50",
    bar:    "from-signal-crimson to-signal-crimson",
    text:   "group-hover:text-signal-crimson",
    iconBg: "bg-signal-crimson/10 group-hover:bg-signal-crimson/20",
  },
};

const iconColor: Record<string, string> = {
  frontend: "text-signal-violet-light",
  backend:  "text-signal-cyan",
  tools:    "text-signal-crimson",
};

export function TechCard({ item, index }: { item: TechItem; index: number }) {
  const accent = accentStyles[item.category];
  const Icon   = (techIcons as Record<string, (props: { className?: string }) => JSX.Element>)[item.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-panel-border bg-panel/50 p-5 backdrop-blur-sm transition-all duration-300",
        accent.glow
      )}
    >
      {/* top row: icon + index */}
      <div className="flex items-center justify-between">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300",
          accent.iconBg
        )}>
          {Icon && (
            <Icon className={cn("h-5 w-5 transition-colors duration-300", iconColor[item.category])} />
          )}
        </div>
        <span className="font-mono text-[10px] text-ink-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* name */}
      <div className={cn(
        "mt-3 font-display text-sm font-semibold text-ink transition-colors duration-300 sm:text-base",
        accent.text
      )}>
        {item.name}
      </div>

      {/* proficiency bar */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-panel-border/60">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", accent.bar)}
          initial={{ width: 0 }}
          whileInView={{ width: `${item.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 + (index % 6) * 0.05, ease: "easeOut" }}
        />
      </div>

      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
        {item.level}%
      </span>
    </motion.div>
  );
}

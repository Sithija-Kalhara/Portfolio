"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  external?: boolean;
  className?: string;
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  icon,
  external = true,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.25);
    y.set(relY * 0.4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-300",
        variant === "primary"
          ? "bg-ink text-void shadow-glow-violet hover:shadow-glow-cyan"
          : "border border-panel-border bg-panel/40 text-ink backdrop-blur-sm hover:border-signal-cyan/50 hover:text-signal-cyan",
        className
      )}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-signal-violet via-signal-cyan to-signal-violet opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon}
      </span>
    </motion.a>
  );
}

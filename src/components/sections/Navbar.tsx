"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Focus", href: "#focus" },
  { label: "Stream", href: "#stream" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-panel-border bg-void/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-signal-violet/40 bg-panel font-display text-sm font-bold text-signal-cyan transition-colors group-hover:border-signal-cyan/60">
            SK
          </span>
          <span className="font-mono text-[13px] uppercase tracking-[0.2em] text-ink-dim transition-colors group-hover:text-ink">
            Sithija<span className="text-signal-violet-light">.</span>com
          </span>
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative font-mono text-[12px] uppercase tracking-[0.18em] text-ink-dim transition-colors hover:text-ink"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-signal-violet-light to-signal-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-full border border-panel-border bg-panel/60 px-5 py-2 font-mono text-[12px] uppercase tracking-[0.15em] text-ink transition-all hover:border-signal-cyan/50 hover:text-signal-cyan lg:flex"
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-crimson" />
          Let&apos;s Talk
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-panel-border bg-panel/60 text-ink lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-panel-border bg-void/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-mono text-sm uppercase tracking-[0.15em] text-ink-dim transition-colors hover:bg-panel hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-[12px] uppercase tracking-[0.15em] text-void"
              >
                Let&apos;s Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

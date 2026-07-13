"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, Minimize2, Maximize2, Loader2, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactAction = {
  label: string;
  icon: "phone" | "mail" | "whatsapp" | "link";
  href: string;
  color: "violet" | "cyan" | "crimson" | "green";
};

type Message = {
  role: "user" | "assistant";
  content: string;
  actions?: ContactAction[];
};

const CONTACT_ACTIONS: ContactAction[] = [
  { label: "Call Now",   icon: "phone",    href: "tel:+94712058956",                                                                                                            color: "cyan"    },
  { label: "Email",      icon: "mail",     href: "mailto:sithijakalhara2@gmail.com?subject=Project%20Inquiry&body=Hi%20Sithija%2C%20I%20found%20your%20portfolio%20and%20wanted%20to%20connect.", color: "violet"  },
  { label: "WhatsApp",   icon: "whatsapp", href: "https://wa.me/94712058956?text=Hi%20Sithija!%20I%20found%20your%20portfolio%20and%20wanted%20to%20connect.",                  color: "green"   },
  { label: "LinkedIn",   icon: "link",     href: "https://www.linkedin.com/in/sithija-kalhara/",                                                                                color: "crimson" },
];

const SUGGESTED = [
  "What's Sithija's tech stack?",
  "Tell me about Eyerone",
  "Is he available for freelance?",
  "Show me his projects",
];

// ── Contact action buttons ────────────────────────────────────────────────────
function ContactButtons({ actions }: { actions: ContactAction[] }) {
  const iconMap = {
    phone:    <Phone size={12} />,
    mail:     <Mail size={12} />,
    whatsapp: <MessageCircle size={12} />,
    link:     <ExternalLink size={12} />,
  };
  const colorMap = {
    violet:  "border-signal-violet/50 bg-signal-violet/10 text-signal-violet-light hover:bg-signal-violet/25",
    cyan:    "border-signal-cyan/50 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/25",
    crimson: "border-signal-crimson/50 bg-signal-crimson/10 text-signal-crimson hover:bg-signal-crimson/25",
    green:   "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25",
  };
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <a
          key={a.label}
          href={a.href}
          target={a.icon === "whatsapp" || a.icon === "link" ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-all duration-200",
            colorMap[a.color]
          )}
        >
          {iconMap[a.icon]}
          {a.label}
        </a>
      ))}
    </div>
  );
}

// ── NEXUS avatar ──────────────────────────────────────────────────────────────
function NEXUSAvatar({ size = 32, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <defs>
          <radialGradient id="NEXUS-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0d0d14" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect x="8" y="4" width="24" height="26" rx="4" fill="url(#NEXUS-bg)" />
        <ellipse cx="15" cy="16" rx="3.5" ry="3.5" fill="#00f0ff" opacity="0.95" />
        <ellipse cx="25" cy="16" rx="3.5" ry="3.5" fill="#00f0ff" opacity="0.95" />
        <ellipse cx="15" cy="16" rx="1.5" ry="1.5" fill="#fff" opacity="0.9" />
        <ellipse cx="25" cy="16" rx="1.5" ry="1.5" fill="#fff" opacity="0.9" />
        <path d="M14 23 Q20 27 26 23" stroke="#00f0ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="20" y1="4" x2="20" y2="0" stroke="#a855f7" strokeWidth="1.5" />
        <circle cx="20" cy="0" r="1.5" fill="#00f0ff" />
        <rect x="4" y="12" width="4" height="8" rx="2" fill="#7c3aed" opacity="0.7" />
        <rect x="32" y="12" width="4" height="8" rx="2" fill="#7c3aed" opacity="0.7" />
      </svg>
      {pulse && (
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-cyan opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal-cyan" />
        </span>
      )}
    </div>
  );
}

// ── Main NEXUS Chat ───────────────────────────────────────────────────────────
export function NEXUSChat() {
  const [open, setOpen]         = useState(false);
  const [minimized, setMin]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm **NEXUS** — Sithija's AI assistant. Ask me anything about his skills, projects, or availability. 🎮",
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, minimized]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function shouldShowContact(userText: string, aiText: string): boolean {
    const t = (userText + " " + aiText).toLowerCase();
    return (
      t.includes("contact") || t.includes("hire") || t.includes("email") ||
      t.includes("call") || t.includes("whatsapp") || t.includes("reach") ||
      t.includes("freelance") || t.includes("work together") ||
      t.includes("available") || t.includes("phone")
    );
  }

  async function send(text = input) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      const reply = data.text ?? "Sorry, I had trouble processing that. Try again!";
      const showContact = shouldShowContact(text, reply);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, actions: showContact ? CONTACT_ACTIONS : undefined },
      ]);
      if (data.action) setTimeout(() => scrollToSection(data.action), 600);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection issue! Try again in a moment. 🔌" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function renderText(text: string) {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1 ? <strong key={i} className="text-signal-cyan font-semibold">{p}</strong> : p
    );
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-signal-violet/50 bg-void/90 px-4 py-3 shadow-glow-violet backdrop-blur-xl transition-all hover:shadow-glow-cyan"
            aria-label="Open NEXUS assistant"
          >
            <NEXUSAvatar size={28} pulse />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-ink">
              Ask NEXUS
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-panel-border bg-void/95 shadow-glow-violet backdrop-blur-2xl sm:max-w-[380px]"
            style={{ maxHeight: minimized ? "64px" : "540px" }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-panel-border bg-panel/60 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <NEXUSAvatar size={30} pulse />
                <div>
                  <div className="font-display text-sm font-semibold text-ink">NEXUS</div>
                  <div className="font-mono text-[10px] text-signal-cyan uppercase tracking-wider">
                    Online · Sithija&apos;s AI
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMin((v) => !v)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel hover:text-ink"
                >
                  {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel hover:text-ink"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "340px" }}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn("flex gap-2.5", m.role === "user" ? "flex-row-reverse" : "flex-row")}
                    >
                      {m.role === "assistant" && <NEXUSAvatar size={26} />}
                      <div className="flex flex-col max-w-[82%]">
                        <div
                          className={cn(
                            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                            m.role === "user"
                              ? "bg-signal-violet/20 text-ink border border-signal-violet/30 rounded-tr-sm"
                              : "bg-panel/80 text-ink border border-panel-border rounded-tl-sm"
                          )}
                        >
                          {renderText(m.content)}
                        </div>
                        {m.actions && <ContactButtons actions={m.actions} />}
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <div className="flex gap-2.5">
                      <NEXUSAvatar size={26} />
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-panel-border bg-panel/80 px-3.5 py-2.5">
                        <Loader2 size={13} className="animate-spin text-signal-cyan" />
                        <span className="font-mono text-xs text-ink-faint">Thinking…</span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* suggested questions */}
                {messages.length <= 1 && (
                  <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-panel-border bg-panel/60 px-3 py-1 font-mono text-[10px] text-ink-dim transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* input */}
                <div className="border-t border-panel-border bg-panel/40 px-3 py-3">
                  <div className="flex items-center gap-2 rounded-xl border border-panel-border bg-void/60 px-3 py-2 focus-within:border-signal-cyan/50">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && send()}
                      placeholder="Ask about Sithija…"
                      className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                    <button
                      onClick={() => send()}
                      disabled={!input.trim() || loading}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-signal-violet/80 text-white transition-all hover:bg-signal-violet disabled:opacity-40"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                  <div className="w-full flex justify-center items-center font-sans mt-1.5">
                    <p className="text-[10.5px] tracking-wider text-neutral-500 text-center">
                      <span className="font-extrabold tracking-[0.25em] text-white uppercase mr-2">NEXUS</span>
                      <span className="italic font-light text-neutral-400 text-[10px]">powered by</span>{" "}
                      <span className="font-medium text-neutral-200">Sithija Kalhara</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { profile, socials } from "@/data/profile";
import { socialIconMap } from "./socialIcons";
import { cn } from "@/lib/utils";
import emailjs from "@emailjs/browser";

type FormStatus = "idle" | "sending" | "sent" | "error";

const accentText: Record<string, string> = {
  violet: "text-signal-violet-light",
  cyan: "text-signal-cyan",
  crimson: "text-signal-crimson",
};

const accentBorder: Record<string, string> = {
  violet: "hover:border-signal-violet/50 hover:shadow-glow-violet",
  cyan: "hover:border-signal-cyan/50 hover:shadow-glow-cyan",
  crimson: "hover:border-signal-crimson/50 hover:shadow-glow-crimson",
};

const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // EmailJS Template එකේ ඔයා දාලා තියෙන variables වලට අනුව මේවා වෙනස් කරන්න (e.g., from_name, reply_to, message)
    const templateParams = {
      from_name: form.name,
      reply_to: form.email,
      message: form.message,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <section id="contact" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.25] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionTag index="05" label="Contact" accent="cyan" />
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Let&apos;s build something{" "}
            <span className="text-gradient-violet-cyan">ambitious</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-dim sm:text-lg">
            Open to product collaborations, full-stack builds, and anything
            that mixes serious engineering with creative ambition. Drop a
            message or reach out directly.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-6">
          {/* form */}
          <Reveal delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-2xl border border-panel-border bg-panel/30 p-7 backdrop-blur-xl sm:p-9"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-signal-violet/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-signal-cyan/10 blur-3xl" />

              <div className="relative space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    id="name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    placeholder="Your name"
                    required
                  />
                  <Field
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Tell me about the project..."
                    className="w-full resize-none rounded-xl border border-panel-border bg-void/60 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal-cyan/50 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className={cn(
                    "group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] transition-all duration-300",
                    status === "sent" && "bg-emerald-500/15 text-emerald-400",
                    status === "error" && "bg-rose-500/15 text-rose-400",
                    status !== "sent" && status !== "error" && "bg-ink text-void hover:shadow-glow-violet"
                  )}
                >
                  {status === "idle" && (
                    <>
                      Send Message
                      <Send size={15} />
                    </>
                  )}
                  {status === "sending" && (
                    <>
                      Sending
                      <Loader2 size={15} className="animate-spin" />
                    </>
                  )}
                  {status === "sent" && (
                    <>
                      Message Sent
                      <CheckCircle2 size={15} />
                    </>
                  )}
                  {status === "error" && (
                    <>
                      Failed to Send
                      <AlertCircle size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>

          {/* social links */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {socials.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "group flex items-center justify-between rounded-xl border border-panel-border bg-panel/40 px-5 py-4 backdrop-blur-sm transition-all duration-300",
                      accentBorder[social.color]
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon
                        size={18}
                        className={cn(
                          "shrink-0 transition-colors",
                          accentText[social.color]
                        )}
                      />
                      <div>
                        <div className="font-display text-sm font-semibold text-ink">
                          {social.label}
                        </div>
                        <div className="font-mono text-[11px] text-ink-faint">
                          {social.handle}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={15}
                      className="text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </motion.a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-panel-border bg-void/60 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal-cyan/50 focus:outline-none"
      />
    </div>
  );
}
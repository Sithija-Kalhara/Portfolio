"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Radio, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

type VideoData = {
  type: "live" | "video";
  videoId: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
  error?: string;
};

export function YouTubeEmbed() {
  const [data,     setData]     = useState<VideoData | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [playing,  setPlaying]  = useState(false);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(true); }
        else         { setData(d); }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-panel-border bg-void">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-signal-cyan" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Fetching stream…
          </span>
        </div>
      </div>
    );
  }

  // ── Error / API key not set ────────────────────────────────────────────────
  if (error || !data) {
    return (
      <FallbackThumbnail />
    );
  }

  // ── Thumbnail → click to play ─────────────────────────────────────────────
  if (!playing) {
    return (
      <motion.div
        className="relative flex aspect-video cursor-pointer overflow-hidden rounded-xl border border-panel-border bg-void"
        whileHover="hover"
        onClick={() => setPlaying(true)}
      >
        {/* thumbnail */}
        {data.thumbnail ? (
          <Image
            src={data.thumbnail}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        )}

        {/* dark overlay */}
        <div className="absolute inset-0 bg-void/50" />

        {/* LIVE badge */}
        {data.type === "live" && (
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-signal-crimson px-2.5 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white">
              Live
            </span>
          </motion.div>
        )}

        {/* Latest badge */}
        {data.type === "video" && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-panel/90 px-2.5 py-1 border border-panel-border">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
              Latest
            </span>
          </div>
        )}

        {/* play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={{ hover: { scale: 1.05 } }}
        >
          <motion.div
            className={`flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm shadow-lg ${
              data.type === "live"
                ? "bg-signal-crimson/90 shadow-glow-crimson"
                : "bg-ink/90 shadow-glow-violet"
            }`}
            variants={{ hover: { scale: 1.12 } }}
            transition={{ duration: 0.25 }}
          >
            <PlayCircle
              size={30}
              strokeWidth={1.5}
              className={data.type === "live" ? "text-white" : "text-void"}
            />
          </motion.div>
        </motion.div>

        {/* title */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/95 via-void/60 to-transparent p-4">
          <p className="line-clamp-2 font-mono text-[11px] leading-relaxed text-ink-dim">
            {data.title}
          </p>
        </div>

        {/* channel watermark */}
        <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-wider text-ink-faint/60">
          @mrflexy1
        </span>
      </motion.div>
    );
  }

  // ── iframe embed (after click) ─────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative aspect-video overflow-hidden rounded-xl border border-panel-border bg-void"
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1&rel=0&modestbranding=1${
            data.type === "live" ? "&livemonitor=1" : ""
          }`}
          title={data.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ── Fallback when API key not set yet ─────────────────────────────────────────
function FallbackThumbnail() {
  return (
    <a
      href="https://www.youtube.com/@mrflexy1"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-panel-border bg-void"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-signal-crimson/90 px-2 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-white">
          Live
        </span>
      </div>
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-ink/95 text-void shadow-glow-crimson"
      >
        <PlayCircle size={30} strokeWidth={1.5} />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={12} className="text-signal-crimson" />
          <span className="font-mono text-[10px] text-ink-faint">
            Add YOUTUBE_API_KEY to .env.local to enable smart embed
          </span>
        </div>
      </div>
      <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        @mrflexy1
      </span>
    </a>
  );
}

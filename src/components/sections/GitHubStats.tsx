"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Flame, Trophy, GitFork, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";

const GITHUB_USER = "Sithija-Kalhara";

type ContributionDay = { date: string; count: number };
type ContributionWeek = { days: ContributionDay[] };
type Contributions = {
  total: number;
  currentStreak: number;
  longestStreak: number;
  maxCount: number;
  weeks: ContributionWeek[];
};

type GitHubData = {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  topLangs: { lang: string; count: number }[];
  contributions: Contributions | null;
};

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  "Jupyter Notebook": "#da5b0b",
};

// Same 5-bucket shading GitHub itself uses, tinted to the site's cyan/violet palette.
const LEVEL_COLORS = ["#181822", "#123b3f", "#0e5c63", "#0891a8", "#00f0ff"];

function levelFor(count: number, max: number) {
  if (count === 0) return 0;
  const q = Math.max(1, max / 4);
  if (count <= q) return 1;
  if (count <= q * 2) return 2;
  if (count <= q * 3) return 3;
  return 4;
}

function ContributionHeatmap({ data }: { data: Contributions }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-[3px]">
        {data.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.days.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                className="h-[10px] w-[10px] rounded-[2px]"
                style={{ backgroundColor: LEVEL_COLORS[levelFor(day.count, data.maxCount)] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/github")
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text().catch(() => "");
          console.error(`/api/github returned ${r.status}: ${body}`);
          setFetchFailed(true);
          return;
        }
        return r.json();
      })
      .then((d) => {
        if (d && !d.error) setData(d);
        else if (d?.error) {
          console.error("/api/github error payload:", d.error);
          setFetchFailed(true);
        }
      })
      .catch((err) => {
        console.error("/api/github fetch threw:", err);
        setFetchFailed(true);
      })
      .finally(() => setLoaded(true));
  }, []);

  // Fetch itself succeeded but the API returned contributions: null — this only
  // happens when GITHUB_TOKEN isn't configured server-side (see route.ts).
  const contributionsUnavailable = loaded && data && !data.contributions;

  // Use ?? so a real value of 0 (e.g. 0 followers) isn't hidden behind the placeholder.
  const quickStats = [
    { label: "Public Repos", value: data ? `${data.public_repos}+` : "12+", color: "text-signal-cyan" },
    { label: "Followers", value: data ? `${data.followers}` : "—", color: "text-signal-violet-light" },
    { label: "Years Coding", value: "5+", color: "text-emerald-400" },
    { label: "Top Language", value: data?.topLangs?.[0]?.lang || "JS/TS", color: "text-signal-crimson" },
  ];

  return (
    <section id="stats" className="relative py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-panel-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.2] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Code by the numbers.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* ── GitHub Profile Card (self-hosted data) ── */}
          <Reveal delay={0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              className="flex flex-col gap-4 rounded-2xl border border-panel-border bg-panel/30 p-6 backdrop-blur-sm transition-all hover:border-signal-violet/40 hover:shadow-glow-violet"
            >
              <div className="flex items-center gap-3">
                {data?.avatar ? (
                  <Image
                    src={data.avatar}
                    alt={data.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-panel-border"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-panel-border bg-panel">
                    <Github size={20} className="text-signal-violet-light" />
                  </div>
                )}
                <div>
                  <div className="font-display text-base font-semibold text-ink">
                    {data?.name || "Sithija Kalhara"}
                  </div>
                  <a
                    href={`https://github.com/${GITHUB_USER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-signal-cyan hover:underline"
                  >
                    @{GITHUB_USER}
                  </a>
                </div>
              </div>

              {data?.bio && <p className="text-sm leading-relaxed text-ink-dim">{data.bio}</p>}

              <div className="grid grid-cols-3 gap-3 border-t border-panel-border pt-4">
                {[
                  { icon: <Github size={14} />, label: "Repos", value: data ? data.public_repos : 12 },
                  { icon: <Users size={14} />, label: "Followers", value: data ? data.followers : "—" },
                  { icon: <GitFork size={14} />, label: "Following", value: data ? data.following : "—" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="flex justify-center text-signal-cyan">{s.icon}</div>
                    <div className="mt-1 font-display text-lg font-bold text-ink">{s.value}</div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Top Languages */}
              {data?.topLangs && data.topLangs.length > 0 && (
                <div className="border-t border-panel-border pt-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">Top Languages</div>
                  <div className="space-y-2">
                    {data.topLangs.map(({ lang, count }) => {
                      const total = data.topLangs.reduce((a, b) => a + b.count, 0);
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={lang}>
                          <div className="mb-1 flex justify-between font-mono text-[10px] text-ink-dim">
                            <span>{lang}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-panel-border">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: LANG_COLORS[lang] || "#7c3aed" }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {fetchFailed && (
                <div className="border-t border-panel-border pt-3 font-mono text-[10px] text-ink-faint">
                  Live stats unavailable — showing placeholders.
                </div>
              )}
            </motion.div>
          </Reveal>

          {/* ── Streak Stats (self-hosted, from our own /api/github) ── */}
          <Reveal delay={0.12}>
            <motion.div
              whileHover={{ y: -4 }}
              className="flex h-full flex-col justify-center gap-4 rounded-2xl border border-panel-border bg-panel/30 p-6 backdrop-blur-sm transition-all hover:border-signal-crimson/40 hover:shadow-glow-crimson"
            >
              {data?.contributions ? (
                <>
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold text-ink">
                      {data.contributions.total.toLocaleString()}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                      Contributions (past year)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-panel-border pt-4">
                    <div className="text-center">
                      <div className="flex justify-center text-signal-crimson">
                        <Flame size={16} />
                      </div>
                      <div className="mt-1 font-display text-lg font-bold text-ink">
                        {data.contributions.currentStreak}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                        Current Streak
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center text-signal-cyan">
                        <Trophy size={16} />
                      </div>
                      <div className="mt-1 font-display text-lg font-bold text-ink">
                        {data.contributions.longestStreak}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                        Longest Streak
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center font-mono text-[10px] text-ink-faint">
                  Streak data unavailable.
                </div>
              )}
            </motion.div>
          </Reveal>

          {/* ── Quick Stats ── */}
          <Reveal delay={0.16}>
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="rounded-xl border border-panel-border bg-panel/30 p-4 text-center backdrop-blur-sm"
                >
                  <div className={`font-display text-2xl font-bold sm:text-3xl ${stat.color}`}>{stat.value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Activity Graph — full width, self-hosted heatmap */}
        <Reveal delay={0.2} className="mt-5">
          <motion.div
            whileHover={{ y: -2 }}
            className="overflow-hidden rounded-2xl border border-panel-border bg-panel/30 p-5 backdrop-blur-sm transition-all hover:border-signal-violet/30"
          >
            <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              Contribution Activity
            </div>
            {data?.contributions ? (
              <ContributionHeatmap data={data.contributions} />
            ) : (
              <div className="font-mono text-[10px] text-ink-faint">
                {fetchFailed || contributionsUnavailable ? "Live stats unavailable." : "Loading…"}
              </div>
            )}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
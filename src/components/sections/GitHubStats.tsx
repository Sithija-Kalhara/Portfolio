"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Flame, GitFork, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";

const GITHUB_USER = "Sithija-Kalhara";

type ContributionDay = { date: string; count: number };
type ContributionWeek = { days: ContributionDay[] };
type Contributions = {
  total: number;
  currentStreak: number;
  longestStreak: number;
  currentStreakStart: string;
  currentStreakEnd: string;
  longestStreakStart: string;
  longestStreakEnd: string;
  firstDate: string;
  lastDate: string;
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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatShort(dateStr: string, withYear = false) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  const label = `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
  return withYear ? `${label}, ${d.getFullYear()}` : label;
}

function formatRange(start: string, end: string) {
  if (!start || !end) return "";
  return start === end ? formatShort(start) : `${formatShort(start)} - ${formatShort(end)}`;
}

// Rolls the daily contribution calendar up into the last 12 calendar months,
// oldest first, so the bar chart reads left-to-right like a timeline.
function monthlyTotals(data: Contributions) {
  const totals = new Map<string, number>();
  for (const week of data.weeks) {
    for (const day of week.days) {
      const d = new Date(day.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      totals.set(key, (totals.get(key) || 0) + day.count);
    }
  }
  const now = new Date();
  const months: { key: string; label: string; total: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    months.push({ key, label: MONTH_LABELS[d.getMonth()], total: totals.get(key) || 0 });
  }
  return months;
}

function StreakRing({ value, pct }: { value: number; pct: number }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, pct));

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" className="stroke-panel-border" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#0891a8"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - clamped) }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <Flame size={16} className="text-signal-crimson" />
        <div className="font-display text-2xl font-bold text-ink">{value}</div>
      </div>
    </div>
  );
}

function MonthlyActivityChart({ data }: { data: Contributions }) {
  const months = monthlyTotals(data);
  const max = Math.max(1, ...months.map((m) => m.total));

  return (
    <div className="flex h-full flex-col">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        Monthly Activity
      </div>
      <div className="flex flex-1 items-end gap-[6px] pt-2">
        {months.map((m, i) => (
          <div key={m.key} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.div
              className="w-full rounded-t-sm bg-gradient-to-t from-signal-cyan/40 to-signal-cyan"
              title={`${m.label}: ${m.total} contribution${m.total === 1 ? "" : "s"}`}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max(4, (m.total / max) * 72)}px` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.03, ease: "easeOut" }}
            />
            <div className="font-mono text-[8px] uppercase tracking-wider text-ink-faint">{m.label}</div>
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
                  <div className="flex items-center gap-2">
                    <div className="font-display text-base font-semibold text-ink">
                      {data?.name || "Sithija Kalhara"}
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                      5+ yrs
                    </span>
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
              className="flex h-full flex-col justify-center rounded-2xl border border-panel-border bg-panel/30 p-6 backdrop-blur-sm transition-all hover:border-signal-crimson/40 hover:shadow-glow-crimson"
            >
              {data?.contributions ? (
                <div className="grid grid-cols-3 items-center divide-x divide-panel-border">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-ink sm:text-3xl">
                      {data.contributions.total.toLocaleString()}
                    </div>
                    <div className="mt-1.5 text-xs text-ink-dim">Total Contributions</div>
                    <div className="mt-0.5 font-mono text-[10px] text-ink-faint">
                      {formatShort(data.contributions.firstDate, true)} - Present
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 px-2">
                    <StreakRing
                      value={data.contributions.currentStreak}
                      pct={
                        data.contributions.longestStreak > 0
                          ? data.contributions.currentStreak / data.contributions.longestStreak
                          : 0
                      }
                    />
                    <div className="text-xs font-semibold text-signal-crimson">Current Streak</div>
                    <div className="font-mono text-[10px] text-ink-faint">
                      {formatRange(data.contributions.currentStreakStart, data.contributions.currentStreakEnd)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-ink sm:text-3xl">
                      {data.contributions.longestStreak}
                    </div>
                    <div className="mt-1.5 text-xs text-ink-dim">Longest Streak</div>
                    <div className="mt-0.5 font-mono text-[10px] text-ink-faint">
                      {formatRange(data.contributions.longestStreakStart, data.contributions.longestStreakEnd)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center font-mono text-[10px] text-ink-faint">
                  {fetchFailed || contributionsUnavailable ? "Streak data unavailable." : "Loading…"}
                </div>
              )}
            </motion.div>
          </Reveal>

          {/* ── Monthly Activity Chart (replaces the old duplicate quick-stats grid) ── */}
          <Reveal delay={0.16}>
            <motion.div
              whileHover={{ y: -4 }}
              className="flex h-full flex-col rounded-2xl border border-panel-border bg-panel/30 p-6 backdrop-blur-sm transition-all hover:border-signal-cyan/40 hover:shadow-glow-cyan"
            >
              {data?.contributions ? (
                <MonthlyActivityChart data={data.contributions} />
              ) : (
                <div className="flex flex-1 items-center justify-center text-center font-mono text-[10px] text-ink-faint">
                  {fetchFailed || contributionsUnavailable ? "Chart data unavailable." : "Loading…"}
                </div>
              )}
            </motion.div>
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
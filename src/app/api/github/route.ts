import { NextResponse } from "next/server";

export const runtime = "edge";
// Cache එක instant clear කරගන්න revalidate එක 0 කරන්න (නැතහොත් dynamic කරන්න)
export const dynamic = "force-dynamic";

const GITHUB_USER = "Sithija-Kalhara";

type ContributionDay = { date: string; count: number };

function calcStreaks(days: ContributionDay[]) {
  let longest = 0;
  let temp = 0;
  for (const d of days) {
    if (d.count > 0) {
      temp++;
      longest = Math.max(longest, temp);
    } else {
      temp = 0;
    }
  }

  // Current streak: walk backwards from the most recent day. If "today" has
  // 0 contributions yet (day not finished), skip it and check from yesterday.
  let idx = days.length - 1;
  if (idx >= 0 && days[idx].count === 0) idx--;
  let current = 0;
  while (idx >= 0 && days[idx].count > 0) {
    current++;
    idx--;
  }

  return { current, longest };
}

export async function GET() {
  const restHeaders: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "sithijakalhara-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) restHeaders["Authorization"] = `Bearer ${token}`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers: restHeaders,
        cache: "no-store",
      }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
        headers: restHeaders,
        cache: "no-store",
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub REST fetch failed" }, { status: 502 });
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const langCount: Record<string, number> = {};
    repos.forEach((r: { language?: string }) => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });

    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    // ── Contribution calendar (replaces the old external streak/graph images) ──
    // GraphQL requires a token even for public data, so this block only runs
    // if GITHUB_TOKEN is set. If it's missing, we just omit `contributions`
    // and the frontend falls back gracefully instead of showing an error card.
    let contributions: {
      total: number;
      currentStreak: number;
      longestStreak: number;
      weeks: { days: ContributionDay[] }[];
      maxCount: number;
    } | null = null;

    if (token) {
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

      const gqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "sithijakalhara-portfolio",
        },
        body: JSON.stringify({ query, variables: { login: GITHUB_USER } }),
        cache: "no-store",
      });

      if (gqlRes.ok) {
        const gqlJson = await gqlRes.json();
        const calendar = gqlJson?.data?.user?.contributionsCollection?.contributionCalendar;

        if (calendar) {
          const allDays: ContributionDay[] = calendar.weeks.flatMap(
            (w: { contributionDays: { date: string; contributionCount: number }[] }) =>
              w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
          );
          const maxCount = Math.max(1, ...allDays.map((d) => d.count));
          const { current, longest } = calcStreaks(allDays);

          contributions = {
            total: calendar.totalContributions,
            currentStreak: current,
            longestStreak: longest,
            maxCount,
            weeks: calendar.weeks.map((w: { contributionDays: { date: string; contributionCount: number }[] }) => ({
              days: w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
            })),
          };
        }
      }
      // If the GraphQL call fails, we silently leave `contributions` as null —
      // the REST-based stats above still render fine either way.
    }

    return NextResponse.json(
      {
        name: user.name || GITHUB_USER,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        public_repos: user.public_repos ?? 0,
        topLangs,
        contributions,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
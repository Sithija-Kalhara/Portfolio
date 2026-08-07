import { NextResponse } from "next/server";

export const runtime = "edge";
// Cache එක instant clear කරගන්න revalidate එක 0 කරන්න (නැතහොත් dynamic කරන්න)
export const dynamic = "force-dynamic";

export async function GET() {
  const GITHUB_USER = "Sithija-Kalhara";
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "sithijakalhara-portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      // cache: 'no-store' මගින් Next.js/Edge cache එක Bypass කරයි
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
        headers,
        cache: "no-store",
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub fetch failed" }, { status: 502 });
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

    return NextResponse.json(
      {
        name: user.name || GITHUB_USER,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        public_repos: user.public_repos ?? 0,
        topLangs,
      },
      {
        headers: {
          // Browser සහ Cloudflare Caching වැළැක්වීමට
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
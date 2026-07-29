import { NextResponse } from "next/server";

export const runtime = "edge"; // ensure this runs even on Cloudflare/edge deployments
export const revalidate = 3600; // cache 1 hour

export async function GET() {
  const GITHUB_USER = "Sithija-Kalhara";
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "sithijakalhara-portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  } else {
    console.warn("GITHUB_TOKEN not set — using unauthenticated GitHub API (60 req/hr limit)");
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    if (!userRes.ok) {
      const body = await userRes.text();
      console.error(`GitHub user fetch failed: ${userRes.status} ${body}`);
      return NextResponse.json(
        { error: `GitHub user fetch failed with status ${userRes.status}` },
        { status: 502 }
      );
    }

    if (!reposRes.ok) {
      const body = await reposRes.text();
      console.error(`GitHub repos fetch failed: ${reposRes.status} ${body}`);
      return NextResponse.json(
        { error: `GitHub repos fetch failed with status ${reposRes.status}` },
        { status: 502 }
      );
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) {
      console.error("GitHub repos response was not an array:", repos);
      return NextResponse.json(
        { error: "Unexpected repos response shape" },
        { status: 502 }
      );
    }

    const langCount: Record<string, number> = {};
    repos.forEach((r: { language?: string }) => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });

    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    return NextResponse.json({
      name: user.name || GITHUB_USER,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      public_repos: user.public_repos ?? 0,
      topLangs,
    });
  } catch (err) {
    console.error("GitHub API route threw:", err);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
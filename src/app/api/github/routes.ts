import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    const GITHUB_USER = "Sithija-Kalhara";
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "sithijakalhara-portfolio",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Count languages
    const langCount: Record<string, number> = {};
    if (Array.isArray(repos)) {
      repos.forEach((r: { language?: string }) => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      });
    }
    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    return NextResponse.json({
      name:        user.name || GITHUB_USER,
      avatar:      user.avatar_url,
      bio:         user.bio,
      followers:   user.followers || 0,
      following:   user.following || 0,
      public_repos: user.public_repos || 0,
      topLangs,
    });
  } catch (err) {
    console.error("GitHub API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
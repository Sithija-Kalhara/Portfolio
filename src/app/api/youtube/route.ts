import { NextResponse } from "next/server";

const CHANNEL_ID = "UCFK9phR6Au3AVhUw95n71fQ"; // @mrflexy1
const API_KEY    = process.env.YOUTUBE_API_KEY;

export const revalidate = 120;

// ── Strategy 1: YouTube Data API (if key is set) ──────────────────────────────
async function fetchViaAPI() {
  // Check live first
  const liveRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`,
    { next: { revalidate: 120 } }
  );
  const liveData = await liveRes.json();

  if (liveData.items?.length > 0) {
    const v = liveData.items[0];
    return {
      type:      "live" as const,
      videoId:   v.id.videoId,
      title:     v.snippet.title,
      thumbnail: v.snippet.thumbnails?.high?.url,
    };
  }

  // Latest video
  const latestRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=1&key=${API_KEY}`,
    { next: { revalidate: 120 } }
  );
  const latestData = await latestRes.json();

  if (latestData.items?.length > 0) {
    const v = latestData.items[0];
    return {
      type:        "video" as const,
      videoId:     v.id.videoId,
      title:       v.snippet.title,
      thumbnail:   v.snippet.thumbnails?.high?.url,
      publishedAt: v.snippet.publishedAt,
    };
  }
  return null;
}

// ── Strategy 2: RSS Feed (no API key needed, always free) ────────────────────
async function fetchViaRSS() {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const res    = await fetch(rssUrl, { next: { revalidate: 120 } });
  const xml    = await res.text();

  // Parse first <entry> from RSS
  const videoIdMatch = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
  const titleMatch   = xml.match(/<title>(?!Mr\. Flexy)([^<]+)<\/title>/);  // skip channel title

  if (!videoIdMatch) return null;

  const videoId  = videoIdMatch[1];
  const title    = titleMatch?.[1] ?? "Latest Video";
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return {
    type:      "video" as const,
    videoId,
    title,
    thumbnail,
  };
}

export async function GET() {
  try {
    // Use API if key is available, otherwise fall back to RSS
    const data = API_KEY
      ? await fetchViaAPI()
      : await fetchViaRSS();

    if (!data) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("YouTube fetch error:", err);
    // Last resort — try RSS if API failed
    try {
      const rssData = await fetchViaRSS();
      if (rssData) return NextResponse.json(rssData);
    } catch {}
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

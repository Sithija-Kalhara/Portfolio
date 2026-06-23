import { NextResponse } from "next/server";

const CHANNEL_ID = "UCFK9phR6Au3AVhUw95n71fQ"; 
const API_KEY    = process.env.YOUTUBE_API_KEY!;

export const revalidate = 120; // cache 2 minutes

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    // 1. Check if currently live
    const liveRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`,
      { next: { revalidate: 120 } }
    );
    const liveData = await liveRes.json();

    if (liveData.items && liveData.items.length > 0) {
      const liveVideo = liveData.items[0];
      return NextResponse.json({
        type:        "live",
        videoId:     liveVideo.id.videoId,
        title:       liveVideo.snippet.title,
        thumbnail:   liveVideo.snippet.thumbnails?.high?.url,
        channelName: liveVideo.snippet.channelTitle,
      });
    }

    // 2. Not live — fetch latest uploaded video
    const latestRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=1&key=${API_KEY}`,
      { next: { revalidate: 120 } }
    );
    const latestData = await latestRes.json();

    if (latestData.items && latestData.items.length > 0) {
      const video = latestData.items[0];
      return NextResponse.json({
        type:        "video",
        videoId:     video.id.videoId,
        title:       video.snippet.title,
        thumbnail:   video.snippet.thumbnails?.high?.url,
        channelName: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
      });
    }

    return NextResponse.json({ error: "No videos found" }, { status: 404 });

  } catch (err) {
    console.error("YouTube API error:", err);
    return NextResponse.json({ error: "API fetch failed" }, { status: 500 });
  }
}

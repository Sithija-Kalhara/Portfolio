import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sithija Kalhara — Full-Stack Developer & Streamer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#05050a",
          backgroundImage:
            "radial-gradient(circle at 75% 30%, rgba(124,58,237,0.35), transparent 55%), radial-gradient(circle at 25% 80%, rgba(0,240,255,0.18), transparent 50%)",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* status chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #2a2a3a",
            borderRadius: 999,
            padding: "8px 20px",
            color: "#9494a8",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#ff1f4f",
            }}
          />
          Full-Stack Developer
        </div>

        {/* name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1,
            color: "#e8e8f0",
            letterSpacing: -2,
          }}
        >
          <span>Sithija</span>
          <span
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #00f0ff)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Kalhara
          </span>
        </div>

        {/* tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "#9494a8",
            maxWidth: 820,
          }}
        >
          Founder of Eyerone · AI Data Analyst · Game Streamer
        </div>

        {/* bottom bar */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1f1f2b",
            paddingTop: 28,
            fontSize: 22,
            color: "#5c5c6e",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex" }}>sithijakalhara.com</div>
          <div style={{ display: "flex" }}>React · Next.js · Three.js</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

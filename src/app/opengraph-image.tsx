import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sithija Kalhara — Full-Stack Developer & Game Streamer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #05050a 0%, #0d0d1a 50%, #05050a 100%)",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grid dots background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(124,58,237,0.15) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Violet glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Cyan glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: 200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {/* Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
              background: "rgba(124,58,237,0.18)",
              border: "1px solid rgba(124,58,237,0.4)",
              borderRadius: 100,
              padding: "8px 20px",
              width: "fit-content",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff1f4f" }} />
            <span style={{ color: "#9494a8", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              sithijakalhara.com
            </span>
          </div>

          {/* NAME — biggest, boldest element on the card */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: "-2px",
              marginBottom: 8,
            }}
          >
            Sithija
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              background: "linear-gradient(90deg, #a855f7, #00f0ff)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-2px",
              marginBottom: 40,
            }}
          >
            Kalhara
          </div>

          {/* Roles */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              "Full-Stack Developer",
              "AI Data Analyst",
              "Founder · Eyerone",
              "Mr. Flexy",
            ].map((role) => (
              <div
                key={role}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  padding: "10px 18px",
                  color: "#e8e8f0",
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {role}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            color: "rgba(148,148,168,0.6)",
            fontSize: 16,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          sithijakalhara.com
        </div>
      </div>
    ),
    { ...size }
  );
}

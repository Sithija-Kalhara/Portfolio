import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sithijakalhara.dev"),
  title: "Sithija Kalhara — Full-Stack Developer & Streamer",
  description:
    "Full-Stack Developer, Founder of Eyerone, AI Data Analyst, and Gaming Content Creator (Mr. Flexy). Building scalable platforms and interactive 3D experiences with React, Next.js, and Three.js.",
  keywords: [
    "Sithija Kalhara",
    "Full-Stack Developer",
    "Eyerone",
    "Mr. Flexy",
    "Next.js Developer",
    "Three.js",
    "AI Data Analyst",
    "Game Streamer Sri Lanka",
  ],
  authors: [{ name: "Sithija Kalhara" }],
  openGraph: {
    title: "Sithija Kalhara — Full-Stack Developer & Streamer",
    description:
      "Founder of Eyerone. Building scalable platforms, interactive 3D apps, and high-performance systems — by day a developer, by night Mr. Flexy.",
    url: "https://sithijakalhara.dev",
    siteName: "Sithija Kalhara",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sithija Kalhara — Full-Stack Developer & Streamer",
    description:
      "Founder of Eyerone. Full-Stack Developer, AI Data Analyst, Gaming Content Creator.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05050a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased bg-void text-ink`}
      >
        {children}
      </body>
    </html>
  );
}

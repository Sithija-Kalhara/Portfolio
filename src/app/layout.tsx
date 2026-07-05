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

// ── Canonical domain ──────────────────────────────────────────────────────────
const BASE_URL = "https://www.sithijakalhara.com";

// ── Full name repeated in every signal Google uses ───────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // Title eke full name boldly — "Sithija Kalhara" as the primary signal
  title: {
    default: "Sithija Kalhara | Full-Stack Developer, AI Analyst & Game Streamer",
    template: "%s | Sithija Kalhara",
  },

  description:
    "Sithija Kalhara — Full-Stack Developer, Founder of Eyerone, AI Data Analyst, and Gaming Content Creator (Mr. Flexy). Based in Sri Lanka, specialising in React, Next.js, Node.js, Three.js, and scalable web platforms.",

  keywords: [
    "Sithija Kalhara",
    "Sithija Kalhara developer",
    "Sithija Kalhara Sri Lanka",
    "Sithija Kalhara portfolio",
    "Sithija Kalhara Eyerone",
    "Sithija Kalhara Mr Flexy",
    "sithijakalhara.com",
    "Full-Stack Developer Sri Lanka",
    "Next.js developer Sri Lanka",
    "Three.js developer",
    "AI Data Analyst Sri Lanka",
    "Game Streamer Sri Lanka",
    "Mr Flexy YouTube",
    "Eyerone founder",
    "React developer Sri Lanka",
  ],

  authors: [{ name: "Sithija Kalhara", url: BASE_URL }],
  creator: "Sithija Kalhara",
  publisher: "Sithija Kalhara",
  generator: "Next.js",
  applicationName: "Sithija Kalhara Portfolio",
  referrer: "origin-when-cross-origin",
  category: "technology",

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: "profile",
    firstName: "Sithija",
    lastName: "Kalhara",
    username: "sithijakalhara",
    gender: "male",
    title: "Sithija Kalhara | Full-Stack Developer & Game Streamer",
    description:
      "Sithija Kalhara — Full-Stack Developer, Founder of Eyerone, AI Data Analyst, and Gaming Content Creator. Building scalable platforms and interactive 3D experiences.",
    url: BASE_URL,
    siteName: "Sithija Kalhara",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sithija Kalhara — Full-Stack Developer, AI Analyst & Game Streamer",
      },
    ],
  },

  // ── Twitter / X ────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Sithija Kalhara | Full-Stack Developer & Game Streamer",
    description:
      "Full-Stack Developer, Founder of Eyerone, AI Data Analyst, Gaming Content Creator (Mr. Flexy). Based in Sri Lanka.",
    images: [`${BASE_URL}/opengraph-image`],
    creator: "@sithijakalhara",
  },

  // ── Canonical URL ──────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Icons ──────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png",  sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Google Search Console verification ───────────────────────────────────
  // Uncomment after verifying in Search Console → Settings → Ownership → HTML tag
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
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

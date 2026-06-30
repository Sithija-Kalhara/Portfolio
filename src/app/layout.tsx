import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { StructuredData } from "@/components/seo/StructuredData";
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
  metadataBase: new URL("https://sithijakalhara.com"),
  title: {
    default: "Sithija Kalhara — Full-Stack Developer & Streamer",
    template: "%s — Sithija Kalhara",
  },
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
    "React Developer Sri Lanka",
    "Web Developer Sri Lanka",
  ],
  authors: [{ name: "Sithija Kalhara", url: "https://sithijakalhara.com" }],
  creator: "Sithija Kalhara",
  publisher: "Sithija Kalhara",
  alternates: {
    canonical: "https://sithijakalhara.com",
  },
  openGraph: {
    title: "Sithija Kalhara — Full-Stack Developer & Streamer",
    description:
      "Founder of Eyerone. Building scalable platforms, interactive 3D apps, and high-performance systems — by day a developer, by night Mr. Flexy.",
    url: "https://sithijakalhara.com",
    siteName: "Sithija Kalhara",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sithija Kalhara — Full-Stack Developer & Streamer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sithija Kalhara — Full-Stack Developer & Streamer",
    description:
      "Founder of Eyerone. Full-Stack Developer, AI Data Analyst, Gaming Content Creator.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
  // Uncomment and paste your real code after verifying ownership in
  // Google Search Console → Settings → Ownership verification → HTML tag.
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
        <StructuredData />
        {children}
      </body>
    </html>
  );
}

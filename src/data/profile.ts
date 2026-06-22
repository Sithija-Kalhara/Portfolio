import { label } from "framer-motion/client";

export const profile = {
  name: "Sithija Kalhara",
  alias: "Mr. Flexy",
  roles: [
    "Full-Stack Developer",
    "Game Live Streamer",
    "AI Data Analyst",
    "Founder & CEO @ Eyerone",
  ],
  bio: "I'm a passionate Full-Stack Developer and AI enthusiast building modern digital experiences. As the Founder of Eyerone, I focus on creating scalable platforms, interactive 3D applications, and innovative tech-driven solutions. I specialize in React, Next.js, Node.js, and Three.js, combining clean architecture with high-performance design. Beyond coding, I'm deeply involved in gaming technology, real-time systems, and creative media production.",
  mission:
    "Build powerful systems, push technical boundaries, and turn ambitious ideas into reality.",
  email: "sithijakalhara2@gmail.com",
  whatsapp: "+94702058956",
  whatsappLink: "https://wa.me/94702058956",
  location: "Sri Lanka",
} as const;

export const socials = [
  {
    label: "GitHub",
    handle: "Sithija-Kalhara",
    href: "https://github.com/Sithija-Kalhara",
    icon: "github",
    color: "violet",
  },
  {
    label: "LinkedIn",
    handle: "sithija-kalhara",
    href: "https://www.linkedin.com/in/sithija-kalhara/",
    icon: "linkedin",
    color: "cyan",
  },
  {
    label: "YouTube",
    handle: "@mrflexy1",
    href: "https://www.youtube.com/@mrflexy1",
    icon: "youtube",
    color: "crimson",
  },
  {
    label: "Facebook",
    handle: "sithijakalhara0",
    href: "https://www.facebook.com/sithijakalhara0/",
    icon: "facebook",
    color: "cyan",
  },
  {
    label: "WhatsApp",
    handle: "+94 70 205 8956",
    href: "https://wa.me/94702058956",
    icon: "whatsapp",
    color: "violet",
  },
  {
    label: "Email",
    handle: "sithijakalhara2@gmail.com",
    href: "mailto:sithijakalhara2@gmail.com",
    icon: "mail",
    color: "crimson",
  },
] as const;

export type TechItem = {
  name: string;
  category: "frontend" | "backend" | "tools";
  level: number; // 0-100, used for the HUD meter
};

export const techStack: TechItem[] = [
  { name: "React", category: "frontend", level: 98 },
  { name: "Next.js", category: "frontend", level: 95 },
  { name: "Tailwind CSS", category: "frontend", level: 94 },
  { name: "JavaScript", category: "frontend", level: 96 },
  { name: "TypeScript", category: "frontend", level: 88 },
  { name: "Three.js", category: "frontend", level: 80 },
  { name: "Python", category: "backend", level: 40 },
  { name: "Node.js", category: "backend", level: 90 },
  { name: "Express.js", category: "backend", level: 87 },
  { name: "MongoDB", category: "backend", level: 95 },
  { name: "Git", category: "tools", level: 93 },
  { name: "GitHub", category: "tools", level: 93 },
  { name: "Docker", category: "tools", level: 78 },
  { name: "Cloudflare", category: "tools", level: 75 },
];

export const techCategories = [
  {
    key: "frontend",
    label: "Frontend",
    description: "Interfaces, motion & 3D",
    accent: "violet",
  },
  {
    key: "backend",
    label: "Backend & DB",
    description: "Services & data systems",
    accent: "cyan",
  },
  {
    key: "tools",
    label: "Tools & Cloud",
    description: "Shipping & infrastructure",
    accent: "crimson",
  },
] as const;

export const focusAreas = [
  {
    title: "Eyerone",
    tag: "Founder",
    description:
      "Scalable platforms and interactive 3D applications, engineered with clean architecture and high-performance design at the core.",
  },
  {
    title: "Real-Time Systems",
    tag: "Engineering",
    description:
      "Building responsive, low-latency systems where gaming technology and production-grade software engineering intersect.",
  },
  {
    title: "AI & Data",
    tag: "Analysis",
    description:
      "Turning raw data into structured insight — applying AI-driven analysis to inform better, faster decisions.",
  },
  {
    title: "Creative Media",
    tag: "Production",
    description:
      "Live streaming and content production under the Mr. Flexy brand, where entertainment meets technical craft.",
  },
] as const;

export const stats = [
  { value: "5+", label: "Core Technologies Mastered" },
  { value: "Live", label: "On Twitch & YouTube" },
  { value: "1", label: "Studio Founded — Eyerone" },
  { value: "24/7", label: "Building & Shipping" },
] as const;

export const channelStats = [
  { 
    label: "Platform", 
    value: "YouTube", 
    link: "https://www.youtube.com/@mrflexy1" 
  },
  { 
    label: "Username", 
    value: "@mrflexy1", 
    link: "https://www.youtube.com/@mrflexy1" 
  },
  { label: "Content", value: "Live Stream & Gaming Video Create" },
  { label: "Status", value: "ON AIR" },

  { 
    label: "Platform", 
    value: "Facebook", 
    link: "https://www.facebook.com/mrflexy2" 
  },
  { 
    label: "Username", 
    value: "@mrflexy2", 
    link: "https://www.facebook.com/mrflexy2" 
  },
  { label: "Content", value: "Live Stream & Gaming Video Create" },
  { label: "Status", value: "ON AIR" },

  { 
    label: "Platform", 
    value: "TikTok", 
    link: "https://www.tiktok.com/@mr._.flexy" 
  },
  { 
    label: "Username", 
    value: "@mr._.flexy", 
    link: "https://www.tiktok.com/@mr._.flexy" 
  },
  { label: "Content", value: "Live Stream & Gaming Video Create" },
  { label: "Status", value: "ON AIR" },
] as const;

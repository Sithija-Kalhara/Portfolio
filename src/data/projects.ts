export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: "active" | "live" | "building" | "planning";
  type: "platform" | "portfolio" | "streaming" | "travel" | "tool";
  url?: string;
  github?: string;
  stack: string[];
  highlights: string[];
  year: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "eyerone",
    name: "Eyerone",
    tagline: "One Digital Vision for the Future",
    description:
      "A full-scale social media and live streaming platform built entirely solo. Features real-time HLS streaming, a TikTok-style gift system with animations, EyeCoin virtual currency powered by Stripe, passkey authentication, 2FA, and Flicks (short-form video). Architected on Cloudflare's edge infrastructure.",
    status: "active",
    type: "platform",
    url: "https://eyerone.com",
    stack: ["Next.js", "Node.js", "MongoDB", "Cloudflare R2", "Express", "Stripe", "HLS"],
    highlights: [
      "Solo full-stack build — 100% by Sithija",
      "Live streaming with HLS + Cloudflare R2",
      "EyeCoin payment system via Stripe",
      "TikTok-style gift animations (50 gifts, 5 tiers)",
      "Passkey auth + email 2FA",
      "Flicks — short video feed",
    ],
    year: "2023–Present",
    featured: true,
  },
  {
    id: "cartoonlk",
    name: "CartoonLK",
    tagline: "Sri Lankan streaming destination",
    description:
      "A video streaming platform focused on Sri Lankan content. Built with a modern stack, featuring a clean UI for browsing and watching content online.",
    status: "live",
    type: "streaming",
    url: "https://cartoonlk.com",
    stack: ["React", "Node.js", "MongoDB", "Express"],
    highlights: [
      "Video streaming platform",
      "Sri Lankan content focus",
      "Custom video player",
      "Content management system",
    ],
    year: "2022–Present",
    featured: false,
  },
  {
    id: "zeylonjourney",
    name: "ZeylonJourney",
    tagline: "Explore Sri Lanka differently",
    description:
      "A travel and tourism platform showcasing Sri Lanka's destinations, culture, and experiences. Designed to help travelers discover and plan trips across the island.",
    status: "live",
    type: "travel",
    url: "https://zeylonjourney.com",
    stack: ["Next.js", "Tailwind CSS", "MongoDB"],
    highlights: [
      "Travel destination guides",
      "Sri Lanka tourism focus",
      "Interactive location browsing",
      "Clean, mobile-first design",
    ],
    year: "2023",
    featured: false,
  },
  {
    id: "hesh-lankan-mart",
    name: "Hesh Lankan Mart",
    tagline: "Sri Lankan groceries, delivered in Malaysia",
    description:
      "A full e-commerce store selling Sri Lankan grocery items to customers in Malaysia (MYR pricing). Separate Express REST API and Next.js frontend, a 4-step bank-transfer checkout with receipt upload to Cloudflare R2, and a full admin dashboard for products, offers, orders and receipt verification.",
    status: "building",
    type: "platform",
    stack: ["Next.js", "Express", "MongoDB", "JWT", "Cloudflare R2", "Nodemailer"],
    highlights: [
      "4-step checkout with receipt upload to R2",
      "Admin dashboard — RBAC, inventory, receipt approval",
      "Sales reports with chart + CSV export",
      "Email notifications on order status changes",
    ],
    year: "2026",
    featured: false,
  },
  {
    id: "jarvis",
    name: "J.A.R.V.I.S.",
    tagline: "Voice-controlled AI desktop assistant",
    description:
      "A wake-word activated desktop assistant in Python. Understands voice commands through a local LLM (Ollama), talks back with text-to-speech, and controls the PC — apps, files, volume, screenshots and system status.",
    status: "building",
    type: "tool",
    github: "https://github.com/Sithija-Kalhara/jarvis",
    stack: ["Python", "Ollama", "SpeechRecognition", "pyttsx3", "Tkinter", "Flask"],
    highlights: [
      "Wake-word voice activation",
      "Local LLM reasoning via Ollama",
      "PC control — apps, files, volume, screenshots",
    ],
    year: "2026",
    featured: false,
  },
  {
    id: "hologram",
    name: "Gesture 3D Hologram",
    tagline: "Control a 3D hologram with your hands",
    description:
      "A browser-based interactive hologram driven entirely by hand gestures. MediaPipe tracks the hand through the webcam in real time, and Three.js renders a reactive wireframe hologram that responds to your movements — no controller needed.",
    status: "live",
    type: "tool",
    github: "https://github.com/Sithija-Kalhara/Gesture-Controlled-Interactive-3D-Hologram-Interface",
    stack: ["Three.js", "MediaPipe Hands", "JavaScript", "WebGL"],
    highlights: [
      "Real-time webcam hand tracking",
      "Gesture-driven 3D interaction",
      "Runs fully in the browser",
    ],
    year: "2026",
    featured: false,
  },
  {
    id: "mrflexy",
    name: "Mr. Flexy",
    tagline: "Gaming content & live streaming brand",
    description:
      "Gaming content creator brand across YouTube, TikTok, and Facebook. Producing bilingual (Sinhala + English) gameplay content, live streams, and gaming commentary since 2019.",
    status: "live",
    type: "streaming",
    url: "https://www.youtube.com/@mrflexy1",
    stack: ["OBS Studio", "After Effects", "YouTube", "TikTok", "Facebook Live"],
    highlights: [
      "TikTok — @mr._.flexy",
      "YouTube gaming channel — @mrflexy1",
      "Bilingual content (Sinhala + English)",
      "Apex Legends, Free Fire, CoC, car games",
      "Live streaming since 2019",
    ],
    year: "2019–Present",
    featured: true,
  },
];

export type TimelineItem = {
  year: string;
  title: string;
  org: string;
  type: "education" | "work" | "project" | "milestone";
  description: string;
  tags?: string[];
  current?: boolean;
};

export const timeline: TimelineItem[] = [
  {
    year: "2026–Present",
    title: "AI Student",
    org: "Chuo College of AI, Japan",
    type: "education",
    description:
      "Studying artificial intelligence and machine learning at Chuo College of AI in Oyama, Tochigi, Japan. Combining formal AI education with active full-stack development.",
    tags: ["AI", "Machine Learning", "Japan"],
    current: true,
  },
  {
    year: "2023–Present",
    title: "Founder & Full-Stack Developer",
    org: "Eyerone",
    type: "work",
    description:
      "Founded and solely built Eyerone — a full social media and live streaming platform. Handling everything from architecture design to deployment, payments, and real-time streaming infrastructure.",
    tags: ["Next.js", "Node.js", "Cloudflare", "Stripe", "HLS"],
    current: true,
  },
  {
    year: "2024",
    title: "Portfolio Launch",
    org: "sithijakalhara.com",
    type: "project",
    description:
      "Launched a cinematic personal portfolio with 3D Three.js scene, NEXUS AI assistant, YouTube live integration, and full technical SEO (JSON-LD, sitemap, dynamic OG images).",
    tags: ["Three.js", "Next.js", "AI", "SEO"],
    current: false,
  },
  {
    year: "2023",
    title: "Full-Stack Developer",
    org: "Freelance & Personal Projects",
    type: "work",
    description:
      "Expanded into freelance full-stack development — scaling CartoonLK (streaming platform, started 2022) and building ZeylonJourney (travel site). Deepened expertise in MongoDB, Express, and Cloudflare infrastructure.",
    tags: ["React", "MongoDB", "Express", "Cloudflare"],
    current: false,
  },
  {
    year: "2022",
    title: "UI/UX Designer",
    org: "Self-directed",
    type: "milestone",
    description:
      "Developed strong UI/UX design skills using Figma. Started combining design thinking with engineering to build visually polished, performance-optimized web applications.",
    tags: ["Figma", "UI/UX", "Design Systems"],
    current: false,
  },
  {
    year: "2019",
    title: "Gaming Content Creator",
    org: "Mr. Flexy — YouTube & TikTok",
    type: "milestone",
    description:
      "Launched the Mr. Flexy gaming brand on YouTube and TikTok. Started with Apex Legends and Free Fire content, growing a bilingual community. Simultaneously began self-teaching web development.",
    tags: ["YouTube", "TikTok", "Gaming", "Content Creation"],
    current: true,
  },
  {
    year: "2019",
    title: "Started Coding",
    org: "Self-taught",
    type: "milestone",
    description:
      "Began the self-taught coding journey with HTML, CSS, and JavaScript. Driven by a passion for building things, rapidly progressed to React, Node.js, and beyond.",
    tags: ["HTML", "CSS", "JavaScript", "Self-taught"],
    current: false,
  },
];
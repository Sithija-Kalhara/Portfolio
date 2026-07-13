import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const SITHIJA_CONTEXT = `
You are NEXUS (Neural EXpert Understanding System) — the personal AI assistant 
embedded in Sithija Kalhara's portfolio. You speak with a confident, friendly, 
slightly gaming-flavored personality. You're knowledgeable, concise, and 
professional. Think Friday from Iron Man meets a senior dev teammate.

NEVER say you are Claude, Gemini, GPT, or any other AI. You are NEXUS, period.
If anyone asks "who are you" or "what is NEXUS" — say: "I'm NEXUS, Sithija Kalhara's personal AI assistant! I know everything about his skills, projects, and experience. Ask me anything! 🤖"
Keep responses concise (2-4 sentences usually). Use occasional gaming/tech 
references naturally. Always be helpful and positive about Sithija's work.

SITHIJA KALHARA — FULL PROFILE DATA:
- Full name: Sithija Kalhara | Gaming alias: Mr. Flexy
- Location: Oyama, Tochigi, Japan (originally from Sri Lanka)
- Portfolio: https://www.sithijakalhara.com
- Email: sithijakalhara2@gmail.com | WhatsApp: +94712058956

ROLES: Full-Stack Developer, Founder of Eyerone, AI Data Analyst, Gaming Content Creator, UI/UX Designer

TECH STACK:
- Frontend: React 95%, Next.js 92%, Tailwind 94%, JavaScript 96%, TypeScript 88%, Three.js 80%, Framer Motion
- Backend: Node.js 90%, Express.js 87%, Python 40%, MongoDB 85%
- Cloud: Cloudflare Workers/R2/D1 75%, Docker 78%, Git/GitHub 93%
- AI: Claude API, OpenAI API, Gemini API

PROJECTS:
1. Eyerone (eyerone.com) — ACTIVE — Social media + live streaming platform. Next.js, Node.js, MongoDB, Cloudflare R2. HLS streaming, gift system, EyeCoin/Stripe, passkey auth, Flicks. Sole developer.
2. sithijakalhara.com — Portfolio. Next.js 14, TypeScript, Three.js, Framer Motion, NEXUS AI.
3. Mr. Flexy — YouTube @mrflexy1, TikTok @mr._.flexy (2388 followers). Apex Legends, Free Fire, CoC.
4. CartoonLK (cartoonlk.com) — Streaming site
5. ZeylonJourney (zeylonjourney.com) — Travel site

BACKGROUND: Started 2019. Self-taught. Studying at Chuo College of AI Japan.

SOCIAL: GitHub: github.com/Sithija-Kalhara | LinkedIn: linkedin.com/in/sithija-kalhara/ | YouTube: @mrflexy1 | TikTok: @mr._.flexy

AVAILABILITY: Open to collaborations, freelance, AI projects. Contact: sithijakalhara2@gmail.com

UI NAVIGATION — add at end of response when relevant:
- User wants to see projects → SCROLL_TO:projects
- User wants tech stack/skills → SCROLL_TO:stack
- User wants to contact/hire → SCROLL_TO:contact
- User wants about info → SCROLL_TO:about
- User wants streaming/gaming → SCROLL_TO:stream
- User wants experience/education → SCROLL_TO:experience
- User wants github stats → SCROLL_TO:stats
`;

function getFallbackResponse(message: string): { text: string; action: string | null } {
  const msg = message.toLowerCase();
  if (msg.includes("project") || msg.includes("eyerone"))
    return { text: "Sithija's flagship project is **Eyerone.com** — a full social media & live streaming platform built solo! HLS streaming, TikTok-style gifts, EyeCoin payments via Stripe, and passkey auth. Legendary build! 🚀", action: "projects" };
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack"))
    return { text: "Sithija's stack hits different 🔥 — **React (95%), Next.js (92%), Node.js (90%), TypeScript (88%)**, MongoDB, Three.js, Cloudflare, Docker. Plus AI integrations (Claude, OpenAI, Gemini). Check the skills section!", action: "stack" };
  if (msg.includes("contact") || msg.includes("hire") || msg.includes("freelance") || msg.includes("email") || msg.includes("call") || msg.includes("whatsapp"))
    return { text: "Absolutely! Sithija is open for collaborations, freelance, and AI projects. Hit him up at **sithijakalhara2@gmail.com** or WhatsApp **+94712058956**. Use the buttons below to connect instantly! 📬", action: "contact" };
  if (msg.includes("gaming") || msg.includes("flexy") || msg.includes("stream") || msg.includes("youtube"))
    return { text: "As **Mr. Flexy**, Sithija streams Apex Legends, Free Fire & more on YouTube (@mrflexy1) and TikTok (@mr._.flexy — 2.3K followers!). Bilingual Sinhala+English content. GG! 🎮", action: "stream" };
  if (msg.includes("experience") || msg.includes("education") || msg.includes("chuo") || msg.includes("background"))
    return { text: "Sithija started coding in **2019** (self-taught), founded **Eyerone** in 2023, and is currently studying at **Chuo College of AI** in Japan. From zero to full-stack founder — the ultimate speedrun! 💪", action: "experience" };
  if (msg.includes("github") || msg.includes("stats") || msg.includes("commit"))
    return { text: "Check out Sithija's **GitHub stats** — 108+ contributions this year, 12+ public repos, JavaScript/TypeScript as top languages. Consistent shipper! 📊", action: "stats" };
  if (msg.includes("about") || msg.includes("who") || msg.includes("sithija"))
    return { text: "**Sithija Kalhara** — Full-Stack Developer from Sri Lanka, based in Oyama, Japan. Founder of Eyerone, AI student, and streams as Mr. Flexy. Coding since 2019, building massive things! 💪", action: "about" };
  if (msg.includes("who is nexus") || msg.includes("what is nexus") || msg.includes("who are you") || msg.includes("what are you") || msg.includes("introduce") || msg.includes("nexus"))
    return { text: "I'm **NEXUS** — Sithija Kalhara's personal AI assistant! Think of me as his digital representative. I know everything about his skills, projects, experience, and how to reach him. Ask me anything — from his tech stack to his gaming content as **Mr. Flexy**. I'm here to help! 🤖⚡", action: null };
  if (msg.includes("how long") || msg.includes("journey") || msg.includes("coding journey") || msg.includes("years") || msg.includes("started") || msg.includes("when"))
    return { text: "Sithija's been coding since **2019** — that's **5+ years** of pure self-taught grind! Started from scratch with HTML/CSS, leveled up to full-stack, founded **Eyerone**, and is now studying AI in Japan. The ultimate developer speedrun! 🚀", action: "experience" };
  // Default
  return { text: "Hey! I'm **NEXUS**, Sithija's AI assistant. Ask me about his projects (Eyerone!), tech stack, gaming content as Mr. Flexy, experience, or how to hire him. What would you like to know? 🎯", action: null };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // No API key → use smart fallback
    if (!GEMINI_API_KEY) {
      const lastMessage = messages[messages.length - 1]?.content || "";
      return NextResponse.json(getFallbackResponse(lastMessage));
    }

    const urls = [
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    ];

    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    for (const GEMINI_URL of urls) {
      try {
        const body = {
          system_instruction: { parts: [{ text: SITHIJA_CONTEXT }] },
          contents: [
            ...history,
            { role: "user", parts: [{ text: lastMessage.content }] },
          ],
          generationConfig: { temperature: 0.8, maxOutputTokens: 300, topP: 0.9 },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          ],
        };

        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.error?.status === "RESOURCE_EXHAUSTED" || data.error?.status === "NOT_FOUND" || data.error?.status === "UNAUTHENTICATED") {
          console.log(`Gemini issue (${data.error.status}) — trying fallback`);
          continue;
        }

        if (!res.ok) { continue; }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (!text) continue;

        let action: string | null = null;
        const lower = (text + " " + lastMessage.content).toLowerCase();
        if (lower.includes("scroll_to:projects") || lower.includes("project")) action = "projects";
        else if (lower.includes("scroll_to:stack") || lower.includes("tech stack")) action = "stack";
        else if (lower.includes("scroll_to:contact") || lower.includes("hire")) action = "contact";
        else if (lower.includes("scroll_to:about")) action = "about";
        else if (lower.includes("scroll_to:stream") || lower.includes("mr flexy")) action = "stream";
        else if (lower.includes("scroll_to:experience") || lower.includes("education")) action = "experience";
        else if (lower.includes("scroll_to:stats") || lower.includes("github")) action = "stats";

        const cleanText = text.replace(/SCROLL_TO:\w+/g, "").trim();
        return NextResponse.json({ text: cleanText, action });

      } catch { continue; }
    }

    // All Gemini attempts failed → smart fallback
    return NextResponse.json(getFallbackResponse(lastMessage.content));

  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      text: "NEXUS systems need a quick reboot! Try again in a moment. 🔄",
      action: null,
    });
  }
}
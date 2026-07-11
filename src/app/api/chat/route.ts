import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// ── Sithija's full context ────────────────────────────────────────────────────
const SITHIJA_CONTEXT = `
You are NEXUS (Kalhara Intelligent Response Assistant) — the personal AI assistant 
embedded in Sithija Kalhara's portfolio. You speak with a confident, friendly, 
slightly gaming-flavored personality. You're knowledgeable, concise, and 
professional. Think Friday from Iron Man meets a senior dev teammate.

NEVER say you are Claude, Gemini, or any other AI. You are NEXUS.
Keep responses concise (2-4 sentences usually). Use occasional gaming/tech 
references naturally. Always be helpful and positive about Sithija's work.

═══════════════════════════════════════════
SITHIJA KALHARA — FULL PROFILE DATA
═══════════════════════════════════════════

IDENTITY:
- Full name: Sithija Kalhara
- Gaming alias: Mr. Flexy
- Location: Oyama, Tochigi, Japan (originally from Sri Lanka)
- Portfolio: https://www.sithijakalhara.com
- Email: sithijakalhara2@gmail.com
- WhatsApp: +94702058956

ROLES:
- Full-Stack Developer (primary)
- Founder of Eyerone (eyerone.com) — a social media / streaming platform
- AI Data Analyst
- Gaming Content Creator & Live Streamer (as Mr. Flexy)
- UI/UX Designer

TECH STACK:
Frontend: React (95%), Next.js (92%), Tailwind CSS (94%), JavaScript (96%), 
          TypeScript (88%), Three.js (80%), Framer Motion
Backend:  Node.js (90%), Express.js (87%), Python (40%)
Database: MongoDB (85%)
Cloud:    Cloudflare Workers, R2, D1 (75%), Docker (78%), Git/GitHub (93%)
AI:       Claude API (Anthropic), OpenAI API, Gemini API
Tools:    Figma, VS Code, OBS Studio, After Effects

PROJECTS:
1. Eyerone (eyerone.com) — ACTIVE
   - Social media + live streaming platform
   - Built with: Next.js, Node.js, MongoDB, Cloudflare R2, Express
   - Features: Live streaming with HLS, TikTok-style gift system, 
     EyeCoin payment system (Stripe), passkey auth, Flicks (short video)
   - Sithija is sole developer (full-stack)

2. sithijakalhara.com — Portfolio site
   - Built with: Next.js 14, TypeScript, Tailwind CSS, React Three Fiber,
     Three.js, Framer Motion
   - Features: 3D AI Core hero scene, YouTube live embed, EmailJS contact

3. Mr. Flexy Gaming Channel — LIVE
   - YouTube: @mrflexy1 (gaming content, live streams)
   - TikTok: @mr._.flexy (2,388 followers, 10.9K likes)
   - Facebook: mrflexy2
   - Content: Apex Legends, Free Fire, CoC, car games, bilingual (Sinhala+English)

4. CartoonLK — Streaming site (cartoonlk.com)

5. ZeylonJourney — Travel site (zeylonjourney.com)

EXPERIENCE & BACKGROUND:
- Started coding/gaming content in 2019
- Self-taught + continuous learning
- Studying at Chuo College of AI (Japan)
- Specializes in real-time systems, 3D web apps, scalable platforms
- Philosophy: "Build powerful systems, push technical boundaries, turn ambitious ideas into reality"

SOCIAL LINKS:
- GitHub: https://github.com/Sithija-Kalhara
- LinkedIn: https://www.linkedin.com/in/sithija-kalhara/
- YouTube: https://www.youtube.com/@mrflexy1
- TikTok: https://www.tiktok.com/@mr._.flexy
- Facebook (personal): https://www.facebook.com/sithijakalhara0/

AVAILABILITY:
- Open to: Collaborations, Freelance projects, AI projects
- Contact: sithijakalhara2@gmail.com or WhatsApp +94702058956

UI COMMANDS (if user asks to navigate/show something, include action in response):
- "show projects" / "see projects" → SCROLL_TO:focus
- "show skills" / "tech stack" → SCROLL_TO:stack  
- "contact" / "hire" / "work together" → SCROLL_TO:contact
- "about" / "who are you" → SCROLL_TO:about
- "streaming" / "gaming" / "mr flexy" → SCROLL_TO:stream
═══════════════════════════════════════════
`;

// ── Fallback mock responses (when Gemini is down) ─────────────────────────────
function getFallbackResponse(message: string): { text: string; action: string | null } {
  const msg = message.toLowerCase();
  
  if (msg.includes("project") || msg.includes("eyerone") || msg.includes("show project")) {
    return {
      text: "Sithija's flagship project is Eyerone.com — a full social media & live streaming platform he built solo! It has HLS streaming, TikTok-style gifts, EyeCoin payments via Stripe, and passkey auth. Check the projects section! 🚀",
      action: "focus"
    };
  }
  
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("what can")) {
    return {
      text: "Sithija's stack is 🔥: React (95%), Next.js (92%), Node.js (90%), TypeScript (88%), MongoDB, Three.js, Cloudflare, and Docker. He's also skilled in AI (Claude, OpenAI, Gemini APIs) and design (Figma). Check the skills section!",
      action: "stack"
    };
  }
  
  if (msg.includes("contact") || msg.includes("hire") || msg.includes("freelance") || msg.includes("work")) {
    return {
      text: "Absolutely! Sithija is open for collaborations, freelance projects, and AI work. Reach him at sithijakalhara2@gmail.com or WhatsApp +94702058956. Check the contact section! 📬",
      action: "contact"
    };
  }
  
  if (msg.includes("gaming") || msg.includes("flexy") || msg.includes("stream") || msg.includes("youtube")) {
    return {
      text: "As Mr. Flexy, Sithija streams Apex Legends, Free Fire, and more on YouTube (@mrflexy1) and TikTok (@mr._.flexy - 2.3K followers!). He's bilingual (Sinhala + English). Check the streaming section! 🎮",
      action: "stream"
    };
  }
  
  if (msg.includes("about") || msg.includes("who") || msg.includes("sithija")) {
    return {
      text: "Sithija Kalhara is a full-stack developer from Sri Lanka, now based in Oyama, Japan. He's the founder of Eyerone, an AI student, and streams as Mr. Flexy. He's been coding since 2019 and builds powerful, scalable systems! 💪",
      action: "about"
    };
  }
  
  if (msg.includes("social") || msg.includes("github") || msg.includes("linkedin")) {
    return {
      text: "Find Sithija on GitHub (Sithija-Kalhara), LinkedIn, YouTube (@mrflexy1), TikTok (@mr._.flexy), and Facebook. All links are on his portfolio! 🔗",
      action: null
    };
  }
  
  // Default response
  return {
    text: "Hey! I'm NEXUS, Sithija's AI assistant. I can tell you about his projects (like Eyerone), tech stack, gaming content as Mr. Flexy, or how to hire him. What would you like to know? 🎯",
    action: null
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!GEMINI_API_KEY) {
      // No API key? Use fallback
      const lastMessage = messages[messages.length - 1]?.content || "";
      const fallback = getFallbackResponse(lastMessage);
      return NextResponse.json(fallback);
    }

    // Try v1beta first (your original URL format)
    const urls = [
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
    ];

    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    for (const GEMINI_URL of urls) {
      try {
        // Try with system_instruction (v1beta format)
        const body: any = {
          contents: [
            ...history,
            {
              role: "user",
              parts: [{ text: lastMessage.content }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
            topP: 0.9,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          ],
        };

        // Add system instruction for v1beta
        if (GEMINI_URL.includes("v1beta")) {
          body.system_instruction = {
            parts: [{ text: SITHIJA_CONTEXT }],
          };
        } else {
          // For v1, prepend context to first message
          body.contents.unshift({
            role: "user",
            parts: [{ text: SITHIJA_CONTEXT }],
          });
          body.contents.unshift({
            role: "model",
            parts: [{ text: "Understood. I am NEXUS." }],
          });
        }

        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        // If rate limited, try next URL
        if (data.error?.status === "RESOURCE_EXHAUSTED") {
          console.log("⏳ Rate limited on", GEMINI_URL);
          continue;
        }

        // If not found, try next URL
        if (data.error?.status === "NOT_FOUND") {
          console.log("❌ Not found:", GEMINI_URL);
          continue;
        }

        if (!res.ok) {
          console.error("Gemini error:", data.error?.message);
          continue;
        }

        // Success!
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        
        let action: string | null = null;
        const lower = (text + " " + lastMessage.content).toLowerCase();
        if (lower.includes("scroll_to:focus") || lower.includes("show projects")) action = "focus";
        else if (lower.includes("scroll_to:stack") || lower.includes("tech stack")) action = "stack";
        else if (lower.includes("scroll_to:contact") || lower.includes("hire")) action = "contact";
        else if (lower.includes("scroll_to:about")) action = "about";
        else if (lower.includes("scroll_to:stream") || lower.includes("mr flexy")) action = "stream";

        const cleanText = text.replace(/SCROLL_TO:\w+/g, "").trim();
        return NextResponse.json({ text: cleanText, action });

      } catch (err) {
        continue;
      }
    }

    // All Gemini attempts failed → use fallback
    console.log("🔄 Using fallback response");
    const fallback = getFallbackResponse(lastMessage.content);
    return NextResponse.json(fallback);

  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ 
      text: "NEXUS systems need a quick reboot! Try again in a moment. 🔄",
      action: null 
    });
  }
}
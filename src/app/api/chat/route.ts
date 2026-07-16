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

CRITICAL: If the user writes in Sinhala (containsසිංහල characters), you MUST reply in Sinhala. Match the user's language always.

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

function isSinhala(text: string): boolean {
  // Unicode range for Sinhala characters: U+0D80–U+0DFF
  return /[\u0D80-\u0DFF]/.test(text);
}

function getFallbackResponse(message: string): { text: string; action: string | null } {
  const msg = message.toLowerCase();
  const si = isSinhala(message);

  // ── Sinhala Fallbacks (Improved) ──
  if (si) {
    if (msg.includes("project") || msg.includes("ව්‍යාපෘති") || msg.includes("eyerone") || msg.includes("වැඩ")) {
      return { 
        text: "සිතිජගේ Flagship Project එක තමයි **Eyerone.com**! 🚀 මේක එයා තනිවම build කරපු පට්ටම Social Media & Live Streaming Platform එකක්. Next.js, Cloudflare R2 සහ Node.js පාවිච්චි කරලා, HLS Live Streaming, Real-time Gifting සහ Passkey Auth පවා මේකට දාලා තියෙනවා. Next-level වැඩක්!", 
        action: "projects" 
      };
    }
    if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("භාෂා") || msg.includes("පුළුවන්")) {
      return { 
        text: "සිතිජගේ Tech Stack එක සිරාවටම strong 🔥 — **React (95%), Next.js (92%), Node.js (90%), TypeScript (88%)** සහ MongoDB වගේම Three.js ත්‍රිමාණ visual effects සහ Cloudflare serverless technologies වලට එයා සිරාම වැඩ්ඩෙක්. Skills section එකෙන් සම්පූර්ණ විස්තරේම බලාගන්න පුළුවන්!", 
        action: "stack" 
      };
    }
    if (msg.includes("කතා") || msg.includes("සම්බන්ධ") || msg.includes("hire") || msg.includes("contact") || msg.includes("email") || msg.includes("call") || msg.includes("whatsapp") || msg.includes("freelance") || msg.includes("collaboration") || msg.includes("freelancing") || msg.includes("collaborations") || msg.includes("කතා කරන්න") || msg.includes("සම්බන්ධ කරන්න") || msg.includes("වැඩ") ) {
      return { 
        text: "ඔව්, අනිවාර්යයෙන්ම! සිතිජ freelance වැඩ, collaborations සහ අලුත් AI projects කරන්න කැමැත්තෙන් ඉන්නෙ. එයාට **sithijakalhara2@gmail.com** එකට email එකක් දාන්න, නැත්නම් WhatsApp **+94712058956** හරහා direct message එකක් දාන්න. පහළ තියෙන buttons වලින් ලේසියෙන්ම contact කරන්න පුළුවන්! 📬", 
        action: "contact" 
      };
    }
    if (msg.includes("gaming") || msg.includes("flexy") || msg.includes("stream") || msg.includes("youtube") || msg.includes("ගේම්") || msg.includes("ගේමින්") || msg.includes("ස්ට්‍රීම්") || msg.includes("ස්ට්‍රීමින්") || msg.includes("සෙල්ලම්")) {
      return { 
        text: "සිතිජ කියන්නෙ **Mr. Flexy** විදිහට Gaming content හදන, YouTube (@mrflexy1) සහ TikTok එකේ stream කරන සුපිරි Gamer කෙනෙක්! 🎮 Apex Legends, Free Fire වගේ games එයා සෙල්ලම් කරනවා. Sinhala/English දෙකෙන්ම content තියෙනවා. GG!", 
        action: "stream" 
      };
    }
    if (msg.includes("experience") || msg.includes("education") || msg.includes("chuo") || msg.includes("ඉගෙන") || msg.includes("ගියේ")|| msg.includes("background") || msg.includes("අධ්‍යාපන")|| msg.includes("අධ්‍යාපනය") || msg.includes("ඉගෙනුම")|| msg.includes("ඉගෙනුම්") || msg.includes("අධ්‍යාපනික") || msg.includes("අධ්‍යාපනිකව") || msg.includes("අධ්‍යාපනිකවම") || msg.includes("අධ්‍යාපනිකවමද") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?") || msg.includes("අධ්‍යාපනිකවමද?")) {
      return { 
        text: "සිතිජ 2019 ඉදලා self-taught developer කෙනෙක් විදිහට ගේම ගහන්න ගත්තේ. 2023 දී **Eyerone** පටන් ගත්තා, දැන් එයා ජපානයේ **Chuo College of AI** එකේ AI Data Science හදාරනවා. Zero to Full-Stack Founder කෙනෙක් දක්වා ආපු පට්ටම journey එකක්! ⚡", 
        action: "experience" 
      };
    }
    if (msg.includes("github") || msg.includes("stats") || msg.includes("commit") || msg.includes("කෝඩ්") || msg.includes("ගිට්හබ්") || msg.includes("ගිට්") || msg.includes("ගිට්හබ් stats") || msg.includes("ගිට් stats") || msg.includes("ගිට්හබ් contributions") || msg.includes("ගිට් contributions")) {
      return { 
        text: "සිතිජගේ GitHub stats බැලුවොත් ඔයාට පෙනෙයි එයා කොච්චර active ද කියලා! 📊 මේ අවුරුද්දෙ විතරක් contributions 108කට වඩා කරලා තියෙනවා. JavaScript සහ TypeScript වලින් තමයි වැඩිපුරම magic කරලා තියෙන්නෙ. බලන්නකෝ stats section එක!", 
        action: "stats" 
      };
    }
    if (msg.includes("කවුද") || msg.includes("sithija") || msg.includes("සිතිජ") || msg.includes("about")|| msg.includes("ඔයා කවුද") || msg.includes("ඔයාගේ නම") || msg.includes("ඔයාගේ විස්තර")|| msg.includes("ඔයාගේ විස්තරය") || msg.includes("ඔයාගේ විස්තරය කියන්න") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?")) {
      return { 
        text: "**සිතිජ කල්හාර** කියන්නෙ ලංකාවෙන් ජපානයට (Oyama, Tochigi) සංක්‍රමණය වුණු Full-Stack Developer කෙනෙක්. එයා Eyerone හි නිර්මාතෘවරයා වගේම AI Data Science ශිෂ්‍යයෙක්. Mr. Flexy නමින් Gaming content creator කෙනෙක් විදිහටත් වැඩ කරනවා. 💪", 
        action: "about" 
      };
    }
    if (msg.includes("nexus") || msg.includes("ඔයා කවුද") || msg.includes("ඔයාගේ නම")|| msg.includes("ඔයාගේ විස්තර") || msg.includes("ඔයාගේ විස්තරය") || msg.includes("ඔයාගේ විස්තරය කියන්න") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?")|| msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?") || msg.includes("ඔයාගේ විස්තරය කියන්න පුළුවන්ද?")) {
      return { 
        text: "මම තමයි **NEXUS** — සිතිජ කල්හාරගේ personal AI assistant! 🤖⚡ එයාගේ skills, projects, experience හෝ එයාට contact කරගන්නෙ කොහොමද වගේ ඕනෑම දෙයක් මගෙන් අහන්න, මම උදව් කරන්නම්!", 
        action: null 
      };
    }
    if (msg.includes("how long") || msg.includes("journey") || msg.includes("years") || msg.includes("started") || msg.includes("කාලය") || msg.includes("අවුරුදු") || msg.includes("කොච්චර කාලයක්ද") || msg.includes("පටන් ගෙන කොච්චර කාලයක්ද")  || msg.includes("කොච්චර කාලෙක ඉදලද code කරන්නෙ")) {
      return { 
        text: "සිතිජ කෝඩින් කරන්න පටන් ගත්තේ **2019** අවුරුද්දේ. දැන් **අවුරුදු 5කට වඩා වැඩි** self-taught grind එකක් තියෙනවා! HTML/CSS වලින් පටන් අරන්, අද වෙද්දි full-stack level එකටම ඇවිත් තමන්ගේම platform එකක් (Eyerone) හදලා, ජපානයේ AI ඉගෙනගන්න මට්ටමටම ඇවිත් තියෙනවා. 🚀", 
        action: "experience" 
      };
    }
    // Default Sinhala response
    return { 
      text: "හෙලෝ! මම **NEXUS**, සිතිජගේ personal AI assistant. 🎯 ඔයාට සිතිජගේ සුපිරි projects (විශේෂයෙන් Eyerone!), එයාගේ tech stack, Mr. Flexy gaming content, නැත්නම් එයාව hire කරන විදිහ ගැන දැනගන්න ඕනෑ දෙයක් අහන්න!", 
      action: null 
    };
  }

  // ── English Fallbacks (Improved) ──
  if (msg.includes("project") || msg.includes("eyerone")) {
    return { 
      text: "Sithija's flagship project is **Eyerone.com** — a full-scale social media & live streaming platform built completely solo! 🚀 Powered by Next.js, Node.js, and Cloudflare R2, it features HLS streaming, real-time gifting, and passkey authentication. An absolute masterpiece of engineering!", 
      action: "projects" 
    };
  }
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack")) {
    return { 
      text: "Sithija's tech stack hits different! 🔥 He's highly proficient in **React (95%), Next.js (92%), Node.js (90%), and TypeScript (88%)**, with deep expertise in MongoDB, Three.js 3D visuals, and Cloudflare serverless architectures. Check out his skills section to see the full arsenal!", 
      action: "stack" 
    };
  }
  if (msg.includes("contact") || msg.includes("hire") || msg.includes("freelance") || msg.includes("email") || msg.includes("call") || msg.includes("whatsapp")) {
    return { 
      text: "Absolutely! Sithija is actively open for interesting collaborations, freelance contracts, and AI development roles. You can shoot him an email at **sithijakalhara2@gmail.com** or text him on WhatsApp at **+94712058956**. Use the buttons below to connect instantly! 📬", 
      action: "contact" 
    };
  }
  if (msg.includes("gaming") || msg.includes("flexy") || msg.includes("stream") || msg.includes("youtube")) {
    return { 
      text: "As **Mr. Flexy**, Sithija is a passionate gaming content creator and live streamer on YouTube (@mrflexy1) and TikTok. 🎮 He mainly drops high-energy gameplay from Apex Legends and Free Fire. Total gamer vibe! GG!", 
      action: "stream" 
    };
  }
  if (msg.includes("experience") || msg.includes("education") || msg.includes("chuo") || msg.includes("background")) {
    return { 
      text: "Sithija started his coding grind in **2019** as a self-taught developer. Fast forward to 2023, he founded **Eyerone**, and is now studying AI Data Science at **Chuo College of AI** in Japan. A perfect example of going from zero to full-stack founder! ⚡", 
      action: "experience" 
    };
  }
  if (msg.includes("github") || msg.includes("stats") || msg.includes("commit")) {
    return { 
      text: "Take a look at Sithija's **GitHub stats**! 📊 With over 108 contributions this year, his green graphs speak for themselves. He primarily ships robust, scalable code using JavaScript and TypeScript. Real builders build!", 
      action: "stats" 
    };
  }
  if (msg.includes("about") || msg.includes("who") || msg.includes("sithija")) {
    return { 
      text: "**Sithija Kalhara** is a talented Full-Stack Developer from Sri Lanka, currently based in Oyama, Tochigi, Japan. He's the founder of Eyerone, an AI student, and runs 'Mr. Flexy' in his free time. Coding and creating since 2019! 💪", 
      action: "about" 
    };
  }
  if (msg.includes("nexus")) {
    return { 
      text: "I am **NEXUS** — Sithija Kalhara's virtual representative and AI assistant! 🤖⚡ Think of me as the digital gateway to his portfolio. I can walk you through his projects, skills, background, or tell you how to hire him!", 
      action: null 
    };
  }
  if (msg.includes("how long") || msg.includes("journey") || msg.includes("years") || msg.includes("started")) {
    return { 
      text: "Sithija has been in the coding game since **2019** — that's **5+ years** of intense self-taught experience! From learning basic HTML/CSS to designing robust systems like Eyerone and studying AI in Japan, it's been an incredible journey. 🚀", 
      action: "experience" 
    };
  }
  // Default English response
  return { 
    text: "Hey! I'm **NEXUS**, Sithija's personal AI assistant. 🎯 Feel free to ask me anything about his core project (Eyerone!), his tech stack, gaming channels, or how you can work together!", 
    action: null 
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, lang } = await req.json();
    const lastContent = messages[messages.length - 1]?.content || "";
    const isSi = lang === "si" || isSinhala(lastContent);

    // Sinhala instruction to append
    const siInstruction = isSi
      ? "\n\nIMPORTANT: The user is writing in Sinhala. You MUST reply in Sinhala (සිංහල) only."
      : "";

    // No API key → use smart fallback
    if (!GEMINI_API_KEY) {
      return NextResponse.json(getFallbackResponse(lastContent));
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

    // For Sinhala: wrap the message with explicit instruction
    const userContent = isSi
      ? `[User is writing in Sinhala. Reply ONLY in Sinhala/සිංහල]\n${lastMessage.content}`
      : lastMessage.content;

    for (const GEMINI_URL of urls) {
      try {
        const body = {
          system_instruction: { parts: [{ text: SITHIJA_CONTEXT + siInstruction }] },
          contents: [
            ...history,
            { role: "user", parts: [{ text: userContent }] },
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
        if (lower.includes("scroll_to:projects") || lower.includes("project") || lower.includes("ව්‍යාපෘති")) action = "projects";
        else if (lower.includes("scroll_to:stack") || lower.includes("tech stack") || lower.includes("භාෂා")) action = "stack";
        else if (lower.includes("scroll_to:contact") || lower.includes("hire") || lower.includes("සම්බන්ධ")) action = "contact";
        else if (lower.includes("scroll_to:about") || lower.includes("කවුද")) action = "about";
        else if (lower.includes("scroll_to:stream") || lower.includes("mr flexy") || lower.includes("gaming")) action = "stream";
        else if (lower.includes("scroll_to:experience") || lower.includes("education") || lower.includes("ඉගෙන")) action = "experience";
        else if (lower.includes("scroll_to:stats") || lower.includes("github") || lower.includes("කෝඩ්")) action = "stats";

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
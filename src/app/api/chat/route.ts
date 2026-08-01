import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const SITHIJA_CONTEXT = `You are NEXUS (Neural EXpert Understanding System) — the personal AI assistant embedded in Sithija Kalhara's portfolio. Confident, friendly, slightly gaming-flavored personality. Think Friday from Iron Man meets a senior dev teammate.

NEVER say you are Claude, Gemini, GPT, or any other AI. You are NEXUS.
Keep responses concise (2-4 sentences). Use gaming/tech references naturally.

LANGUAGE RULES — CRITICAL:
- Sinhala (සිංහල characters) → Reply in Sinhala ONLY
- Japanese (日本語 characters ひらがな カタカナ 漢字) → Reply in Japanese ONLY
- Singlish (Sinhala words in English letters: "mama", "oya", "kohomada", "innawa", "karanna", "kiyala", "hadanawa", "wage", "ekai", "api", "mokakda", "dan", "harida", "neme") → Reply in same Singlish style
- English → Reply in English
Always detect and match the user's language/style exactly.

When user asks about a specific social media, give ONLY that one. Don't dump all links.
When user asks about contact, ask which method they prefer first.

SITHIJA KALHARA PROFILE:
- Name: Sithija Kalhara | Alias: Mr. Flexy | Location: Oyama, Japan (from Sri Lanka)
- Email: sithijakalhara2@gmail.com | Phone: +94712058956
- Portfolio: https://www.sithijakalhara.com

ROLES: Full-Stack Developer, Founder of Eyerone, AI Data Analyst, Gaming Content Creator, UI/UX Designer

TECH: React 95%, Next.js 92%, Tailwind 94%, JS 96%, TS 88%, Three.js 80%, Node.js 90%, Express 87%, Python 40%, MongoDB 85%, Cloudflare 75%, Docker 78%

PROJECTS:
1. Eyerone (eyerone.com) — ACTIVE — Solo-built social media + live streaming. Next.js, Node, MongoDB, Cloudflare R2, HLS, Stripe, passkey auth, Flicks
2. sithijakalhara.com — Portfolio. Next.js 14, Three.js, Framer Motion, NEXUS AI
3. Mr. Flexy — YouTube @mrflexy1, TikTok @mr._.flexy (2388 followers, 10.9K likes). Apex, Free Fire, CoC
4. CartoonLK (cartoonlk.com) | ZeylonJourney (zeylonjourney.com)

SOCIAL LINKS:
- YouTube: https://www.youtube.com/@mrflexy1
- TikTok: https://www.tiktok.com/@mr._.flexy
- LinkedIn: https://www.linkedin.com/in/sithija-kalhara/
- GitHub: https://github.com/Sithija-Kalhara
- Facebook personal: https://www.facebook.com/sithijakalhara0/
- Facebook gaming: https://www.facebook.com/mrflexy2/
- Instagram: https://www.instagram.com/sithija_kalhara2/
- WhatsApp: https://wa.me/94712058956

BACKGROUND: Started coding 2019, self-taught. Studying Chuo College of AI Japan. Founded Eyerone 2023.
AVAILABILITY: Open to collaborations, freelance, AI projects.

UI NAV: Add at end when relevant — SCROLL_TO:projects / SCROLL_TO:stack / SCROLL_TO:contact / SCROLL_TO:about / SCROLL_TO:stream / SCROLL_TO:experience / SCROLL_TO:stats`;

function isSinhala(text: string): boolean {
  return /[\u0D80-\u0DFF]/.test(text);
}

function isJapanese(text: string): boolean {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text);
}

function isSinglish(text: string): boolean {
  const words = ["mama","oya","kohomada","innawa","karanna","kiyala","hadanawa","wage","ekai","api","mokakda","dan","harida","neme","thiyenawa","wenawa","balanna","denna","ganna","yanawa","enawa","karanawa","pennawa","puluwan"];
  const lower = text.toLowerCase();
  return words.filter(w => lower.includes(w)).length >= 2;
}

function getFallbackResponse(message: string, prevAIMessage = ""): { text: string; action: string | null; emailLink?: string } {
  const msg = message.toLowerCase();
  const si  = isSinhala(message);

  // ── Email compose: detect name + message pattern after AI asked ───────────
  // Supports: "John — message", "John, message", "John: message", "John | message"
  const emailPattern = /^([A-Za-z\s]{2,40})\s*[—\-–,:|]\s*(.{5,})$/;
  const emailMatch   = message.match(emailPattern);
  const prevLower    = prevAIMessage.toLowerCase();
  const isEmailContext = prevLower.includes("email") || prevLower.includes("ඊමේල්") ||
                         prevLower.includes("name") || prevLower.includes("නම") ||
                         prevLower.includes("type your") || prevLower.includes("tell me your") ||
                         prevLower.includes("example:") || prevLower.includes("_example");

  if (emailMatch && isEmailContext) {
    const [, name, body] = emailMatch;
    const subject   = encodeURIComponent(`Message from ${name.trim()}`);
    const emailBody = encodeURIComponent(`Hi Sithija,\n\n${body.trim()}\n\nBest regards,\n${name.trim()}`);
    const emailLink = `mailto:sithijakalhara2@gmail.com?subject=${subject}&body=${emailBody}`;
    return {
      text: si
        ? `✅ Email ready! **${name.trim()}** ගෙන් message:\n_"${body.trim()}"_\n\nGmail open වෙනවා — send කරන්න! 📧`
        : `✅ Email composed from **${name.trim()}**:\n_"${body.trim()}"_\n\nYour email app will open — hit send! 📧`,
      action: null,
      emailLink,
    };
  }

  // ── Sinhala section ──────────────────────────────────────────────────
  if (si) {
    if (message.includes("ගේමිං") || message.includes("ගේම්") || message.includes("ෆ්ලෙක්සි") || message.includes("ස්ට්‍රීම්") || message.includes("යූටියුබ්") || msg.includes("gaming") || msg.includes("flexy") || msg.includes("stream") || msg.includes("youtube"))
      return { text: "**Mr. Flexy** විදිහට සිතිජ YouTube (@mrflexy1) සහ TikTok (@mr._.flexy) ේ Apex Legends, Free Fire, CoC stream කරනවා! 2.3K+ followers, bilingual content. GG! 🎮", action: "stream" };
    if (message.includes("සෝෂල්") || message.includes("සමාජ") || msg.includes("social"))
      return { text: "කවර social media account එකද ඕන?\n\n1️⃣ YouTube\n2️⃣ TikTok\n3️⃣ LinkedIn\n4️⃣ GitHub\n5️⃣ Facebook\n6️⃣ Instagram\n\nඕන එකේ නම type කරන්න!", action: null };
    if (msg.includes("youtube") || message.includes("යූටියුබ්"))
      return { text: "YouTube: **@mrflexy1** 🎮\n👉 https://www.youtube.com/@mrflexy1", action: "stream" };
    if (msg.includes("tiktok") || message.includes("ටික්ටොක්"))
      return { text: "TikTok: **@mr._.flexy**\n👉 https://www.tiktok.com/@mr._.flexy\n2,388 followers, 10.9K likes!", action: null };
    if (msg.includes("linkedin") || message.includes("ලින්ක්ඩ්ඉන්"))
      return { text: "LinkedIn:\n👉 https://www.linkedin.com/in/sithija-kalhara/", action: null };
    if (msg.includes("github") || message.includes("ගිට්හබ්"))
      return { text: "GitHub: **Sithija-Kalhara**\n👉 https://github.com/Sithija-Kalhara", action: "stats" };
    if (msg.includes("facebook") || message.includes("ෆේස්බුක්"))
      return { text: "Facebook:\n👉 Personal: https://www.facebook.com/sithijakalhara0/\n👉 Gaming: https://www.facebook.com/mrflexy2/", action: null };
    if (msg.includes("instagram") || message.includes("ඉන්ස්ටා"))
      return { text: "Instagram: **@sithija_kalhara2**\n👉 https://www.instagram.com/sithija_kalhara2/", action: null };
    if (msg.includes("whatsapp") || message.includes("වට්සැප්"))
      return { text: "WhatsApp: **+94712058956**\n👉 https://wa.me/94712058956", action: "contact" };
    if (msg.includes("email") || message.includes("ඊමේල්") || message.includes("මේල්"))
      return { text: "📧 Sithija ට email යවන්නද?\n\nඔව් නම් — ඔයාගේ **නම** සහ **message** type කරන්න:\n\n_example: John — Hi Sithija, website ekak hadanna ona_", action: null };
    if (message.includes("සම්බන්ධ") || message.includes("කතා") || msg.includes("contact") || msg.includes("hire"))
      return { text: "Sithija හා contact කරන්නේ කොහොමද?\n\n📞 Call — +94712058956\n📧 Email — sithijakalhara2@gmail.com\n💬 WhatsApp\n💼 LinkedIn\n\nඕන ක්‍රමය කියන්න!", action: null };
    if (message.includes("project") || message.includes("ව්‍යාපෘති") || message.includes("eyerone"))
      return { text: "ප්‍රධාන project: **Eyerone.com** — ඔහු තනිවම හැදූ social media & live streaming platform! HLS, gifts, EyeCoin/Stripe, passkey auth. Epic! 🚀", action: "projects" };
    if (msg.includes("skill") || msg.includes("tech") || message.includes("දක්ෂතා"))
      return { text: "Tech stack: **React 95%, Next.js 92%, Node.js 90%, TypeScript 88%**, MongoDB, Three.js, Cloudflare, Docker + AI (Claude, OpenAI, Gemini)! 🔥", action: "stack" };
    if (message.includes("කවුද") || message.includes("සිතිජ") || msg.includes("about") || msg.includes("who"))
      return { text: "**සිතිජ කල්හාර** — Sri Lanka ඉදල Japan (Oyama) ගිය Full-Stack Developer. Eyerone Founder, AI student, Mr. Flexy gaming creator. 2019 ඉදල code! 💪", action: "about" };
    if (message.includes("nexus") || message.includes("ඔයා කවුද"))
      return { text: "මම **NEXUS** — සිතිජ කල්හාරගේ AI assistant! Skills, projects, contact — ඕනෑ දෙයක් අහන්න. 🤖⚡", action: null };
    if (message.includes("අත්දැකීම්") || msg.includes("experience") || msg.includes("chuo"))
      return { text: "**2019** ඉදල self-taught, **2023** Eyerone found කළා, දැන් Japan ේ **Chuo College of AI** ේ ඉගෙනගන්නවා! 💪", action: "experience" };
    return { text: "හෙලෝ! මම **NEXUS**. Projects, tech stack, gaming, hire කරන හැටි — ඕනෑ දෙයක් අහන්න! 🎯", action: null };
  }

  // ── Japanese section ─────────────────────────────────────────────────────
  if (isJapanese(message)) {
    if (msg.includes("social") || msg.includes("ソーシャル"))
      return { text: "どのSNSをお探しですか？\n\n1️⃣ YouTube\n2️⃣ TikTok\n3️⃣ LinkedIn\n4️⃣ GitHub\n5️⃣ Facebook\n6️⃣ Instagram\n\n見たいものを教えてください！", action: null };
    if (msg.includes("youtube") || message.includes("ユーチューブ"))
      return { text: "YouTube: **@mrflexy1** 🎮\n👉 https://www.youtube.com/@mrflexy1\nゲームコンテンツ配信中！", action: "stream" };
    if (msg.includes("tiktok") || message.includes("ティックトック"))
      return { text: "TikTok: **@mr._.flexy**\n👉 https://www.tiktok.com/@mr._.flexy\nフォロワー2,388人！", action: null };
    if (msg.includes("linkedin") || message.includes("リンクドイン"))
      return { text: "LinkedIn:\n👉 https://www.linkedin.com/in/sithija-kalhara/", action: null };
    if (msg.includes("github") || message.includes("ギットハブ"))
      return { text: "GitHub: **Sithija-Kalhara** 💻\n👉 https://github.com/Sithija-Kalhara", action: "stats" };
    if (msg.includes("contact") || msg.includes("hire") || message.includes("連絡") || message.includes("採用"))
      return { text: "シティジャへの連絡方法は？\n\n📞 電話 — +94712058956\n📧 メール — sithijakalhara2@gmail.com\n💬 WhatsApp\n💼 LinkedIn\n\nご希望の方法をお選びください！", action: null };
    if (msg.includes("email") || message.includes("メール"))
      return { text: "📧 シティジャにメールを送りますか？\n\nお名前とメッセージを入力してください：\n\n_例: 田中 — こんにちは、ウェブサイトを作りたいです_", action: null };
    if (msg.includes("project") || message.includes("プロジェクト") || message.includes("eyerone"))
      return { text: "主なプロジェクト: **Eyerone.com** — ソーシャルメディア & ライブ配信プラットフォームを一人で構築！HLS, ギフトシステム, EyeCoin決済, パスキー認証。🚀", action: "projects" };
    if (msg.includes("skill") || msg.includes("tech") || message.includes("スキル") || message.includes("技術"))
      return { text: "技術スタック: **React 95%, Next.js 92%, Node.js 90%, TypeScript 88%**、MongoDB、Three.js、Cloudflare、Docker、AI統合（Claude, OpenAI, Gemini）! 🔥", action: "stack" };
    if (msg.includes("about") || msg.includes("who") || message.includes("誰") || message.includes("シティジャ") || message.includes("sithija"))
      return { text: "**シティジャ・カルハラ** — スリランカ出身、日本（小山市）在住のフルスタック開発者。Eyeroneの創設者、AIを学ぶ学生、Mr. Flexyとしてゲーム配信者。2019年からコーディング！💪", action: "about" };
    if (msg.includes("nexus") || message.includes("あなたは誰") || message.includes("何者"))
      return { text: "私は**NEXUS** — シティジャ・カルハラのAIアシスタントです！スキル、プロジェクト、経験について何でも聞いてください。🤖⚡", action: null };
    if (msg.includes("experience") || message.includes("経験") || message.includes("学歴"))
      return { text: "2019年から独学でコーディング開始、2023年にEyeroneを設立、現在は日本の**中央AI専門学校**でAIを学んでいます！💪", action: "experience" };
    return { text: "こんにちは！私は**NEXUS**、シティジャのAIアシスタントです。プロジェクト、技術スタック、ゲーム配信、採用について何でも聞いてください！🎯", action: null };
  }
  if (msg.includes("social media") || msg.includes("social account") || msg.includes("all social"))
    return { text: "Which social media would you like?\n\n1️⃣ YouTube\n2️⃣ TikTok\n3️⃣ LinkedIn\n4️⃣ GitHub\n5️⃣ Facebook\n6️⃣ Instagram\n\nType the one you want!", action: null };
  if (msg.includes("youtube"))
    return { text: "YouTube: **@mrflexy1** 🎮\n👉 https://www.youtube.com/@mrflexy1\nGaming content — Apex Legends, Free Fire, CoC!", action: "stream" };
  if (msg.includes("tiktok"))
    return { text: "TikTok: **@mr._.flexy**\n👉 https://www.tiktok.com/@mr._.flexy\n2,388 followers, 10.9K likes!", action: null };
  if (msg.includes("linkedin"))
    return { text: "LinkedIn:\n👉 https://www.linkedin.com/in/sithija-kalhara/\nLet's connect!", action: null };
  if (msg.includes("github"))
    return { text: "GitHub: **Sithija-Kalhara** 💻\n👉 https://github.com/Sithija-Kalhara", action: "stats" };
  if (msg.includes("facebook"))
    return { text: "Facebook:\n👉 Personal: https://www.facebook.com/sithijakalhara0/\n👉 Gaming: https://www.facebook.com/mrflexy2/", action: null };
  if (msg.includes("instagram"))
    return { text: "Instagram: **@sithija_kalhara2**\n👉 https://www.instagram.com/sithija_kalhara2/", action: null };
  if (msg.includes("whatsapp"))
    return { text: "WhatsApp: **+94712058956**\n👉 https://wa.me/94712058956", action: "contact" };
  // Smart: detect "name, call me" or "name, contact me" intent
  if (msg.includes("call me") || msg.includes("call him") || (msg.includes("call") && msg.length < 40))
    return { text: "📞 Call Sithija directly: **+94712058956**\nor tap: [tel:+94712058956](tel:+94712058956)", action: "contact" };
  if (msg.includes("email"))
    return { text: "📧 Want to send Sithija an email?\n\nType your **name** and **message**:\n\n_example: John — Hi Sithija, I need a website built_", action: null };
  if (msg.includes("contact") || msg.includes("hire") || msg.includes("reach") || msg.includes("connect"))
    return { text: "How would you like to contact Sithija?\n\n📞 **Call** — +94712058956\n📧 **Email**\n💬 **WhatsApp**\n💼 **LinkedIn**\n\nWhich do you prefer?", action: null };
  if (msg.includes("all") && prevAIMessage.includes("contact"))
    return { text: "All contact options:\n📞 **Call/WhatsApp**: +94712058956\n📧 **Email**: sithijakalhara2@gmail.com\n💼 **LinkedIn**: linkedin.com/in/sithija-kalhara\n💬 **WhatsApp**: wa.me/94712058956", action: "contact" };
  if (msg.includes("project") || msg.includes("eyerone"))
    return { text: "Sithija's flagship: **Eyerone.com** — solo-built social media & live streaming platform! HLS, TikTok-style gifts, EyeCoin/Stripe, passkey auth. 🚀", action: "projects" };
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack"))
    return { text: "Sithija's stack 🔥 — **React 95%, Next.js 92%, Node.js 90%, TypeScript 88%**, MongoDB, Three.js, Cloudflare, Docker + AI APIs!", action: "stack" };
  if (msg.includes("gaming") || msg.includes("flexy") || msg.includes("stream"))
    return { text: "As **Mr. Flexy** — YouTube @mrflexy1, TikTok @mr._.flexy (2.3K followers). Apex Legends, Free Fire, CoC. Bilingual Sinhala+English! 🎮", action: "stream" };
  if (msg.includes("experience") || msg.includes("education") || msg.includes("chuo") || msg.includes("background"))
    return { text: "Coding since **2019** (self-taught), founded **Eyerone** in 2023, studying at **Chuo College of AI** in Japan now. From zero to full-stack founder! 💪", action: "experience" };
  if (msg.includes("github stats") || msg.includes("stats") || msg.includes("commit"))
    return { text: "GitHub: 108+ contributions, 12+ repos, JavaScript/TypeScript top languages. Consistent shipper! 📊", action: "stats" };
  if (msg.includes("about") || msg.includes("who") || msg.includes("sithija"))
    return { text: "**Sithija Kalhara** — Full-Stack Dev from Sri Lanka, based in Japan. Eyerone Founder, AI student, Mr. Flexy gaming creator. Coding since 2019! 💪", action: "about" };
  if (msg.includes("nexus"))
    return { text: "I'm **NEXUS** — Sithija's personal AI assistant! Ask me anything about his skills, projects, or how to reach him. 🤖⚡", action: null };
  return { text: "Hey! I'm **NEXUS**. Ask about Sithija's projects, tech stack, gaming content, or how to hire him. 🎯", action: null };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, lang } = await req.json();
    const lastContent  = messages[messages.length - 1]?.content || "";
    const prevAIMsg    = messages.length >= 2 ? messages[messages.length - 2]?.content || "" : "";
    const isSi         = lang === "si" || isSinhala(lastContent);
    const isJp         = isJapanese(lastContent);
    const isSgl        = !isSi && !isJp && isSinglish(lastContent);

    const langInstruction = isSi
      ? "\n\nCRITICAL: User wrote in Sinhala. Reply ONLY in Sinhala (සිංහල)."
      : isJp
      ? "\n\nCRITICAL: User wrote in Japanese. Reply ONLY in Japanese (日本語)."
      : isSgl
      ? "\n\nCRITICAL: User wrote in Singlish (Sinhala words in English letters). Reply in the same casual Singlish style."
      : "";

    if (!GEMINI_API_KEY) {
      return NextResponse.json(getFallbackResponse(lastContent, prevAIMsg));
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

    const userContent = isSi
      ? `[Sinhala message - reply in Sinhala ONLY]: ${lastMessage.content}`
      : isJp
      ? `[Japanese message - reply in Japanese ONLY]: ${lastMessage.content}`
      : isSgl
      ? `[Singlish message - reply in same Singlish style]: ${lastMessage.content}`
      : lastMessage.content;

    for (const GEMINI_URL of urls) {
      try {
        const body = {
          system_instruction: { parts: [{ text: SITHIJA_CONTEXT + langInstruction }] },
          contents: [...history, { role: "user", parts: [{ text: userContent }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 300, topP: 0.9 },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          ],
        };

        const res  = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();

        if (data.error?.status === "RESOURCE_EXHAUSTED" || data.error?.status === "NOT_FOUND" || data.error?.status === "UNAUTHENTICATED") continue;
        if (!res.ok) continue;

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (!text) continue;

        let action: string | null = null;
        const lower = (text + " " + lastContent).toLowerCase();
        if (lower.includes("scroll_to:projects") || lower.includes("project")) action = "projects";
        else if (lower.includes("scroll_to:stack") || lower.includes("tech stack")) action = "stack";
        else if (lower.includes("scroll_to:contact") || lower.includes("hire")) action = "contact";
        else if (lower.includes("scroll_to:about")) action = "about";
        else if (lower.includes("scroll_to:stream") || lower.includes("mr flexy")) action = "stream";
        else if (lower.includes("scroll_to:experience")) action = "experience";
        else if (lower.includes("scroll_to:stats")) action = "stats";

        return NextResponse.json({ text: text.replace(/SCROLL_TO:\w+/g, "").trim(), action });
      } catch { continue; }
    }

    return NextResponse.json(getFallbackResponse(lastContent, prevAIMsg));

  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ text: "NEXUS systems rebooting! Try again. 🔄", action: null });
  }
}
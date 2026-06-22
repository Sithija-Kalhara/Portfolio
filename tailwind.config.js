/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05050a",
          50: "#0d0d14",
          100: "#0a0a10",
          200: "#08080d",
          900: "#020203",
        },
        panel: {
          DEFAULT: "#0d0d14",
          light: "#13131c",
          border: "#1f1f2b",
        },
        signal: {
          violet: "#7c3aed",
          "violet-light": "#a855f7",
          cyan: "#00f0ff",
          crimson: "#ff1f4f",
        },
        ink: {
          DEFAULT: "#e8e8f0",
          dim: "#9494a8",
          faint: "#5c5c6e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.16), transparent 60%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      boxShadow: {
        "glow-violet": "0 0 40px -8px rgba(124,58,237,0.55)",
        "glow-cyan": "0 0 40px -8px rgba(0,240,255,0.45)",
        "glow-crimson": "0 0 40px -8px rgba(255,31,79,0.45)",
        "inner-line": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      animation: {
        "scan-line": "scan-line 4s linear infinite",
        marquee: "marquee 28s linear infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        flicker: "flicker 6s ease-in-out infinite",
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(255,31,79,0.6)" },
          "50%": { opacity: "0.6", boxShadow: "0 0 0 6px rgba(255,31,79,0)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 22%, 24%, 55%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

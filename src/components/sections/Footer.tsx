import { profile } from "@/data/profile";

const marqueeItems = [
  "FULL-STACK DEVELOPER",
  "AI DATA ANALYST",
  "GAME LIVE STREAMER",
  "FOUNDER · EYERONE",
];

export function Footer() {
  return (
    <footer className="relative border-t border-panel-border py-10">
      <div className="mask-fade-x overflow-hidden border-b border-panel-border py-4">
        <div className="flex w-max animate-marquee gap-10">
          {[...Array(2)].map((_, dupIndex) => (
            <div key={dupIndex} className="flex shrink-0 gap-10">
              {marqueeItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-10 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint"
                >
                  {item}
                  <span className="text-signal-violet">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-10">
        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} Team Eyerone. All Rights Reserved.
        </p>
       
      </div>
    </footer>
  );
}

import { cn } from "@/lib/utils";

type SectionTagProps = {
  index: string;
  label: string;
  accent?: "violet" | "cyan" | "crimson";
  className?: string;
};

const accentMap = {
  violet: "text-signal-violet-light border-signal-violet/40",
  cyan: "text-signal-cyan border-signal-cyan/40",
  crimson: "text-signal-crimson border-signal-crimson/40",
};

export function SectionTag({
  index,
  label,
  accent = "violet",
  className,
}: SectionTagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border bg-panel/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] backdrop-blur-sm",
        accentMap[accent],
        className
      )}
    >
      <span className="opacity-60">{index}</span>
      <span className="h-1 w-1 rounded-full bg-current" />
      <span>{label}</span>
    </div>
  );
}

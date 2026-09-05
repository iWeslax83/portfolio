import { wavyDividerPath } from "@/lib/wavy-divider";

export default function WavyDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
    >
      <path d={wavyDividerPath} fill="none" stroke="var(--color-rule)" strokeWidth="1" />
    </svg>
  );
}

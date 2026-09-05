import { binaryDigits } from "@/lib/binary-ticker";

/**
 * Thin horizontal strip of deterministic binary digits - decorative
 * divider for the hero beat, aria-hidden.
 */
export default function BinaryTicker({ className = "" }: { className?: string }) {
  return (
    <p
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-ink-3 opacity-60 ${className}`}
    >
      {binaryDigits}
    </p>
  );
}

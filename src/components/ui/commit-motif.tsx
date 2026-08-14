"use client";

import { CommitEntry } from "@/lib/git-history";

/**
 * Faint mono-type texture built from this repo's own real commit history.
 * Purely decorative background layer - aria-hidden, never focusable, sits
 * behind section content (z-index below `main`'s z-index: 2 in globals.css).
 */
export default function CommitMotif({ commits }: { commits: CommitEntry[] }) {
  if (commits.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.05] select-none"
    >
      <div className="font-mono text-[11px] leading-[1.8] tracking-wide text-ink whitespace-nowrap -rotate-2">
        {commits.map((c, i) => (
          <div key={c.hash + i}>
            {c.hash} {c.message}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CommitEntry } from "@/lib/git-history";
import { binaryRows } from "@/lib/binary-texture";

/**
 * Two-layer decorative background texture: this repo's own real commit
 * history (visible layer) plus a deterministic binary field (fill layer),
 * each drifting at a different scroll-linked speed for a subtle parallax
 * separation. Purely decorative - aria-hidden, never focusable, sits
 * behind section content (z-index below `main`'s z-index: 2 in globals.css).
 */
export default function CommitMotif({ commits }: { commits: CommitEntry[] }) {
  const { scrollYProgress } = useScroll();
  const commitY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const binaryY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {commits.length > 0 && (
        <motion.div
          style={{ y: reduce ? 0 : commitY }}
          className="absolute inset-0 opacity-[0.13] font-mono text-[11px] leading-[1.8] tracking-wide text-ink whitespace-nowrap -rotate-2"
        >
          {commits.map((c, i) => (
            <div key={c.hash + i}>
              {c.hash} {c.message}
            </div>
          ))}
        </motion.div>
      )}
      <motion.div
        style={{ y: reduce ? 0 : binaryY }}
        className="absolute inset-0 opacity-[0.06] font-mono text-[10px] leading-[1.6] tracking-[0.15em] text-ink whitespace-pre rotate-1"
      >
        {binaryRows.join("\n")}
      </motion.div>
    </div>
  );
}

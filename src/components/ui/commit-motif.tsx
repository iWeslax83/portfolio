"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CommitEntry } from "@/lib/git-history";
import { binaryRows } from "@/lib/binary-texture";

/**
 * Two thin horizontal texture strips: this repo's own real commit history
 * (top strip) and a deterministic binary field (bottom strip), each
 * drifting at a different scroll-linked speed. Purely decorative -
 * aria-hidden, never focusable, sits behind section content (z-index below
 * main's z-index: 2 in globals.css). Restyled from a prior full-page
 * diagonal wash into two bounded strips matching the reference site's
 * strip-above/strip-below-headline placement.
 */
export default function CommitMotif({ commits }: { commits: CommitEntry[] }) {
  const { scrollYProgress } = useScroll();
  const commitX = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const binaryX = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 select-none">
      {commits.length > 0 && (
        <motion.div
          style={{ x: reduce ? 0 : commitX }}
          className="h-6 overflow-hidden whitespace-nowrap border-b border-rule font-mono text-[10px] leading-6 tracking-wide text-ink-3 opacity-70"
        >
          {commits.map((c, i) => (
            <span key={c.hash + i} className="mr-8">
              {c.hash} {c.message}
            </span>
          ))}
        </motion.div>
      )}
      <motion.div
        style={{ x: reduce ? 0 : binaryX }}
        className="h-6 overflow-hidden whitespace-nowrap border-b border-rule font-mono text-[10px] leading-6 tracking-[0.15em] text-ink-3 opacity-50"
      >
        {binaryRows.map((row, i) => (
          <span key={i} className="mr-8">
            {row}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

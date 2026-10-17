"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { TickerSegment } from "@/lib/ticker";

/** Framed mono strip that drifts left as the page scrolls. Decorative. */
export default function Ticker({
  segments,
  speed = 0.15,
}: {
  segments: TickerSegment[];
  speed?: number;
}) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const x = useTransform(scrollY, (v) => (reduce ? 0 : -v * speed));
  const loop = [...segments, ...segments];

  return (
    <div
      aria-hidden
      className="flex h-9 items-center gap-3 border-y border-ink px-4 font-mono text-[10px] leading-none tracking-[0.04em] text-ink"
    >
      <span>▸</span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <motion.div style={{ x }} className="flex w-max gap-6 whitespace-nowrap">
          {loop.map((s, i) => (
            <span
              key={i}
              className={s.kind === "commit" ? "text-ink" : "text-ink-2"}
            >
              {s.text}
            </span>
          ))}
        </motion.div>
      </div>
      <span>◂</span>
    </div>
  );
}

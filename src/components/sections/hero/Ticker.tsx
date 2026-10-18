"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { TickerSegment } from "@/lib/ticker";

/** Framed mono strip that drifts left as the page scrolls. Decorative. */
export default function Ticker({
  segments,
  speed = 0.15,
}: {
  segments: TickerSegment[];
  speed?: number;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const loop = [...segments, ...segments];

  // Drift = speed x page scroll, over the whole page, lerped by scrub.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(strip.current, {
        x: () => -ScrollTrigger.maxScroll(window) * speed,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  });

  return (
    <div
      aria-hidden
      className="flex h-9 items-center gap-3 border-y border-ink px-4 font-mono text-[10px] leading-none tracking-[0.04em] text-ink"
    >
      <span>▸</span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div ref={strip} className="flex w-max gap-6 whitespace-nowrap">
          {loop.map((s, i) => (
            <span
              key={i}
              className={s.kind === "commit" ? "text-ink" : "text-ink-2"}
            >
              {s.text}
            </span>
          ))}
        </div>
      </div>
      <span>◂</span>
    </div>
  );
}

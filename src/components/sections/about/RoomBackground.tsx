"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { aboutRoom } from "@/lib/perspective-room";

/** Perspective wireframe behind a centered column. Skews slightly on scroll. */
export default function RoomBackground({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const skewY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [2, -2]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ skewY }}
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {aboutRoom.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="var(--color-ink)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </motion.div>
  );
}

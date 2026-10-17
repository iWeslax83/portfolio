"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";
import DotPattern from "@/components/ui/dot-pattern";

const introGrid = warpedGrid({ cols: 12, rows: 7, bulge: 18 });

/** Black capsule on a grid; grows on scroll until the screen is black. */
export default function WorkIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0.15, 1], [1, 14]);

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <WarpedGrid paths={introGrid} className="absolute inset-0 h-full w-full" />
        <motion.div
          style={{ scale }}
          className="relative flex h-[300px] w-[150px] items-center justify-center overflow-hidden rounded-full bg-ink text-bg"
        >
          <DotPattern color="rgba(255,255,255,0.35)" className="absolute inset-0 h-full w-full" />
          <p aria-hidden className="relative flex flex-col items-center font-display text-6xl leading-[0.95]">
            {"WORK".split("").map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

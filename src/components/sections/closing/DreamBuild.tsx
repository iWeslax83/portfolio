"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

const grid = warpedGrid({ cols: 12, rows: 6, bulge: 24 });

function Char({
  char,
  offset,
  progress,
  mode,
}: {
  char: string;
  offset: number;
  progress: MotionValue<number>;
  mode: "scatter" | "assemble";
}) {
  const reduce = useReducedMotion();
  const x = useTransform(progress, (p) => {
    if (reduce) return "0vw";
    const t = mode === "scatter" ? p : 1 - p;
    return `${offset * t * 4}vw`;
  });
  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    return mode === "scatter" ? 1 - p * 0.85 : 0.15 + p * 0.85;
  });
  return (
    <motion.span style={{ x, opacity }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  );
}

function Line({
  text,
  progress,
  mode,
}: {
  text: string;
  progress: MotionValue<number>;
  mode: "scatter" | "assemble";
}) {
  const chars = text.split("");
  const mid = (chars.length - 1) / 2;
  return (
    <p
      aria-hidden
      className="relative flex justify-center font-condensed text-[clamp(4rem,12vw,11rem)] font-bold leading-none tracking-[0.04em] text-ink"
    >
      {chars.map((c, i) => (
        <Char key={i} char={c} offset={i - mid} progress={progress} mode={mode} />
      ))}
    </p>
  );
}

/** DREAM IT scatters apart while BUILD IT assembles, over a bowed grid. */
export default function DreamBuild() {
  const t = useTranslations("closing");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative h-[200vh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-4 overflow-hidden border-t border-ink motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
        <p className="sr-only">{t("dreamBuild")}</p>
        <Line text="DREAM IT" progress={scrollYProgress} mode="scatter" />
        <Line text="BUILD IT" progress={scrollYProgress} mode="assemble" />
      </div>
    </div>
  );
}

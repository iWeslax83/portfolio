"use client";

import { motion } from "framer-motion";
import { markIn, ruleDraw, lineReveal, viewportOnce } from "@/lib/motion";

/**
 * Section header in the drafting language: a mono figure code, a hairline rule
 * that draws across the page, an optional right-aligned annotation, and the
 * section title set large in the display face. Replaces the terminal-prompt
 * section marker - this is the signature identity motif.
 */
export default function FigureMarker({
  code,
  title,
  annotation,
}: {
  code: string;
  title: string;
  annotation?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4">
        <motion.span variants={markIn} className="annotate shrink-0 text-accent">
          {code}
        </motion.span>
        <motion.span
          variants={ruleDraw}
          className="h-px flex-1 origin-left bg-rule"
        />
        {annotation && (
          <motion.span variants={markIn} className="annotate shrink-0">
            {annotation}
          </motion.span>
        )}
      </div>
      <div className="mt-5 overflow-hidden">
        <motion.h2
          variants={lineReveal}
          className="font-display text-[2.25rem] sm:text-5xl md:text-[3.5rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
        >
          {title}
        </motion.h2>
      </div>
    </motion.header>
  );
}

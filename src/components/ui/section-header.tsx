"use client";

import { motion } from "framer-motion";
import { markIn, ruleDraw, lineReveal, viewportOnce } from "@/lib/motion";

/**
 * Section header in the Instrument language: a mono kicker label, a hairline
 * rule extending across the section, an optional right-aligned mono meta
 * value, and the section title set large. Replaces FigureMarker - no figure
 * code, no registration marks.
 */
export default function SectionHeader({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4">
        <motion.span variants={markIn} className="annotate shrink-0 text-ink">
          {kicker}
        </motion.span>
        <motion.span
          variants={ruleDraw}
          className="h-px flex-1 origin-left bg-rule"
        />
        {meta && (
          <motion.span variants={markIn} className="annotate shrink-0">
            {meta}
          </motion.span>
        )}
      </div>
      <div className="mt-5 overflow-hidden">
        <motion.h2
          variants={lineReveal}
          className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
        >
          {title}
        </motion.h2>
      </div>
    </motion.header>
  );
}

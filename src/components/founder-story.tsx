"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./ui/section-header";
import DroneSchematic from "./ui/drone-schematic";
import { stratosUnits, STRATOS_URL } from "@/data/stratos";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, staggerFast, fadeRise, slideInRight, ruleDraw, viewportOnce } from "@/lib/motion";

export default function FounderStory() {
  const t = useTranslations("stratos");
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  /* Starts undrawn, matching the scrub's own state at scroll 0. Starting at
     1 made the schematic paint fully drawn and then snap back to ~0 the
     moment the ScrollTrigger initialized. The mobile / reduced-motion
     branch below sets it straight back to 1, where there is no scrub to
     desync from. */
  const [drawProgress, setDrawProgress] = useState(0);

  const stats = [
    { value: "04", label: t("departments") },
    { value: "07", label: t("members") },
    { value: "2026", label: t("founded") },
  ];

  useGSAP(
    () => {
      if (reduced || mobile) {
        setDrawProgress(1);
        return;
      }
      if (!sectionRef.current) return;

      /* Re-entering the scrubbed path (e.g. resizing up past `md`) must
         reset the draw, otherwise it stays stuck at the fallback's 1. */
      setDrawProgress(0);

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
          onUpdate: (self) => setDrawProgress(self.progress),
          onRefresh: (self) => setDrawProgress(self.progress),
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  const paragraphThresholds = [0, 0.4, 0.7]; // roleBadge, body, stats reveal in sync with draw

  return (
    <section ref={sectionRef} id="founder-story" className="relative py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <SectionHeader kicker={t("kicker")} title={t("title")} />

      <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-start">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <p
            className="annotate text-accent transition-opacity duration-300"
            style={{ opacity: drawProgress >= paragraphThresholds[0] ? 1 : 0.15 }}
          >
            {t("roleBadge")}
          </p>

          <p
            className="font-body text-lg md:text-xl text-ink mt-6 leading-relaxed max-w-xl transition-opacity duration-300"
            style={{ opacity: drawProgress >= paragraphThresholds[1] ? 1 : 0.15 }}
          >
            {t("body")}
          </p>

          <dl
            className="mt-10 grid grid-cols-3 max-w-md border-t border-rule pt-6 transition-opacity duration-300"
            style={{ opacity: drawProgress >= paragraphThresholds[2] ? 1 : 0.15 }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">{s.value}</dt>
                <dd className="annotate mt-1.5">{s.label}</dd>
              </div>
            ))}
          </dl>

          <motion.a
            variants={fadeRise}
            href={STRATOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent mt-9 hover:text-accent/80 transition-colors"
          >
            {t("visit")}
            <ArrowUpRight size={13} />
          </motion.a>
        </motion.div>

        <div>
          <div className="border border-rule p-8 md:p-10 lg:sticky lg:top-28">
            <DroneSchematic progress={drawProgress} />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerFast} className="mt-8">
            <div className="flex items-center gap-4 mb-2">
              <motion.span variants={slideInRight} className="annotate">
                {t("unitsLabel")}
              </motion.span>
              <motion.span variants={ruleDraw} className="h-px flex-1 origin-left bg-rule" />
            </div>
            <ul>
              {stratosUnits.map((unit, i) => (
                <motion.li
                  key={unit.name}
                  variants={slideInRight}
                  className="row-sweep group grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5 transition-colors hover:border-rule-strong"
                >
                  <span className="font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-accent">
                      {unit.name}
                    </h3>
                    <p className="font-mono text-[11px] text-ink-3 mt-1.5 leading-relaxed">{unit.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import FigureMarker from "./ui/figure-marker";
import { stratosUnits, STRATOS_URL } from "@/data/stratos";
import {
  staggerContainer,
  staggerFast,
  fadeRise,
  slideInLeft,
  slideInRight,
  ruleDraw,
  viewportOnce,
} from "@/lib/motion";

export default function Stratos() {
  const t = useTranslations("stratos");

  const stats = [
    { value: "04", label: t("departments") },
    { value: "07", label: t("members") },
    { value: "2026", label: t("founded") },
  ];

  return (
    <section id="stratos" className="relative py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <FigureMarker code="FIG. 01" title={t("title")} annotation={t("kicker")} />

      <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-start">
        {/* Left - the story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.p variants={slideInLeft} className="annotate text-accent">
            {t("roleBadge")}
          </motion.p>

          <motion.p
            variants={slideInLeft}
            className="font-body text-lg md:text-xl text-ink mt-6 leading-relaxed max-w-xl"
          >
            {t("body")}
          </motion.p>

          {/* Stat spec row */}
          <motion.dl
            variants={fadeRise}
            className="mt-10 grid grid-cols-3 max-w-md border-t border-rule pt-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">
                  {s.value}
                </dt>
                <dd className="annotate mt-1.5">{s.label}</dd>
              </div>
            ))}
          </motion.dl>

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

        {/* Right - parts manifest */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerFast}
        >
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
                className="group grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5 transition-colors hover:border-rule-strong"
              >
                <span className="font-mono text-xs text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-accent">
                    {unit.name}
                  </h3>
                  <p className="font-mono text-[11px] text-ink-3 mt-1.5 leading-relaxed">
                    {unit.detail}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

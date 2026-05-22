"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Crosshair, Radio, Bot } from "lucide-react";
import SectionMarker from "./ui/section-marker";
import AnimatedCounter from "./animated-counter";
import { stratosUnits, STRATOS_URL } from "@/data/stratos";
import {
  staggerContainer,
  slideInLeft,
  slideInRight,
  fadeInUp,
  viewportOnce,
} from "@/lib/motion";

const unitIcons = [Crosshair, Radio, Bot];

export default function Stratos() {
  const t = useTranslations("stratos");

  return (
    <section id="stratos" className="py-24 md:py-32 px-6 md:px-10 max-w-[1320px] mx-auto">
      <SectionMarker command={t("command")} title={t("title")} index="01" />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
        {/* Left - the story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.span
            variants={slideInLeft}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-1.5 font-mono text-[11px] tracking-wide text-accent"
          >
            {t("roleBadge")}
          </motion.span>

          <motion.p
            variants={slideInLeft}
            className="font-body text-base md:text-lg text-text-secondary leading-relaxed mt-6 max-w-xl"
          >
            {t("body")}
          </motion.p>

          {/* Mini stats */}
          <motion.div variants={fadeInUp} className="flex gap-8 mt-9">
            <div>
              <div className="font-mono text-2xl font-semibold text-accent">
                <AnimatedCounter target={4} />
              </div>
              <div className="font-mono text-[11px] text-text-muted mt-1">
                {t("departments")}
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold text-accent">
                <AnimatedCounter target={7} />
              </div>
              <div className="font-mono text-[11px] text-text-muted mt-1">
                {t("members")}
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold text-accent">2026</div>
              <div className="font-mono text-[11px] text-text-muted mt-1">
                {t("founded")}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right - the standout amber-bordered panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="rounded-2xl border border-accent/25 bg-gradient-to-b from-accent-soft to-transparent p-6 md:p-7"
        >
          <motion.p
            variants={slideInRight}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-5"
          >
            {t("unitsLabel")}
          </motion.p>

          <div className="space-y-3">
            {stratosUnits.map((unit, i) => {
              const Icon = unitIcons[i % unitIcons.length];
              return (
                <motion.div
                  key={unit.name}
                  variants={slideInRight}
                  className="group flex items-center gap-3.5 rounded-xl border border-card-border bg-bg/40 px-4 py-3.5 transition-colors hover:border-card-border-hover"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform group-hover:scale-110">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base font-medium text-text-primary">
                      {unit.name}
                    </div>
                    <div className="font-mono text-[11px] text-text-secondary mt-0.5">
                      {unit.detail}
                    </div>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="flex-shrink-0 text-text-muted opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.a
            variants={slideInRight}
            href={STRATOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-shimmer inline-flex items-center gap-1.5 font-mono text-xs text-accent mt-6 hover:text-accent/80 transition-colors"
          >
            {t("visit")}
            <ArrowUpRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

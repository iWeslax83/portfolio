"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import DroneSchematic from "./ui/drone-schematic";
import {
  staggerContainer,
  fadeRise,
  lineReveal,
  markIn,
  viewportOnce,
} from "@/lib/motion";

export default function Hero() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);

  // Gentle parallax: the schematic drifts up as the hero scrolls away.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const figureOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const credentials = [
    t("cred1"),
    t("cred2"),
    t("cred3"),
  ];

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-[100dvh] flex items-center px-6 md:px-10 lg:px-14 pt-28 pb-20 max-w-[1320px] mx-auto"
    >
      <span className="reg-mark reg-tr" aria-hidden />
      <span className="reg-mark reg-bl" aria-hidden />

      <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center w-full">
        {/* Left - the statement */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Role + part code */}
          <motion.div
            variants={markIn}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8"
          >
            <span className="annotate text-accent">{t("role")}</span>
            <span className="h-px w-8 bg-rule" aria-hidden />
            <span className="annotate">{t("org")}</span>
          </motion.div>

          {/* Headline - two lines, each unmasking upward */}
          <h1 className="font-display text-[2.6rem] sm:text-6xl md:text-[4.1rem] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                {t("hLine1")}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block text-ink-2">
                {t("hLine2")}
              </motion.span>
            </span>
          </h1>

          {/* Revision mark - the NASA win, stated like a drawing revision */}
          <motion.p variants={markIn} className="annotate text-accent mt-7">
            {t("rev")}
          </motion.p>

          {/* Lead */}
          <motion.p
            variants={fadeRise}
            className="font-body text-base md:text-lg text-ink-2 mt-6 max-w-xl leading-relaxed"
          >
            {t("lead")}
          </motion.p>

          {/* Credentials - drafting annotation list with tick rule */}
          <motion.ul variants={fadeRise} className="mt-9 space-y-2.5">
            {credentials.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 border-l border-b border-rule-strong" aria-hidden />
                <span className="font-mono text-xs text-ink-2">{c}</span>
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div variants={fadeRise} className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-accent text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
            >
              {t("viewWork")}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="link-draw font-mono text-xs text-ink-2 hover:text-ink transition-colors"
            >
              {t("getInTouch")}
            </a>
          </motion.div>
        </motion.div>

        {/* Right - the technical figure */}
        <motion.figure
          style={{ y: figureY, opacity: figureOpacity }}
          className="relative hidden lg:block"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="relative px-6">
            <DroneSchematic />
          </div>
          <motion.figcaption
            variants={markIn}
            className="mt-4 flex items-center gap-3 annotate"
          >
            <span className="text-accent">Fig. 00</span>
            <span className="h-px flex-1 bg-rule" />
            <span>Autonomous quadrotor · top view</span>
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

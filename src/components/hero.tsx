"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import AnimatedCounter from "./animated-counter";
import Magnetic from "./ui/magnetic";
import HeroConsole from "./ui/hero-console";
import {
  staggerContainer,
  staggerFast,
  fadeInUp,
  wordReveal,
  imageUnblur,
} from "@/lib/motion";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

const stats = [
  { key: "projects", value: projects.length, suffix: "+" },
  {
    key: "technologies",
    value: skills.flatMap((s) => s.items).length,
    suffix: "+",
  },
  { key: "competitions", value: 5, suffix: "" },
];

/* ── Inline headline image tiles (visual punctuation) ───────── */
function Tile({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <motion.span
      variants={imageUnblur}
      aria-label={label}
      role="img"
      className="inline-flex items-center justify-center align-middle mx-1.5 h-[0.92em] aspect-[5/4] rounded-lg bg-panel-2 border border-card-border text-accent shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
    >
      {children}
    </motion.span>
  );
}

const DroneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[58%]">
    <circle cx="5" cy="5" r="2.4" /><circle cx="19" cy="5" r="2.4" />
    <circle cx="5" cy="19" r="2.4" /><circle cx="19" cy="19" r="2.4" />
    <path d="M6.7 6.7l3 3M17.3 6.7l-3 3M6.7 17.3l3-3M17.3 17.3l-3-3" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" />
  </svg>
);

const ChipIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[58%]">
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
  </svg>
);

const BrowserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[58%]">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18" /><circle cx="6" cy="6.5" r="0.6" fill="currentColor" /><circle cx="8.4" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={wordReveal} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);

  // Cursor-following ambient amber light
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const lx = useSpring(mx, { stiffness: 60, damping: 20 });
  const ly = useSpring(my, { stiffness: 60, damping: 20 });
  const background = useTransform(
    [lx, ly],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, rgba(232,160,92,0.10), transparent 70%)`
  );

  // Parallax drift on the backdrop as you scroll past the hero
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      ref={ref}
      id="home"
      onPointerMove={handleMove}
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-10 pt-28 pb-20 max-w-[1320px] mx-auto overflow-hidden"
    >
      {/* Ambient cursor light */}
      <motion.div style={{ background }} className="pointer-events-none absolute inset-0 z-0" aria-hidden />
      {/* Parallax dotted telemetry layer */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-x-0 -top-1/4 h-[150%] z-0 opacity-[0.5]"
        aria-hidden
      >
        <div className="h-full w-full [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_60%_50%_at_30%_40%,#000,transparent_75%)]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center w-full"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
        {/* Role tag - founder leads */}
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-ring" />
            <span className="font-mono text-[10px] md:text-xs tracking-[0.18em] text-accent">
              {t("roleTag")}
            </span>
          </span>
          <span className="font-mono text-[10px] md:text-xs tracking-[0.18em] text-text-secondary">
            {t("roleOrg")}
          </span>
        </motion.div>

        <motion.p variants={fadeInUp} className="font-mono text-xs text-text-muted mb-3">
          <span className="text-accent">$</span> {t("whoami")}
        </motion.p>

        {/* Headline with inline image punctuation */}
        <motion.h1
          variants={staggerFast}
          className="font-display text-[2.1rem] sm:text-5xl md:text-[3.6rem] font-bold tracking-tight text-text-primary flex flex-wrap items-center gap-x-[0.28em] gap-y-1.5"
        >
          <Words text={t("h0")} />
          <Tile label={t("altDrone")}>{DroneIcon}</Tile>
          <Words text={t("h1")} />
          <Tile label={t("altBoard")}>{ChipIcon}</Tile>
          <Words text={t("h2")} />
          <Tile label={t("altBrowser")}>{BrowserIcon}</Tile>
          <Words text={t("h3")} />
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="font-body text-sm md:text-base text-text-secondary mt-6 max-w-xl leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 md:gap-4 mt-9">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-xl border border-card-border bg-card-bg/60 px-5 py-3.5 backdrop-blur-sm"
            >
              <div className="font-mono text-xl font-semibold text-text-primary">
                <span className="text-accent">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <div className="font-mono text-[11px] text-text-muted mt-0.5">
                {t(stat.key)}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-9">
          <Magnetic>
            <a
              href="#projects"
              className="inline-block font-mono text-xs font-semibold bg-accent text-bg px-6 py-3 rounded-lg transition-[transform,filter] hover:brightness-105 active:translate-y-[1px]"
            >
              {t("viewProjects")}
            </a>
          </Magnetic>
          <a
            href="#contact"
            className="font-mono text-xs text-text-secondary px-5 py-3 rounded-lg border border-card-border transition-colors hover:border-card-border-hover hover:text-text-primary active:translate-y-[1px]"
          >
            {t("getInTouch")}
          </a>
        </motion.div>
        </motion.div>

        <div className="hidden lg:block">
          <HeroConsole />
        </div>
      </motion.div>
    </section>
  );
}

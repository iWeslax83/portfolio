"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import AnimatedCounter from "./animated-counter";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

const stats = [
  {
    key: "projects",
    value: projects.length,
    suffix: "+",
    borderColor: "border-accent/12",
  },
  {
    key: "technologies",
    value: skills.flatMap((s) => s.items).length,
    suffix: "+",
    borderColor: "border-text-muted/20",
  },
  {
    key: "competitions",
    value: projects.filter((p) => p.tag === "competition").length,
    suffix: "",
    borderColor: "border-text-secondary/15",
  },
];

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center px-6 md:px-10 max-w-5xl mx-auto pt-14 relative"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeInUp}
          className="font-mono text-xs text-text-muted mb-1.5"
        >
          <span className="text-accent">$</span> whoami
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="font-mono text-4xl md:text-5xl font-bold text-text-primary tracking-tight"
        >
          {t("name")}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="font-mono text-base text-accent mt-3"
        >
          {t("subtitle")}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="font-mono text-xs text-text-muted mt-2"
        >
          {t("location")}
        </motion.p>

        {/* Stats row */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap gap-4 md:gap-6 mt-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.key}
              className={`bg-card-bg border ${stat.borderColor} rounded-lg px-5 py-3.5`}
            >
              <div className="font-mono text-xl font-semibold text-text-primary">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-mono text-xs text-text-muted mt-0.5">
                {t(stat.key)}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeInUp} className="flex gap-3 mt-7">
          <a
            href="#projects"
            className="font-mono text-xs font-semibold bg-accent text-bg px-6 py-2.5 rounded-md hover:bg-accent/90 transition-colors"
          >
            {t("viewProjects")}
          </a>
          <a
            href="#contact"
            className="font-mono text-xs border border-card-border text-text-secondary px-6 py-2.5 rounded-md hover:border-card-border-hover transition-colors"
          >
            {t("getInTouch")}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <p className="font-mono text-xs text-text-muted">{t("scroll")}</p>
        <ChevronDown size={14} className="text-text-muted mx-auto mt-1" />
      </motion.div>
    </section>
  );
}

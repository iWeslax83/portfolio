"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import { skills } from "@/data/skills";
import SectionHeader from "./ui/section-header";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, staggerFast, fadeRise, readoutSettle, markIn, ruleDraw, viewportOnce } from "@/lib/motion";

const cellTone = ["bg-rule", "bg-ink-3", "bg-ink-2", "bg-accent/55", "bg-accent"];

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai_embedded: "AI & Embedded",
  devops: "DevOps & Infra",
};

function ContributionGraph({ graph, label }: { graph: number[][]; label: string }) {
  if (graph.length === 0) return null;
  return (
    <figure>
      <figcaption className="annotate mb-4">{label}</figcaption>
      <motion.div
        className="flex gap-[3px] overflow-x-auto pb-1"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.01 } } }}
      >
        {graph.map((week, wi) => (
          <motion.div
            key={wi}
            variants={{
              hidden: { opacity: 0, scaleY: 0.2 },
              visible: { opacity: 1, scaleY: 1, transition: { duration: 0.25 } },
            }}
            className="flex flex-col gap-[3px] origin-bottom"
          >
            {week.map((level, di) => (
              <span
                key={di}
                title={`activity level ${level}`}
                className={`h-[10px] w-[10px] ${cellTone[level]} transition-transform hover:scale-150`}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-4 flex items-center justify-end gap-1.5 annotate">
        <span>less</span>
        {cellTone.map((c, i) => (
          <span key={i} className={`h-[9px] w-[9px] ${c}`} />
        ))}
        <span>more</span>
      </div>
    </figure>
  );
}

function LanguageBar({ languages, label }: { languages: GitHubStats["languages"]; label: string }) {
  return (
    <figure>
      <figcaption className="annotate mb-4">{label}</figcaption>
      <motion.div
        className="flex h-1.5 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {languages.map((lang) => (
          <motion.div
            key={lang.name}
            style={{ flex: lang.percentage, backgroundColor: lang.color, transformOrigin: "left" }}
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          />
        ))}
      </motion.div>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5">
        {languages.map((lang) => (
          <span key={lang.name} className="font-mono text-[11px] text-ink-2">
            <span style={{ color: lang.color }}>{"■"}</span> {lang.name} <span className="text-ink-3">{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </figure>
  );
}

function SkillsTile({ label }: { label: string }) {
  const t = useTranslations("skills");
  return (
    <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
      <p className="annotate mb-4">{label}</p>
      {skills.map((category) => (
        <div key={category.key} className="border-t border-rule first:border-t-0 py-4">
          <div className="flex items-baseline gap-3 mb-2.5">
            <span className="font-mono text-[11px] text-accent tabular-nums">
              {String(category.items.length).padStart(2, "0")}
            </span>
            <h4 className="font-display text-base font-medium text-ink">
              {categoryLabels[category.key] ?? category.key}
            </h4>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {category.items.map((item) => (
              <span key={item} className="font-mono text-xs text-ink-2 border border-rule px-2 py-0.5">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Telemetry({ stats }: { stats: GitHubStats }) {
  const t = useTranslations("github");
  const tSkills = useTranslations("skills");
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  const specs = [
    { value: stats.publicRepos, label: t("publicRepos") },
    { value: stats.contributions, label: t("contributions") },
    { value: stats.languages.length, label: t("languages") },
  ];

  useGSAP(
    () => {
      if (reduced || mobile) return;
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=50%",
          pin: true,
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  return (
    <section ref={sectionRef} id="telemetry" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("status")} />

      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        <motion.dl variants={staggerFast} className="grid sm:grid-cols-3 gap-4 lg:gap-5">
          {specs.map((s) => (
            <motion.div key={s.label} variants={readoutSettle} className="border border-rule p-5 md:p-6">
              <dt className="font-display text-6xl md:text-7xl font-semibold text-ink tabular-nums tracking-tight">
                {s.value}
              </dt>
              <dd className="annotate mt-2">{s.label}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
          </motion.div>
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <SkillsTile label={tSkills("kicker")} />
        </div>

        <div className="flex items-center gap-4 mt-8">
          <motion.a
            variants={fadeRise}
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-accent/80"
          >
            github.com/iWeslax83
            <ArrowUpRight size={13} />
          </motion.a>
          <motion.span variants={ruleDraw} className="h-px flex-1 origin-left bg-rule" />
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import SectionHeader from "./ui/section-header";
import {
  staggerContainer,
  staggerFast,
  fadeRise,
  readoutSettle,
  ruleDraw,
  viewportOnce,
} from "@/lib/motion";

// Monochrome activity scale: ink for low days, amber signal as it intensifies.
const cellTone = ["bg-rule", "bg-ink-3", "bg-ink-2", "bg-accent/55", "bg-accent"];

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

function LanguageBar({
  languages,
  label,
}: {
  languages: GitHubStats["languages"];
  label: string;
}) {
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
            <span style={{ color: lang.color }}>{"■"}</span> {lang.name}{" "}
            <span className="text-ink-3">{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </figure>
  );
}

export default function GitHub({ stats }: { stats: GitHubStats }) {
  const t = useTranslations("github");

  const specs = [
    { value: stats.publicRepos, label: t("publicRepos") },
    { value: stats.contributions, label: t("contributions") },
    { value: stats.languages.length, label: t("languages") },
  ];

  return (
    <section id="github" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("status")} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        {/* Three small readout panels */}
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

        {/* Two wide panels */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
          </motion.div>
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
          </motion.div>
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

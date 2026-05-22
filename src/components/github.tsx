"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FolderGit2, Activity, Code2, ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import SectionMarker from "./ui/section-marker";
import AnimatedCounter from "./animated-counter";
import { staggerContainer, fadeInUp, scaleUp, viewportOnce } from "@/lib/motion";

const activityColors = [
  "bg-white/[0.04]",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/65",
  "bg-accent/90",
];

const column = {
  hidden: { opacity: 0, scaleY: 0.15 },
  visible: { opacity: 1, scaleY: 1, transition: { duration: 0.25 } },
};

function ContributionGraph({ graph, label }: { graph: number[][]; label: string }) {
  if (graph.length === 0) return null;
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5 mt-5">
      <p className="font-mono text-xs text-text-muted mb-4">{label}</p>
      <motion.div
        className="flex gap-[3px] overflow-x-auto pb-2"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.012 } } }}
      >
        {graph.map((week, wi) => (
          <motion.div
            key={wi}
            variants={column}
            className="flex flex-col gap-[3px] origin-bottom"
          >
            {week.map((level, di) => (
              <div
                key={di}
                title={`activity level ${level}`}
                className={`w-[11px] h-[11px] rounded-sm ${activityColors[level]} transition-transform hover:scale-[1.6]`}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-text-muted">
        <span>Less</span>
        {activityColors.map((c, i) => (
          <span key={i} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
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
    <div className="rounded-xl border border-card-border bg-card-bg p-5 mt-5">
      <p className="font-mono text-xs text-text-muted mb-4">{label}</p>
      <motion.div
        className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {languages.map((lang) => (
          <motion.div
            key={lang.name}
            style={{ flex: lang.percentage, backgroundColor: lang.color, transformOrigin: "left" }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
          />
        ))}
      </motion.div>
      <div className="flex flex-wrap gap-5 font-mono text-xs">
        {languages.map((lang) => (
          <span key={lang.name} className="text-text-secondary">
            <span style={{ color: lang.color }}>●</span> {lang.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function GitHub({ stats }: { stats: GitHubStats }) {
  const t = useTranslations("github");

  const statCards = [
    { label: t("publicRepos"), value: stats.publicRepos, suffix: "", Icon: FolderGit2 },
    { label: t("contributions"), value: stats.contributions, suffix: "", Icon: Activity },
    { label: t("languages"), value: stats.languages.length, suffix: "+", Icon: Code2 },
  ];

  return (
    <section id="github" className="py-24 md:py-32 px-6 md:px-10 max-w-[1320px] mx-auto">
      <SectionMarker command={t("command")} title={t("title")} index="04" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleUp}
              className="flex-1 rounded-xl border border-card-border bg-card-bg px-6 py-5 text-center transition-colors hover:border-card-border-hover"
            >
              <stat.Icon size={18} strokeWidth={1.8} className="mx-auto mb-2 text-accent/70" />
              <div className="font-mono text-2xl md:text-3xl font-bold text-accent">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-mono text-[11px] text-text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp}>
          <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-5">
          <a
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            className="link-shimmer inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-accent/80"
          >
            github.com/iWeslax83
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GitHubStats } from "@/lib/types";
import SectionHeader from "./section-header";
import AnimatedCounter from "./animated-counter";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const activityColors = [
  "bg-accent/[0.08]",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/65",
  "bg-accent/85",
];

function ContributionGraph({
  graph,
  label,
}: {
  graph: number[][];
  label: string;
}) {
  if (graph.length === 0) return null;

  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-5 mt-4">
      <p className="font-mono text-xs text-text-muted mb-3">{label}</p>
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {graph.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((level, di) => (
              <div
                key={di}
                className={`w-[10px] h-[10px] rounded-sm ${activityColors[level]}`}
              />
            ))}
          </div>
        ))}
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
    <div className="bg-card-bg border border-card-border rounded-lg p-5 mt-4">
      <p className="font-mono text-xs text-text-muted mb-3">{label}</p>
      <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mb-3">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ flex: lang.percentage, backgroundColor: lang.color }}
          />
        ))}
      </div>
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
    { label: t("publicRepos"), value: stats.publicRepos, suffix: "" },
    { label: t("contributions"), value: stats.contributions, suffix: "" },
    { label: t("languages"), value: stats.languages.length, suffix: "+" },
  ];

  return (
    <section id="github" className="py-20 px-6 md:px-10 max-w-5xl mx-auto">
      <SectionHeader prompt={t("prompt")} title={t("title")} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex gap-4 md:gap-5 mb-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-card-bg border border-card-border rounded-lg px-6 py-4 flex-1 text-center"
            >
              <div className="font-mono text-2xl font-bold text-text-primary">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-mono text-xs text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp}>
          <ContributionGraph
            graph={stats.contributionGraph}
            label={t("activity")}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <LanguageBar
            languages={stats.languages}
            label={t("languageBreakdown")}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

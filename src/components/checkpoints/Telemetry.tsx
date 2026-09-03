"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import { skills } from "@/data/skills";
import SectionHeader from "@/components/ui/section-header";
import CheckpointShell from "./CheckpointShell";

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
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {graph.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((level, di) => (
              <span key={di} title={`activity level ${level}`} className={`h-[10px] w-[10px] ${cellTone[level]}`} />
            ))}
          </div>
        ))}
      </div>
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
      <div className="flex h-1.5 overflow-hidden">
        {languages.map((lang) => (
          <div key={lang.name} style={{ flex: lang.percentage, backgroundColor: lang.color }} />
        ))}
      </div>
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

export default function Telemetry({
  visible,
  mode,
  stats,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  stats: GitHubStats;
}) {
  const t = useTranslations("github");
  const tSkills = useTranslations("skills");

  const specs = [
    { value: stats.publicRepos, label: t("publicRepos") },
    { value: stats.contributions, label: t("contributions") },
    { value: stats.languages.length, label: t("languages") },
  ];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("status")} />

        <dl className="grid sm:grid-cols-3 gap-4 lg:gap-5">
          {specs.map((s) => (
            <div key={s.label} className="border border-rule p-5 md:p-6">
              <dt className="font-display text-6xl md:text-7xl font-semibold text-ink tabular-nums tracking-tight">
                {s.value}
              </dt>
              <dd className="annotate mt-2">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <div className="border border-rule p-5 md:p-6">
            <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
          </div>
          <div className="border border-rule p-5 md:p-6">
            <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <div className="md:col-span-2 border border-rule p-5 md:p-6">
            <p className="annotate mb-4">{tSkills("kicker")}</p>
            {skills.map((category) => {
              const displayedItems = mode === "scene" ? category.items.slice(0, 4) : category.items;
              const hiddenCount = category.items.length - displayedItems.length;
              return (
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
                    {displayedItems.map((item) => (
                      <span key={item} className="font-mono text-xs text-ink-2 border border-rule px-2 py-0.5">
                        {item}
                      </span>
                    ))}
                    {hiddenCount > 0 && (
                      <span className="font-mono text-xs text-ink-3">+{hiddenCount} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <a
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent/80 transition-colors"
          >
            github.com/iWeslax83
            <ArrowUpRight size={13} />
          </a>
          <span className="h-px flex-1 bg-rule" />
        </div>
      </div>
    </CheckpointShell>
  );
}

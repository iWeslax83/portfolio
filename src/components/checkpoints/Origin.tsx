"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { stratosUnits, STRATOS_URL } from "@/data/stratos";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";

export default function Origin({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("stratos");

  const stats = [
    { value: "04", label: t("departments") },
    { value: "07", label: t("members") },
    { value: "2026", label: t("founded") },
  ];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="annotate text-accent">{t("roleBadge")}</p>
            <p className="font-body text-lg md:text-xl text-ink mt-6 leading-relaxed max-w-xl">{t("body")}</p>
            <dl className="mt-10 grid grid-cols-3 max-w-md border-t border-rule pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">{s.value}</dt>
                  <dd className="annotate mt-1.5">{s.label}</dd>
                </div>
              ))}
            </dl>
            <a
              href={STRATOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent mt-9 hover:text-accent/80 transition-colors"
            >
              {t("visit")}
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="annotate">{t("unitsLabel")}</span>
              <span className="h-px flex-1 bg-rule" />
            </div>
            <ul>
              {stratosUnits.map((unit, i) => (
                <li key={unit.name} className="grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5">
                  <span className="font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink">{unit.name}</h3>
                    <p className="font-mono text-[11px] text-ink-3 mt-1.5 leading-relaxed">{unit.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {mode === "flat" && (
          <figure className="relative mt-12 lg:mt-16 max-w-sm">
            <div className="relative border border-rule p-8 md:p-10">
              <DroneSchematic progress={1} />
            </div>
          </figure>
        )}
      </div>
    </CheckpointShell>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { ventures } from "@/data/ventures";
import { stratosUnits } from "@/data/stratos";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";

export default function Ventures({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("ventures");

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
        <ul>
          {ventures.map((venture, i) => (
            <li key={venture.name} className="border-b border-rule py-6">
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-5 items-baseline">
                <span className="font-mono text-xs text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-medium text-ink">{venture.name}</h3>
                    <span className="annotate">{venture.role}</span>
                  </div>
                  <p className="font-mono text-[11px] text-ink-3 mt-2 leading-relaxed">
                    {venture.proof}
                  </p>
                </div>
                {venture.href && (
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${venture.name} - visit site`}
                    className="text-ink-3 hover:text-accent transition-colors"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>

              {venture.name === "STRATOS İHA" && (
                <div className="mt-5 ml-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="annotate">{t("unitsLabel")}</span>
                    <span className="h-px flex-1 bg-rule" />
                  </div>
                  <ul>
                    {stratosUnits.map((unit, ui) => (
                      <li
                        key={unit.name}
                        className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline border-t border-rule py-3 first:border-t-0"
                      >
                        <span className="font-mono text-[11px] text-ink-3 tabular-nums">
                          {String(ui + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-medium text-ink">{unit.name}</h4>
                          <p className="font-mono text-[11px] text-ink-3 mt-1 leading-relaxed">
                            {unit.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

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

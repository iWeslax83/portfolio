"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";

export default function Liftoff({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("hero");
  const credentials = [t("cred1"), t("cred2"), t("cred3"), t("cred4")];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div className={`grid w-full ${mode === "flat" ? "lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center" : ""}`}>
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
            <span className="annotate text-accent">{t("role")}</span>
            <span className="h-px w-8 bg-rule" aria-hidden />
            <span className="annotate">{t("org")}</span>
          </div>

          <h1 className="font-display text-[clamp(3rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
            <span className="block">{t("hLine1")}</span>
            <span className="block text-accent">{t("hLine2")}</span>
          </h1>

          <p className="annotate text-accent mt-7">{t("rev")}</p>

          <p className="font-body text-base md:text-lg text-ink-2 mt-6 max-w-xl leading-relaxed">{t("lead")}</p>

          <ul className="mt-9 space-y-2.5">
            {credentials.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-rule-strong" aria-hidden />
                <span className="font-mono text-xs text-ink-2">{c}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#flight-log"
              className="group inline-flex items-center gap-2 bg-accent text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
            >
              {t("viewWork")}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#contact" className="link-draw font-mono text-xs text-ink-2 hover:text-ink transition-colors">
              {t("getInTouch")}
            </a>
          </div>
        </div>

        {mode === "flat" && (
          <figure className="relative hidden lg:block">
            <div className="relative border border-rule p-8 md:p-10">
              <DroneSchematic progress={1} />
            </div>
            <figcaption className="mt-4 annotate">{t("panelReadout")}</figcaption>
          </figure>
        )}
      </div>
    </CheckpointShell>
  );
}

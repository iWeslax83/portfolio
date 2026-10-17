"use client";

import { useTranslations } from "next-intl";
import type { GitHubStats } from "@/lib/types";
import RoomBackground from "./RoomBackground";
import SideRails from "./SideRails";
import Bento from "./Bento";

/** Black full-width label bar used to open a block (ABOUT, SKILLS, ...). */
export const SECTION_BAR =
  "bg-ink py-1 text-center font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg";

const PARAGRAPHS = ["p1", "p2", "p3", "p4"] as const;

export default function AboutSkills({ stats }: { stats: GitHubStats | null }) {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-clip"
    >
      <RoomBackground />
      <SideRails left={t("railLeft")} right={t("railRight")} />
      <div className="relative mx-auto w-full max-w-[640px] border-x border-ink bg-bg">
        <h2 id="about-title" className={SECTION_BAR}>
          {t("barAbout")}
        </h2>
        <div className="space-y-8 px-6 py-14 font-serif text-[22px] leading-[1.5] tracking-[-0.01em] sm:px-[72px] sm:py-20 sm:text-[30px]">
          {PARAGRAPHS.map((k) => (
            <p key={k}>{t(k)}</p>
          ))}
        </div>
        <h2 className={SECTION_BAR}>{t("barSkills")}</h2>
        <Bento stats={stats} />
      </div>
    </section>
  );
}

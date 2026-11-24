import type { Messages } from "@/lib/messages";
import type { GitHubStats } from "@/lib/types";
import type { BentoSkill, DevopsSkill } from "@/data/skills";
import type { Locale } from "@/lib/locales";
import RoomBackground from "./RoomBackground";
import SideRails from "./SideRails";
import Bento from "./Bento";
import { SECTION_BAR } from "@/components/sections/section-bar";

const topics = ["flight", "ai", "software"] as const;

export default function AboutSkills({
  stats,
  t,
  skills,
  bentoSkills,
  devops,
  locale,
}: {
  stats: GitHubStats | null;
  t: Messages["about"];
  skills: Messages["skills"];
  bentoSkills: BentoSkill[];
  devops: DevopsSkill;
  locale: Locale;
}) {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-clip">
      <RoomBackground />
      <SideRails left={t.railLeft} right={t.railRight} />
      <div className="relative mx-auto max-w-[1000px] border-x border-edge bg-panel">
        <h2 id="about-title" className={SECTION_BAR}>{t.barAbout}</h2>
        <div className="mx-auto max-w-[67ch] px-5 py-10 sm:px-8 sm:py-14">
          <p className="text-pretty text-lg font-bold leading-relaxed text-ink sm:text-xl">{t.summary}</p>
          <div className="mt-6 space-y-5">
            {topics.map((topic) => (
              <section key={topic} className="border-t border-edge pt-4">
                <h3 className="text-sm font-bold text-accent">{t[topic].heading}</h3>
                <p className="mt-2 text-pretty text-base leading-relaxed text-ink">{t[topic].body}</p>
              </section>
            ))}
          </div>
        </div>
        <h2 id="skills-title" className={SECTION_BAR}>{t.barSkills}</h2>
        <Bento stats={stats} t={skills} bentoSkills={bentoSkills} devopsSkill={devops} locale={locale} />
      </div>
    </section>
  );
}

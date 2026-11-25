import type { Messages } from "@/lib/messages";
import type { GitHubStats } from "@/lib/types";
import type { BentoSkill, DevopsSkill } from "@/data/skills";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";
import { getProjects } from "@/lib/localize";
import GitHubCell from "./GitHubCell";

const related: Record<string, string> = {
  embedded: "otonom-iha",
  ai: "prose",
  backend: "tofas-fen-webapp",
};

export default function Bento({
  stats,
  t,
  bentoSkills,
  devopsSkill,
  locale,
}: {
  stats: GitHubStats | null;
  t: Messages["skills"];
  bentoSkills: BentoSkill[];
  devopsSkill: DevopsSkill;
  locale: Locale;
}) {
  const projects = getProjects(locale);
  const cards = [...bentoSkills, { key: "devops", ...devopsSkill }];
  return (
    <div className="px-5 py-8 sm:px-8 sm:py-12">
      <p className="mb-5 text-balance text-base font-bold text-accent sm:text-lg">{t.statement}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {cards.map(({ key, sub, label, tools }) => {
          const project = projects.find(({ slug }) => slug === related[key]);
          return (
            <li key={key} className="min-w-0 border border-edge bg-bg p-4 sm:p-5">
              <h3 className="text-balance text-lg font-bold leading-snug">{sub}</h3>
              <p className="mt-2 text-sm text-ink">{label}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-3">{tools.join(" · ")}</p>
              {project && (
                <a
                  href={localizedPath(locale, `/projects/${project.slug}`)}
                  className="mt-2 inline-flex min-h-11 items-center text-xs font-bold text-accent underline underline-offset-4"
                >
                  {project.title}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-5 border border-edge bg-bg sm:max-w-md">
        <GitHubCell stats={stats} t={t} />
      </div>
    </div>
  );
}

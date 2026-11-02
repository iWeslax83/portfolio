import { useLocale, useTranslations } from "next-intl";
import { localizedPath } from "@/lib/locale-path";
import type { Locale } from "@/lib/locales";
import { getProjects } from "@/lib/localize";
import { galleryProjects } from "@/lib/work-gallery";
import WorkStage from "./WorkStage";
import StaticGallery from "./StaticGallery";

/**
 * The reference's Work rhythm: a fixed black stage under a sticky white
 * sheet with a capsule hole that slides over it, then a shared zoom flies
 * into the hole while WORK rows fan out and project cards cross. The scene
 * is decorative motion, so the real links live in a list that is hidden
 * until it takes keyboard focus; the full record is on /projects.
 */
export default function Work() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const projects = getProjects(locale);
  const items = galleryProjects(projects);
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">
        {t("workTitle")}
      </h2>
      <nav
        aria-label={t("listLabel")}
        className="sr-only focus-within:not-sr-only focus-within:block focus-within:border-b focus-within:border-ink focus-within:p-6"
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.1em]">
          {items.map((p) => (
            <li key={p.slug}>
              <a
                href={localizedPath(locale, `/projects/${p.slug}`)}
                className="link-draw"
              >
                {p.title}
              </a>
            </li>
          ))}
          <li>
            <a href={localizedPath(locale, "/projects")} className="link-draw">
              {t("allTitle")} · {t("count", { count: projects.length })}
            </a>
          </li>
        </ul>
      </nav>
      <div className="work-animated">
        <WorkStage items={items} locale={locale} />
      </div>
      <div className="work-static">
        <StaticGallery items={items} locale={locale} />
      </div>
    </section>
  );
}

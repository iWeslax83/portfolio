import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { localizedPath } from "@/lib/locale-path";
import type { Locale } from "@/lib/locales";
import { getProjects } from "@/lib/localize";
import { showcaseProjects } from "@/lib/work-gallery";
export default function Work() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const projects = getProjects(locale);
  const items = showcaseProjects(projects);
  return (
    <section id="work" aria-labelledby="work-title" className="border-y border-edge bg-panel">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-10 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <h2 id="work-title" className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t("workTitle")}
            </h2>
            <p className="mt-3 max-w-[60ch] text-pretty text-sm leading-relaxed text-ink-3">
              {t("workIntro")}
            </p>
          </div>
          <a
            href={localizedPath(locale, "/projects")}
            className="inline-flex min-h-11 items-center text-sm font-bold text-accent underline decoration-edge underline-offset-4 hover:decoration-accent"
          >
            {t("allTitle")} · {t("count", { count: projects.length })}
          </a>
        </div>
        <ul className="mt-6 grid gap-5 md:grid-cols-3 sm:mt-8">
          {items.map(({ project, summaryKey, tag }, index) => (
            <li key={project.slug}>
              <article className="flex h-full flex-col border border-edge bg-bg">
                <div className="relative aspect-[16/10] border-b border-edge bg-deep">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 1200px) 360px, (min-width: 768px) 30vw, 92vw"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    {String(index + 1).padStart(2, "0")} / {t(`tags.${tag}`)}
                  </p>
                  <h3 className="mt-2 text-balance text-lg font-bold leading-snug text-ink">{project.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-3">
                    {t(`showcase.${summaryKey}`)}
                  </p>
                  <ul aria-label={t("technologies")} className="mt-4 mb-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-3">
                    {project.techPills.slice(0, 3).map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                  <a
                    href={localizedPath(locale, `/projects/${project.slug}`)}
                    className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-accent underline decoration-edge underline-offset-4 hover:decoration-accent"
                  >
                    {t("viewProject")}<span className="sr-only">: {project.title}</span><span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Image from "next/image";
import type { Messages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import type { Project } from "@/lib/types";
import type { RepoStats } from "@/lib/github-repo-stats";
import StatusTag, { type StatusLabels } from "@/components/ui/status-tag";
import ProjectLinks from "@/components/sections/work/ProjectLinks";
import { SECTION_BAR } from "@/components/sections/section-bar";
import { localizedPath } from "@/lib/locale-path";
import { formatDay } from "@/lib/format-date";
import { projectDescriptionParts } from "@/lib/project-nav";

function NavCell({
  project,
  label,
  locale,
  align,
}: {
  project: Project;
  label: string;
  locale: Locale;
  align: "start" | "end";
}) {
  return (
    <a
      href={localizedPath(locale, `/projects/${project.slug}`)}
      className={`group block px-4 py-8 transition-colors duration-300 hover:bg-ink hover:text-bg sm:px-10 ${
        align === "end" ? "border-l border-edge text-right" : ""
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 group-hover:text-bg">
        {align === "start" ? `← ${label}` : `${label} →`}
      </span>
      <span className="mt-2 block text-balance font-mono text-base font-bold leading-[1.3] sm:text-lg">
        {project.title}
      </span>
    </a>
  );
}

/** One project's full record: meta, copy, stack, links, image and stats. */
export default function ProjectDetail({
  project,
  index,
  prev,
  next,
  stats,
  t,
  projectsT,
  statusLabels,
  locale,
}: {
  project: Project;
  /** Position in catalogue order, from 1. */
  index: number;
  prev: Project | null;
  next: Project | null;
  stats: RepoStats | null;
  t: Messages["project"];
  projectsT: Messages["projects"];
  statusLabels: StatusLabels;
  locale: Locale;
}) {
  const tag =
    (projectsT.tags as Record<string, string>)[project.tag] ?? project.tag;
  const { summary, implementation } = projectDescriptionParts(project.description);
  const role = project.slug === "otonom-iha" ? t.flightRole : undefined;
  return (
    <article>
      <p className="border-b border-edge px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] sm:px-10">
        <a href={localizedPath(locale, "/projects")} className="link-draw">
          <span aria-hidden>← </span>
          {t.back}
        </a>
      </p>
      <h1 className="break-words border-b border-edge px-4 py-10 text-center font-mono text-[clamp(1.6rem,5vw,3.75rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-balance sm:px-10">
        {project.title}
      </h1>
      <div className="grid grid-cols-3 gap-px border-b border-edge bg-edge">
        <p className="bg-bg px-4 py-3 font-mono text-xs tabular-nums text-ink-2 sm:px-10">
          {String(index).padStart(2, "0")}
        </p>
        <p className="bg-bg px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 sm:px-10">
          {tag}
        </p>
        <p className="bg-bg px-4 py-3 sm:px-10">
          <StatusTag status={project.status} labels={statusLabels} />
        </p>
      </div>
      <h2 className={SECTION_BAR}>{t.summary}</h2>
      <div className="mx-auto max-w-[1100px] space-y-8 px-4 py-8 sm:px-10 sm:py-12">
        <p className="max-w-[62ch] text-pretty font-mono text-base leading-relaxed">{summary}</p>
        {role && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent">{t.role}</h2>
            <p className="mt-2 text-base text-ink">{role}</p>
          </section>
        )}
        {implementation && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent">{t.implementation}</h2>
            <p className="mt-2 max-w-[62ch] text-pretty text-base leading-relaxed">{implementation}</p>
          </section>
        )}
        {project.techPills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-accent">{t.stack}</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs">
              {project.techPills.map((tech) => <li key={tech} className="border border-edge px-2 py-1">{tech}</li>)}
            </ul>
          </section>
        )}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent">{t.evidence}</h2>
          <p className="mt-2 text-sm text-ink-3">{project.tagDetail}</p>
          <ProjectLinks links={project.links} />
          {project.image && (
            <div className="mt-5 border border-edge bg-panel">
              <Image
                src={project.image}
                alt={project.image.endsWith(".svg") ? "" : projectsT.screenshotAlt.replace("{title}", project.title)}
                width={1440}
                height={900}
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="h-auto w-full"
              />
            </div>
          )}
          {stats && (
            <p className="mt-4 font-mono text-[11px] text-ink-2">
              {stats.commitCount} {projectsT.commits} · {projectsT.lastCommit}{" "}
              {formatDay(stats.lastCommitDate, locale)}
            </p>
          )}
        </section>
      </div>
      {prev && next && (
        <nav
          aria-label={t.navLabel}
          className="grid grid-cols-2 border-t border-edge"
        >
          <NavCell
            project={prev}
            label={t.previous}
            locale={locale}
            align="start"
          />
          <NavCell project={next} label={t.next} locale={locale} align="end" />
        </nav>
      )}
    </article>
  );
}

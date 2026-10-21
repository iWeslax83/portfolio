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
        align === "end" ? "border-l border-ink text-right" : ""
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 group-hover:text-bg">
        {align === "start" ? `← ${label}` : `${label} →`}
      </span>
      <span className="mt-2 block text-balance font-serif text-xl leading-[1.2] sm:text-2xl">
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
  return (
    <article>
      <p className="border-b border-ink px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] sm:px-10">
        <a href={localizedPath(locale, "/projects")} className="link-draw">
          <span aria-hidden>← </span>
          {t.back}
        </a>
      </p>
      <h1 className="break-words border-b border-ink px-4 py-10 text-center font-display text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[0.9] text-balance sm:px-10">
        {project.title}
      </h1>
      <div className="grid grid-cols-2 gap-px border-b border-ink bg-ink md:grid-cols-[auto_auto_minmax(0,1fr)_auto]">
        <p className="bg-bg px-4 py-3 font-mono text-xs tabular-nums text-ink-2 sm:px-10">
          {String(index).padStart(2, "0")}
        </p>
        <p className="bg-bg px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 sm:px-10">
          {tag}
        </p>
        <p className="bg-bg px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 sm:px-10">
          {project.tagDetail}
        </p>
        <p className="bg-bg px-4 py-3 sm:px-10">
          <StatusTag status={project.status} labels={statusLabels} />
        </p>
      </div>
      <h2 className={SECTION_BAR}>{t.overview}</h2>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-10">
        <p className="max-w-3xl text-pretty font-serif text-xl leading-[1.5] sm:text-2xl">
          {project.description}
        </p>
        <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2">
          {t.stack}
        </h3>
        <p className="mt-3 font-mono text-xs leading-relaxed">
          {project.techPills.join("  ·  ")}
        </p>
        <ProjectLinks links={project.links} />
        {project.image && (
          <div className="mt-10 border border-ink bg-panel">
            <Image
              src={project.image}
              alt={projectsT.screenshotAlt.replace("{title}", project.title)}
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
      </div>
      {prev && next && (
        <nav
          aria-label={t.navLabel}
          className="grid grid-cols-2 border-t border-ink"
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

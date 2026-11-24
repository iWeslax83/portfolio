"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import type { Messages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import type { Project } from "@/lib/types";
import type { RepoStats } from "@/lib/github-repo-stats";
import StatusTag from "@/components/ui/status-tag";
import CatalogFilter from "@/components/ui/catalog-filter";
import {
  filterFromSearch,
  searchForFilter,
  type CatalogFilterValue,
} from "@/lib/catalog-filter";
import { SECTION_BAR } from "@/components/sections/section-bar";
import { formatDay } from "@/lib/format-date";
import { localizedPath } from "@/lib/locale-path";
import { firstSentence, orderedProjects } from "@/lib/project-nav";
import ProjectLinks from "./ProjectLinks";

/** replaceState fires no event, so the filter buttons notify directly. */
const filterListeners = new Set<() => void>();
function subscribeToFilter(notify: () => void) {
  filterListeners.add(notify);
  window.addEventListener("popstate", notify);
  return () => {
    filterListeners.delete(notify);
    window.removeEventListener("popstate", notify);
  };
}

export default function WorkCatalogue({
  projects,
  repoStats,
  title,
  t,
  status,
  locale,
}: {
  /** Every project, already in the page's language. */
  projects: Project[];
  repoStats: Record<string, RepoStats | null>;
  /** Heading, counted and worded on the server. */
  title: string;
  t: Messages["projects"];
  status: Messages["status"];
  locale: Locale;
}) {
  // The filter lives in the URL (?status=shipped), so a filtered list can
  // be shared. The page is static, so the server snapshot is always ALL.
  const filter = useSyncExternalStore(
    subscribeToFilter,
    () => filterFromSearch(window.location.search),
    () => "ALL" as const,
  );
  const statusLabels = {
    SHIPPED: status.shipped,
    IN_PROGRESS: status.inProgress,
    ARCHIVED: status.archived,
  };
  const ordered = orderedProjects(projects);
  const flagship = ordered[0];
  const shown = ordered.filter((p) => filter === "ALL" || p.status === filter);
  const choose = (next: CatalogFilterValue) => {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(
      window.history.state,
      "",
      `${pathname}${searchForFilter(search, next)}${hash}`,
    );
    filterListeners.forEach((notify) => notify());
  };

  return (
    <section aria-labelledby="catalogue-title" className="border-t border-edge bg-bg">
      <h2 id="catalogue-title" className={SECTION_BAR}>{title}</h2>
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-10 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CatalogFilter
            value={filter}
            onChange={choose}
            labels={{ ALL: status.all, ...statusLabels }}
          />
          <p role="status" className="text-sm text-ink-3">
            {t.results.replace("{count}", String(shown.length))}
          </p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {shown.map((project, i) => {
            const isFlagship = project.slug === flagship?.slug;
            const detail = localizedPath(locale, `/projects/${project.slug}`);
            const stats = project.repo ? repoStats[project.repo] : null;
            const tags = project.techPills.slice(0, 3);
            const tag = (t.tags as Record<string, string>)[project.tag] ?? project.tag;
            return (
              <article
                key={project.slug}
                className={`grid border bg-panel ${
                  isFlagship
                    ? "border-accent md:col-span-2 md:grid-cols-2"
                    : "grid-rows-[auto_1fr] border-edge"
                }`}
              >
                <div className={`relative grid aspect-[16/10] place-items-center overflow-hidden border-b border-edge bg-deep ${
                  isFlagship ? "md:aspect-auto md:border-b-0 md:border-r" : ""
                }`}>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.image.endsWith(".svg") ? "" : t.screenshotAlt.replace("{title}", project.title)}
                      fill
                      sizes="(min-width: 1200px) 560px, (min-width: 768px) 46vw, 92vw"
                      className="object-contain"
                    />
                  ) : (
                    <p aria-hidden className="px-4 text-center text-sm font-bold uppercase tracking-wider text-ink-3">
                      {tag} / {tags.join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col p-4 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                    <span className="text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs uppercase tracking-wider text-ink-3">{tag}</span>
                    <StatusTag status={project.status} labels={statusLabels} />
                  </div>
                  <h3 className="text-balance text-xl font-bold leading-snug text-ink">{project.title}</h3>
                  <p className="mt-2 text-sm font-bold text-accent">{project.tagDetail}</p>
                  <p className="mt-3 max-w-[60ch] text-pretty text-sm leading-relaxed text-ink-3">
                    {firstSentence(project.description)}
                  </p>
                  {tags.length > 0 && (
                    <ul aria-label={t.technologies} className="mt-4 flex flex-wrap gap-2 text-xs text-ink-3">
                      {tags.map((tech) => <li key={tech} className="border border-edge px-2 py-1">{tech}</li>)}
                    </ul>
                  )}
                  {stats && (
                    <p className="mt-4 text-xs text-ink-3">
                      {stats.commitCount} {t.commits} · {t.lastCommit}{" "}
                      {formatDay(stats.lastCommitDate, locale)}
                    </p>
                  )}
                  <div className="mt-auto pt-4">
                    <a href={detail} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent underline underline-offset-4">
                      {t.viewProject}<span className="sr-only">: {project.title}</span><span aria-hidden>→</span>
                    </a>
                    <ProjectLinks links={project.links} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

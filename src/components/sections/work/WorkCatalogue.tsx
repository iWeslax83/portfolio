"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Messages } from "@/lib/messages";
import type { Project } from "@/lib/types";
import type { RepoStats } from "@/lib/github-repo-stats";
import StatusTag from "@/components/ui/status-tag";
import CatalogFilter from "@/components/ui/catalog-filter";
import {
  filterFromSearch,
  searchForFilter,
  type CatalogFilterValue,
} from "@/lib/catalog-filter";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { revealOnce } from "@/lib/reveal";
import { formatDay } from "@/lib/format-date";

function Links({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <a
            key={link.label}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`link-draw inline-flex items-center gap-1 font-mono text-xs ${
              link.isPrimary ? "text-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            {link.label}
            <ArrowUpRight size={12} aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

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

/** The full, accessible project list. Every project, every link. */
export default function WorkCatalogue({
  projects,
  repoStats,
  title,
  t,
  status,
}: {
  /** Every project, already in the page's language. */
  projects: Project[];
  repoStats: Record<string, RepoStats | null>;
  /** Heading, counted and worded on the server. */
  title: string;
  t: Messages["projects"];
  status: Messages["status"];
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
  const [flagship] = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
  const ordered = [
    flagship,
    ...projects
      .filter((p) => p.slug !== flagship.slug)
      .sort((a, b) => a.order - b.order),
  ];
  const shown = ordered.filter((p) => filter === "ALL" || p.status === filter);
  const scope = useRef<HTMLElement>(null);

  // The black title bar wipes in, then articles reveal in batches as they
  // arrive. Only transforms and opacity move, so nothing shifts layout.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const bar = q("[data-reveal='bar']")[0];
        const barTl = gsap
          .timeline({ paused: true })
          .fromTo(
            bar,
            { scaleX: 0, transformOrigin: "0% 50%" },
            { scaleX: 1, duration: 1.1, ease: EASE.enter },
          );
        revealOnce(bar, () => barTl.play(), "top 95%");

        const articles = q("article");
        const shown = new WeakSet<Element>();
        const show = (els: Element[]) => {
          const fresh = els.filter((el) => !shown.has(el));
          if (!fresh.length) return;
          fresh.forEach((el) => shown.add(el));
          gsap.to(fresh, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: EASE.enter,
            stagger: 0.08,
            overwrite: true,
          });
        };
        gsap.set(articles, { y: 30, opacity: 0 });
        const triggers = ScrollTrigger.batch(articles, {
          start: "top 90%",
          once: true,
          onEnter: (els) => show(els),
        });
        // A refresh (load with restored scroll, filter change, resize) fires
        // no callbacks, so reveal anything already at or past its start.
        const onRefresh = () =>
          show(
            triggers
              .filter((st) => st.progress > 0)
              .map((st) => st.trigger)
              .filter((el): el is Element => !!el),
          );
        ScrollTrigger.addEventListener("refresh", onRefresh);
        onRefresh();
        return () => ScrollTrigger.removeEventListener("refresh", onRefresh);
      });
      return () => mm.revert();
    },
    { scope },
  );

  const choose = (next: CatalogFilterValue) => {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(
      window.history.state,
      "",
      `${pathname}${searchForFilter(search, next)}${hash}`,
    );
    filterListeners.forEach((notify) => notify());
  };

  // Filtering reflows the list: re-measure every trigger below it.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <section
      ref={scope}
      aria-labelledby="catalogue-title"
      className="border-t border-ink bg-bg"
    >
      <h2 id="catalogue-title" data-reveal="bar" className={SECTION_BAR}>
        {title}
      </h2>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-10">
        <CatalogFilter
          value={filter}
          onChange={choose}
          labels={{ ALL: status.all, ...statusLabels }}
        />
        <div className="mt-8">
          {shown.map((project, i) => (
            <article
              key={project.slug}
              className={`grid py-8 ${
                project.slug === flagship.slug
                  ? "border-2 border-ink px-6 md:px-8"
                  : "border-t border-ink"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="font-mono text-xs tabular-nums text-ink-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2">
                  {project.tag}
                </span>
                <StatusTag status={project.status} labels={statusLabels} />
              </div>
              <h3 className="text-balance font-serif text-3xl leading-[1.1] text-ink">
                {project.title}
              </h3>
              <p className="mt-3 max-w-2xl text-pretty font-serif text-lg leading-[1.5] text-ink-2">
                {project.description}
              </p>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-2">
                {project.techPills.join("  ·  ")}
              </p>
              <Links links={project.links} />
              {project.image && (
                <div className="relative mt-5 flex min-h-[160px] max-w-[280px] items-center justify-center overflow-hidden border border-ink bg-panel p-6">
                  <Image
                    src={project.image}
                    alt={t.screenshotAlt.replace("{title}", project.title)}
                    width={280}
                    height={175}
                    className="aspect-[16/10] h-auto w-full object-contain"
                  />
                </div>
              )}
              {project.repo && repoStats[project.repo] && (
                <p className="mt-4 font-mono text-[11px] text-ink-2">
                  {repoStats[project.repo]!.commitCount} {t.commits} ·{" "}
                  {t.lastCommit}{" "}
                  {formatDay(repoStats[project.repo]!.lastCommitDate)}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

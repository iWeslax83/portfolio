"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import type { Project } from "@/lib/types";
import type { RepoStats } from "@/lib/github-repo-stats";
import StatusTag from "@/components/ui/status-tag";
import CatalogFilter, { type CatalogFilterValue } from "@/components/ui/catalog-filter";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";

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

/** The full, accessible project list. Every project, every link. */
export default function WorkCatalogue({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");
  const [flagship] = featuredProjects;
  const ordered = [
    flagship,
    ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order),
  ];
  const shown = ordered.filter((p) => filter === "ALL" || p.status === filter);

  return (
    <div className="border-t border-ink">
      <h3 className={SECTION_BAR}>
        {t("allTitle")} · {t("count", { count: projects.length })}
      </h3>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-10">
        <CatalogFilter value={filter} onChange={setFilter} />
        <div className="mt-8">
          {shown.map((project, i) => (
            <article
              key={project.slug}
              className={`grid py-8 ${
                project.slug === flagship.slug ? "border-2 border-ink px-6 md:px-8" : "border-t border-ink"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="font-mono text-xs tabular-nums text-ink-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2">
                  {project.tag}
                </span>
                <StatusTag status={project.status} />
              </div>
              <h4 className="font-serif text-3xl leading-[1.1] text-ink">{project.title}</h4>
              <p className="mt-3 max-w-2xl font-serif text-lg leading-[1.5] text-ink-2">
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
                    alt={`${project.title} screenshot`}
                    width={280}
                    height={200}
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}
              {project.repo && repoStats[project.repo] && (
                <p className="mt-4 font-mono text-[11px] text-ink-2">
                  {repoStats[project.repo]!.commitCount} commits · last commit{" "}
                  {repoStats[project.repo]!.lastCommitDate}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

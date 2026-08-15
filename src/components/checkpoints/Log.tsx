"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import { RepoStats } from "@/lib/github-repo-stats";
import SectionHeader from "@/components/ui/section-header";
import CatalogFilter, { CatalogFilterValue } from "@/components/ui/catalog-filter";
import CheckpointShell from "./CheckpointShell";

const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

function StatusTag({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3">
      <span
        className={`h-1.5 w-1.5 ${
          status === "SHIPPED" ? "bg-accent" : status === "IN_PROGRESS" ? "bg-accent-2" : "bg-ink-3"
        }`}
        aria-hidden
      />
      {statusLabel[status]}
    </span>
  );
}

function Links({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`link-draw inline-flex items-center gap-1 font-mono text-xs transition-colors ${
            link.isPrimary ? "text-accent hover:text-accent/80" : "text-ink-2 hover:text-ink"
          }`}
        >
          {link.label}
          <ArrowUpRight size={12} />
        </a>
      ))}
    </div>
  );
}

export default function Log({
  visible,
  mode,
  repoStats,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  repoStats: Record<string, RepoStats | null>;
}) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");

  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];
  const visibleProjects = ordered.filter((p) => filter === "ALL" || p.status === filter);
  /* Scene-mode panels can no longer scroll internally (see CheckpointShell -
     overflow-hidden so the page scroll drives the camera instead of being
     trapped by an inner scroll container), so the rendered list is capped to
     what fits within the panel's 85vh. Flat mode has no such constraint and
     keeps the full, unfiltered-by-count list. */
  const displayedProjects = mode === "scene" ? visibleProjects.slice(0, 1) : visibleProjects;

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("count", { count: projects.length })} />
        <div className="mt-6 mb-6">
          <CatalogFilter value={filter} onChange={setFilter} />
        </div>
        <div>
          {displayedProjects.map((project, i) => {
            const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
            return (
              <article key={project.slug} className="relative grid gap-x-8 border-t border-rule py-8">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-3">
                  <span className="font-display text-3xl font-semibold text-ink-3 leading-none tabular-nums">
                    #{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="annotate">{project.tag}</span>
                  <StatusTag status={project.status} />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-medium text-ink leading-tight tracking-[-0.01em]">
                    {project.title}
                  </h3>
                  {primary && (
                    <a
                      href={primary.href}
                      target={primary.href.startsWith("http") ? "_blank" : undefined}
                      rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={`${project.title} - ${primary.label}`}
                      className="mt-1 shrink-0 text-ink-3 hover:text-accent transition-colors"
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                </div>
                <p className="font-body text-sm text-ink-2 mt-2.5 leading-relaxed max-w-2xl">{project.description}</p>
                {mode === "flat" && (
                  <p className="font-mono text-[11px] text-ink-3 mt-4 leading-relaxed">{project.techPills.join("  ·  ")}</p>
                )}
                <Links links={project.links} />
                {project.image && mode === "flat" && (
                  <div className="relative border border-rule overflow-hidden bg-panel/40 min-h-[160px] flex items-center justify-center p-6 mt-5 max-w-[280px]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={280}
                      height={200}
                      className="w-full h-auto object-contain opacity-90"
                    />
                  </div>
                )}
                {mode === "flat" && project.repo && repoStats[project.repo] && (
                  <p className="mt-4 font-mono text-[11px] text-ink-3">
                    {repoStats[project.repo]!.commitCount} commits · last commit {repoStats[project.repo]!.lastCommitDate}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </CheckpointShell>
  );
}

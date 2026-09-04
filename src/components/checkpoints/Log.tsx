"use client";

import { useState, type RefObject } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import { RepoStats } from "@/lib/github-repo-stats";
import { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";
import { useWorkCarouselProgress } from "@/lib/flight-scene/useWorkCarouselProgress";
import SectionHeader from "@/components/ui/section-header";
import CatalogFilter, { CatalogFilterValue } from "@/components/ui/catalog-filter";
import StatusTag from "@/components/ui/status-tag";
import CheckpointShell from "./CheckpointShell";
import WorkIntroBackground from "./work-carousel/WorkIntroBackground";
import ProjectCard from "./work-carousel/ProjectCard";

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
            link.isPrimary ? "text-ink font-medium hover:text-ink-2" : "text-ink-2 hover:text-ink"
          }`}
        >
          {link.label}
          <ArrowUpRight size={12} />
        </a>
      ))}
    </div>
  );
}

function FlatCatalogue({ repoStats }: { repoStats: Record<string, RepoStats | null> }) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");

  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];
  const displayedProjects = ordered.filter((p) => filter === "ALL" || p.status === filter);

  return (
    <div>
      <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("count", { count: projects.length })} />
      <div className="mt-6 mb-6">
        <CatalogFilter value={filter} onChange={setFilter} />
      </div>
      <div>
        {displayedProjects.map((project, i) => {
          const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
          return (
            <article
              key={project.slug}
              className={`relative grid gap-x-8 py-8 ${
                project.slug === flagship.slug ? "border-2 border-ink px-6 md:px-8" : "border-t border-rule"
              }`}
            >
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
                    className="mt-1 shrink-0 text-ink-3 hover:text-ink transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>
              <p className="font-body text-sm text-ink-2 mt-2.5 leading-relaxed max-w-2xl">{project.description}</p>
              <p className="font-mono text-[11px] text-ink-3 mt-4 leading-relaxed">
                {project.techPills.join("  ·  ")}
              </p>
              <Links links={project.links} />
              {project.image && (
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
              {project.repo && repoStats[project.repo] && (
                <p className="mt-4 font-mono text-[11px] text-ink-3">
                  {repoStats[project.repo]!.commitCount} commits · last commit {repoStats[project.repo]!.lastCommitDate}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SceneCarousel({ progressRef }: { progressRef: RefObject<FlightProgressRef> }) {
  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];
  const state = useWorkCarouselProgress(progressRef, ordered.length);

  if (state.stage === "intro" || state.stage === "tile") {
    return <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />;
  }

  if (state.stage === "carousel") {
    // Crossfade + scale, not a slide - at most one card is meaningfully
    // visible at any point in the transition. The outgoing card shrinks
    // and fades in the first half of slideProgress; the incoming card
    // grows and fades in over the second half. No side-by-side overlap.
    const outgoingOpacity = Math.max(0, 1 - state.slideProgress * 2.2);
    const outgoingScale = 1 - state.slideProgress * 0.08;
    const incomingOpacity = Math.max(0, state.slideProgress * 2.2 - 1);
    const incomingScale = 0.94 + Math.min(1, state.slideProgress * 1.2) * 0.06;

    return (
      <div className="relative h-full w-full">
        <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
        {outgoingOpacity > 0 && (
          <ProjectCard
            project={ordered[state.activeIndex]}
            index={state.activeIndex}
            total={ordered.length}
            translateX={0}
            scale={outgoingScale}
            opacity={outgoingOpacity}
          />
        )}
        {incomingOpacity > 0 && state.activeIndex < ordered.length - 1 && (
          <ProjectCard
            project={ordered[state.activeIndex + 1]}
            index={state.activeIndex + 1}
            total={ordered.length}
            translateX={0}
            scale={incomingScale}
            opacity={incomingOpacity}
          />
        )}
      </div>
    );
  }

  const lastIndex = ordered.length - 1;
  return (
    <div className="relative h-full w-full">
      <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
      <ProjectCard
        project={ordered[lastIndex]}
        index={lastIndex}
        total={ordered.length}
        translateX={0}
        scale={1 + state.stageProgress * 4}
        opacity={Math.max(0, 1 - Math.max(0, state.stageProgress - 0.6) / 0.4)}
      />
    </div>
  );
}

export default function Log({
  visible,
  mode,
  repoStats,
  progressRef,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  repoStats: Record<string, RepoStats | null>;
  progressRef: RefObject<FlightProgressRef>;
}) {
  if (mode === "flat") {
    return (
      <CheckpointShell visible={visible} mode={mode}>
        <FlatCatalogue repoStats={repoStats} />
      </CheckpointShell>
    );
  }

  return (
    <CheckpointShell visible={visible} mode={mode} fullBleed>
      <SceneCarousel progressRef={progressRef} />
    </CheckpointShell>
  );
}

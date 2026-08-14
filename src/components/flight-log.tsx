"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, ArrowLeft, ArrowRightIcon } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import { RepoStats } from "@/lib/github-repo-stats";
import SectionHeader from "./ui/section-header";
import CatalogFilter, { CatalogFilterValue } from "./ui/catalog-filter";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, plateIn, viewportOnce } from "@/lib/motion";

function SpecLine({ pills }: { pills: string[] }) {
  return (
    <p className="font-mono text-[11px] text-ink-3 mt-4 leading-relaxed">
      {pills.join("  ·  ")}
    </p>
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

const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

const statusPillClass: Record<Project["status"], string> = {
  SHIPPED: "bg-accent text-bg",
  IN_PROGRESS: "bg-accent-2 text-bg",
  ARCHIVED: "border border-rule text-ink-3",
};

function StatusTag({ status }: { status: Project["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] ${statusPillClass[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

/* One flight card - full-viewport on desktop (horizontal hijack), a plain
   row on mobile. `index`/`total` are 1-based across the whole set,
   flagship included. */
function FlightCard({
  project,
  index,
  total,
  stats,
  flagship,
}: {
  project: Project;
  index: number;
  total: number;
  stats: RepoStats | null;
  flagship: boolean;
}) {
  return (
    <article
      className={`flight-card shrink-0 w-full md:w-screen h-full flex items-center px-6 md:px-14 ${
        flagship ? "gradient-border" : "border-t md:border-t-0 border-rule"
      }`}
    >
      <div className="max-w-[1320px] mx-auto w-full grid lg:grid-cols-[1fr_0.92fr] gap-10 items-center">
        <div>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-5xl md:text-6xl font-semibold text-accent leading-none tabular-nums">
              {String(index).padStart(2, "0")}
            </span>
            <span className="annotate text-ink-3">/ {String(total).padStart(2, "0")}</span>
            <StatusTag status={project.status} />
          </div>
          <p className="annotate mt-4">{project.tag}</p>
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink mt-5 leading-[1.05] tracking-[-0.02em]">
            {project.title}
          </h3>
          <p className="font-body text-sm md:text-base text-ink-2 mt-4 leading-relaxed max-w-md">
            {project.description}
          </p>
          <SpecLine pills={project.techPills} />
          <Links links={project.links} />
          {stats && (
            <p className="mt-4 font-mono text-[11px] text-ink-3">
              {stats.commitCount} commits · last commit {stats.lastCommitDate}
            </p>
          )}
        </div>

        {project.image && (
          <div className="relative border border-rule overflow-hidden bg-panel/40 min-h-[220px] flex items-center justify-center p-10">
            <Image
              src={project.image}
              alt={project.title}
              width={320}
              height={240}
              className="w-full h-auto max-w-[280px] object-contain opacity-90"
            />
          </div>
        )}
      </div>
    </article>
  );
}

/* Mobile fallback: the old vertical numbered-row catalogue, unchanged
   in shape from the pre-redesign `projects.tsx`. */
function VerticalCatalogue({
  ordered,
  repoStats,
  filter,
  onFilterChange,
}: {
  ordered: Project[];
  repoStats: Record<string, RepoStats | null>;
  filter: CatalogFilterValue;
  onFilterChange: (v: CatalogFilterValue) => void;
}) {
  const visible = ordered.filter((p) => filter === "ALL" || p.status === filter);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mt-6 mb-6">
        <CatalogFilter value={filter} onChange={onFilterChange} />
      </div>
      <div>
        {visible.map((project, i) => {
          const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
          return (
            <motion.article
              key={project.slug}
              variants={plateIn}
              className="row-sweep group relative grid gap-x-8 border-t border-rule py-8 transition-colors"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-3">
                <span className="font-display text-3xl font-semibold text-ink-3 leading-none tabular-nums transition-colors group-hover:text-accent">
                  #{String(i + 1).padStart(3, "0")}
                </span>
                <span className="annotate">{project.tag}</span>
                <StatusTag status={project.status} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-medium text-ink leading-tight tracking-[-0.01em] transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                {primary && (
                  <a
                    href={primary.href}
                    target={primary.href.startsWith("http") ? "_blank" : undefined}
                    rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={`${project.title} - ${primary.label}`}
                    className="mt-1 shrink-0 text-ink-3 transition-colors group-hover:text-accent"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>
              <p className="font-body text-sm text-ink-2 mt-2.5 leading-relaxed max-w-2xl">
                {project.description}
              </p>
              <SpecLine pills={project.techPills} />
              <Links links={project.links} />
              {project.repo && repoStats[project.repo] && (
                <p className="mt-4 font-mono text-[11px] text-ink-3">
                  {repoStats[project.repo]!.commitCount} commits · last commit{" "}
                  {repoStats[project.repo]!.lastCommitDate}
                </p>
              )}
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function FlightLog({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
  const t = useTranslations("projects");
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");

  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      if (reduced || mobile) return;
      if (!sectionRef.current || !trackRef.current) return;

      const ctx = gsap.context(() => {
        const cards = trackRef.current!.children.length;
        const distance = (cards - 1) * window.innerWidth;

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            gsap.set(trackRef.current, { x: -self.progress * distance });
            setCurrent(Math.round(self.progress * (cards - 1)));
          },
        });

        const onResize = () => ScrollTrigger.refresh();
        let resizeTimer: ReturnType<typeof setTimeout>;
        const debouncedResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(onResize, 200);
        };
        window.addEventListener("resize", debouncedResize);

        return () => {
          window.removeEventListener("resize", debouncedResize);
          trigger.kill();
        };
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile, ordered.length] }
  );

  const jump = (delta: number) => {
    const trigger = ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
    if (!trigger) return;
    const cards = ordered.length;
    const nextIndex = Math.min(cards - 1, Math.max(0, current + delta));
    const targetProgress = nextIndex / (cards - 1);
    const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  useEffect(() => {
    if (reduced || mobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") jump(-1);
      if (e.key === "ArrowRight") jump(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, mobile, current]);

  return (
    <section
      ref={sectionRef}
      id="flight-log"
      className="relative overflow-hidden"
      aria-label={t("title")}
    >
      {mobile || reduced ? (
        <div className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
          <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("count", { count: projects.length })} />
          <VerticalCatalogue
            ordered={ordered}
            repoStats={repoStats}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      ) : (
        <div className="min-h-[100dvh] flex flex-col justify-center">
          <div className="px-6 md:px-14 max-w-[1320px] mx-auto w-full flex items-center justify-between mb-6">
            <span className="font-mono text-xs text-ink-3">
              {String(current + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => jump(-1)}
                aria-label="Previous project"
                className="border border-rule p-2 text-ink-3 hover:text-accent hover:border-rule-strong transition-colors"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => jump(1)}
                aria-label="Next project"
                className="border border-rule p-2 text-ink-3 hover:text-accent hover:border-rule-strong transition-colors"
              >
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
          <div className="h-px bg-rule mx-6 md:mx-14 mb-4 relative overflow-hidden">
            <div
              className="h-full bg-accent origin-left transition-transform duration-200"
              style={{ transform: `scaleX(${(current + 1) / ordered.length})` }}
            />
          </div>
          <div ref={trackRef} className="flex h-[70vh]">
            {ordered.map((project, i) => (
              <FlightCard
                key={project.slug}
                project={project}
                index={i + 1}
                total={ordered.length}
                stats={project.repo ? repoStats[project.repo] ?? null : null}
                flagship={i === 0}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

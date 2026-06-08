"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects, secondaryProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import FigureMarker from "./ui/figure-marker";
import {
  staggerContainer,
  staggerFast,
  plateIn,
  fadeRise,
  ruleDraw,
  viewportOnce,
} from "@/lib/motion";

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

/* The flagship plate - bordered figure with a parallax technical drawing */
function Flagship({ project, role }: { project: Project; role: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  return (
    <motion.article
      variants={plateIn}
      className="relative border border-rule grid lg:grid-cols-[1fr_0.92fr]"
    >
      <span className="reg-mark reg-tr" aria-hidden />
      <span className="reg-mark reg-bl" aria-hidden />

      <div className="p-8 md:p-10 lg:p-12">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-5xl md:text-6xl font-semibold text-accent leading-none tabular-nums">
            01
          </span>
          <span className="annotate text-accent">{project.tag}</span>
        </div>
        <p className="annotate mt-4">{project.tagDetail}</p>

        <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink mt-5 leading-[1.05] tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="font-body text-sm md:text-base text-ink-2 mt-4 leading-relaxed max-w-md">
          {project.description}
        </p>
        <SpecLine pills={project.techPills} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5">
          <Links links={project.links} />
          <span className="font-mono text-[11px] text-ink-3">{role}</span>
        </div>
      </div>

      {project.image && (
        <figure
          ref={ref}
          className="relative border-t lg:border-t-0 lg:border-l border-rule overflow-hidden bg-panel/40 min-h-[260px]"
        >
          <motion.div style={{ y: imgY }} className="absolute inset-0 flex items-center justify-center p-10">
            <Image
              src={project.image}
              alt={project.title}
              width={320}
              height={240}
              className="w-full h-auto max-w-[280px] object-contain opacity-90"
            />
          </motion.div>
          <figcaption className="absolute bottom-4 left-5 annotate">
            Fig. 02a · UAV airframe
          </figcaption>
        </figure>
      )}
    </motion.article>
  );
}

/* Catalogue row - a project as an indexed figure line */
function WorkRow({ project, index }: { project: Project; index: number }) {
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
  return (
    <motion.article
      variants={plateIn}
      className="group grid md:grid-cols-[4.5rem_1fr] gap-x-6 border-t border-rule py-8 transition-colors"
    >
      <div className="flex md:flex-col items-baseline md:items-start gap-3">
        <span className="font-display text-3xl md:text-4xl font-semibold text-ink-3 leading-none tabular-nums transition-colors group-hover:text-accent">
          {String(index).padStart(2, "0")}
        </span>
        <span className="annotate md:mt-3">{project.tag}</span>
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl md:text-[1.75rem] font-medium text-ink leading-tight tracking-[-0.01em] transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {primary && (
            <a
              href={primary.href}
              target={primary.href.startsWith("http") ? "_blank" : undefined}
              rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={`${project.title} - ${primary.label}`}
              className="mt-1 shrink-0 text-ink-3 transition-all duration-300 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const t = useTranslations("projects");
  const [flagship, ...rest] = featuredProjects;

  return (
    <section id="projects" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <FigureMarker code="FIG. 02" title={t("title")} annotation={t("count")} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <Flagship project={flagship} role={t("role")} />
        <div className="mt-2">
          {rest.map((project, i) => (
            <WorkRow key={project.slug} project={project} index={i + 2} />
          ))}
        </div>
      </motion.div>

      {/* Secondary index */}
      <motion.div
        className="mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerFast}
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.span variants={fadeRise} className="annotate">
            {t("alsoLabel")}
          </motion.span>
          <motion.span variants={ruleDraw} className="h-px flex-1 origin-left bg-rule" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          {secondaryProjects.map((project) => {
            const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
            const inner = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-base font-medium text-ink-2 leading-snug transition-colors group-hover:text-ink">
                    {project.title}
                  </h4>
                  {primary && (
                    <ArrowUpRight
                      size={14}
                      className="mt-0.5 shrink-0 text-ink-3 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
                    />
                  )}
                </div>
                <p className="font-mono text-[10px] text-ink-3 mt-2">{project.tagDetail}</p>
              </>
            );
            return primary ? (
              <motion.a
                key={project.slug}
                variants={fadeRise}
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-t border-rule pt-4 transition-colors hover:border-rule-strong"
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={project.slug}
                variants={fadeRise}
                className="group block border-t border-rule pt-4"
              >
                {inner}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

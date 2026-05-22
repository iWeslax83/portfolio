"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Star } from "lucide-react";
import { featuredProjects, secondaryProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import SectionMarker from "./ui/section-marker";
import TiltCard from "./ui/tilt-card";
import {
  staggerContainer,
  staggerFast,
  scaleUp,
  flipUp,
  popIn,
  fadeInUp,
  viewportOnce,
} from "@/lib/motion";

function Tag({ tag, detail }: { tag: string; detail: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="font-mono text-[11px] bg-accent-soft text-accent px-2.5 py-0.5 rounded-md">
        {tag}
      </span>
      <span className="font-mono text-[11px] text-text-muted">{detail}</span>
    </div>
  );
}

function Pills({ pills }: { pills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-4">
      {pills.map((p) => (
        <span
          key={p}
          className="font-mono text-[10px] text-text-secondary bg-white/[0.04] border border-card-border px-2 py-0.5 rounded"
        >
          {p}
        </span>
      ))}
    </div>
  );
}

function Links({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex items-center gap-4 mt-5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`link-shimmer inline-flex items-center gap-1 font-mono text-xs transition-colors ${
            link.isPrimary
              ? "text-accent hover:text-accent/80"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {link.label}
          <ArrowUpRight size={13} />
        </a>
      ))}
    </div>
  );
}

function Spotlight({ project, role }: { project: Project; role: string }) {
  return (
    <motion.div
      variants={scaleUp}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-soft to-transparent p-7 md:p-9 mb-5 transition-shadow hover:shadow-[0_24px_70px_-20px_rgba(232,160,92,0.25)]"
    >
      <span className="absolute right-6 top-6 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-bg/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
        <Star size={11} className="fill-accent" /> flagship
      </span>
      <div className="flex flex-col md:flex-row md:items-start gap-7">
        <div className="flex-1">
          <Tag tag={project.tag} detail={project.tagDetail} />
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
            {project.title}
          </h3>
          <p className="font-body text-sm md:text-base text-text-secondary mt-3 leading-relaxed max-w-xl">
            {project.description}
          </p>
          <Pills pills={project.techPills} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5">
            <Links links={project.links} />
            <span className="font-mono text-[11px] text-text-muted">· {role}</span>
          </div>
        </div>
        {project.image && (
          <div className="relative w-full md:w-52 h-36 flex-shrink-0 rounded-xl border border-card-border bg-bg/40 overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 208px, 100vw"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Card({ project }: { project: Project }) {
  return (
    <TiltCard
      variants={flipUp}
      className="group relative h-full overflow-hidden rounded-xl border border-card-border bg-card-bg p-6 transition-colors hover:border-card-border-hover"
    >
      <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100" />
      <Tag tag={project.tag} detail={project.tagDetail} />
      <h3 className="font-display text-lg font-semibold text-text-primary">
        {project.title}
      </h3>
      <p className="font-body text-sm text-text-secondary mt-2 leading-relaxed">
        {project.description}
      </p>
      <Pills pills={project.techPills} />
      <Links links={project.links} />
    </TiltCard>
  );
}

function MiniTile({ project }: { project: Project }) {
  const link = project.links.find((l) => l.isPrimary) ?? project.links[0];
  const className =
    "group block rounded-lg border border-white/[0.05] p-4 transition-colors hover:border-card-border-hover";
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-display text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
          {project.title}
        </h4>
        {link && (
          <ArrowUpRight
            size={13}
            className="flex-shrink-0 text-text-muted opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
          />
        )}
      </div>
      <p className="font-mono text-[11px] text-text-muted mt-1.5">{project.tagDetail}</p>
    </>
  );

  return link ? (
    <motion.a
      variants={popIn}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </motion.a>
  ) : (
    <motion.div variants={popIn} className={className}>
      {content}
    </motion.div>
  );
}

export default function Projects() {
  const t = useTranslations("projects");
  const [spotlight, ...sideFeatured] = featuredProjects;

  return (
    <section id="projects" className="py-24 md:py-32 px-6 md:px-10 max-w-[1320px] mx-auto">
      <SectionMarker command={t("command")} title={t("title")} index="02" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        style={{ perspective: 1200 }}
      >
        <Spotlight project={spotlight} role={t("role")} />
        <div className="grid md:grid-cols-2 gap-5">
          {sideFeatured.map((project) => (
            <Card key={project.slug} project={project} />
          ))}
        </div>
      </motion.div>

      {/* Secondary */}
      <motion.div
        className="mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerFast}
      >
        <motion.p variants={fadeInUp} className="font-mono text-xs text-text-muted mb-4">
          <span className="text-accent">$</span> {t("allCommand")}
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {secondaryProjects.map((project) => (
            <MiniTile key={project.slug} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

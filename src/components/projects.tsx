"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { featuredProjects, secondaryProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import SectionHeader from "./section-header";
import { staggerContainer, fadeInUp } from "@/lib/motion";

function ProjectTag({ tag, detail }: { tag: string; detail: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className="font-mono text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
        {tag}
      </span>
      <span className="font-mono text-xs text-text-muted">{detail}</span>
    </div>
  );
}

function TechPills({ pills }: { pills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {pills.map((pill) => (
        <span
          key={pill}
          className="font-mono text-[10px] text-text-secondary bg-white/[0.04] px-2 py-0.5 rounded"
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

function ProjectLinks({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-4 mt-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`font-mono text-xs ${
            link.isPrimary
              ? "text-accent hover:text-accent/80"
              : "text-text-muted hover:text-text-secondary"
          } transition-colors`}
        >
          {link.label} →
        </a>
      ))}
    </div>
  );
}

function SpotlightCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-accent/[0.04] border border-accent/12 rounded-xl p-7 mb-4"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div className="flex-1">
          <ProjectTag tag={project.tag} detail={project.tagDetail} />
          <h3 className="font-mono text-xl font-semibold text-text-primary">
            {project.title}
          </h3>
          <p className="font-sans text-sm text-text-muted mt-2 leading-relaxed max-w-lg">
            {project.description}
          </p>
          <TechPills pills={project.techPills} />
          <div className="flex items-center gap-4 mt-4">
            <ProjectLinks links={project.links} />
            <span className="font-mono text-xs text-text-muted">
              · Role: Electronics & Software Captain
            </span>
          </div>
        </div>
        {project.image && (
          <div className="w-full md:w-44 h-28 bg-white/[0.03] border border-card-border rounded-lg overflow-hidden flex-shrink-0 relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 176px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-card-bg border border-card-border rounded-xl p-6 hover:border-card-border-hover transition-colors"
    >
      <ProjectTag tag={project.tag} detail={project.tagDetail} />
      <h3 className="font-mono text-lg font-semibold text-text-primary">
        {project.title}
      </h3>
      <p className="font-sans text-xs text-text-muted mt-2 leading-relaxed">
        {project.description}
      </p>
      <TechPills pills={project.techPills} />
      <ProjectLinks links={project.links} />
    </motion.div>
  );
}

function SecondaryCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="border border-white/[0.05] rounded-lg p-4 hover:border-card-border-hover transition-colors"
    >
      <h4 className="font-mono text-sm font-medium text-text-secondary">
        {project.title}
      </h4>
      <p className="font-mono text-xs text-text-muted mt-1">
        {project.tagDetail}
      </p>
    </motion.div>
  );
}

export default function Projects() {
  const t = useTranslations("projects");
  const [spotlight, ...sideFeatured] = featuredProjects;

  return (
    <section id="projects" className="py-20 px-6 md:px-10 max-w-5xl mx-auto">
      <SectionHeader prompt={t("prompt")} title={t("title")} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        <SpotlightCard project={spotlight} />

        <div className="grid md:grid-cols-2 gap-4">
          {sideFeatured.map((project) => (
            <FeaturedCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.div>

      {/* Secondary grid */}
      <motion.div
        className="mt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeInUp}
          className="font-mono text-xs text-text-muted mb-4"
        >
          <span className="text-accent">$</span>{" "}
          {t("allPrompt").replace("$ ", "")}
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {secondaryProjects.map((project) => (
            <SecondaryCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

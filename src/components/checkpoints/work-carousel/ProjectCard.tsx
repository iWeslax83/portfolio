"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/types";
import StatusTag from "@/components/ui/status-tag";

export default function ProjectCard({
  project,
  index,
  total,
  translateX,
  scale = 1,
  opacity = 1,
}: {
  project: Project;
  index: number;
  total: number;
  translateX: number;
  scale?: number;
  opacity?: number;
}) {
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[min(560px,80vw)] border border-rule bg-bg"
      style={{
        opacity,
        transform: `translate(calc(-50% + ${translateX}vw), -50%) scale(${scale})`,
      }}
    >
      <div className="flex items-center gap-1.5 border-b border-rule px-3 py-2">
        <span className="h-2 w-2 bg-rule-strong" aria-hidden />
        <span className="h-2 w-2 bg-rule-strong" aria-hidden />
        <span className="h-2 w-2 bg-rule-strong" aria-hidden />
      </div>

      <div className="relative aspect-[16/10] bg-panel">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 80vw, 560px"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <h3 className="font-display text-xl font-medium text-ink">{project.title}</h3>
            <span className="annotate">{project.tag}</span>
            <StatusTag status={project.status} />
            <p className="font-mono text-[11px] text-ink-3 leading-relaxed">
              {project.techPills.join("  ·  ")}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-rule px-3 py-2">
        <span className="font-mono text-[11px] text-ink-3">{project.title}</span>
        <div className="flex items-center gap-2">
          {primary && (
            <a
              href={primary.href}
              target={primary.href.startsWith("http") ? "_blank" : undefined}
              rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={`${project.title} - ${primary.label}`}
              className="text-ink-3 hover:text-ink transition-colors"
            >
              <ArrowUpRight size={13} />
            </a>
          )}
          <span className="font-mono text-[11px] text-ink tabular-nums">
            #{String(index + 1).padStart(3, "0")}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}

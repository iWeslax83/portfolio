import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

/** A project's outbound links, primary in ink and the rest in gray. */
export default function ProjectLinks({ links }: { links: Project["links"] }) {
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

import type { Project } from "@/lib/types";

const byOrder = (a: Project, b: Project) => a.order - b.order;

/**
 * Catalogue order: the flagship (the first featured project by `order`)
 * leads, then everything else by `order`.
 */
export function orderedProjects(list: Project[]): Project[] {
  const [flagship] = list.filter((p) => p.featured).sort(byOrder);
  const rest = list.filter((p) => p !== flagship).sort(byOrder);
  return flagship ? [flagship, ...rest] : rest;
}

/** The projects either side of `slug` in `list`, wrapping at both ends. */
export function adjacentProjects(
  list: Project[],
  slug: string,
): { prev: Project | null; next: Project | null } {
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1 || list.length < 2) return { prev: null, next: null };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

/** Text up to the first `.`, `!` or `?` that is followed by whitespace. */
export function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?](?=\s)/);
  return (match ? match[0] : text).trim();
}

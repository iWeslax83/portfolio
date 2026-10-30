import type { Project } from "@/lib/types";

const byOrder = (a: Project, b: Project) => a.order - b.order;

/** Slug of the project shown beside the flagship in the catalogue. */
export const FLAGSHIP_COMPANION = "stratos-website";

/**
 * Catalogue order: the flagship (the first featured project by `order`)
 * leads, then its companion, then everything else by `order`.
 */
export function orderedProjects(list: Project[]): Project[] {
  const [flagship] = list.filter((p) => p.featured).sort(byOrder);
  const companion = list.find((p) => p.slug === FLAGSHIP_COMPANION);
  const lead = [flagship, companion].filter((p): p is Project => !!p);
  const rest = list.filter((p) => !lead.includes(p)).sort(byOrder);
  return [...lead, ...rest];
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

/**
 * `text` capped at `max` characters for a meta description. Longer text is
 * cut at the last space that leaves room for a trailing "…", with trailing
 * punctuation dropped; a single word longer than the cap is cut hard.
 */
export function metaDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const room = clean.slice(0, max - 1);
  // A word that ends right at the cut stays whole.
  const space = clean[max - 1] === " " ? room.length : room.lastIndexOf(" ");
  const cut = space > 0 ? room.slice(0, space) : room;
  return `${cut.replace(/[\s,;:.!?-]+$/, "")}…`;
}

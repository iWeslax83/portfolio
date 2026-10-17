import type { Project } from "@/lib/types";

/** Projects with a real screenshot, in catalogue order. */
export function galleryProjects(all: Project[]): Project[] {
  return all
    .filter((p) => p.image?.startsWith("/images/projects/"))
    .sort((a, b) => a.order - b.order);
}

/** How far right of center (vw) the first card starts and the last ends left. */
const EDGE_VW = 60;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Horizontal offset from viewport center, in vw, for card `index` of
 * `count` at scroll `progress` (0..1, clamped). Cards keep `spacingVw`
 * between them and the whole row travels right to left.
 */
export function cardX(
  index: number,
  count: number,
  progress: number,
  spacingVw = 34,
): number {
  const p = Math.min(1, Math.max(0, progress));
  const travel = EDGE_VW * 2 + (count - 1) * spacingVw;
  return r2(EDGE_VW + index * spacingVw - p * travel);
}

const Y_OFFSETS_VH = [-12, 9, -3];

/** Vertical offset (vh) so cards sit at staggered heights. */
export function cardY(index: number): number {
  return Y_OFFSETS_VH[index % Y_OFFSETS_VH.length];
}

/** Per-letter rotation (deg, within +-6) for the swaying WORK letters. */
export function letterSway(index: number, progress: number): number {
  return r2(Math.sin(index * 0.9 + progress * Math.PI * 2) * 6);
}

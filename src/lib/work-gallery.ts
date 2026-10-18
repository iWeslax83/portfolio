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

/**
 * Local 0..1 progress of the gallery's exit, which runs over the last part
 * of the pinned stage (from `start` to 1). 0 before the exit begins.
 */
export function exitPhase(progress: number, start = 0.9): number {
  const p = (progress - start) / (1 - start);
  return Math.min(1, Math.max(0, p));
}

/**
 * Progress at which the gallery exit should begin when the content after
 * it is pulled up by `overlapVh` over a `wrapperVh` tall pinned wrapper
 * (which pins for wrapperVh - 100). That is the moment the overlapping
 * content first enters the viewport, so the stage fades while it rises.
 */
export function exitStartFor(overlapVh: number, wrapperVh: number): number {
  const pinned = wrapperVh - 100;
  if (pinned <= 0) return 0;
  return Math.min(1, Math.max(0, 1 - overlapVh / pinned));
}

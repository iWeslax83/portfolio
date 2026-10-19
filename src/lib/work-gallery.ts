import type { Project } from "@/lib/types";

/** Projects with a real screenshot, in catalogue order. */
export function galleryProjects(all: Project[]): Project[] {
  return all
    .filter((p) => p.image?.startsWith("/images/projects/"))
    .sort((a, b) => a.order - b.order);
}

/** How far right of center (vw) the first card starts and the last ends left. */
const EDGE_VW = 75;
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

const Y_OFFSETS_VH = [-16, 14, -4];

/** Vertical offset (vh) so cards sit at staggered heights. */
export function cardY(index: number): number {
  return Y_OFFSETS_VH[index % Y_OFFSETS_VH.length];
}

/** Per-letter rotation (deg, within +-6) for the swaying WORK letters. */
export function letterSway(index: number, progress: number): number {
  return r2(Math.sin(index * 0.9 + progress * Math.PI * 2) * 6);
}

/**
 * Local 0..1 progress of the gallery's exit, which runs from `start` to
 * `end` (default 1, the end of the pinned stage). 0 before `start`, 1 from
 * `end` on. An `end` at or before `start` is a hard cut at `start`.
 */
export function exitPhase(progress: number, start = 0.9, end = 1): number {
  if (end <= start) return progress >= start ? 1 : 0;
  const p = (progress - start) / (end - start);
  return Math.min(1, Math.max(0, p));
}

/** Share of the pinned scroll the letters take to open out (and to pack). */
const SPREAD_EDGE = 0.12;
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * How far the letter rows have opened (0 = packed into a tight block at the
 * centre, 1 = spread across the stage) at gallery `progress`. They open at
 * the start and pack again at the end, like the reference's entry and exit.
 */
export function rowSpread(progress: number, edge = SPREAD_EDGE): number {
  if (progress <= 0 || progress >= 1) return 0;
  const open = Math.min(1, progress / edge);
  const close = Math.min(1, (1 - progress) / edge);
  return r2(smooth(Math.min(open, close)));
}

/**
 * Arch of letter `index` in a row of `count`: 0 at the middle, -1 at both
 * ends. Scaled by how packed the rows are, it bends the packed block.
 */
export function letterArch(index: number, count: number): number {
  const mid = (count - 1) / 2;
  if (mid === 0) return 0;
  const d = (index - mid) / mid;
  return r2(-(d * d)) || 0;
}

/** Vertical bob (vh, within +-2.5) so each row reads as a wave. */
export function letterBob(index: number, progress: number): number {
  return r2(Math.sin(index * 1.3 + progress * Math.PI * 4) * 2.5);
}

import { mulberry32 } from "@/lib/prng";

/**
 * Pure geometry for the Work stage (see
 * docs/superpowers/specs/2026-11-02-work-reference-parity-design.md).
 * `rel` is px scrolled since the section top hit the viewport top; `w`/`h`
 * are the viewport size in px. Angles in radians.
 */

export const ROW_LETTERS = ["W", "O", "R", "K"] as const;
export const SECTION_VH = 4.5;
export const PIN_VH = 3.5;

const BASE_COUNTS = [10, 15, 15, 14] as const;
const MIN_COUNTS = [4, 5, 5, 4] as const;
const ROW_SPEEDS = [1, 0.86, 0.78, 0.6] as const;
const ROW_BOW = [-0.6, -0.2, 0.2, 0.6] as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const wrap = (v: number, m: number) => ((v % m) + m) % m;
const quadOut = (t: number) => 1 - (1 - t) * (1 - t);
const power2InOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Letters per row for a viewport `w` x `h`, scaled off the 1.6 base. */
export function letterCounts(w: number, h: number): number[] {
  return BASE_COUNTS.map((b, r) =>
    Math.max(MIN_COUNTS[r], Math.round((b * (w / h)) / 1.6)),
  );
}

/** 0..1 progress through the 3.5-viewport pin. */
export function pinProgress(rel: number, h: number): number {
  return clamp(rel / (PIN_VH * h), 0, 1);
}

/**
 * Horizontal offset from the viewport centre for letter `slot` of `count`
 * in `row` at pin progress `t`. The row is a loop `S = 1.43w` wide that
 * drifts left and wraps, so the result always lands in [-S/2, S/2).
 */
export function rowLoopX(
  slot: number,
  count: number,
  row: number,
  t: number,
  w: number,
): number {
  const S = 1.43 * w;
  const drift = ROW_SPEEDS[row] * 2.39 * w * quadOut(clamp(t, 0, 1));
  return wrap(((slot + 0.5) * S) / count - drift, S) - S / 2;
}

/**
 * 3D pose for a letter `x` px from the centre: edge letters come toward
 * the viewer (z), rows bow apart vertically (y) and lean in (rotY).
 */
export function letterPose(
  x: number,
  row: number,
  w: number,
): { x: number; y: number; z: number; rotY: number } {
  const xx = (x * x) / w;
  return {
    x,
    y: ROW_BOW[row] * 0.274 * xx + 0,
    z: xx / 2.78,
    rotY: Math.asin(clamp((-0.355 * x) / w, -1, 1)) + 0,
  };
}

/**
 * The shared zoom value (0 packed .. 1 open): power4.in as the mask pins,
 * power2.inOut back down before it unpins.
 */
export function zoomState(rel: number, h: number): number {
  if (rel < 1.75 * h) {
    const u = clamp((rel + 0.17 * h) / (0.7 * h), 0, 1);
    return u * u * u * u;
  }
  const v = clamp((rel - 2.9 * h) / (0.55 * h), 0, 1);
  return 1 - power2InOut(v);
}

/** Scroll position (in viewport heights) where card `i` of `n` centres. */
export function cardCrossing(i: number, n: number): number {
  if (n <= 1) return 0.77;
  return 0.77 + (i * (2.76 - 0.77)) / (n - 1);
}

/**
 * Card `i` runs p = 1 (right, approaching) to -1 (left, gone) over 0.78
 * viewports of scroll centred on its crossing.
 */
export function cardProgress(
  i: number,
  n: number,
  rel: number,
  h: number,
): number {
  return clamp((cardCrossing(i, n) * h - rel) / (0.39 * h), -1, 1);
}

/** 3D pose for a card at progress `p`. */
export function cardPose(
  p: number,
  w: number,
): { x: number; z: number; rotY: number } {
  return {
    x: p * w,
    z: (0.297 * p * p - 0.0875 * p) * w,
    rotY: Math.asin(clamp(-(0.172 * p + 0.17 * p * p * p), -1, 1)),
  };
}

/**
 * Per-card size factor and signed vertical offset. Seeded so it is stable
 * across renders and identical on server and client.
 */
export function cardLayout(n: number): { size: number; y: number }[] {
  const rand = mulberry32(0x51ed269b);
  return Array.from({ length: n }, (_, i) => ({
    size: 0.52 + rand() * (0.93 - 0.52),
    y: (i % 2 === 0 ? 1 : -1) * (0.5 + rand() * 0.4),
  }));
}

/** 32-bit FNV-1a hash. */
function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Caption key, e.g. `#K7QX-0002/08`: slug hash + position + total. */
export function cardKey(slug: string, index: number, total: number): string {
  const hash = fnv1a(slug).toString(36).toUpperCase().padStart(4, "0");
  return `#${hash.slice(-4)}-${String(index + 1).padStart(4, "0")}/${String(
    total,
  ).padStart(2, "0")}`;
}

/**
 * Indices (into the flat letter list) of the `k` letters that render in
 * front of the cards. Seeded, distinct, sorted.
 */
export function frontLetters(total: number, k = 5): number[] {
  const rand = mulberry32(0x1b873593);
  const picked = new Set<number>();
  while (picked.size < Math.min(k, total)) {
    picked.add(Math.floor(rand() * total));
  }
  return [...picked].sort((a, b) => a - b);
}

/** Capsule hole, its ring offset and centre, in sheet coordinates. */
export function holeGeometry(
  sheetW: number,
  h: number,
  w: number,
): {
  cx: number;
  top: number;
  width: number;
  height: number;
  r: number;
  ring: number;
} {
  const height = 0.764 * h;
  const width = Math.min(0.225 * h, 0.46 * sheetW);
  return {
    cx: sheetW / 2,
    top: (h - height) / 2,
    width,
    height,
    r: width / 2,
    ring: w < 640 ? 10 : 16,
  };
}

/** Mask scale at state 1: always ends fully black, even on wide screens. */
export function maxZoom(w: number, holeWidth: number): number {
  return Math.max(12.3, (1.2 * w) / holeWidth);
}

/** How far from the pointer (CSS px) the hero mesh bends. */
export const MESH_RADIUS = 160;
/** Largest push (CSS px). Kept low enough that a line never folds over. */
export const MESH_STRENGTH = 36;

// t * (1 - t^2)^2 peaks at t = 1/sqrt(5); dividing by that peak makes
// `strength` the real maximum push.
const PEAK = (1 / Math.sqrt(5)) * (1 - 1 / 5) ** 2;

/**
 * Outward push (CSS px) for a point `dist` px from the pointer. Zero at the
 * pointer itself (so a line under the cursor never jumps from one side to
 * the other), rising to `strength`, then easing back to zero at `radius`
 * with a smooth (zero-slope) edge.
 */
export function pushMagnitude(
  dist: number,
  radius = MESH_RADIUS,
  strength = MESH_STRENGTH,
): number {
  if (radius <= 0 || dist <= 0 || dist >= radius) return 0;
  const t = dist / radius;
  const k = 1 - t * t;
  return (strength * t * k * k) / PEAK;
}

/**
 * Bends one polyline away from the pointer at (`cx`, `cy`). `base` and `out`
 * hold interleaved x,y pairs in CSS px; `amp` (0..1) scales the push so it
 * can ease in and out. Writes into `out` so the render loop allocates
 * nothing per frame.
 */
export function displaceLine(
  base: Float32Array,
  out: Float32Array,
  cx: number,
  cy: number,
  amp: number,
  radius = MESH_RADIUS,
  strength = MESH_STRENGTH,
): void {
  const r2 = radius * radius;
  for (let i = 0; i + 1 < base.length; i += 2) {
    const x = base[i];
    const y = base[i + 1];
    const dx = x - cx;
    const dy = y - cy;
    const d2 = dx * dx + dy * dy;
    if (amp === 0 || d2 >= r2 || d2 === 0) {
      out[i] = x;
      out[i + 1] = y;
      continue;
    }
    const d = Math.sqrt(d2);
    const m = (amp * pushMagnitude(d, radius, strength)) / d;
    out[i] = x + dx * m;
    out[i + 1] = y + dy * m;
  }
}

/**
 * Frame-rate independent exponential smoothing from `current` toward
 * `target`. `lambda` is the speed (higher settles faster), `dt` in seconds.
 */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number {
  if (current === target) return target;
  return target + (current - target) * Math.exp(-lambda * dt);
}

const ROTATION_COUNT = 24;
const SEED = 9090;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic per-card rotation angles (degrees, -4..4) for the WORK
 * beat's scattered project gallery. Indexed by project position (modulo
 * this array's length); seeded, SSR-safe, identical server/client
 * output. 24 entries comfortably covers this project's catalogue size
 * with room to grow.
 */
export const cardRotations: number[] = (() => {
  const rand = mulberry32(SEED);
  return Array.from({ length: ROTATION_COUNT }, () => rand() * 8 - 4);
})();

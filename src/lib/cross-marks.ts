const MARK_COUNT = 6;
const SEED = 5150;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CrossMark {
  xPct: number;
  yPct: number;
}

/**
 * Deterministic scattered cross-mark positions (percent of container) for
 * the Skills beat's black room panel. Seeded, SSR-safe, identical
 * server/client output.
 */
export const crossMarks: CrossMark[] = (() => {
  const rand = mulberry32(SEED);
  return Array.from({ length: MARK_COUNT }, () => ({
    xPct: 8 + rand() * 84,
    yPct: 10 + rand() * 80,
  }));
})();

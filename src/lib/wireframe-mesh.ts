const LINE_COUNT = 60;
const POINTS_PER_LINE = 40;
const SEED = 4242;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface WireframeLine {
  d: string;
}

/**
 * Deterministic warped vertical-line mesh, generated once at module load
 * from a fixed seed - identical server/client output, no hydration
 * mismatch, no per-render randomness. Purely decorative background texture.
 * Coordinates are in a 0-1000 x 0-600 viewBox space; the consuming SVG
 * scales to fill its container via preserveAspectRatio="none".
 */
export const wireframeLines: WireframeLine[] = (() => {
  const rand = mulberry32(SEED);
  const lines: WireframeLine[] = [];
  const centers = Array.from({ length: 4 }, () => ({
    x: rand() * 1000,
    strength: 40 + rand() * 60,
  }));

  for (let i = 0; i < LINE_COUNT; i++) {
    const baseX = (i / (LINE_COUNT - 1)) * 1000;
    const points: string[] = [];
    for (let p = 0; p < POINTS_PER_LINE; p++) {
      const y = (p / (POINTS_PER_LINE - 1)) * 600;
      let x = baseX;
      for (const c of centers) {
        const dist = Math.abs(baseX - c.x);
        const falloff = Math.exp(-dist / 220);
        x += Math.sin(y / 90 + c.x) * c.strength * falloff;
      }
      points.push(`${p === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: points.join(" ") });
  }
  return lines;
})();

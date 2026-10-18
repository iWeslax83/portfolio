const LINE_COUNT = 60;
const POINTS_PER_LINE = 40;

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

function rawPoints(seed: number, lineCount: number): number[][] {
  const rand = mulberry32(seed);
  const lines: number[][] = [];
  const centers = Array.from({ length: 4 }, () => ({
    x: rand() * 1000,
    strength: 40 + rand() * 60,
  }));

  for (let i = 0; i < lineCount; i++) {
    const baseX = (i / (lineCount - 1)) * 1000;
    const points: number[] = [];
    for (let p = 0; p < POINTS_PER_LINE; p++) {
      const y = (p / (POINTS_PER_LINE - 1)) * 600;
      let x = baseX;
      for (const c of centers) {
        const dist = Math.abs(baseX - c.x);
        const falloff = Math.exp(-dist / 220);
        x += Math.sin(y / 90 + c.x) * c.strength * falloff;
      }
      points.push(x, y);
    }
    lines.push(points);
  }
  return lines;
}

/**
 * The mesh as raw numbers: one array per line, interleaved x,y pairs in the
 * 0-1000 x 0-600 viewBox space, rounded to 0.1 exactly like the SVG path
 * data. The client canvas in the hero draws from these, so it matches the
 * server-rendered SVG point for point.
 */
export function generateWireframePoints(
  seed: number,
  lineCount = LINE_COUNT,
): number[][] {
  return rawPoints(seed, lineCount).map((pts) =>
    pts.map((v) => Number(v.toFixed(1))),
  );
}

export function generateWireframeLines(
  seed: number,
  lineCount = LINE_COUNT,
): WireframeLine[] {
  return rawPoints(seed, lineCount).map((pts) => {
    const parts: string[] = [];
    for (let i = 0; i < pts.length; i += 2) {
      parts.push(
        `${i === 0 ? "M" : "L"}${pts[i].toFixed(1)},${pts[i + 1].toFixed(1)}`,
      );
    }
    return { d: parts.join(" ") };
  });
}

/**
 * Deterministic warped vertical-line mesh, generated once at module load
 * from a fixed seed - identical server/client output, no hydration
 * mismatch, no per-render randomness. Purely decorative background
 * texture. Coordinates are in a 0-1000 x 0-600 viewBox space; the
 * consuming SVG scales to fill its container via
 * preserveAspectRatio="none". This is the hero beat's mesh - unchanged
 * seed (4242) and output from before `generateWireframeLines` existed.
 */
export const wireframeLines: WireframeLine[] = generateWireframeLines(4242);

/** Dense mesh for the full-bleed hero panel (same seed, more lines). */
export const heroMeshLines: WireframeLine[] = generateWireframeLines(4242, 140);

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

/** Tenths as the shortest number text: 154 -> "15.4", -3 -> "-.3", 150 -> "15". */
function tenths(n: number): string {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  const whole = Math.floor(a / 10);
  const frac = a % 10;
  return sign + (frac ? `${whole || ""}.${frac}` : `${whole}`);
}

/**
 * Path data for each line: an absolute start, then relative steps
 * ("M x,y l dx,dy dx,dy ..."). Steps are taken between the same 0.1-rounded
 * points the canvas uses, in whole tenths, so they add up exactly and the
 * markup is much shorter than absolute "L x,y" pairs.
 */
export function generateWireframeLines(
  seed: number,
  lineCount = LINE_COUNT,
): WireframeLine[] {
  return generateWireframePoints(seed, lineCount).map((pts) => {
    const t = pts.map((v) => Math.round(v * 10));
    const steps: string[] = [];
    for (let i = 2; i < t.length; i += 2) {
      steps.push(`${tenths(t[i] - t[i - 2])},${tenths(t[i + 1] - t[i - 1])}`);
    }
    return { d: `M${tenths(t[0])},${tenths(t[1])} l${steps.join(" ")}` };
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

/** The hero mesh as numbers, for the interactive canvas (same geometry). */
export const heroMeshPoints: number[][] = generateWireframePoints(4242, 140);

/** Hero lines drawn thicker so the field has a couple of strong ridges. */
export const HERO_MESH_CRESTS = [30, 98];

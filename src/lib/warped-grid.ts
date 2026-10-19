export type GridPath = { d: string };

const W = 1000;
const H = 600;
const STEPS = 24;
const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * A square grid in a 1000x600 viewBox, bowed outward by `bulge` units at
 * its middle (negative bulge bows inward). Deterministic.
 */
export function warpedGrid({
  cols,
  rows,
  bulge,
}: {
  cols: number;
  rows: number;
  bulge: number;
}): GridPath[] {
  const paths: GridPath[] = [];

  for (let c = 0; c <= cols; c++) {
    const x0 = (c / cols) * W;
    const pts: string[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const y = (s / STEPS) * H;
      const x =
        x0 + ((x0 - W / 2) / (W / 2)) * bulge * Math.sin((Math.PI * y) / H);
      pts.push(`${s === 0 ? "M" : "L"}${r1(x)},${r1(y)}`);
    }
    paths.push({ d: pts.join(" ") });
  }

  for (let r = 0; r <= rows; r++) {
    const y0 = (r / rows) * H;
    const pts: string[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const x = (s / STEPS) * W;
      const y =
        y0 + ((y0 - H / 2) / (H / 2)) * bulge * Math.sin((Math.PI * x) / W);
      pts.push(`${s === 0 ? "M" : "L"}${r1(x)},${r1(y)}`);
    }
    paths.push({ d: pts.join(" ") });
  }

  return paths;
}

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

/**
 * A square grid in the same 1000x600 viewBox, magnified around (cx, cy) as
 * if seen through a lens: points within `radius` are pushed outward by up
 * to `strength` (0.5 = 50%), easing to no change at the rim. Points outside
 * the radius stay on the flat grid. Deterministic.
 */
export function lensGrid({
  cols,
  rows,
  cx,
  cy,
  radius,
  strength,
}: {
  cols: number;
  rows: number;
  cx: number;
  cy: number;
  radius: number;
  strength: number;
}): GridPath[] {
  const steps = STEPS * 2;
  const warp = (x: number, y: number) => {
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.hypot(dx, dy);
    if (d >= radius) return [x, y];
    const f = 1 + strength * (1 - d / radius) ** 2;
    return [cx + dx * f, cy + dy * f];
  };
  const line = (at: (s: number) => [number, number]) => {
    const pts: string[] = [];
    for (let s = 0; s <= steps; s++) {
      const [x, y] = warp(...at(s / steps));
      pts.push(`${s === 0 ? "M" : "L"}${r1(x)},${r1(y)}`);
    }
    return { d: pts.join(" ") };
  };
  const paths: GridPath[] = [];
  for (let c = 0; c <= cols; c++) {
    paths.push(line((t) => [(c / cols) * W, t * H]));
  }
  for (let r = 0; r <= rows; r++) {
    paths.push(line((t) => [t * W, (r / rows) * H]));
  }
  return paths;
}

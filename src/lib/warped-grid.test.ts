import { describe, expect, it } from "vitest";
import { lensGrid, warpedGrid } from "./warped-grid";

describe("warpedGrid", () => {
  it("emits cols+1 vertical and rows+1 horizontal paths", () => {
    expect(warpedGrid({ cols: 12, rows: 6, bulge: 30 })).toHaveLength(13 + 7);
  });

  it("is deterministic", () => {
    const a = warpedGrid({ cols: 8, rows: 4, bulge: 20 });
    expect(warpedGrid({ cols: 8, rows: 4, bulge: 20 })).toEqual(a);
  });

  it("draws straight vertical lines when bulge is 0", () => {
    const first = warpedGrid({ cols: 4, rows: 2, bulge: 0 })[1].d;
    const xs = [...first.matchAll(/[ML]([\d.-]+),/g)].map((m) => m[1]);
    expect(new Set(xs).size).toBe(1);
  });
});

describe("lensGrid", () => {
  const pts = (d: string) =>
    [...d.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map((m) => [+m[1], +m[2]]);

  it("emits cols+1 vertical and rows+1 horizontal paths", () => {
    expect(
      lensGrid({
        cols: 12,
        rows: 6,
        cx: 500,
        cy: 300,
        radius: 250,
        strength: 0.4,
      }),
    ).toHaveLength(20);
  });

  it("leaves points outside the radius where a flat grid has them", () => {
    const lens = lensGrid({
      cols: 10,
      rows: 6,
      cx: 500,
      cy: 300,
      radius: 100,
      strength: 0.5,
    });
    // The left edge (x=0) is far outside the lens: it stays a straight line.
    expect(pts(lens[0].d).every(([x]) => x === 0)).toBe(true);
  });

  it("pushes lines near the centre outward", () => {
    const lens = lensGrid({
      cols: 10,
      rows: 6,
      cx: 500,
      cy: 300,
      radius: 300,
      strength: 0.5,
    });
    // The vertical line at x=600, at mid height, is pushed right of 600.
    const mid = pts(lens[6].d).find(([, y]) => y === 300)!;
    expect(mid[0]).toBeGreaterThan(600);
  });
});

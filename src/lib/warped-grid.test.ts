import { describe, expect, it } from "vitest";
import { warpedGrid } from "./warped-grid";

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

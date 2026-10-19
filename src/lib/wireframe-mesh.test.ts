import { describe, expect, it } from "vitest";
import {
  generateWireframeLines,
  generateWireframePoints,
  heroMeshLines,
  heroMeshPoints,
  wireframeLines,
} from "./wireframe-mesh";

describe("wireframe mesh", () => {
  it("keeps the original 60-line mesh unchanged by default", () => {
    expect(wireframeLines).toHaveLength(60);
    expect(generateWireframeLines(4242)).toEqual(wireframeLines);
  });

  it("builds the dense hero mesh with 140 lines", () => {
    expect(heroMeshLines).toHaveLength(140);
    expect(heroMeshLines.every((l) => l.d.startsWith("M"))).toBe(true);
  });

  it("is deterministic", () => {
    expect(generateWireframeLines(4242, 140)).toEqual(heroMeshLines);
  });
});

/** Absolute x,y pairs from "M x,y l dx,dy dx,dy ..." path data. */
function decode(d: string): number[] {
  const nums = d.match(/-?(?:\d+\.?\d*|\.\d+)/g)!.map(Number);
  const out = [nums[0], nums[1]];
  for (let k = 2; k < nums.length; k += 2) {
    out.push(out[k - 2] + nums[k], out[k - 1] + nums[k + 1]);
  }
  return out;
}

describe("wireframe mesh points", () => {
  it("matches the SVG path data point for point", () => {
    const points = generateWireframePoints(4242, 140);
    expect(points).toHaveLength(140);
    points.forEach((line, i) => {
      const abs = decode(heroMeshLines[i].d);
      expect(abs.length).toBe(line.length);
      line.forEach((v, j) => expect(abs[j]).toBeCloseTo(v, 6));
    });
  });

  it("writes short relative path data", () => {
    const d = heroMeshLines[0].d;
    expect(d).toMatch(/^M[\d.]+,[\d.]+ l/);
    // Absolute "L x,y" output was about 520 characters per line.
    expect(d.length).toBeLessThan(400);
  });
});

describe("hero mesh points export", () => {
  it("is the 140-line hero geometry", () => {
    expect(heroMeshPoints).toEqual(generateWireframePoints(4242, 140));
    expect(heroMeshPoints).toHaveLength(140);
  });
});

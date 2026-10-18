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

describe("wireframe mesh points", () => {
  it("matches the SVG path data point for point", () => {
    const points = generateWireframePoints(4242, 140);
    expect(points).toHaveLength(140);
    points.forEach((line, i) => {
      const nums = heroMeshLines[i].d.match(/-?\d+\.\d/g)!.map(Number);
      expect(line.length).toBe(nums.length);
      line.forEach((v, j) => expect(v).toBeCloseTo(nums[j], 1));
    });
  });
});

describe("hero mesh points export", () => {
  it("is the 140-line hero geometry", () => {
    expect(heroMeshPoints).toEqual(generateWireframePoints(4242, 140));
    expect(heroMeshPoints).toHaveLength(140);
  });
});

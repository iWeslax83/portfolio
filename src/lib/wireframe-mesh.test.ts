import { describe, expect, it } from "vitest";
import {
  generateWireframeLines,
  heroMeshLines,
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

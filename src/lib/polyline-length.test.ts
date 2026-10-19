import { describe, expect, it } from "vitest";
import { polylineLength } from "./polyline-length";
import { heroMeshLines } from "./wireframe-mesh";

describe("polylineLength", () => {
  it("measures a straight segment", () => {
    expect(polylineLength("M0,0 L3,4")).toBeCloseTo(5);
  });

  it("sums every segment of a polyline", () => {
    expect(polylineLength("M0,0 L0,10 L10,10")).toBeCloseTo(20);
  });

  it("applies non-uniform scale before measuring", () => {
    // 0,0 -> 3,4 scaled by (2, 0.5) becomes 0,0 -> 6,2
    expect(polylineLength("M0,0 L3,4", 2, 0.5)).toBeCloseTo(Math.hypot(6, 2));
  });

  it("reads relative steps after a lowercase l", () => {
    // 0,0 -> 3,4 -> 3,14
    expect(polylineLength("M0,0 l3,4 0,10")).toBeCloseTo(15);
    expect(polylineLength("M1,1 l-.3,.4")).toBeCloseTo(0.5);
  });

  it("returns 0 for an empty or single-point path", () => {
    expect(polylineLength("")).toBe(0);
    expect(polylineLength("M5,5")).toBe(0);
  });

  it("measures the hero mesh lines at least their 600-unit height", () => {
    for (const line of heroMeshLines) {
      expect(polylineLength(line.d)).toBeGreaterThanOrEqual(600 - 1e-6);
    }
  });
});

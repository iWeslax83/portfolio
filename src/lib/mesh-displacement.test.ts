import { describe, expect, it } from "vitest";
import {
  MESH_RADIUS,
  MESH_STRENGTH,
  damp,
  displaceLine,
  pushMagnitude,
} from "./mesh-displacement";

describe("pushMagnitude", () => {
  it("is zero at the cursor, at the radius and beyond it", () => {
    expect(pushMagnitude(0, 160, 36)).toBe(0);
    expect(pushMagnitude(160, 160, 36)).toBe(0);
    expect(pushMagnitude(400, 160, 36)).toBe(0);
  });

  it("peaks at exactly the strength inside the radius", () => {
    let peak = 0;
    for (let d = 0; d <= 160; d += 0.25) {
      peak = Math.max(peak, pushMagnitude(d, 160, 36));
    }
    expect(peak).toBeCloseTo(36, 1);
  });

  it("falls off smoothly with no jumps", () => {
    let prev = pushMagnitude(0, 160, 36);
    for (let d = 0.5; d <= 170; d += 0.5) {
      const m = pushMagnitude(d, 160, 36);
      expect(Math.abs(m - prev)).toBeLessThan(0.5);
      prev = m;
    }
  });

  it("never folds a line: pushed points keep their order along a ray", () => {
    let prev = -Infinity;
    for (let d = 0; d <= 200; d += 0.25) {
      const moved = d + pushMagnitude(d, MESH_RADIUS, MESH_STRENGTH);
      expect(moved).toBeGreaterThan(prev);
      prev = moved;
    }
  });

  it("returns zero for a zero or negative radius", () => {
    expect(pushMagnitude(10, 0, 36)).toBe(0);
    expect(pushMagnitude(10, -5, 36)).toBe(0);
  });
});

describe("displaceLine", () => {
  const base = Float32Array.from([100, 0, 100, 50, 100, 100, 600, 100]);

  it("pushes points away from the cursor", () => {
    const out = new Float32Array(base.length);
    displaceLine(base, out, 140, 50, 1);
    // (100,50) sits 40px left of the cursor: it moves further left only.
    expect(out[2]).toBeLessThan(100);
    expect(out[3]).toBeCloseTo(50, 5);
    // (100,100) is below-left: it moves left and down.
    expect(out[4]).toBeLessThan(100);
    expect(out[5]).toBeGreaterThan(100);
  });

  it("leaves points outside the radius untouched", () => {
    const out = new Float32Array(base.length);
    displaceLine(base, out, 140, 50, 1);
    expect(out[6]).toBe(600);
    expect(out[7]).toBe(100);
  });

  it("scales with the amplitude and is the identity at zero", () => {
    const full = new Float32Array(base.length);
    const half = new Float32Array(base.length);
    const none = new Float32Array(base.length);
    displaceLine(base, full, 140, 50, 1);
    displaceLine(base, half, 140, 50, 0.5);
    displaceLine(base, none, 140, 50, 0);
    expect(100 - half[2]).toBeCloseTo((100 - full[2]) / 2, 4);
    expect(Array.from(none)).toEqual(Array.from(base));
  });

  it("does not move a point sitting exactly on the cursor", () => {
    const out = new Float32Array(base.length);
    displaceLine(base, out, 100, 50, 1);
    expect(out[2]).toBe(100);
    expect(out[3]).toBe(50);
  });
});

describe("damp", () => {
  it("moves toward the target without overshooting", () => {
    const v = damp(0, 1, 10, 1 / 60);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(1);
  });

  it("is frame-rate independent", () => {
    let a = 0;
    for (let i = 0; i < 4; i++) a = damp(a, 1, 8, 1 / 120);
    const b = damp(damp(0, 1, 8, 1 / 60), 1, 8, 1 / 60);
    expect(a).toBeCloseTo(b, 6);
  });

  it("settles on the target given enough time", () => {
    expect(damp(0, 1, 8, 5)).toBeCloseTo(1, 6);
    expect(damp(5, 5, 8, 1 / 60)).toBe(5);
  });
});

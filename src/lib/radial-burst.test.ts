import { describe, expect, it } from "vitest";
import { radialRays, radialRaysFrom } from "./radial-burst";

describe("radialRaysFrom", () => {
  it("keeps the original centered burst unchanged", () => {
    expect(radialRaysFrom(500, 500, 48, 900)).toEqual(radialRays);
  });

  it("emits `count` rays of the given length from the center", () => {
    const rays = radialRaysFrom(500, 40, 64, 1400);
    expect(rays).toHaveLength(64);
    for (const r of rays) {
      expect(Math.hypot(r.x2 - 500, r.y2 - 40)).toBeCloseTo(1400, 0);
    }
  });
});

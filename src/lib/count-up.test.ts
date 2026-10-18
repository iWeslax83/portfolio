import { describe, expect, it } from "vitest";
import { countUpText } from "./count-up";

describe("countUpText", () => {
  it("starts at zero and ends on the exact target", () => {
    expect(countUpText(1234, 0)).toBe("0");
    expect(countUpText(1234, 1)).toBe("1234");
  });

  it("rounds intermediate values to whole numbers", () => {
    expect(countUpText(10, 0.26)).toBe("3");
    expect(countUpText(7, 0.5)).toBe("4");
  });

  it("clamps progress outside 0..1", () => {
    expect(countUpText(50, -0.4)).toBe("0");
    expect(countUpText(50, 1.7)).toBe("50");
  });

  it("never passes the target on the way up", () => {
    for (let p = 0; p <= 1; p += 0.01) {
      expect(Number(countUpText(99, p))).toBeLessThanOrEqual(99);
    }
  });
});

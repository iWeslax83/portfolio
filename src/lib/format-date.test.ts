import { describe, expect, it } from "vitest";
import { formatDay } from "./format-date";

describe("formatDay", () => {
  it("prints an ISO day as a short English date", () => {
    expect(formatDay("2026-08-09")).toBe("Aug 9, 2026");
    expect(formatDay("2025-12-31")).toBe("Dec 31, 2025");
  });

  it("returns the input when it is not a valid day", () => {
    expect(formatDay("")).toBe("");
    expect(formatDay("soon")).toBe("soon");
  });
});

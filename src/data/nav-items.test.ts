import { describe, expect, it } from "vitest";
import { SECTION_IDS, navItems } from "./nav-items";

describe("navItems", () => {
  it("points every link at a real section id", () => {
    for (const item of navItems) {
      expect(item.href.startsWith("#")).toBe(true);
      expect(SECTION_IDS).toContain(item.href.slice(1));
    }
  });

  it("numbers links 01.. in order", () => {
    expect(navItems.map((i) => i.num)).toEqual(["01", "02", "03", "04"]);
  });
});

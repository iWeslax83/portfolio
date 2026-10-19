import { describe, expect, it } from "vitest";
import { SECTION_IDS, navItems } from "./nav-items";

describe("navItems", () => {
  it("points every home link at a real section id", () => {
    for (const item of navItems.filter((i) => i.href.startsWith("/#"))) {
      expect(SECTION_IDS).toContain(item.href.slice(2));
    }
  });

  it("uses absolute hrefs so the links work from every page", () => {
    for (const item of navItems) expect(item.href.startsWith("/")).toBe(true);
  });

  it("has five cells numbered 01.. in order", () => {
    expect(navItems.map((i) => i.num)).toEqual(["01", "02", "03", "04", "05"]);
  });
});

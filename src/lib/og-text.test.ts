import { describe, expect, it } from "vitest";
import { upperForLocale } from "./og-text";

describe("upperForLocale", () => {
  it("uses Turkish casing for tr", () => {
    expect(upperForLocale("verebilirlik için", "tr")).toBe("VEREBİLİRLİK İÇİN");
    expect(upperForLocale("ışık", "tr")).toBe("IŞIK");
  });
  it("uses English casing for en", () => {
    expect(upperForLocale("Emir Sakarya", "en")).toBe("EMIR SAKARYA");
  });
});

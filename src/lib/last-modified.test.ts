import { describe, expect, it } from "vitest";
import { FALLBACK_DATE, lastModified } from "./last-modified";
import sitemap from "@/app/sitemap";

describe("lastModified", () => {
  it("parses the date the runner prints", () => {
    const d = lastModified(["a"], () => "2026-09-01T10:00:00+03:00\n");
    expect(d.toISOString()).toBe(
      new Date("2026-09-01T10:00:00+03:00").toISOString(),
    );
  });
  it("falls back when the runner throws", () => {
    expect(
      lastModified(["a"], () => {
        throw new Error("no git");
      }),
    ).toEqual(FALLBACK_DATE);
  });
  it("falls back on empty output", () => {
    expect(lastModified(["a"], () => "")).toEqual(FALLBACK_DATE);
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  it("lists localized project pages", () => {
    expect(urls).toContain("https://emirsakarya.vercel.app/tr/projects/prose");
  });
  it("has no notes URL while every note is a draft", () => {
    expect(urls.some((u) => u.includes("/notes"))).toBe(false);
  });
});

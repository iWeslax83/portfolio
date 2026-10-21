import { describe, expect, it } from "vitest";
import { localizedPath, stripLocale, switchLocalePath } from "./locale-path";

describe("localizedPath", () => {
  it("leaves English paths unprefixed", () => {
    expect(localizedPath("en", "/#about")).toBe("/#about");
  });

  it("prefixes site-internal paths for Turkish", () => {
    expect(localizedPath("tr", "/#about")).toBe("/tr#about");
    expect(localizedPath("tr", "/")).toBe("/tr");
    expect(localizedPath("tr", "/projects#ventures")).toBe(
      "/tr/projects#ventures",
    );
  });

  it("never touches external links, mailto, static files or bare hashes", () => {
    expect(localizedPath("tr", "https://github.com/iWeslax83")).toBe(
      "https://github.com/iWeslax83",
    );
    expect(localizedPath("tr", "mailto:a@b.c")).toBe("mailto:a@b.c");
    expect(localizedPath("tr", "/resume.pdf")).toBe("/resume.pdf");
    expect(localizedPath("tr", "#about")).toBe("#about");
  });
});

describe("switchLocalePath", () => {
  it("moves a path between locales", () => {
    expect(switchLocalePath("/projects/prose", "tr")).toBe(
      "/tr/projects/prose",
    );
    expect(switchLocalePath("/tr/projects/prose", "en")).toBe(
      "/projects/prose",
    );
    expect(switchLocalePath("/tr", "en")).toBe("/");
    expect(switchLocalePath("/", "tr")).toBe("/tr");
    expect(switchLocalePath("/tr", "tr")).toBe("/tr");
  });
});

describe("stripLocale", () => {
  it("drops a leading locale segment only", () => {
    expect(stripLocale("/tr/projects")).toBe("/projects");
    expect(stripLocale("/tr")).toBe("/");
    expect(stripLocale("/")).toBe("/");
    expect(stripLocale("/projects")).toBe("/projects");
    expect(stripLocale("/trivia")).toBe("/trivia");
  });
});

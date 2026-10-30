import { describe, expect, it } from "vitest";
import { featuredProjects, projects } from "@/data/projects";
import {
  adjacentProjects,
  firstSentence,
  FLAGSHIP_COMPANION,
  metaDescription,
  orderedProjects,
} from "./project-nav";

describe("orderedProjects", () => {
  const list = orderedProjects(projects);

  it("puts the flagship first", () => {
    expect(list[0].slug).toBe(featuredProjects[0].slug);
  });

  it("puts the flagship's companion right after it", () => {
    expect(list[1].slug).toBe(FLAGSHIP_COMPANION);
  });

  it("orders the rest by ascending order", () => {
    const rest = list.slice(2).map((p) => p.order);
    expect(rest).toEqual([...rest].sort((a, b) => a - b));
  });

  it("keeps every project exactly once", () => {
    expect(list.map((p) => p.slug).sort()).toEqual(
      projects.map((p) => p.slug).sort(),
    );
  });
});

describe("adjacentProjects", () => {
  const list = orderedProjects(projects);

  it("wraps the first project's prev to the last", () => {
    const { prev, next } = adjacentProjects(list, list[0].slug);
    expect(prev?.slug).toBe(list[list.length - 1].slug);
    expect(next?.slug).toBe(list[1].slug);
  });

  it("wraps the last project's next to the first", () => {
    const { next } = adjacentProjects(list, list[list.length - 1].slug);
    expect(next?.slug).toBe(list[0].slug);
  });

  it("returns nulls for an unknown slug", () => {
    expect(adjacentProjects(list, "missing")).toEqual({
      prev: null,
      next: null,
    });
  });
});

describe("firstSentence", () => {
  it("stops at the first sentence end followed by a space", () => {
    expect(firstSentence("Has 19.76 minutes. Then more.")).toBe(
      "Has 19.76 minutes.",
    );
  });

  it("returns a single sentence whole", () => {
    expect(firstSentence("Only one sentence here")).toBe(
      "Only one sentence here",
    );
  });
});

describe("metaDescription", () => {
  it("leaves short text unchanged", () => {
    expect(metaDescription("A short line.")).toBe("A short line.");
  });

  it("keeps text of exactly the limit whole", () => {
    const text = "a".repeat(160);
    expect(metaDescription(text)).toBe(text);
  });

  it("caps long text on a word boundary with an ellipsis", () => {
    const text = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    const out = metaDescription(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith("…")).toBe(true);
    const kept = out.slice(0, -1);
    expect(text.startsWith(kept)).toBe(true);
    expect(text[kept.length]).toBe(" ");
  });

  it("drops trailing punctuation before the ellipsis", () => {
    const text = `${"x".repeat(150)}, ${"y".repeat(20)}`;
    expect(metaDescription(text)).toBe(`${"x".repeat(150)}…`);
  });

  it("handles Turkish text without cutting a word", () => {
    const text =
      "Öğrencilerin yurt başvurularını, oda atamalarını ve günlük yoklamayı tek bir panelden yöneten, okul yönetimiyle birlikte geliştirilen ve şu anda kullanımda olan çok kullanıcılı bir yönetim sistemi.";
    const out = metaDescription(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith("…")).toBe(true);
    const kept = out.slice(0, -1);
    expect(text.startsWith(kept)).toBe(true);
    expect(text[kept.length]).toBe(" ");
  });

  it("keeps a word that ends right at the cut", () => {
    expect(metaDescription("abcd efgh ijkl", 10)).toBe("abcd efgh…");
  });

  it("respects a custom limit", () => {
    expect(metaDescription("one two three four", 10)).toBe("one two…");
  });

  it("hard-cuts a single word longer than the limit", () => {
    expect(metaDescription("x".repeat(20), 10)).toBe(`${"x".repeat(9)}…`);
  });
});

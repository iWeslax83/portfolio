import { describe, expect, it } from "vitest";
import { featuredProjects, projects } from "@/data/projects";
import {
  adjacentProjects,
  firstSentence,
  orderedProjects,
} from "./project-nav";

describe("orderedProjects", () => {
  const list = orderedProjects(projects);

  it("puts the flagship first", () => {
    expect(list[0].slug).toBe(featuredProjects[0].slug);
  });

  it("orders the rest by ascending order", () => {
    const rest = list.slice(1).map((p) => p.order);
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

import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/types";
import {
  cardX,
  cardY,
  exitPhase,
  galleryProjects,
  letterSway,
} from "./work-gallery";

function project(slug: string, order: number, image?: string): Project {
  return {
    slug,
    title: slug,
    description: "",
    tag: "",
    tagDetail: "",
    techPills: [],
    links: [],
    image,
    featured: false,
    order,
    status: "SHIPPED",
  };
}

describe("galleryProjects", () => {
  it("keeps only real screenshots, sorted by order", () => {
    const all = [
      project("b", 2, "/images/projects/b.png"),
      project("uav", 1, "/images/uav.svg"),
      project("none", 3),
      project("a", 0, "/images/projects/a.png"),
    ];
    expect(galleryProjects(all).map((p) => p.slug)).toEqual(["a", "b"]);
  });
});

describe("cardX", () => {
  it("starts the first card right of center and ends the last card left", () => {
    expect(cardX(0, 7, 0)).toBe(60);
    expect(cardX(6, 7, 1)).toBe(-60);
  });

  it("clamps progress outside 0..1", () => {
    expect(cardX(0, 7, -1)).toBe(cardX(0, 7, 0));
    expect(cardX(0, 7, 2)).toBe(cardX(0, 7, 1));
  });

  it("moves every card left as progress grows", () => {
    for (let i = 0; i < 7; i++) {
      expect(cardX(i, 7, 0.6)).toBeLessThan(cardX(i, 7, 0.5));
    }
  });
});

describe("cardY and letterSway", () => {
  it("cycles three vertical offsets", () => {
    expect(cardY(0)).toBe(cardY(3));
    expect(new Set([cardY(0), cardY(1), cardY(2)]).size).toBe(3);
  });

  it("keeps sway within +-6 degrees and is deterministic", () => {
    for (let i = 0; i < 48; i++) {
      const v = letterSway(i, 0.37);
      expect(Math.abs(v)).toBeLessThanOrEqual(6);
      expect(letterSway(i, 0.37)).toBe(v);
    }
  });
});

describe("exitPhase", () => {
  it("stays at 0 until the exit starts, then runs 0..1", () => {
    expect(exitPhase(0)).toBe(0);
    expect(exitPhase(0.9)).toBe(0);
    expect(exitPhase(0.95)).toBeCloseTo(0.5);
    expect(exitPhase(1)).toBe(1);
  });

  it("clamps and honours a custom start", () => {
    expect(exitPhase(1.4)).toBe(1);
    expect(exitPhase(-1)).toBe(0);
    expect(exitPhase(0.8, 0.6)).toBeCloseTo(0.5);
  });
});

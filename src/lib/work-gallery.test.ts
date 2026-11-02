import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/types";
import { galleryProjects } from "./work-gallery";

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

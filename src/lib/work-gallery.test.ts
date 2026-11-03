import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/types";
import { cardLinkProps, galleryProjects } from "./work-gallery";

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

describe("cardLinkProps", () => {
  it("opens the primary live link in a new tab", () => {
    const p = {
      ...project("a", 0),
      links: [
        {
          label: "source code",
          href: "https://github.com/x/a",
          isPrimary: false,
        },
        { label: "live", href: "https://a.example", isPrimary: true },
      ],
    };
    expect(cardLinkProps(p, "en")).toEqual({
      href: "https://a.example",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("falls back to the localized detail page", () => {
    expect(cardLinkProps(project("a", 0), "en")).toEqual({
      href: "/projects/a",
    });
    expect(cardLinkProps(project("a", 0), "tr").href).toBe("/tr/projects/a");
  });
});

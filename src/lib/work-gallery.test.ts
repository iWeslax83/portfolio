import { describe, expect, it } from "vitest";
import { getProjects } from "./localize";
import { showcaseProjects } from "./work-gallery";

describe("showcaseProjects", () => {
  it.each(["en", "tr"] as const)("keeps the same curated order and images in %s", (locale) => {
    const selected = showcaseProjects(getProjects(locale));
    expect(selected.map(({ project }) => project.slug)).toEqual([
      "prose",
      "otonom-iha",
      "live-wildfire",
    ]);
    expect(selected[0].project.image).toMatch(/^\/images\/projects\//);
    expect(selected.every(({ project }) => project.image && project.title)).toBe(true);
  });

  it("omits missing projects and projects without an asset", () => {
    const projects = getProjects("en").filter(({ slug }) => slug !== "otonom-iha");
    const selected = showcaseProjects(projects.map((project) =>
      project.slug === "prose" ? { ...project, image: undefined } : project,
    ));
    expect(selected.map(({ project }) => project.slug)).toEqual(["live-wildfire"]);
  });
});

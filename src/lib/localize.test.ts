import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { ventures } from "@/data/ventures";
import { stratosUnits } from "@/data/stratos";
import { bentoSkills } from "@/data/skills";
import {
  getBentoSkills,
  getFeaturedProjects,
  getProjects,
  getStratosUnits,
  getVentures,
} from "./localize";

/** Titles that are proper names and read the same in Turkish. */
const NAME_TITLES = new Set([
  "stratos-akademi",
  "masa-hesaplari",
  "duran",
  "zero-g-pharma",
]);

describe("getProjects", () => {
  it("returns the English records untouched for en", () => {
    expect(getProjects("en")).toEqual(projects);
  });

  it("keeps every slug, in order, for tr", () => {
    expect(getProjects("tr").map((p) => p.slug)).toEqual(
      getProjects("en").map((p) => p.slug),
    );
  });

  it("gives every Turkish project its own title and description", () => {
    const en = getProjects("en");
    getProjects("tr").forEach((p, i) => {
      expect(p.title, p.slug).toBeTruthy();
      expect(p.description, p.slug).toBeTruthy();
      if (!NAME_TITLES.has(p.slug)) {
        expect(p.title, p.slug).not.toBe(en[i].title);
      }
      expect(p.description, p.slug).not.toBe(en[i].description);
    });
  });

  it("keeps every link's href and primary flag", () => {
    const en = getProjects("en");
    getProjects("tr").forEach((p, i) => {
      expect(p.links.map((l) => [l.href, l.isPrimary])).toEqual(
        en[i].links.map((l) => [l.href, l.isPrimary]),
      );
    });
  });

  it("keeps the facts that are not copy", () => {
    const en = getProjects("en");
    getProjects("tr").forEach((p, i) => {
      const { slug, tag, image, featured, order, status, repo } = en[i];
      expect(p).toMatchObject({ slug, tag, featured, order, status });
      expect(p.image).toBe(image);
      expect(p.repo).toBe(repo);
    });
  });
});

describe("getFeaturedProjects", () => {
  it("is the featured projects by order, localized", () => {
    const featured = getFeaturedProjects("tr");
    expect(featured.map((p) => p.slug)).toEqual(
      projects
        .filter((p) => p.featured)
        .sort((a, b) => a.order - b.order)
        .map((p) => p.slug),
    );
    expect(featured[0].title).not.toBe(
      projects.find((p) => p.slug === featured[0].slug)!.title,
    );
  });
});

describe("ventures, units and skills", () => {
  it("returns the English arrays for en", () => {
    expect(getVentures("en")).toEqual(ventures);
    expect(getStratosUnits("en")).toEqual(stratosUnits);
    expect(getBentoSkills("en")).toEqual(bentoSkills);
  });

  it("keeps names, hrefs and keys for tr, and localizes the units", () => {
    const tr = getVentures("tr");
    expect(tr.map((v) => [v.name, v.href])).toEqual(
      ventures.map((v) => [v.name, v.href]),
    );
    tr.forEach((v, i) => expect(v.role).not.toBe(ventures[i].role));
    const stratos = tr.find((v) => v.units);
    expect(stratos?.units).toEqual(getStratosUnits("tr"));
    expect(getStratosUnits("tr")).toHaveLength(stratosUnits.length);
    expect(getBentoSkills("tr").map((s) => s.key)).toEqual(
      bentoSkills.map((s) => s.key),
    );
  });
});

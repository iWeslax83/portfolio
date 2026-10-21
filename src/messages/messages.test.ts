import { describe, expect, it } from "vitest";
import en from "./en.json";
import tr from "./tr.json";
import { projectsTr } from "@/data/tr/projects";
import { venturesTr } from "@/data/tr/ventures";
import { stratosUnitsTr } from "@/data/tr/stratos";
import { bentoSkillsTr, devopsSkillTr } from "@/data/tr/skills";
import { projects } from "@/data/projects";

const EM_DASH = "\u2014";

type Tree = { [key: string]: string | Tree };

/** Every leaf as [dotted.key, value]. */
function leaves(tree: Tree, prefix = ""): [string, string][] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string"
      ? [[`${prefix}${k}`, v] as [string, string]]
      : leaves(v, `${prefix}${k}.`),
  );
}

/** Every string anywhere inside a value. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}

/** Values that read the same in both languages (names, handles, tech). */
const SAME_IN_BOTH = new Set([
  "nav.caption",
  "nav.langEn",
  "nav.langTr",
  "skills.githubLink",
  "closing.go",
  "footer.meta",
  "projects.tags.full-stack",
  "projects.tags.web",
]);

describe("tr.json", () => {
  const enLeaves = leaves(en as Tree);
  const trLeaves = leaves(tr as Tree);
  const trMap = new Map(trLeaves);

  it("has exactly the keys en.json has", () => {
    expect(trLeaves.map(([k]) => k).sort()).toEqual(
      enLeaves.map(([k]) => k).sort(),
    );
  });

  it("translates every value outside the allowlist", () => {
    const untranslated = enLeaves
      .filter(([k, v]) => !SAME_IN_BOTH.has(k) && trMap.get(k) === v)
      .map(([k]) => k);
    expect(untranslated).toEqual([]);
  });

  it("keeps the same {placeholders} as English", () => {
    for (const [k, v] of enLeaves) {
      const names = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(names(trMap.get(k) ?? ""), k).toEqual(names(v));
    }
  });
});

describe("project tag labels", () => {
  const tags = [...new Set(projects.map((p) => p.tag))];

  it("label every tag in projects.ts in both languages", () => {
    for (const messages of [en, tr]) {
      const labels: Record<string, string> = messages.projects.tags;
      for (const tag of tags) expect(labels[tag], tag).toBeTruthy();
    }
  });
});

describe("Turkish copy", () => {
  it("never uses an em dash", () => {
    const all = [
      ...strings(tr),
      ...strings(projectsTr),
      ...strings(venturesTr),
      ...strings(stratosUnitsTr),
      ...strings(bentoSkillsTr),
      ...strings(devopsSkillTr),
    ];
    expect(all.filter((s) => s.includes(EM_DASH))).toEqual([]);
  });
});

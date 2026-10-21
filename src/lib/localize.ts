import type { Locale } from "@/lib/locales";
import type { Project, StratosUnit } from "@/lib/types";
import { projects } from "@/data/projects";
import { ventures, type Venture } from "@/data/ventures";
import { stratosUnits } from "@/data/stratos";
import {
  bentoSkills,
  devopsSkill,
  type BentoSkill,
  type DevopsSkill,
} from "@/data/skills";
import { projectsTr } from "@/data/tr/projects";
import { venturesTr } from "@/data/tr/ventures";
import { stratosUnitsTr } from "@/data/tr/stratos";
import { bentoSkillsTr, devopsSkillTr } from "@/data/tr/skills";

/*
 * The data files hold the English records. Turkish copy lives in
 * src/data/tr/ as overrides keyed by slug, name or key, merged over the
 * English record here, so facts like hrefs, status and order exist once.
 */

function localizeProject(p: Project): Project {
  const copy = projectsTr[p.slug];
  if (!copy) return p;
  const { links: labels, ...fields } = copy;
  return {
    ...p,
    ...fields,
    links: p.links.map((l) => ({ ...l, label: labels?.[l.label] ?? l.label })),
  };
}

export function getProjects(locale: Locale): Project[] {
  return locale === "en" ? projects : projects.map(localizeProject);
}

/** Featured projects in catalogue order (the gallery's flagship first). */
export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale)
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getStratosUnits(locale: Locale): StratosUnit[] {
  return locale === "en"
    ? stratosUnits
    : stratosUnits.map((u) => stratosUnitsTr[u.name] ?? u);
}

export function getVentures(locale: Locale): Venture[] {
  if (locale === "en") return ventures;
  const units = getStratosUnits(locale);
  return ventures.map((v) => ({
    ...v,
    ...venturesTr[v.name],
    ...(v.units && { units }),
  }));
}

export function getBentoSkills(locale: Locale): BentoSkill[] {
  return locale === "en"
    ? bentoSkills
    : bentoSkills.map((s) => ({ ...s, ...bentoSkillsTr[s.key] }));
}

export function getDevopsSkill(locale: Locale): DevopsSkill {
  return locale === "en" ? devopsSkill : { ...devopsSkill, ...devopsSkillTr };
}

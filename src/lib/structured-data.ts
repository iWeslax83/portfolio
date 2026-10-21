import type { Venture } from "@/data/ventures";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";
import type { Project } from "@/lib/types";

export const SITE_URL = "https://emirsakarya.vercel.app";

const PERSON_ID = `${SITE_URL}/#person`;
const CONTEXT = "https://schema.org";

export function personJsonLd(): object {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Emir Sakarya",
    jobTitle:
      "Founder & Head of Electronics & Software, STRATOS İHA · Embedded & Full-Stack Engineer",
    url: SITE_URL,
    sameAs: [
      "https://github.com/iWeslax83",
      "https://linkedin.com/in/emirsakarya",
      "https://www.stratosiha.com",
    ],
    worksFor: {
      "@type": "Organization",
      name: "STRATOS İHA",
      url: "https://www.stratosiha.com",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Tofaş Fen Lisesi",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bursa",
      addressCountry: "TR",
    },
  };
}

export function venturesJsonLd(ventures: Venture[]): object {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    itemListElement: ventures.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: v.name,
        description: v.proof,
        founder: { "@id": PERSON_ID },
        ...(v.href ? { url: v.href } : {}),
      },
    })),
  };
}

export function projectJsonLd(project: Project, locale: Locale): object {
  const repoUrl = project.repo
    ? `https://github.com/${project.repo}`
    : undefined;
  return {
    "@context": CONTEXT,
    "@type": repoUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.description,
    url: SITE_URL + localizedPath(locale, `/projects/${project.slug}`),
    inLanguage: locale,
    author: { "@id": PERSON_ID },
    ...(repoUrl ? { codeRepository: repoUrl } : {}),
  };
}

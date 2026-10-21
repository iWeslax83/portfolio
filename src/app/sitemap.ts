import type { MetadataRoute } from "next";
import { notes } from "@/content/notes/meta";
import { getProjects } from "@/lib/localize";
import { lastModified } from "@/lib/last-modified";
import { LOCALES } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";
import { publishedNotes } from "@/lib/notes";
import { SITE_URL } from "@/lib/structured-data";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale for `path`, each pointing at every language version. */
function localized(path: string, lastMod: Date, priority: number): Entry[] {
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`]),
  );
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${localizedPath(locale, path)}`,
    lastModified: lastMod,
    priority,
    alternates: { languages },
  }));
}

/** English-only page: a single entry at its English URL. */
function englishOnly(path: string, lastMod: Date, priority: number): Entry {
  return { url: `${SITE_URL}${path}`, lastModified: lastMod, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeDate = lastModified([
    "src/app/[locale]/page.tsx",
    "src/messages",
    "src/components/sections",
  ]);
  const projectsDate = lastModified(["src/data", "src/messages"]);

  const entries: Entry[] = [
    ...localized("/", homeDate, 1.0),
    ...localized("/projects", projectsDate, 0.8),
    ...getProjects("en").flatMap((p) =>
      localized(`/projects/${p.slug}`, projectsDate, 0.6),
    ),
  ];

  // Notes are English-only, so no /tr entries and no tr alternate.
  const published = publishedNotes(notes, false);
  if (published.length > 0) {
    entries.push(
      englishOnly(
        "/notes",
        lastModified(published.map((n) => `src/content/notes/${n.slug}.mdx`)),
        0.7,
      ),
      ...published.map((n) =>
        englishOnly(
          `/notes/${n.slug}`,
          lastModified([`src/content/notes/${n.slug}.mdx`]),
          0.6,
        ),
      ),
    );
  }
  return entries;
}

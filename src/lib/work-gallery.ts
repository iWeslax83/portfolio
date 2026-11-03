import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";

/** Projects with a real screenshot, in catalogue order. */
export function galleryProjects(all: Project[]): Project[] {
  return all
    .filter((p) => p.image?.startsWith("/images/projects/"))
    .sort((a, b) => a.order - b.order);
}

/**
 * Anchor props for a gallery card: the project's primary (live) link in a
 * new tab, or its detail page when it has none.
 */
export function cardLinkProps(
  p: Project,
  locale: Locale,
): { href: string; target?: string; rel?: string } {
  const live = p.links.find((l) => l.isPrimary)?.href;
  return live
    ? { href: live, target: "_blank", rel: "noopener noreferrer" }
    : { href: localizedPath(locale, `/projects/${p.slug}`) };
}

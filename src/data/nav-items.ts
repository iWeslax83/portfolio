import type { Messages } from "@/lib/messages";
import { notes } from "@/content/notes/meta";
import { SHOW_DRAFTS, publishedNotes } from "@/lib/notes";

export interface NavItem {
  key: keyof Messages["nav"];
  href: string;
  num: string;
}

/** Every in-page section id on the home page, in page order. */
export const SECTION_IDS = ["home", "about", "work", "contact"] as const;

const sectionItems: NavItem[] = [
  { key: "about", href: "/#about", num: "01" },
  { key: "work", href: "/#work", num: "02" },
  { key: "projects", href: "/projects", num: "03" },
  { key: "ventures", href: "/projects#ventures", num: "04" },
  { key: "contact", href: "/#contact", num: "05" },
];

const notesItem: NavItem = { key: "notes", href: "/notes", num: "06" };

/** The nav cells, with Notes last when `showNotes`. */
export function buildNavItems(showNotes: boolean): NavItem[] {
  return showNotes ? [...sectionItems, notesItem] : sectionItems;
}

/**
 * Five header cells, like the reference's, plus Notes once a note is
 * published (drafts count in `next dev` only, so a production build shows
 * Notes only for a real note). Absolute English hrefs, so the same links work
 * from the projects page; components pass them through `localizedPath` for
 * `/tr`. On the home page the smooth-scroll handler treats `/#id` (or
 * `/tr#id`) as an in-page jump.
 */
export const navItems: NavItem[] = buildNavItems(
  publishedNotes(notes, SHOW_DRAFTS).length > 0,
);

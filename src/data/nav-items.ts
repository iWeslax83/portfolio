import type { Messages } from "@/lib/messages";

export interface NavItem {
  key: keyof Messages["nav"];
  href: string;
  num: string;
}

/** Every in-page section id on the home page, in page order. */
export const SECTION_IDS = ["home", "about", "work", "contact"] as const;

/**
 * Five header cells, like the reference's. Absolute English hrefs, so the
 * same links work from the projects page; components pass them through
 * `localizedPath` for `/tr`. On the home page the smooth-scroll handler
 * treats `/#id` (or `/tr#id`) as an in-page jump.
 */
export const navItems: NavItem[] = [
  { key: "about", href: "/#about", num: "01" },
  { key: "work", href: "/#work", num: "02" },
  { key: "projects", href: "/projects", num: "03" },
  { key: "ventures", href: "/projects#ventures", num: "04" },
  { key: "contact", href: "/#contact", num: "05" },
];

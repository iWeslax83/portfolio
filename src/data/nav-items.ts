export interface NavItem {
  key: string;
  href: string;
  num: string;
}

/** Every in-page section id, in page order. */
export const SECTION_IDS = [
  "home",
  "about",
  "work",
  "ventures",
  "contact",
] as const;

export const navItems: NavItem[] = [
  { key: "about", href: "#about", num: "01" },
  { key: "work", href: "#work", num: "02" },
  { key: "ventures", href: "#ventures", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
];

export interface NavItem {
  key: string;
  href: string;
  num: string;
}

export const navItems: NavItem[] = [
  { key: "home", href: "#home", num: "00" },
  { key: "flightLog", href: "#flight-log", num: "01" },
  { key: "founderStory", href: "#founder-story", num: "02" },
  { key: "telemetry", href: "#telemetry", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
];

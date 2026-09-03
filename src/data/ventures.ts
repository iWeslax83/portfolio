import { STRATOS_URL } from "@/data/stratos";

export interface Venture {
  name: string;
  role: string;
  proof: string;
  href?: string;
}

export const ventures: Venture[] = [
  {
    name: "STRATOS İHA",
    role: "Founder & Chief Engineer",
    proof:
      "25-person engineering org · TEKNOFEST rotorcraft finalist · NASA Space Apps Turkey finalist",
    href: STRATOS_URL,
  },
  {
    name: "Teluvane",
    role: "Founder",
    proof:
      "Multi-tenant AI-agent compliance platform · hash-chained audit trail · EU AI Act / ISO 42001 / NIST AI RMF / SOC 2",
    href: "https://teluvane.com",
  },
  {
    name: "Viyaro",
    role: "Founder & CEO",
    proof: "Autonomous mobility · BOSİAD-funded · 50,000+ rides across 10+ companies in production",
  },
];

import { STRATOS_URL, stratosUnits } from "@/data/stratos";
import { StratosUnit } from "@/lib/types";

export interface Venture {
  name: string;
  role: string;
  proof: string;
  isFounder?: boolean;
  href?: string;
  units?: StratosUnit[];
}

export const ventures: Venture[] = [
  {
    name: "STRATOS İHA",
    role: "Founder & Chief Engineer",
    isFounder: true,
    proof:
      "25-person engineering org · TEKNOFEST rotorcraft finalist · NASA Space Apps Turkey finalist",
    href: STRATOS_URL,
    units: stratosUnits,
  },
  {
    name: "Teluvane",
    role: "Founder",
    isFounder: true,
    proof:
      "Multi-tenant AI-agent compliance platform · hash-chained audit trail · EU AI Act / ISO 42001 / NIST AI RMF / SOC 2",
    href: "https://teluvane.com",
  },
  {
    name: "Viyaro",
    role: "Founding Technical Developer Member",
    proof:
      "Autonomous mobility · BOSİAD-funded · 50,000+ rides across 10+ companies in production",
  },
];

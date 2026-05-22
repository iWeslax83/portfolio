import { StratosUnit } from "@/lib/types";

export const stratosStats = [
  { value: 4, suffix: "", key: "departments" },
  { value: 7, suffix: "", key: "members" },
  { value: 2026, suffix: "", key: "founded", raw: true },
];

export const stratosUnits: StratosUnit[] = [
  {
    name: "Autonomous Quadrotor",
    detail: "Real-time target detection & precision landing",
  },
  {
    name: "FPV Racing Drone",
    detail: "Low-latency video, built for maneuverability",
  },
  {
    name: "VEX Robotics",
    detail: "Competition platform · V5 Pushback",
  },
];

export const STRATOS_URL = "https://stratosiha.vercel.app";

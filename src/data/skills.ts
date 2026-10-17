import { SkillCategory } from "@/lib/types";

export const skills: SkillCategory[] = [
  {
    key: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    key: "backend",
    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "GraphQL",
      "MongoDB",
      "Postgres",
      "Supabase",
      "Redis",
    ],
  },
  {
    key: "ai_embedded",
    items: [
      "Python",
      "LangGraph",
      "Ollama",
      "MediaPipe",
      "Flight Controllers",
      "PCB Design",
    ],
  },
  {
    key: "devops",
    items: ["Docker", "Kubernetes", "GitHub Actions", "Linux", "Vercel"],
  },
];

export interface BentoSkill {
  key: string;
  /** The big word, one array entry per stacked line. */
  word: string[];
  tools: string[];
  label: string;
  sub: string;
}

/** Bento rows for the About section. Tools come from skills above and the
 *  UAV stack in projects.ts. */
export const bentoSkills: BentoSkill[] = [
  {
    key: "embedded",
    word: ["Embed", "ded"],
    tools: ["Flight Controllers", "PCB Design", "Pixhawk 6C", "ArduPilot"],
    label: "Pixhawk / ArduPilot / OpenCV",
    sub: "Flight Software",
  },
  {
    key: "ai",
    word: ["AI"],
    tools: ["Python", "LangGraph", "Ollama", "MediaPipe"],
    label: "LangGraph / Claude / Ollama",
    sub: "Agent Systems",
  },
  {
    key: "frontend",
    word: ["Front", "End"],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    label: "Next.js / React / TypeScript",
    sub: "Modern Frontend",
  },
  {
    key: "backend",
    word: ["Back", "End"],
    tools: ["Node.js", "FastAPI", "GraphQL", "Postgres", "Redis"],
    label: "Node.js / FastAPI / Postgres",
    sub: "Backend & Data",
  },
];

export const devopsSkill = {
  tools: ["Docker", "Kubernetes", "GitHub Actions", "Linux", "Vercel"],
  label: "Docker / Kubernetes / Vercel",
  sub: "Ship & Deploy",
};

import { SkillCategory } from "@/lib/types";

export const skills: SkillCategory[] = [
  {
    key: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    key: "backend",
    items: ["Node.js", "Express", "FastAPI", "GraphQL", "MongoDB", "Postgres", "Supabase", "Redis"],
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

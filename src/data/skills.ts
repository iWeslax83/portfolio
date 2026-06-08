import { SkillCategory } from "@/lib/types";

export const skills: SkillCategory[] = [
  {
    key: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    key: "backend",
    items: ["Node.js", "Express", "FastAPI", "GraphQL", "MongoDB", "Redis"],
  },
  {
    key: "ai_embedded",
    items: ["Python", "Ollama", "Flight Controllers", "PCB Design"],
  },
  {
    key: "devops",
    items: ["Docker", "Kubernetes", "GitHub Actions", "Linux", "Vercel"],
  },
];

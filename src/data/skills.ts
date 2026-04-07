import { SkillCategory } from "@/lib/types";

export const skills: SkillCategory[] = [
  {
    key: "frontend",
    label: '"frontend":',
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    key: "backend",
    label: '"backend":',
    items: ["Node.js", "Express", "FastAPI", "GraphQL", "MongoDB", "Redis"],
  },
  {
    key: "ai_embedded",
    label: '"ai_&_embedded":',
    items: ["Python", "Ollama", "Flight Controllers", "PCB Design"],
  },
  {
    key: "devops",
    label: '"devops":',
    items: ["Docker", "Kubernetes", "GitHub Actions", "Linux", "Vercel"],
  },
];

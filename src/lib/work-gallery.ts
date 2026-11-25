import type { Project } from "@/lib/types";

const showcase = [
  { slug: "prose", summaryKey: "prose", tag: "AI" },
  { slug: "otonom-iha", summaryKey: "multicopter", tag: "competition" },
  { slug: "live-wildfire", summaryKey: "wildfire", tag: "simulation" },
] as const;

export function showcaseProjects(projects: Project[]) {
  return showcase.flatMap(({ slug, summaryKey, tag }) => {
    const project = projects.find((entry) => entry.slug === slug);
    return project?.image
      ? [{ project: { ...project, image: project.image }, summaryKey, tag }]
      : [];
  });
}

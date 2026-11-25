import type { Project } from "@/lib/types";

const showcase = [
  { slug: "stratos-website", summaryKey: "stratos", tag: "web" },
  { slug: "teluvane", summaryKey: "teluvane", tag: "AI" },
  { slug: "prose", summaryKey: "prose", tag: "AI" },
] as const;

export function showcaseProjects(projects: Project[]) {
  return showcase.flatMap(({ slug, summaryKey, tag }) => {
    const project = projects.find((entry) => entry.slug === slug);
    return project?.image
      ? [{ project: { ...project, image: project.image }, summaryKey, tag }]
      : [];
  });
}

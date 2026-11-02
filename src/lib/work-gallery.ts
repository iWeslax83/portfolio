import type { Project } from "@/lib/types";

/** Projects with a real screenshot, in catalogue order. */
export function galleryProjects(all: Project[]): Project[] {
  return all
    .filter((p) => p.image?.startsWith("/images/projects/"))
    .sort((a, b) => a.order - b.order);
}

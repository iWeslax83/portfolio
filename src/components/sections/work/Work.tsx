import { projects } from "@/data/projects";
import type { RepoStats } from "@/lib/github-repo-stats";
import { galleryProjects } from "@/lib/work-gallery";
import WorkIntro from "./WorkIntro";
import WorkGallery from "./WorkGallery";
import StaticGallery from "./StaticGallery";
import WorkCatalogue from "./WorkCatalogue";

export default function Work({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
  const items = galleryProjects(projects);
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">
        Work
      </h2>
      <div className="work-animated">
        <WorkIntro />
        <WorkGallery items={items} />
      </div>
      <div className="work-static">
        <StaticGallery items={items} />
      </div>
      <WorkCatalogue repoStats={repoStats} />
    </section>
  );
}

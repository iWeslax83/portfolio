import type { Metadata } from "next";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Ventures from "@/components/sections/Ventures";
import WorkCatalogue from "@/components/sections/work/WorkCatalogue";
import { projects } from "@/data/projects";
import { fetchRepoStats } from "@/lib/github-repo-stats";

export const metadata: Metadata = {
  title: "Projects - Emir Sakarya",
  description:
    "Every project and venture Emir Sakarya has built: UAVs, AI agents, full-stack apps and the companies behind them.",
  alternates: { canonical: "/projects" },
};

/**
 * The full record the home page's gallery only samples: the ventures, then
 * every project with its links and status. Kept off the home page so its
 * section rhythm matches the reference's (gallery straight into the close).
 */
export default async function ProjectsPage() {
  const repoStats = await fetchRepoStats(
    projects.filter((p) => p.repo).map((p) => p.repo as string),
  );
  return (
    <Frame>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <h1 className="border-b border-ink px-4 py-10 text-center font-display text-[clamp(3rem,12vw,10rem)] uppercase leading-[0.85] sm:px-10">
          Projects
        </h1>
        <Ventures />
        <WorkCatalogue repoStats={repoStats} />
      </main>
      <Footer />
      <BackToTop />
    </Frame>
  );
}

import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Hero from "@/components/sections/hero/Hero";
import AboutSkills from "@/components/sections/about/AboutSkills";
import { getRecentCommits } from "@/lib/git-history";
import Work from "@/components/sections/work/Work";
import Ventures from "@/components/sections/Ventures";
import { projects } from "@/data/projects";
import { fetchGitHubStats } from "@/lib/github";
import { fetchRepoStats } from "@/lib/github-repo-stats";

export default async function Home() {
  const commits = getRecentCommits();
  const githubStats = await fetchGitHubStats();
  const repoStats = await fetchRepoStats(
    projects.filter((p) => p.repo).map((p) => p.repo as string),
  );
  return (
    <Frame>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero commits={commits} />
        <AboutSkills stats={githubStats} />
        <Work repoStats={repoStats} />
        <Ventures />
      </main>
      <Footer />
      <BackToTop />
    </Frame>
  );
}

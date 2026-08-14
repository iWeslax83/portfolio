import { fetchGitHubStats } from "@/lib/github";
import { fetchRepoStats } from "@/lib/github-repo-stats";
import { getRecentCommits } from "@/lib/git-history";
import { projects } from "@/data/projects";
import Nav from "@/components/nav";
import BackToTop from "@/components/ui/back-to-top";
import CommitMotif from "@/components/ui/commit-motif";
import Hero from "@/components/hero";
import Stratos from "@/components/stratos";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import GitHub from "@/components/github";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default async function Home() {
  const githubStats = await fetchGitHubStats();
  const commits = getRecentCommits();
  const repoStats = await fetchRepoStats(
    projects.filter((p) => p.repo).map((p) => p.repo as string)
  );

  return (
    <>
      <CommitMotif commits={commits} />
      <Nav />
      <main>
        <Hero />
        <Projects repoStats={repoStats} />
        <Stratos />
        <Skills />
        <GitHub stats={githubStats} />
        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}

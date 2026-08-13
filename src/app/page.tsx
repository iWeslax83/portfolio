import { fetchGitHubStats } from "@/lib/github";
import { getRecentCommits } from "@/lib/git-history";
import Nav from "@/components/nav";
import ScrollProgress from "@/components/ui/scroll-progress";
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

  return (
    <>
      <CommitMotif commits={commits} />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Projects />
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

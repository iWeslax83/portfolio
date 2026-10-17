import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Hero from "@/components/sections/hero/Hero";
import AboutSkills from "@/components/sections/about/AboutSkills";
import { getRecentCommits } from "@/lib/git-history";
import { fetchGitHubStats } from "@/lib/github";

export default async function Home() {
  const commits = getRecentCommits();
  const githubStats = await fetchGitHubStats();
  return (
    <Frame>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero commits={commits} />
        <AboutSkills stats={githubStats} />
      </main>
      <Footer />
      <BackToTop />
    </Frame>
  );
}

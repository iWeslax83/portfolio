import { fetchGitHubStats } from "@/lib/github";
import Nav from "@/components/nav";
import ScrollProgress from "@/components/ui/scroll-progress";
import BackToTop from "@/components/ui/back-to-top";
import Hero from "@/components/hero";
import Stratos from "@/components/stratos";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import GitHub from "@/components/github";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default async function Home() {
  const githubStats = await fetchGitHubStats();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Stratos />
        <Projects />
        <Skills />
        <GitHub stats={githubStats} />
        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}

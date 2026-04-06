import { fetchGitHubStats } from "@/lib/github";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import GitHub from "@/components/github";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default async function Home() {
  const githubStats = await fetchGitHubStats();

  return (
    <main>
      <Nav />
      <Hero />
      <Projects />
      <Skills />
      <GitHub stats={githubStats} />
      <Contact />
      <Footer />
    </main>
  );
}

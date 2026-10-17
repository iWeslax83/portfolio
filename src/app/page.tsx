import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Hero from "@/components/sections/hero/Hero";
import { getRecentCommits } from "@/lib/git-history";

export default async function Home() {
  const commits = getRecentCommits();
  return (
    <Frame>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero commits={commits} />
      </main>
      <Footer />
      <BackToTop />
    </Frame>
  );
}

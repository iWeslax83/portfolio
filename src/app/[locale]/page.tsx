import { setRequestLocale } from "next-intl/server";
import type { Locale } from "../../../i18n/routing";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Intro from "@/components/intro";
import Hero from "@/components/sections/hero/Hero";
import AboutSkills from "@/components/sections/about/AboutSkills";
import { getRecentCommits } from "@/lib/git-history";
import Work from "@/components/sections/work/Work";
import Closing from "@/components/sections/closing/Closing";
import { fetchGitHubStats } from "@/lib/github";
import { loadMessages } from "@/lib/messages";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const commits = getRecentCommits();
  const [githubStats, m] = await Promise.all([
    fetchGitHubStats(),
    loadMessages(),
  ]);
  return (
    <Frame>
      <SiteHeader t={m.nav} locale={locale} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero commits={commits} />
        <AboutSkills stats={githubStats} t={m.about} skills={m.skills} />
        <Work />
        <Closing commits={commits} t={m.closing} />
      </main>
      <Footer t={m.footer} nav={m.nav} locale={locale} />
      <BackToTop />
      <Intro />
    </Frame>
  );
}

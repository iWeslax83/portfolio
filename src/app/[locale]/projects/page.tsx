import type { Metadata } from "next";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Ventures from "@/components/sections/Ventures";
import WorkCatalogue from "@/components/sections/work/WorkCatalogue";
import { projects } from "@/data/projects";
import { fetchRepoStats } from "@/lib/github-repo-stats";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/locales";
import { localeAlternates } from "@/lib/locale-path";
import { loadMessages } from "@/lib/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: "Projects - Emir Sakarya",
    description:
      "Every project and venture Emir Sakarya has built: UAVs, AI agents, full-stack apps and the companies behind them.",
    alternates: localeAlternates(locale, "/projects"),
  };
}

/**
 * The full record the home page's gallery only samples: the ventures, then
 * every project with its links and status. Kept off the home page so its
 * section rhythm matches the reference's (gallery straight into the close).
 */
export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [repoStats, m, t] = await Promise.all([
    fetchRepoStats(projects.filter((p) => p.repo).map((p) => p.repo as string)),
    loadMessages(),
    getTranslations("projects"),
  ]);
  return (
    <Frame>
      <SiteHeader t={m.nav} locale={locale} />
      <main id="main" tabIndex={-1} className="outline-none">
        <h1 className="border-b border-ink px-4 py-10 text-center font-display text-[clamp(3rem,12vw,10rem)] uppercase leading-[0.85] sm:px-10">
          Projects
        </h1>
        <Ventures t={m.ventures} />
        <WorkCatalogue
          repoStats={repoStats}
          title={`${t("allTitle")} · ${t("count", { count: projects.length })}`}
        />
      </main>
      <Footer t={m.footer} nav={m.nav} locale={locale} />
      <BackToTop />
    </Frame>
  );
}

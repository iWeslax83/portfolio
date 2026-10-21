import type { Metadata, ResolvingMetadata } from "next";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import Ventures from "@/components/sections/Ventures";
import WorkCatalogue from "@/components/sections/work/WorkCatalogue";
import { getProjects, getVentures } from "@/lib/localize";
import { fetchRepoStats } from "@/lib/github-repo-stats";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/locales";
import { localeAlternates } from "@/lib/locale-path";
import { shareMetadata } from "@/lib/share-metadata";
import JsonLd from "@/components/ui/json-ld";
import { venturesJsonLd } from "@/lib/structured-data";
import { loadMessages } from "@/lib/messages";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ locale: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("projectsTitle");
  const description = t("projectsDescription");
  return {
    title,
    description,
    alternates: localeAlternates(locale, "/projects"),
    ...shareMetadata({
      locale,
      path: "/projects",
      title,
      description,
      type: "website",
      parent: await parent,
    }),
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
  const projects = getProjects(locale);
  const [repoStats, m, t] = await Promise.all([
    fetchRepoStats(projects.filter((p) => p.repo).map((p) => p.repo as string)),
    loadMessages(),
    getTranslations("projects"),
  ]);
  return (
    <Frame>
      <JsonLd data={venturesJsonLd(getVentures(locale))} />
      <SiteHeader t={m.nav} locale={locale} />
      <main id="main" tabIndex={-1} className="outline-none">
        <h1 className="border-b border-ink px-4 py-10 text-center font-display text-[clamp(3rem,12vw,10rem)] uppercase leading-[0.85] sm:px-10">
          {m.projects.heading}
        </h1>
        <Ventures t={m.ventures} ventures={getVentures(locale)} />
        <WorkCatalogue
          projects={projects}
          repoStats={repoStats}
          title={`${t("allTitle")} · ${t("count", { count: projects.length })}`}
          t={m.projects}
          status={m.status}
          locale={locale}
        />
      </main>
      <Footer t={m.footer} nav={m.nav} locale={locale} />
      <BackToTop label={m.common.backToTop} />
    </Frame>
  );
}

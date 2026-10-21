import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../../../i18n/routing";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import ProjectDetail from "@/components/sections/project/ProjectDetail";
import { getProjects } from "@/lib/localize";
import { fetchRepoStats } from "@/lib/github-repo-stats";
import type { Locale } from "@/lib/locales";
import { localeAlternates } from "@/lib/locale-path";
import { loadMessages } from "@/lib/messages";
import {
  adjacentProjects,
  firstSentence,
  orderedProjects,
} from "@/lib/project-nav";
import { projects } from "@/data/projects";

type Params = Promise<{ locale: string; slug: string }>;

// Only the listed projects exist; any other slug falls through to the
// framed global 404 (notFound() here would render a client-only shell).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const project = getProjects(locale).find((p) => p.slug === slug)!;
  return {
    title: `${project.title} - Emir Sakarya`,
    description: firstSentence(project.description),
    alternates: localeAlternates(locale, `/projects/${slug}`),
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const list = orderedProjects(getProjects(locale));
  const index = list.findIndex((p) => p.slug === slug);
  const project = list[index];
  const { prev, next } = adjacentProjects(list, slug);
  const [repoStats, m] = await Promise.all([
    fetchRepoStats(project.repo ? [project.repo] : []),
    loadMessages(),
  ]);
  return (
    <Frame>
      <SiteHeader t={m.nav} locale={locale} />
      <main id="main" tabIndex={-1} className="outline-none">
        <ProjectDetail
          project={project}
          index={index + 1}
          prev={prev}
          next={next}
          stats={project.repo ? (repoStats[project.repo] ?? null) : null}
          t={m.project}
          projectsT={m.projects}
          statusLabels={{
            SHIPPED: m.status.shipped,
            IN_PROGRESS: m.status.inProgress,
            ARCHIVED: m.status.archived,
          }}
          locale={locale}
        />
      </main>
      <Footer t={m.footer} nav={m.nav} locale={locale} />
      <BackToTop label={m.common.backToTop} />
    </Frame>
  );
}

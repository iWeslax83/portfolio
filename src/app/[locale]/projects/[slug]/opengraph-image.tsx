import { getTranslations } from "next-intl/server";
import { routing } from "../../../../../i18n/routing";
import { projects } from "@/data/projects";
import { getProjects } from "@/lib/localize";
import type { Locale } from "@/lib/locales";
import { ogSize, renderOgCard } from "@/lib/og-card";

export const alt = "Emir Sakarya - project";
export const size = ogSize;
export const contentType = "image/png";

// Mirror the detail page: only listed projects exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const project = getProjects(locale).find((p) => p.slug === slug)!;
  const t = await getTranslations({ locale, namespace: "status" });
  const status = {
    SHIPPED: t("shipped"),
    IN_PROGRESS: t("inProgress"),
    ARCHIVED: t("archived"),
  }[project.status];

  return renderOgCard({
    kicker: project.tagDetail,
    title: project.title,
    subtitle: `Emir Sakarya · ${status}`,
  });
}

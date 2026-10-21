import { getTranslations } from "next-intl/server";
import { routing } from "../../../../../i18n/routing";
import { projects } from "@/data/projects";
import { getProjects } from "@/lib/localize";
import type { Locale } from "@/lib/locales";
import { ogSize, renderOgCard } from "@/lib/og-card";



export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug, __metadata_id__: "card" })),
  );
}

type Params = Promise<{ locale: string; slug: string }>;

// Per-project, localized alt text (the static `alt` export cannot see params).
// Unlike the image function, it receives plain (not promised) params.
export async function generateImageMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params as { locale: Locale; slug: string };
  const project = getProjects(locale).find((p) => p.slug === slug);
  return [
    {
      id: "card",
      // Next also calls this with empty params while collecting routes.
      alt: project ? `${project.title} - Emir Sakarya` : "Emir Sakarya",
      size: ogSize,
      contentType: "image/png",
    },
  ];
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const project = getProjects(locale).find((p) => p.slug === slug);
  // Unknown slugs (dynamicParams stays on for the metadata id route).
  if (!project) return new Response(null, { status: 404 });
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
    locale,
  });
}

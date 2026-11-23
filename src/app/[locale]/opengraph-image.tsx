import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/locales";
import { routing } from "../../../i18n/routing";
import { renderOgCard } from "@/lib/og-card";
import { ogSize } from "@/lib/og-text";

export const alt = "Emir Sakarya";
export const size = ogSize;
export const contentType = "image/png";

// One card per locale, rendered at build time like the pages.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "meta" });
  return renderOgCard({
    kicker: t("ogKicker"),
    title: "Emir Sakarya",
    locale,
    titleSize: 150,
    subtitle: t("ogSubtitle"),
    signature: t("ogSignature"),
  });
}

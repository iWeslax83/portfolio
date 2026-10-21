import type { Locale } from "@/lib/locales";
import { routing } from "../../../i18n/routing";
import { ogSize, renderOgCard } from "@/lib/og-card";

export const alt = "Emir Sakarya - Founder & Engineer";
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
  return renderOgCard({
    kicker: "FOUNDER & HEAD OF ELECTRONICS & SOFTWARE · STRATOS İHA",
    title: "Emir Sakarya",
    locale,
    titleSize: 150,
    subtitle:
      "Building autonomous drones and the software behind them, from Bursa, Türkiye.",
  });
}

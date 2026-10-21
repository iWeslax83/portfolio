import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import NotFoundContent from "@/components/not-found-content";
import { loadMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export const metadata: Metadata = {
  title: "Page not found - Emir Sakarya",
  robots: { index: false },
};

/**
 * For an explicit `notFound()` from a locale page. Unknown URLs never reach
 * it: they get app/global-not-found.tsx.
 */
export default async function NotFound() {
  const [m, locale] = await Promise.all([
    loadMessages(),
    getLocale() as Promise<Locale>,
  ]);
  return <NotFoundContent m={m} locale={locale} />;
}

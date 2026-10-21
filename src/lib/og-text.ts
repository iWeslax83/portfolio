import type { Locale } from "@/lib/locales";

/**
 * Locale-aware uppercase for the OG card. Satori's CSS textTransform ignores
 * the language, so Turkish i would become I instead of İ.
 */
export function upperForLocale(text: string, locale: Locale): string {
  return text.toLocaleUpperCase(locale === "tr" ? "tr" : "en");
}

import type { Locale } from "@/lib/locales";

// Fixed locale and UTC, so the server and the browser print the same text.
const options: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};
const DAY: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", options),
  tr: new Intl.DateTimeFormat("tr-TR", options),
};

/**
 * "2026-08-09" to "Aug 9, 2026" (en) or "9 Ağu 2026" (tr). Anything
 * unparseable comes back as is.
 */
export function formatDay(iso: string, locale: Locale = "en"): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : DAY[locale].format(date);
}

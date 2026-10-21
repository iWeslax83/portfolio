import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "../src/lib/locales";

/**
 * English lives at the bare URLs, Turkish under `/tr`. No Accept-Language
 * detection: a shared English link always opens in English.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

import { defineRouting } from "next-intl/routing";

/**
 * English lives at the bare URLs, Turkish under `/tr`. No Accept-Language
 * detection: a shared English link always opens in English.
 */
export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

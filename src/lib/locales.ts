/**
 * The site's locales as plain data, shared by the next-intl routing config
 * and the client-side path helpers so the browser bundle never pulls in
 * next-intl. English is the default and lives at the bare URLs.
 */
export const LOCALES = ["en", "tr"] as const;
export const DEFAULT_LOCALE = "en";

export type Locale = (typeof LOCALES)[number];

import type { Metadata, ResolvedMetadata } from "next";
import { LOCALES, type Locale } from "./locales";
import { localizedPath } from "./locale-path";
import { ogSize } from "./og-text";
import { SITE_URL } from "./structured-data";

/** Open Graph locale codes for each site locale. */
export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  tr: "tr_TR",
};

/**
 * `openGraph` and `twitter` metadata for one page. A page that sets these
 * replaces the layout's objects whole, so this always fills the full set:
 * title, description, absolute URL, type, locale and the other locales.
 * `canonicalPath` defaults to `path` in `locale`; pass it for pages whose
 * canonical lives elsewhere (the English-only notes). Pass `imageAlt` to
 * describe a local card, or `parent` to keep the layout's card.
 */
export function shareMetadata({
  locale,
  path,
  title,
  description,
  type,
  imageAlt,
  canonicalPath,
  parent,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  imageAlt?: string;
  canonicalPath?: string;
  parent?: ResolvedMetadata;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const url = new URL(canonicalPath ?? localizedPath(locale, path), SITE_URL)
    .href;
  const image = imageAlt
    ? {
        url: `${SITE_URL}/${locale}${path === "/" ? "" : path}/opengraph-image`,
        alt: imageAlt,
        ...ogSize,
        type: "image/png",
      }
    : undefined;
  const ogImages = image ? [image] : parent?.openGraph?.images;
  const twitterImages = image ? [image] : parent?.twitter?.images;
  return {
    openGraph: {
      title,
      description,
      url,
      type,
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALES[l],
      ),
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterImages && { images: twitterImages }),
    },
  };
}

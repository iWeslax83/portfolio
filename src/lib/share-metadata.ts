import type { Metadata, ResolvedMetadata } from "next";
import { LOCALES, type Locale } from "./locales";
import { localizedPath } from "./locale-path";
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
 * canonical lives elsewhere (the English-only notes). Pages without their
 * own `opengraph-image` pass `parent` (the resolved parent metadata) so the
 * layout's card is kept rather than dropped with the replaced objects.
 */
export function shareMetadata({
  locale,
  path,
  title,
  description,
  type,
  canonicalPath,
  parent,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  canonicalPath?: string;
  parent?: ResolvedMetadata;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const url = new URL(canonicalPath ?? localizedPath(locale, path), SITE_URL)
    .href;
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
      ...(parent?.openGraph?.images && { images: parent.openGraph.images }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(parent?.twitter?.images && { images: parent.twitter.images }),
    },
  };
}

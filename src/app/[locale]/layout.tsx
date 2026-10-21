import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";
import { localeAlternates } from "@/lib/locale-path";
import SkipLink from "@/components/ui/skip-link";
import SmoothScroll from "@/components/smooth-scroll";
import { INTRO_SCRIPT } from "@/lib/intro-script";
import { fontVariables } from "../site-fonts";
import "../globals.css";

// The browser chrome matches the black page frame; the site has no dark
// theme, so form controls and scrollbars stay light.
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "light",
};

const metadataBase = new URL("https://emirsakarya.vercel.app");

// Only the listed locales exist; anything else falls through to
// app/global-not-found.tsx as a fully server-rendered 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Pages override `alternates` with their own path; this covers the home page. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const requested = (await params).locale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const share = t("shareDescription");
  return {
    metadataBase,
    title,
    description: t("description"),
    openGraph: { title, description: share, type: "website" },
    twitter: { card: "summary_large_image", title, description: share },
    robots: { index: true, follow: true },
    alternates: localeAlternates(locale, "/"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={fontVariables}
      // The intro script and Lenis add classes to <html> before and after
      // hydration; only this element's own attributes are exempted.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="bg-frame text-ink antialiased">
        <SkipLink />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emir Sakarya",
              jobTitle:
                "Founder & Head of Electronics & Software, STRATOS İHA · Embedded & Full-Stack Engineer",
              url: "https://emirsakarya.vercel.app",
              sameAs: [
                "https://github.com/iWeslax83",
                "https://linkedin.com/in/emirsakarya",
                "https://www.stratosiha.com",
              ],
              worksFor: {
                "@type": "Organization",
                name: "STRATOS İHA",
                url: "https://www.stratosiha.com",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Tofaş Fen Lisesi",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bursa",
                addressCountry: "TR",
              },
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}

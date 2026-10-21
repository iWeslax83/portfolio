import type { Metadata } from "next";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";
import { getLocale } from "next-intl/server";
import { loadMessages } from "@/lib/messages";
import { localizedPath } from "@/lib/locale-path";
import type { Locale } from "../../../i18n/routing";

export const metadata: Metadata = {
  title: "Page not found - Emir Sakarya",
  robots: { index: false },
};

const linkCell =
  "flex items-center justify-center px-6 py-6 font-mono text-sm uppercase tracking-[0.05em] transition-colors duration-[350ms] hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg active:bg-ink active:text-bg";

/** Same frame, header and footer as the rest of the site, two ways back. */
export default async function NotFound() {
  const [m, locale] = await Promise.all([
    loadMessages(),
    getLocale() as Promise<Locale>,
  ]);
  return (
    <Frame>
      <SiteHeader t={m.nav} locale={locale} />
      <main id="main" tabIndex={-1} className="outline-none">
        <p className={SECTION_BAR}>Error 404</p>
        <div className="border-b border-ink px-4 py-16 text-center sm:py-24">
          <h1 className="font-display text-[clamp(6rem,30vw,22rem)] leading-[0.85]">
            404
          </h1>
          <p className="mx-auto mt-8 max-w-md text-pretty font-serif text-2xl leading-[1.5]">
            This page does not exist. It may have moved, or the link has a typo.
          </p>
        </div>
        <div className="grid sm:grid-cols-2">
          {/* Plain links, not next/link: the not-found page ships with every page, and next/link would add ~48KB to all of them for two links */}
          <a
            href={localizedPath(locale, "/")}
            className={`${linkCell} border-b border-ink sm:border-b-0 sm:border-r`}
          >
            Back to the home page
          </a>
          <a href={localizedPath(locale, "/projects")} className={linkCell}>
            See all projects
          </a>
        </div>
      </main>
      <Footer t={m.footer} nav={m.nav} locale={locale} />
    </Frame>
  );
}

import type { Metadata, Viewport } from "next";
import NotFoundContent from "@/components/not-found-content";
import SkipLink from "@/components/ui/skip-link";
import type { Messages } from "@/lib/messages";
import { DEFAULT_LOCALE } from "@/lib/locales";
import en from "@/messages/en.json";
import { fontVariables } from "./site-fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found - Emir Sakarya",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "light",
};

/**
 * The site 404 for every URL no route matches: unknown pages in either
 * locale (`/nope`, `/tr/nope`, there is no catch-all route), paths the proxy
 * skips (`/old.html`, `/api/x`) and unknown locale segments (the locale
 * layout sets `dynamicParams = false`). Next serves it as a full static
 * page, unlike a `notFound()` thrown from a page, which in this app (no
 * root layout above `[locale]`) only renders client-side. English only: it
 * renders outside every layout, with its own html, fonts and CSS.
 */
export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={fontVariables}>
      <body className="bg-frame text-ink antialiased">
        <SkipLink />
        <NotFoundContent m={en as Messages} locale={DEFAULT_LOCALE} />
      </body>
    </html>
  );
}

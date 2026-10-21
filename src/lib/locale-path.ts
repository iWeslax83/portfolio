import { routing, type Locale } from "../../i18n/routing";

/** A path with a file extension in its last segment (`/resume.pdf`). */
function isStaticFile(path: string): boolean {
  const last = path.split("/").pop() ?? "";
  return last.includes(".");
}

/**
 * The href for `locale`: site-internal paths get the locale prefix (Turkish
 * only, English stays bare). External links, `mailto:`, bare `#x` hashes and
 * static files are returned untouched.
 */
export function localizedPath(locale: Locale, href: string): string {
  if (locale === routing.defaultLocale || !href.startsWith("/")) return href;
  if (href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);
  if (isStaticFile(path)) return href;
  return `/${locale}${path === "/" ? "" : path}${rest}`;
}

/**
 * The pathname without a leading locale segment: `/tr/projects` becomes
 * `/projects`, `/tr` becomes `/`. Also strips `/en`, which only shows up
 * during prerendering, so server and client agree.
 */
export function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

/** The same page in `to`, from a pathname with or without its prefix. */
export function switchLocalePath(pathname: string, to: Locale): string {
  return localizedPath(to, stripLocale(pathname));
}

/**
 * `alternates` metadata for one page: canonical in the current locale plus
 * every language version and `x-default` (English).
 */
export function localeAlternates(locale: Locale, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, localizedPath(l, path)]),
      ),
      "x-default": localizedPath(routing.defaultLocale, path),
    },
  };
}

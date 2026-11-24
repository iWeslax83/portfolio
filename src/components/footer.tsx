import type { Messages } from "@/lib/messages";
import { navItems } from "@/data/nav-items";
import { RESUME_PATH, contactLinks } from "@/data/contact";
import { localizedPath } from "@/lib/locale-path";
import type { Locale } from "@/lib/locales";

const heading = "text-xs font-bold uppercase tracking-wider text-ink-3";
const link = "inline-flex min-h-11 items-center text-sm hover:text-accent focus-visible:text-accent";
const footerLinks = contactLinks.filter(({ href }) => href !== RESUME_PATH);

export default function Footer({
  t,
  nav,
  locale,
}: {
  t: Messages["footer"];
  nav: Messages["nav"];
  locale: Locale;
}) {
  return (
    <footer className="border-t border-edge bg-deep text-ink">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-10 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-[3fr_2fr] sm:gap-12">
          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className={heading}>{t.navHeading}</h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-4">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a href={localizedPath(locale, item.href)} className={link}>{nav[item.key]}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={heading}>{t.socialHeading}</h2>
            <ul className="mt-2 flex flex-wrap gap-x-6">
              {footerLinks.map(({ href, label }) => {
                const external = href.startsWith("https://");
                return (
                  <li key={href}>
                    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={link}>
                      {external ? label : t.emailLabel}
                      {external && <span aria-hidden className="ml-1 text-xs text-ink-3">↗</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-edge pt-5 text-xs text-ink-3 sm:flex-row sm:justify-between">
          <p>{t.colophon}</p>
          <p>{t.meta}</p>
        </div>
        <p aria-hidden className="mt-8 hidden select-none text-[clamp(2.5rem,7.25vw,6rem)] font-extrabold leading-none tracking-tighter text-ink-3 opacity-20 md:block">
          {t.wordmark}
        </p>
      </div>
    </footer>
  );
}

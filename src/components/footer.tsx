"use client";

import type { Messages } from "@/lib/messages";
import { navItems } from "@/data/nav-items";
import { contactLinks } from "@/data/contact";
import DotPattern from "@/components/ui/dot-pattern";
import { localizedPath } from "@/lib/locale-path";
import type { Locale } from "../../i18n/routing";

const heading =
  "mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-bg/60";

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
    <footer>
      <div className="relative h-24 bg-ink md:h-[220px]">
        <DotPattern
          color="var(--color-bg)"
          gap={10}
          radius={1.2}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="relative overflow-hidden border-t border-bg bg-ink text-bg">
        {/* Faint texture, not copy: drawn as SVG so contrast checkers do
            not read it as low-contrast text. Font size is 10.5% of width. */}
        <svg
          aria-hidden
          viewBox="0 0 1000 105"
          className="pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 select-none overflow-visible opacity-[0.1]"
        >
          <text
            x="500"
            y="52.5"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="105"
            fill="currentColor"
            className="font-display"
          >
            {t.wordmark}
          </text>
        </svg>

        <div className="relative mx-auto max-w-[1320px] px-6 py-14 md:px-10 md:py-20 lg:px-36">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-24">
            <div>
              <p className={heading}>{t.contactHeading}</p>
              <ul className="space-y-3">
                {contactLinks.map((c) => {
                  const external = c.href.startsWith("http");
                  return (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex min-w-0 items-baseline justify-between gap-4 transition-opacity duration-[350ms] hover:opacity-70 focus-visible:opacity-70 active:opacity-70"
                      >
                        <span className="font-serif text-xl">{c.label}</span>
                        <span className="min-w-0 truncate font-mono text-xs text-bg/50">
                          {c.value}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className={heading}>{t.navHeading}</p>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <a
                      href={localizedPath(locale, item.href)}
                      className="group flex items-baseline justify-between font-serif text-xl transition-opacity duration-[350ms] hover:opacity-70 focus-visible:opacity-70 active:opacity-70"
                    >
                      {nav[item.key]}
                      <span
                        aria-hidden
                        className="text-sm text-bg/60 transition-transform duration-[350ms] group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-bg/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">
              {t.colophon}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">
              {t.meta}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

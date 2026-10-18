"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/data/nav-items";
import { contactLinks } from "@/data/contact";
import DotPattern from "@/components/ui/dot-pattern";

const heading =
  "mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-bg/60";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer>
      <div className="relative h-16 bg-ink md:h-24">
        <DotPattern color="var(--color-bg)" gap={10} radius={1.2} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="relative overflow-hidden border-t border-bg bg-ink text-bg">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1/4 select-none whitespace-nowrap text-center font-display text-[18vw] leading-none opacity-[0.08]"
        >
          {t("wordmark")}
        </p>

        <div className="relative mx-auto max-w-[1320px] px-6 py-14 md:px-10 md:py-20 lg:px-36">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-24">
            <div>
              <p className={heading}>{t("contactHeading")}</p>
              <ul className="space-y-3">
                {contactLinks.map((c) => {
                  const external = c.href.startsWith("http");
                  return (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex min-w-0 items-baseline justify-between gap-4 transition-opacity hover:opacity-70 active:opacity-70"
                      >
                        <span className="font-serif text-xl">{c.label}</span>
                        <span className="min-w-0 truncate font-mono text-xs text-bg/50">{c.value}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className={heading}>{t("navHeading")}</p>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className="flex items-baseline justify-between font-serif text-xl transition-opacity hover:opacity-70 active:opacity-70"
                    >
                      {tNav(item.key)}
                      <span aria-hidden className="text-sm text-bg/60">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-bg/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">{t("colophon")}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">{t("meta")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

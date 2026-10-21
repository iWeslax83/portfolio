"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { Messages } from "@/lib/messages";
import { Menu } from "lucide-react";
import { SECTION_IDS, navItems } from "@/data/nav-items";
import { useActiveSection } from "@/lib/use-active-section";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import LocaleSwitch from "@/components/ui/locale-switch";
import { localizedPath, stripLocale } from "@/lib/locale-path";
import type { Locale } from "@/lib/locales";
import MobileNav from "./mobile-nav";

const socialCell =
  "flex flex-1 items-center justify-center transition-colors hover:bg-ink hover:text-bg active:bg-ink active:text-bg";

/**
 * Cell-grid header in normal flow (it scrolls away, like the reference's).
 * Desktop: logo, caption, nav, social, two-line tagline. Below lg: logo and
 * a burger that opens the full-screen menu.
 */
export default function SiteHeader({
  t,
  locale,
}: {
  t: Messages["nav"];
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const pathname = stripLocale(usePathname());
  const href = (path: string) => localizedPath(locale, path);
  const langLabels = { en: t.langEn, tr: t.langTr, label: t.language };

  return (
    <header className="relative z-40 border-b border-ink bg-bg">
      <div data-intro="header-row" className="flex h-16 lg:h-24">
        {/* A plain hash link: on the home page the smooth-scroll handler takes it, elsewhere it is a normal load */}
        <a
          href={href("/#home")}
          aria-label={t.homeLabel}
          data-intro="header-cell"
          className="flex w-16 shrink-0 items-center justify-center border-r border-ink transition-colors duration-[350ms] hover:bg-ink focus-visible:bg-ink active:bg-ink lg:w-24"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={48}
            height={48}
            priority
            className="h-9 w-9 lg:h-12 lg:w-12"
          />
        </a>

        <div
          data-intro="header-cell"
          className="hidden w-56 shrink-0 items-end border-r border-ink px-6 pb-3 xl:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
            {t.caption}
          </span>
        </div>

        <nav
          aria-label="Primary"
          data-intro="header-cell"
          className="hidden flex-1 border-r border-ink lg:flex"
        >
          {navItems.map((item) => {
            const isActive =
              pathname === "/"
                ? item.href === `/#${active}`
                : item.href === pathname;
            return (
              <a
                key={item.key}
                href={href(item.href)}
                aria-current={isActive ? "true" : undefined}
                className="group flex flex-1 items-center justify-center font-mono text-sm uppercase tracking-[0.05em] text-ink transition-colors duration-[350ms] hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg active:bg-ink active:text-bg"
              >
                {/* Cell fills on hover and an arrow slides in, as on the reference. */}
                <span
                  aria-hidden
                  className="w-0 overflow-hidden text-[10px] opacity-0 transition-all duration-[350ms] group-hover:mr-2 group-hover:w-2 group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:w-2 group-focus-visible:opacity-100"
                >
                  ▸
                </span>
                <span className="relative py-1">
                  {t[item.key]}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-current"
                    />
                  )}
                </span>
              </a>
            );
          })}
        </nav>

        <div
          data-intro="header-cell"
          className="hidden w-12 shrink-0 flex-col border-r border-ink lg:flex"
        >
          <a
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={`${socialCell} border-b border-ink`}
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://linkedin.com/in/emirsakarya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={socialCell}
          >
            <LinkedInIcon className="h-[18px] w-[18px]" />
          </a>
        </div>

        <div
          data-intro="header-cell"
          className="hidden w-12 shrink-0 border-r border-ink lg:flex"
        >
          <LocaleSwitch
            locale={locale}
            labels={langLabels}
            className="flex flex-1 flex-col [&>a:first-child]:border-b [&>a:first-child]:border-ink"
            linkClassName={`${socialCell} font-mono text-xs uppercase tracking-[0.05em] duration-[350ms] focus-visible:bg-ink focus-visible:text-bg`}
          />
        </div>

        <div
          data-intro="header-cell"
          className="hidden w-[22rem] shrink-0 flex-col lg:flex xl:w-[28rem]"
        >
          <p className="flex flex-1 items-center border-b border-ink px-5 font-serif text-lg leading-none xl:text-[22px]">
            {t.statusLine1}
          </p>
          <p className="flex flex-1 items-center gap-[0.3em] px-5 font-serif text-lg leading-none xl:text-[22px]">
            {t.statusLine2}
            <a
              href={href("/#contact")}
              className="underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] duration-[350ms] hover:decoration-[3px] focus-visible:decoration-[3px]"
            >
              {t.getInTouch}
            </a>
          </p>
        </div>

        <div data-intro="header-cell" className="flex-1 lg:hidden" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.openMenu}
          aria-expanded={open}
          data-intro="header-cell"
          className="flex w-16 items-center justify-center border-l border-ink bg-panel transition-colors duration-[350ms] hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg active:bg-ink active:text-bg lg:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      <MobileNav
        open={open}
        onClose={() => setOpen(false)}
        t={t}
        locale={locale}
      />
    </header>
  );
}

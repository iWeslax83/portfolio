"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Messages } from "@/lib/messages";
import { Menu } from "lucide-react";
import { SECTION_IDS, navItems } from "@/data/nav-items";
import { useActiveSection } from "@/lib/use-active-section";
import LocaleSwitch from "@/components/ui/locale-switch";
import { localizedPath, stripLocale } from "@/lib/locale-path";
import type { Locale } from "@/lib/locales";
import MobileNav from "./mobile-nav";

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
    <header className="relative z-40 border-b border-edge bg-bg">
      <div data-intro="header-row" className="mx-auto flex h-16 max-w-[1440px] lg:h-[72px]">
        {/* A plain hash link: on the home page the smooth-scroll handler takes it, elsewhere it is a normal load */}
        <a
          href={href("/#home")}
          aria-label={t.homeLabel}
          data-intro="header-cell"
          className="flex w-16 shrink-0 items-center justify-center border-r border-edge font-mono text-lg font-bold tracking-tight text-accent transition-colors duration-[350ms] hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg active:bg-ink active:text-bg lg:w-24"
        >
          ES_
        </a>

        <nav
          aria-label={t.primaryLabel}
          data-intro="header-cell"
          className="hidden flex-1 lg:flex"
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
                className="flex flex-1 items-center justify-center px-3 font-mono text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg"
              >
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

        <div className="flex-1 lg:hidden" />
        <p
          data-intro="header-cell"
          className="hidden shrink-0 items-center border-l border-edge px-5 font-mono text-xs text-ink-3 xl:flex"
        >
          {t.statusLine1}
        </p>
        <div data-intro="header-cell" className="hidden shrink-0 border-l border-edge lg:flex">
          <LocaleSwitch
            locale={locale}
            labels={langLabels}
            className="flex"
            linkClassName="flex items-center px-4 font-mono text-xs font-bold uppercase transition-colors hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.openMenu}
          aria-expanded={open}
          data-intro="header-cell"
          className="flex w-16 items-center justify-center border-l border-edge bg-panel transition-colors duration-[350ms] hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg active:bg-ink active:text-bg lg:hidden"
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

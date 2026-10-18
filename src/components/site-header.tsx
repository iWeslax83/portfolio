"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { SECTION_IDS, navItems } from "@/data/nav-items";
import { useActiveSection } from "@/lib/use-active-section";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import MobileNav from "./mobile-nav";

const socialCell =
  "flex flex-1 items-center justify-center transition-colors hover:bg-ink hover:text-bg active:bg-ink active:text-bg";

/**
 * Cell-grid header in normal flow (it scrolls away, like the reference's).
 * Desktop: logo, caption, nav, social, two-line tagline. Below lg: logo and
 * a burger that opens the full-screen menu.
 */
export default function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className="relative z-40 border-b border-ink bg-bg">
      <div data-intro="header-row" className="flex h-16 lg:h-24">
        <a
          href="#home"
          aria-label={t("homeLabel")} data-intro="header-cell"
          className="group flex w-16 shrink-0 items-center justify-center border-r border-ink transition-colors duration-[350ms] hover:bg-ink focus-visible:bg-ink active:bg-ink lg:w-24"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={48}
            height={48}
            priority
            className="h-9 w-9 transition-[filter] duration-[350ms] group-hover:invert group-focus-visible:invert group-active:invert lg:h-12 lg:w-12"
          />
        </a>

        <div data-intro="header-cell" className="hidden w-56 shrink-0 items-end border-r border-ink px-6 pb-3 xl:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
            {t("caption")}
          </span>
        </div>

        <nav
          aria-label="Primary" data-intro="header-cell"
          className="hidden flex-1 items-center justify-around border-r border-ink px-6 lg:flex"
        >
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.key}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 font-mono text-sm uppercase tracking-[0.05em] transition-colors ${
                  isActive ? "text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {t(item.key)}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-ink"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div data-intro="header-cell" className="hidden w-12 shrink-0 flex-col border-r border-ink lg:flex">
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

        <div data-intro="header-cell" className="hidden w-[22rem] shrink-0 flex-col lg:flex xl:w-[28rem]">
          <p className="flex flex-1 items-center border-b border-ink px-5 font-serif text-lg leading-none xl:text-[22px]">
            {t("statusLine1")}
          </p>
          <p className="flex flex-1 items-center gap-[0.3em] px-5 font-serif text-lg leading-none xl:text-[22px]">
            {t("statusLine2")}
            <a
              href="#contact"
              className="underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] duration-[350ms] hover:decoration-[3px] focus-visible:decoration-[3px]"
            >
              {t("getInTouch")}
            </a>
          </p>
        </div>

        <div data-intro="header-cell" className="flex-1 lg:hidden" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={open} data-intro="header-cell"
          className="flex w-16 items-center justify-center border-l border-ink bg-panel transition-colors duration-[350ms] hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg active:bg-ink active:text-bg lg:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

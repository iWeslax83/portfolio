"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/data/nav-items";
import { scrollToSection } from "@/lib/scroll-to-section";

const contactLinks = [
  { label: "Email", value: "emirsakarya00@gmail.com", href: "mailto:emirsakarya00@gmail.com" },
  { label: "GitHub", value: "github.com/iWeslax83", href: "https://github.com/iWeslax83" },
  { label: "LinkedIn", value: "linkedin.com/in/emirsakarya", href: "https://linkedin.com/in/emirsakarya" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer>
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-rule">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 md:h-20 border-b border-rule border-r last:border-r-0 sm:[&:nth-child(4n)]:border-r-0" />
        ))}
      </div>

      <div
        aria-hidden
        className="h-16 md:h-20"
        style={{
          backgroundImage: "radial-gradient(var(--color-bg) 1px, var(--color-ink) 1px)",
          backgroundSize: "8px 8px",
          backgroundColor: "var(--color-ink)",
        }}
      />

      <div className="relative bg-ink text-bg overflow-hidden">
        <p
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 translate-y-1/4 text-center font-display text-[18vw] font-extrabold leading-none tracking-tight opacity-[0.06] whitespace-nowrap"
        >
          {t("wordmark")}
        </p>

        <div className="relative px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto py-14 md:py-20">
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="annotate text-bg/60 mb-5">{t("contactHeading")}</p>
              <ul className="space-y-3">
                {contactLinks.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-baseline justify-between gap-4 font-mono text-sm hover:opacity-70 transition-opacity"
                    >
                      <span>{c.label}</span>
                      <span className="text-bg/50">{c.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="annotate text-bg/60 mb-5">{t("navHeading")}</p>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.href.slice(1));
                      }}
                      className="font-mono text-sm hover:opacity-70 transition-opacity"
                    >
                      {tNav(item.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-bg/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-mono text-[11px] text-bg/60">{t("colophon")}</p>
            <p className="annotate text-bg/60">{t("meta")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

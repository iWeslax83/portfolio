"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import MobileNav from "./mobile-nav";

const navItems = [
  { key: "home", href: "#home" },
  { key: "projects", href: "#projects" },
  { key: "skills", href: "#skills" },
  { key: "github", href: "#github" },
  { key: "contact", href: "#contact" },
];

export default function Nav() {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLocale = pathname.startsWith("/tr") ? "tr" : "en";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function switchLocale(locale: string) {
    const newPath = pathname.replace(/^\/(en|tr)/, `/${locale}`);
    router.push(newPath);
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          scrolled ? "bg-bg/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 flex items-center justify-between h-14">
          <a href="#home" className="font-mono text-sm font-semibold text-text-primary">
            emir<span className="text-accent">.</span>sakarya
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                {t(item.key)}
              </a>
            ))}

            <div className="flex gap-2 ml-3 pl-3 border-l border-card-border">
              <button
                onClick={() => switchLocale("en")}
                className={`font-mono text-xs px-2 py-0.5 rounded ${
                  currentLocale === "en"
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale("tr")}
                className={`font-mono text-xs px-2 py-0.5 rounded ${
                  currentLocale === "tr"
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                TR
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden font-mono text-text-secondary text-sm"
            aria-label="Open menu"
          >
            ≡
          </button>
        </div>
      </nav>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentLocale={currentLocale}
        onSwitchLocale={switchLocale}
      />
    </>
  );
}

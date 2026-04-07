"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";

const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "projects", href: "#projects", num: "01" },
  { key: "skills", href: "#skills", num: "02" },
  { key: "github", href: "#github", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
];

export default function Nav() {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const currentLocale = pathname.startsWith("/tr") ? "tr" : "en";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
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
                className={`font-mono text-xs transition-colors ${
                  activeSection === item.href.slice(1)
                    ? "text-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <span className="text-text-muted/50">{item.num}.</span>
                {t(item.key).replace("~/", "")}
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
            className="md:hidden text-text-secondary"
            aria-label="Open menu"
          >
            <Menu size={18} />
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

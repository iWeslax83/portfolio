"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          b.intersectionRatio > a.intersectionRatio ? b : a
        );
        setActiveSection(top.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          scrolled ? "bg-bg/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 flex items-center justify-between h-14">
          <a href="#home" className="flex items-center gap-2 font-mono text-sm font-semibold text-text-primary">
            <Image
              src="/images/logo.webp"
              alt="Emir Sakarya logo"
              width={24}
              height={24}
              priority
              className="h-6 w-6 rounded-sm"
            />
            <span>
              emir<span className="text-accent">.</span>sakarya
            </span>
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
      />
    </>
  );
}

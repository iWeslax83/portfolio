"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";

export const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "stratos", href: "#stratos", num: "01" },
  { key: "projects", href: "#projects", num: "02" },
  { key: "skills", href: "#skills", num: "03" },
  { key: "github", href: "#github", num: "04" },
  { key: "contact", href: "#contact", num: "05" },
];

export default function Nav() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
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
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
          scrolled
            ? "bg-bg/70 backdrop-blur-xl border-b border-card-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          <a
            href="#home"
            className="flex items-center gap-2 font-mono text-sm font-semibold text-text-primary"
          >
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

          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className={`relative font-mono text-xs pb-1 transition-colors ${
                    active ? "text-accent" : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <span className="text-text-muted/40 mr-1">{item.num}.</span>
                  {t(item.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-text-secondary"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

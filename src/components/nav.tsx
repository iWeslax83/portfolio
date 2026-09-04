"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";

export const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "flightLog", href: "#flight-log", num: "01" },
  { key: "founderStory", href: "#founder-story", num: "02" },
  { key: "telemetry", href: "#telemetry", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
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

  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });

  const activeNum =
    navItems.find((i) => i.href.slice(1) === activeSection)?.num ?? "00";

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled
            ? "bg-bg border-b border-rule"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-between h-16">
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="group flex items-center gap-2.5">
            <Image
              src="/images/logo.webp"
              alt="Emir Sakarya logo"
              width={22}
              height={22}
              priority
              className="h-[22px] w-[22px]"
            />
            <span className="font-display text-sm font-semibold text-ink">
              emir<span className="text-ink">.</span>sakarya
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1">
              <span className="border border-rule px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-ink-3">
                {activeNum}
              </span>
              <span className="relative h-3.5 w-8 border border-rule overflow-hidden">
                <motion.span
                  style={{ scaleX: barScale }}
                  className="absolute inset-0 origin-left bg-ink"
                />
              </span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navItems.slice(1).map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative font-mono text-xs pb-1 transition-colors ${
                    active ? "text-ink" : "text-ink-3 hover:text-ink-2"
                  }`}
                >
                  <span className="text-ink-3 mr-1.5">{item.num}</span>
                  {t(item.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-px h-px bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-ink-2"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </motion.nav>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { navItems } from "@/data/nav-items";

/** Full-screen black menu sheet with numbered serif links. */
export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className="fixed inset-0 z-[70] flex flex-col bg-ink p-6 text-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("closeMenu")}
              className="flex h-12 w-12 items-center justify-center border border-bg/30 active:bg-bg active:text-ink"
            >
              <X size={22} />
            </button>
          </div>

          <nav aria-label={t("menu")} className="mt-10 flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 border-b border-bg/20 py-5 font-serif text-4xl active:opacity-70"
              >
                <span className="font-mono text-xs text-bg/60">{item.num}</span>
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex gap-6 font-mono text-xs uppercase tracking-[0.1em] text-bg/70">
            <a
              href="https://github.com/iWeslax83"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/emirsakarya"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

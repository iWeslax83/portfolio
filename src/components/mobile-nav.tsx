"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { spring } from "@/lib/motion";

const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "projects", href: "#projects", num: "01" },
  { key: "skills", href: "#skills", num: "02" },
  { key: "github", href: "#github", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
];

export default function MobileNav({
  open,
  onClose,
  currentLocale,
  onSwitchLocale,
}: {
  open: boolean;
  onClose: () => void;
  currentLocale: string;
  onSwitchLocale: (locale: string) => void;
}) {
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-64 bg-bg border-l border-card-border z-50 p-8 flex flex-col gap-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
          >
            <button
              onClick={onClose}
              className="self-end text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <span className="text-text-muted/50 mr-2">{item.num}.</span>
                {t(item.key).replace("~/", "")}
              </a>
            ))}

            <div className="flex gap-3 mt-4 pt-4 border-t border-card-border">
              <button
                onClick={() => {
                  onSwitchLocale("en");
                  onClose();
                }}
                className={`font-mono text-xs px-3 py-1 rounded ${
                  currentLocale === "en"
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  onSwitchLocale("tr");
                  onClose();
                }}
                className={`font-mono text-xs px-3 py-1 rounded ${
                  currentLocale === "tr"
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted"
                }`}
              >
                TR
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

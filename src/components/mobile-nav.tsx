"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { spring } from "@/lib/motion";
import { navItems } from "./nav";

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-72 bg-panel border-l border-rule z-50 p-8 flex flex-col gap-7"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
          >
            <div className="flex items-center justify-between">
              <span className="annotate">menu</span>
              <button
                onClick={onClose}
                className="text-ink-3 hover:text-ink transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ...spring }}
                  className="group flex items-baseline gap-3 border-b border-rule py-4 font-display text-lg text-ink-2 hover:text-accent transition-colors"
                >
                  <span className="font-mono text-[11px] text-ink-3 group-hover:text-accent transition-colors">
                    {item.num}
                  </span>
                  {t(item.key)}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

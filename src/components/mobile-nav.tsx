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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-72 bg-panel border-l border-card-border z-50 p-8 flex flex-col gap-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
          >
            <button
              onClick={onClose}
              className="self-end text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {navItems.map((item, i) => (
              <motion.a
                key={item.key}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, ...spring }}
                className="font-mono text-base text-text-secondary hover:text-accent transition-colors"
              >
                <span className="text-text-muted/40 mr-2">{item.num}.</span>
                {t(item.key)}
              </motion.a>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

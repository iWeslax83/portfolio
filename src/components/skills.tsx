"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Server, Cpu, Boxes, type LucideIcon } from "lucide-react";
import { skills } from "@/data/skills";
import SectionMarker from "./ui/section-marker";

const categoryIcons: Record<string, LucideIcon> = {
  frontend: LayoutDashboard,
  backend: Server,
  ai_embedded: Cpu,
  devops: Boxes,
};
import {
  staggerContainer,
  staggerFast,
  popIn,
  slideInLeft,
  slideInRight,
  viewportOnce,
} from "@/lib/motion";

const allItems = skills.flatMap((s) => s.items);

export default function Skills() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="py-24 md:py-32 px-6 md:px-10 max-w-[1320px] mx-auto">
      <SectionMarker command={t("command")} title={t("title")} index="03" />

      <motion.div
        className="grid md:grid-cols-2 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        {skills.map((category, idx) => {
          const Icon = categoryIcons[category.key] ?? Cpu;
          return (
            <motion.div
              key={category.key}
              variants={idx % 2 === 0 ? slideInLeft : slideInRight}
              className="rounded-xl border border-card-border bg-card-bg p-6 transition-colors hover:border-card-border-hover"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Icon size={14} strokeWidth={1.9} />
                </span>
                <p className="font-mono text-xs text-accent">{category.label}</p>
              </div>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={staggerFast}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {category.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={popIn}
                    className="font-mono text-xs text-text-secondary bg-white/[0.04] border border-card-border px-3 py-1.5 rounded-md transition-colors hover:border-accent/40 hover:text-text-primary"
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Perpetual drift marquee */}
      <div
        className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
        aria-hidden
      >
        <div
          className="flex w-max animate-marquee gap-3"
          style={{ "--marquee-duration": "42s" } as React.CSSProperties}
        >
          {[...allItems, ...allItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-mono text-[11px] text-text-muted/70 border border-card-border rounded-full px-3.5 py-1.5 whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

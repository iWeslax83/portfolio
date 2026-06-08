"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { skills } from "@/data/skills";
import FigureMarker from "./ui/figure-marker";
import {
  staggerContainer,
  staggerFast,
  fadeRise,
  markIn,
  viewportOnce,
} from "@/lib/motion";

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai_embedded: "AI & Embedded",
  devops: "DevOps & Infra",
};

export default function Skills() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <FigureMarker code="FIG. 03" title={t("title")} annotation={t("kicker")} />

      <motion.div
        className="border-t border-rule"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        {skills.map((category) => (
          <motion.div
            key={category.key}
            variants={fadeRise}
            className="group grid md:grid-cols-[14rem_1fr] gap-x-10 gap-y-3 border-b border-rule py-7 transition-colors hover:border-rule-strong"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-accent tabular-nums">
                {String(category.items.length).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-medium text-ink">
                {categoryLabels[category.key] ?? category.key}
              </h3>
            </div>

            <motion.ul
              className="flex flex-wrap gap-x-7 gap-y-2.5"
              variants={staggerFast}
            >
              {category.items.map((item) => (
                <motion.li
                  key={item}
                  variants={markIn}
                  className="font-mono text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

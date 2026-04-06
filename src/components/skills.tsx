"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { skills } from "@/data/skills";
import SectionHeader from "./section-header";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export default function Skills() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="py-20 px-6 md:px-10 max-w-5xl mx-auto">
      <SectionHeader prompt={t("prompt")} title={t("title")} />

      <motion.div
        className="grid md:grid-cols-2 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        {skills.map((category) => (
          <motion.div
            key={category.key}
            variants={fadeInUp}
            className="bg-card-bg border border-card-border rounded-lg p-5"
          >
            <p className="font-mono text-xs text-accent mb-3">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="font-mono text-xs text-text-secondary bg-white/[0.04] border border-card-border px-3 py-1.5 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

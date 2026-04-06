"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeader from "./section-header";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const contacts = [
  {
    key: "email",
    icon: "@",
    value: "emirsakarya00@gmail.com",
    href: "mailto:emirsakarya00@gmail.com",
  },
  {
    key: "githubLabel",
    icon: "GH",
    value: "github.com/iWeslax83",
    href: "https://github.com/iWeslax83",
  },
  {
    key: "linkedin",
    icon: "in",
    value: "linkedin.com/in/emirsakarya",
    href: "https://linkedin.com/in/emirsakarya",
  },
];

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-20 px-6 md:px-10 max-w-5xl mx-auto">
      <SectionHeader prompt={t("prompt")} title={t("title")} />
      <p className="font-sans text-sm text-text-muted -mt-4 mb-8">
        {t("subtitle")}
      </p>

      <motion.div
        className="flex flex-col md:flex-row gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        {contacts.map((contact) => (
          <motion.a
            key={contact.key}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            className="flex items-center gap-3 bg-card-bg border border-card-border rounded-lg px-7 py-5 flex-1 hover:border-card-border-hover transition-colors"
          >
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-accent flex-shrink-0">
              {contact.icon}
            </div>
            <div>
              <div className="font-mono text-sm font-medium text-text-secondary">
                {t(contact.key)}
              </div>
              <div className="font-mono text-xs text-text-muted mt-0.5">
                {contact.value}
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

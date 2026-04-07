"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import SectionHeader from "./section-header";
import { staggerContainer, fadeInUp } from "@/lib/motion";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const contacts = [
  {
    key: "email",
    icon: <Mail size={18} />,
    value: "emirsakarya00@gmail.com",
    href: "mailto:emirsakarya00@gmail.com",
  },
  {
    key: "githubLabel",
    icon: <GitHubIcon className="w-[18px] h-[18px]" />,
    value: "github.com/iWeslax83",
    href: "https://github.com/iWeslax83",
  },
  {
    key: "linkedin",
    icon: <LinkedInIcon className="w-[18px] h-[18px]" />,
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
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent flex-shrink-0">
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

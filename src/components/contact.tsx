"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, ArrowUpRight } from "lucide-react";
import SectionMarker from "./ui/section-marker";
import { staggerContainer, liftIn, fadeInUp, viewportOnce } from "@/lib/motion";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
    <section id="contact" className="py-24 md:py-32 px-6 md:px-10 max-w-[1320px] mx-auto">
      <SectionMarker command={t("command")} title={t("title")} index="05" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="-mt-5 mb-10"
      >
        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-ring" />
          open to work
        </motion.span>
        <motion.p
          variants={fadeInUp}
          className="font-body text-base text-text-secondary mt-4 max-w-lg"
        >
          {t("subtitle")}
        </motion.p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        style={{ perspective: 1200 }}
      >
        {contacts.map((contact) => (
          <motion.a
            key={contact.key}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={liftIn}
            whileHover={{ y: -5 }}
            className="group flex items-center gap-3.5 rounded-xl border border-card-border bg-card-bg px-6 py-5 transition-colors hover:border-card-border-hover"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform group-hover:scale-110">
              {contact.icon}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-sm font-medium text-text-primary">
                {t(contact.key)}
              </div>
              <div className="font-mono text-[11px] text-text-muted mt-0.5 truncate">
                {contact.value}
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="ml-auto flex-shrink-0 text-text-muted opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
            />
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

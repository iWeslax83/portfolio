"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, ArrowUpRight } from "lucide-react";
import FigureMarker from "./ui/figure-marker";
import {
  staggerContainer,
  staggerFast,
  fadeRise,
  lineReveal,
  markIn,
  viewportOnce,
} from "@/lib/motion";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const contacts = [
  {
    key: "email",
    code: "01",
    icon: <Mail size={18} strokeWidth={1.6} />,
    value: "emirsakarya00@gmail.com",
    href: "mailto:emirsakarya00@gmail.com",
  },
  {
    key: "githubLabel",
    code: "02",
    icon: <GitHubIcon className="w-[18px] h-[18px]" />,
    value: "github.com/iWeslax83",
    href: "https://github.com/iWeslax83",
  },
  {
    key: "linkedin",
    code: "03",
    icon: <LinkedInIcon className="w-[18px] h-[18px]" />,
    value: "linkedin.com/in/emirsakarya",
    href: "https://linkedin.com/in/emirsakarya",
  },
];

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <FigureMarker code="FIG. 05" title={t("title")} annotation={t("kicker")} />

      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-start">
        {/* Left - the call */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <h3 className="font-display text-[2.1rem] sm:text-5xl md:text-[3.25rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                {t("ctaLine1")}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block text-accent">
                {t("ctaLine2")}
              </motion.span>
            </span>
          </h3>
          <motion.p
            variants={fadeRise}
            className="font-body text-base text-ink-2 mt-6 max-w-md leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>
          <motion.p variants={markIn} className="annotate mt-7 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-signal" aria-hidden />
            {t("availability")}
          </motion.p>
        </motion.div>

        {/* Right - the channels */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerFast}
        >
          {contacts.map((contact) => (
            <motion.a
              key={contact.key}
              variants={fadeRise}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-rule py-6 transition-colors hover:border-rule-strong last:border-b"
            >
              <span className="font-mono text-[11px] text-accent tabular-nums">{contact.code}</span>
              <div>
                <div className="flex items-center gap-2.5 text-ink transition-colors group-hover:text-accent">
                  <span className="text-ink-2 transition-colors group-hover:text-accent">
                    {contact.icon}
                  </span>
                  <span className="font-display text-lg font-medium">{t(contact.key)}</span>
                </div>
                <p className="font-mono text-[11px] text-ink-3 mt-1.5 truncate">{contact.value}</p>
              </div>
              <ArrowUpRight
                size={18}
                className="text-ink-3 transition-all duration-300 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Mail, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import RadialBurst from "@/components/ui/radial-burst";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import WavyDivider from "@/components/ui/wavy-divider";
import { scrollToSection } from "@/lib/scroll-to-section";
import CheckpointShell from "./CheckpointShell";

const contacts = [
  { key: "email", code: "01", icon: <Mail size={18} strokeWidth={1.6} />, value: "emirsakarya00@gmail.com", href: "mailto:emirsakarya00@gmail.com" },
  { key: "githubLabel", code: "02", icon: <GitHubIcon className="w-[18px] h-[18px]" />, value: "github.com/iWeslax83", href: "https://github.com/iWeslax83" },
  { key: "linkedin", code: "03", icon: <LinkedInIcon className="w-[18px] h-[18px]" />, value: "linkedin.com/in/emirsakarya", href: "https://linkedin.com/in/emirsakarya" },
];

export default function Landing({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("contact");

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />

        <div className="relative flex items-center justify-center py-16 md:py-24 mb-12 md:mb-16">
          <RadialBurst className="absolute inset-0 -z-10 h-full w-full opacity-40" />
          <p className="font-condensed text-center text-[clamp(2.5rem,9vw,6rem)] leading-[0.95] tracking-wide text-ink uppercase">
            {t("ctaLine1")}
            <br />
            {t("ctaLine2")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-12 md:mb-16">
          <WavyDivider className="h-3 w-24" />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-mono text-xs font-semibold tracking-wide text-bg transition-[filter] hover:brightness-105"
          >
            {t("go")}
          </a>
          <WavyDivider className="h-3 w-24 rotate-180" />
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="font-body text-base text-ink-2 max-w-md leading-relaxed">{t("subtitle")}</p>
            <p className="annotate mt-5 flex items-center gap-2.5">
              <span className="status-dot animate-signal" aria-hidden />
              {t("availability")}
            </p>
          </div>

          <div>
            {contacts.map((contact) => (
              <a
                key={contact.key}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-rule py-6 hover:border-rule-strong last:border-b transition-colors"
              >
                <span className="font-mono text-[11px] text-ink tabular-nums">{contact.code}</span>
                <div>
                  <div className="flex items-center gap-2.5 text-ink transition-colors">
                    <span className="text-ink-2 group-hover:text-ink transition-colors">{contact.icon}</span>
                    <span className="font-display text-lg font-medium">{t(contact.key)}</span>
                  </div>
                  <p className="font-mono text-[11px] text-ink-3 mt-1.5 truncate">{contact.value}</p>
                </div>
                <ArrowUpRight size={18} className="text-ink-3 group-hover:text-ink transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </CheckpointShell>
  );
}

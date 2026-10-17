"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ventures, type Venture } from "@/data/ventures";
import { spring, viewportOnce } from "@/lib/motion";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";
import RoomBackground from "@/components/sections/about/RoomBackground";

function Row({ venture, index }: { venture: Venture; index: number }) {
  return (
    <div className="grid gap-6 px-4 py-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:py-12">
      <p className="break-words font-display text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85]">
        {venture.name}
        {venture.href && (
          <span
            aria-hidden
            className="ml-3 inline-block align-top text-[0.35em] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        )}
      </p>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-2">
          {String(index + 1).padStart(2, "0")} · {venture.role}
        </p>
        <p className="mt-3 font-serif text-xl leading-[1.5]">{venture.proof}</p>
        {venture.units && (
          <ul className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">
            {venture.units.map((u) => (
              <li key={u.name}>
                {u.name} · {u.detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Ventures() {
  const t = useTranslations("ventures");

  return (
    <section
      id="ventures"
      aria-labelledby="ventures-title"
      className="relative overflow-clip border-t border-ink"
    >
      <RoomBackground className="opacity-15" />
      <h2 id="ventures-title" className={`relative ${SECTION_BAR}`}>
        {t("title")}
      </h2>
      <ul className="relative">
        {ventures.map((v, i) => (
          <motion.li
            key={v.name}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={spring}
            className="border-b border-ink"
          >
            {v.href ? (
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block transition-colors hover:bg-panel"
              >
                <Row venture={v} index={i} />
              </a>
            ) : (
              <Row venture={v} index={i} />
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

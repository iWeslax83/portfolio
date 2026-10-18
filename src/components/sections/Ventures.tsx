"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ventures, type Venture } from "@/data/ventures";
import { gsap, SplitText, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { revealOnce } from "@/lib/reveal";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";
import RoomBackground from "@/components/sections/about/RoomBackground";

function Row({ venture, index }: { venture: Venture; index: number }) {
  return (
    <div className="grid gap-6 px-4 py-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:py-12">
      <p
        data-venture-name
        className="break-words font-display text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85]"
      >
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
  const scope = useRef<HTMLElement>(null);

  // Rows slide in from the left, staggered, and each big name rises out of
  // a clip. Start states are client-only, so the rows read without JS.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const list = q("[data-venture-list]")[0];
        const rows = q("[data-venture-row]");
        // SplitText note: revert() restores the original markup via innerHTML,
        // so the split nodes must stay static text (no React children or refs).
        const split = SplitText.create(q("[data-venture-name]"), {
          type: "words",
          mask: "words",
          aria: "none",
        });
        const tl = gsap
          .timeline({ paused: true, onComplete: () => split.revert() })
          .fromTo(
            rows,
            { x: -60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: EASE.enter,
              stagger: 0.1,
            },
          )
          .fromTo(
            split.words,
            { yPercent: 100 },
            { yPercent: 0, duration: 1.2, ease: EASE.enter, stagger: 0.06 },
            0.1,
          );
        revealOnce(list, () => tl.play(), "top 80%");
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="ventures"
      aria-labelledby="ventures-title"
      className="relative overflow-clip border-t border-ink"
    >
      <RoomBackground className="opacity-15" />
      <h2 id="ventures-title" className={`relative ${SECTION_BAR}`}>
        {t("title")}
      </h2>
      <ul data-venture-list className="relative">
        {ventures.map((v, i) => (
          <li key={v.name} data-venture-row className="border-b border-ink">
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
          </li>
        ))}
      </ul>
    </section>
  );
}

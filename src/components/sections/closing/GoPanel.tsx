"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/data/contact";
import { lensGrid } from "@/lib/warped-grid";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import WarpedGrid from "@/components/ui/warped-grid";

/** Lens centre in the grid's 1000x600 viewBox; GO sits on it. */
const LENS = { cx: 500, cy: 270 };
const grid = lensGrid({
  cols: 12,
  rows: 8,
  ...LENS,
  radius: 300,
  strength: 0.45,
});

export default function GoPanel() {
  const t = useTranslations("closing");
  const disc = useRef<HTMLSpanElement>(null);

  // A slow breathing pulse on the disc. The link itself carries the hover
  // scale (CSS), so the two transforms never fight over one element.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // Only breathes while on screen, so it costs nothing elsewhere.
      const pulse = gsap.fromTo(
        disc.current,
        { scale: 0.92 },
        {
          scale: 1.04,
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        },
      );
      ScrollTrigger.create({
        trigger: disc.current,
        onToggle: (self) => (self.isActive ? pulse.play() : pulse.pause()),
      });
    });
    return () => mm.revert();
  });

  return (
    <div className="relative h-[75vh] min-h-[460px] overflow-clip border-t border-ink">
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={t("goLabel")}
        style={{ top: `${(LENS.cy / 600) * 100}%` }}
        className="group absolute left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-4xl text-bg transition-[scale] duration-[400ms] hover:scale-[1.18] focus-visible:scale-[1.18] active:scale-95"
      >
        <span
          ref={disc}
          aria-hidden
          className="absolute inset-0 rounded-full bg-ink"
        />
        <span className="relative">{t("go")}</span>
      </a>
    </div>
  );
}

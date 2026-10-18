"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/data/contact";
import { warpedGrid } from "@/lib/warped-grid";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import WarpedGrid from "@/components/ui/warped-grid";

const grid = warpedGrid({ cols: 12, rows: 5, bulge: -20 });

export default function GoPanel() {
  const t = useTranslations("closing");
  const disc = useRef<HTMLSpanElement>(null);

  // A slow breathing pulse on the disc. The link itself carries the hover
  // scale (CSS), so the two transforms never fight over one element.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        disc.current,
        { scale: 0.92 },
        { scale: 1.04, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
    });
    return () => mm.revert();
  });

  return (
    <div className="relative h-[60vh] min-h-[420px] overflow-clip border-t border-ink">
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={t("goLabel")}
        className="group absolute left-1/2 top-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full font-display text-4xl text-bg transition-[scale] duration-[400ms] hover:scale-[1.18] focus-visible:scale-[1.18] active:scale-95"
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

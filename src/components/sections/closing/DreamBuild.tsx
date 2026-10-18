"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { revealOnce } from "@/lib/reveal";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

const grid = warpedGrid({ cols: 12, rows: 6, bulge: 24 });

function Line({ text, side }: { text: string; side: "left" | "right" }) {
  return (
    <p
      aria-hidden
      data-dream-line={side}
      className="relative flex justify-center font-condensed text-[clamp(4rem,12vw,11rem)] font-bold leading-none tracking-[-0.01em] text-ink"
    >
      {text.split("").map((c, i) => (
        <span key={i} data-dream-char className="inline-block whitespace-pre">
          {c}
        </span>
      ))}
    </p>
  );
}

/**
 * DREAM IT slides in from the left and BUILD IT from the right, letter by
 * letter, when the block enters. Both rest fully black and tightly set; no
 * pin and no scrubbing, so the resting state is always the readable one.
 */
export default function DreamBuild() {
  const t = useTranslations("closing");
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const dream = q("[data-dream-line='left'] [data-dream-char]");
        const build = q("[data-dream-line='right'] [data-dream-char]");
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: EASE.enter } })
          .fromTo(
            dream,
            { xPercent: -160, autoAlpha: 0 },
            { xPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05 },
            0,
          )
          .fromTo(
            build,
            { xPercent: 160, autoAlpha: 0 },
            {
              xPercent: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: { each: 0.05, from: "end" },
            },
            0.25,
          );
        revealOnce(scope.current, () => tl.play(), "top 65%");
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative flex min-h-[80vh] flex-col justify-center gap-4 overflow-clip border-t border-ink py-24"
    >
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <p className="sr-only">{t("dreamBuild")}</p>
      <Line text="DREAM IT" side="left" />
      <Line text="BUILD IT" side="right" />
    </div>
  );
}

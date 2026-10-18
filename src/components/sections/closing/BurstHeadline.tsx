"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { revealOnce } from "@/lib/reveal";
import { radialRaysFrom } from "@/lib/radial-burst";
import { polylineLength } from "@/lib/polyline-length";
import RadialBurst from "@/components/ui/radial-burst";

const CX = 500;
const CY = 40;
const rays = radialRaysFrom(CX, CY, 64, 1400);

/**
 * Ray burst over a leaning four-line headline, standing on a ruled floor.
 * The headline and the floor are in normal flow (the block grows to fit
 * them), so the floor can never cover the last line at any viewport.
 */
export default function BurstHeadline() {
  const t = useTranslations("closing");
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const svg = scope.current?.querySelector("[data-burst] svg");
        const lines = gsap.utils.toArray<SVGLineElement>(
          q("[data-burst] line"),
        );
        const words = q("[data-headline-line]");
        const disc = q("[data-burst-disc]");

        // Non-scaling strokes on a stretched viewBox: dashes are measured in
        // screen pixels, so scale each ray before measuring it.
        const box = svg?.getBoundingClientRect();
        const sx = box ? box.width / 1000 : 1;
        const sy = box ? box.height / 1000 : 1;
        const lengths = rays.map(
          (r) => polylineLength(`M${CX},${CY} L${r.x2},${r.y2}`, sx, sy) + 2,
        );

        const tl = gsap
          .timeline({
            paused: true,
            onComplete: () => {
              gsap.set(lines, {
                clearProps: "strokeDasharray,strokeDashoffset",
              });
            },
          })
          .fromTo(
            disc,
            { scale: 0 },
            { scale: 1, duration: 0.9, ease: EASE.enter },
            0,
          )
          .fromTo(
            lines,
            {
              strokeDasharray: (i: number) => `${lengths[i]} ${lengths[i]}`,
              strokeDashoffset: (i: number) => lengths[i],
            },
            {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: EASE.enter,
              stagger: { amount: 0.4, from: "center" },
            },
            0.1,
          )
          .fromTo(
            words,
            { yPercent: 60, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 1.2,
              ease: EASE.enter,
              stagger: 0.1,
            },
            0.25,
          );
        revealOnce(scope.current, () => tl.play(), "top 75%");
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative flex min-h-[90vh] flex-col overflow-clip"
    >
      <div data-burst className="absolute inset-0">
        <RadialBurst
          rays={rays}
          cx={CX}
          cy={CY}
          stroke="var(--color-ink)"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <span
        data-burst-disc
        aria-hidden
        className="absolute left-1/2 top-[4%] -ml-7 -mt-7 h-14 w-14 rounded-full border border-ink bg-bg"
      />
      <div className="relative flex flex-1 items-end justify-center px-4 pb-[5vh] pt-[20vh] [perspective:1200px]">
        <h2
          id="contact-title"
          className="flex origin-bottom flex-col items-center text-center font-display uppercase leading-[0.95] text-ink [transform:rotateX(12deg)]"
        >
          <span
            data-headline-line
            className="block text-[clamp(2rem,min(5vw,8vh),4.25rem)]"
          >
            {t("line1")}
          </span>
          <span
            data-headline-line
            className="block text-[clamp(2.5rem,min(7vw,11vh),6rem)]"
          >
            {t("line2")}
          </span>
          <span
            data-headline-line
            className="block text-[clamp(3.5rem,min(13vw,17vh),10rem)]"
          >
            {t("line3")}
          </span>
          <span
            data-headline-line
            className="block text-[clamp(5rem,min(26vw,27vh),16rem)]"
          >
            {t("line4")}
          </span>
        </h2>
      </div>
      <div
        aria-hidden
        className="relative grid h-[14vh] min-h-20 grid-cols-12 border-t border-ink bg-bg"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="border-r border-ink last:border-r-0" />
        ))}
      </div>
    </div>
  );
}

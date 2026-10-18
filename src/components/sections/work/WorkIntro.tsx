"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";
import DotPattern from "@/components/ui/dot-pattern";

const introGrid = warpedGrid({ cols: 12, rows: 7, bulge: 18 });

/** Same dot texture as the gallery stage, so the hand-off has no seam. */
export const STAGE_DOTS = { color: "rgba(255,255,255,0.18)", gap: 16 } as const;

/**
 * Black capsule on a grid. On scroll only its background grows until the
 * screen is black; the WORK letters fade and shrink out early, so no giant
 * cropped letters ever fill the screen.
 */
export default function WorkIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          })
          .to(
            q("[data-intro-letters]"),
            { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "power2.in" },
            0,
          )
          .to(
            q("[data-intro-capsule-dots]"),
            { autoAlpha: 0, duration: 0.4 },
            0.1,
          )
          .to(
            q("[data-intro-capsule]"),
            { scale: 22, duration: 0.8, ease: EASE.scaleUp },
            0.05,
          )
          // Once the capsule covers the screen, swap to the gallery's own
          // backdrop so the next stage starts on an identical frame.
          .fromTo(
            q("[data-intro-cover]"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.05 },
            0.82,
          )
          .set({}, {}, 1);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <WarpedGrid
          paths={introGrid}
          className="absolute inset-0 h-full w-full"
        />
        <div className="relative h-[300px] w-[150px]">
          <div
            data-intro-capsule
            className="absolute inset-0 overflow-hidden rounded-full bg-ink"
          >
            <span data-intro-capsule-dots className="absolute inset-0">
              <DotPattern
                color="rgba(255,255,255,0.35)"
                className="absolute inset-0 h-full w-full"
              />
            </span>
          </div>
          <p
            data-intro-letters
            aria-hidden
            className="relative flex h-full flex-col items-center justify-center font-display text-6xl leading-[0.95] text-bg"
          >
            {"WORK".split("").map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </div>
        <div
          data-intro-cover
          aria-hidden
          className="invisible absolute inset-0 bg-ink"
        >
          <DotPattern
            color={STAGE_DOTS.color}
            gap={STAGE_DOTS.gap}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

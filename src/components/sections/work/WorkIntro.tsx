"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";
import DotPattern from "@/components/ui/dot-pattern";

const introGrid = warpedGrid({ cols: 12, rows: 7, bulge: 0 });

/** Same dot texture as the gallery stage, so the hand-off has no seam. */
export const STAGE_DOTS = { color: "rgba(255,255,255,0.18)", gap: 16 } as const;

/**
 * Black capsule on a grid, used on both sides of the gallery.
 *
 * "in": on scroll the capsule first grows into a full-height black column,
 * then widens until the screen is black, handing off to the gallery.
 * "out": the same timeline played backwards, so the black stage folds back
 * into the capsule, which then scrolls away with its grid.
 *
 * The WORK letters fade early (in) or late (out), so no giant cropped
 * letters ever fill the screen.
 */
export default function WorkIntro({ mode = "in" }: { mode?: "in" | "out" }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const q = gsap.utils.selector(ref);
        // Scale to a full-height column (with margin, so the rounded ends
        // sit off screen), then to the full width.
        const box = q("[data-intro-capsule]")[0].getBoundingClientRect();
        const tall = (window.innerHeight * 1.6) / box.height;
        const wide = (window.innerWidth * 1.3) / box.width;
        const tl = gsap
          .timeline({
            paused: true,
            defaults: { ease: "none" },
          })
          .to(
            q("[data-intro-letters]"),
            { autoAlpha: 0, scaleY: 1.6, duration: 0.3, ease: "power2.in" },
            0,
          )
          .to(
            q("[data-intro-capsule-dots]"),
            { autoAlpha: 0, duration: 0.4 },
            0.1,
          )
          .to(
            q("[data-intro-capsule]"),
            { scaleY: tall, scaleX: 2, duration: 0.4, ease: EASE.scaleUp },
            0.05,
          )
          .to(
            q("[data-intro-capsule]"),
            { scaleX: wide, duration: 0.35, ease: "power2.in" },
            0.45,
          )
          // Once the capsule covers the screen, swap to the gallery's own
          // backdrop so the next stage starts on an identical frame.
          .fromTo(
            q("[data-intro-cover]"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.05 },
            0.8,
          )
          .set({}, {}, 1);

        if (mode === "out") {
          // The outro is pulled up over the gallery's last viewport. Keep it
          // invisible while it rises over the pinned gallery, and show it the
          // moment it pins, when it lines up with the gallery's last frame.
          const stage = q("[data-intro-stage]");
          gsap.set(stage, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: ref.current,
            start: "top top",
            onToggle: (self) =>
              gsap.set(stage, { autoAlpha: self.isActive ? 1 : 0 }),
            onLeave: () => gsap.set(stage, { autoAlpha: 1 }),
          });
        }

        const state = { p: mode === "in" ? 0 : 1 };
        tl.progress(state.p);
        gsap.to(state, {
          p: mode === "in" ? 1 : 0,
          ease: "none",
          onUpdate: () => tl.progress(state.p),
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [mode] },
  );

  return (
    <div
      ref={ref}
      className={`relative h-[150vh] ${mode === "out" ? "z-[2] -mt-[100vh]" : ""}`}
    >
      <div
        data-intro-stage
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-bg"
      >
        <WarpedGrid
          paths={introGrid}
          className="absolute inset-0 h-full w-full"
        />
        <div className="relative h-[80vh] w-[37vh]">
          <div
            data-intro-capsule
            className="absolute inset-0 overflow-hidden rounded-full bg-ink outline outline-1 outline-offset-[1.2vh] outline-ink"
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
            className="relative flex h-full flex-col items-center justify-center font-display text-[16vh] leading-[0.92] text-bg"
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

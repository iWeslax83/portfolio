"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

/** Bowed outward like the reference's backdrop behind the two lines. */
const grid = warpedGrid({ cols: 12, rows: 7, bulge: 36 });

const LINE =
  "whitespace-nowrap font-condensed text-[clamp(4rem,11vw,10rem)] font-bold leading-[0.9] tracking-[0.02em]";

/**
 * One line and its reflection: the same words flipped under it in flat
 * gray, cut to the top half so it reads as a reflection on the floor.
 */
function Line({ text, side }: { text: string; side: "left" | "right" }) {
  return (
    <div
      data-dream-line={side}
      className={`relative flex ${side === "right" ? "justify-end" : "justify-start"}`}
    >
      <div className="relative">
        <p aria-hidden className={`${LINE} text-ink`}>
          {text}
        </p>
        <p
          aria-hidden
          className={`${LINE} absolute inset-x-0 top-full h-[0.45em] overflow-hidden text-rule-strong`}
        >
          <span className="block -scale-y-100">{text}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * DREAM IT sits right and BUILD IT left, each over its reflection, on a
 * square grid. As the block scrolls through, the two lines cross to the
 * opposite sides. Both lines stay whole and solid black at every point, so
 * any resting state is readable.
 */
export default function DreamBuild() {
  const t = useTranslations("closing");
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const dream = q("[data-dream-line='right'] > div");
        const build = q("[data-dream-line='left'] > div");
        // How far each line travels to reach the opposite side.
        const travel = (el: Element) =>
          (el.parentElement?.clientWidth ?? 0) - el.getBoundingClientRect().width;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scope.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(dream, { x: 0 }, { x: () => -travel(dream[0]) }, 0)
          .fromTo(build, { x: 0 }, { x: () => travel(build[0]) }, 0);
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative flex min-h-[80vh] flex-col justify-start gap-[14vh] overflow-clip px-4 pb-16 pt-[6vh] sm:px-6"
    >
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <p className="sr-only">{t("dreamBuild")}</p>
      <Line text="DREAM IT" side="right" />
      <Line text="BUILD IT" side="left" />
    </div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Messages } from "@/lib/messages";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { radialRaysFrom } from "@/lib/radial-burst";
import { projects } from "@/data/projects";
import { galleryProjects } from "@/lib/work-gallery";
import RadialBurst from "@/components/ui/radial-burst";
import Star from "@/components/ui/star";

/** Sun position in the 1000x1000 ray viewBox (stretched to the stage). */
const CX = 500;
const CY = 380;
const rays = radialRaysFrom(CX, CY, 72, 1500);

/** Square cells of the floor the headline lies on. */
const FLOOR_COLS = 16;
const FLOOR_ROWS = 6;

type Flyer =
  | { kind: "image"; src: string; angle: number; delay: number }
  | { kind: "star" | "block"; angle: number; delay: number };

/**
 * Things that fly out of the sun as the section scrolls: three real project
 * screenshots, two stars and a black block. Angles in degrees (0 = right,
 * 90 = down), delays as a share of the scroll.
 */
const shots = galleryProjects(projects).slice(0, 3);
const all: Flyer[] = [
  { kind: "image", src: shots[0]?.image ?? "", angle: 200, delay: 0 },
  { kind: "star", angle: 330, delay: 0.08 },
  { kind: "block", angle: 20, delay: 0.18 },
  { kind: "image", src: shots[1]?.image ?? "", angle: 150, delay: 0.3 },
  { kind: "star", angle: 250, delay: 0.42 },
  { kind: "image", src: shots[2]?.image ?? "", angle: 300, delay: 0.5 },
];
const flyers = all.filter((f) => f.kind !== "image" || f.src);

/**
 * Pinned ray burst. A small sun sits a third of the way down with rays in
 * every direction; the headline lies on a ruled floor below it and grows
 * toward the viewer as the page scrolls, while screenshots and stars fly
 * out of the sun past the edges. Without motion it is a still poster.
 */
/**
 * The last word is the biggest. Sized for a word of up to five letters
 * ("Real"); a longer one (Turkish "Yapalım") shrinks in proportion, so it
 * still fits across a phone.
 */
function lastLineSize(word: string): string {
  const fit = Math.min(1, 5 / word.length);
  return fit === 1
    ? "clamp(5rem,min(32vw,44vh),26rem)"
    : `clamp(5rem,calc(min(32vw,44vh) * ${fit.toFixed(3)}),26rem)`;
}

export default function BurstHeadline({ t }: { t: Messages["closing"] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const items = q("[data-flyer]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        });
        tl.fromTo(
          q("[data-headline]"),
          { scale: 0.45 },
          { scale: 1, duration: 1, ease: "power1.out" },
          0,
        ).fromTo(
          q("[data-burst-disc]"),
          { scale: 0.4 },
          { scale: 1, duration: 0.5 },
          0,
        );
        items.forEach((el, i) => {
          const f = flyers[i];
          const rad = (f.angle * Math.PI) / 180;
          // Far enough to leave the screen in any direction.
          const dist = Math.hypot(window.innerWidth, window.innerHeight) * 0.75;
          tl.fromTo(
            el,
            { x: 0, y: 0, scale: 0.05, autoAlpha: 0, rotation: 0 },
            {
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              scale: 1.6,
              autoAlpha: 1,
              rotation: f.angle > 90 && f.angle < 270 ? -24 : 24,
              duration: 0.5,
              ease: "power2.in",
            },
            f.delay,
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative h-screen motion-safe:h-[170vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <RadialBurst
          rays={rays}
          cx={CX}
          cy={CY}
          stroke="var(--color-ink)"
          className="absolute inset-0 h-full w-full"
        />

        {/* Floor: a square grid laid back in perspective under the words. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[40%] [perspective:600px]"
        >
          <div className="absolute -left-1/4 bottom-0 grid h-[160%] w-[150%] origin-bottom grid-cols-16 border-t border-ink bg-bg [transform:rotateX(52deg)]">
            {Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, (_, i) => (
              <span key={i} className="border-b border-r border-ink" />
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="absolute"
          style={{ left: `${CX / 10}%`, top: `${CY / 10}%` }}
        >
          {flyers.map((f, i) => (
            <span
              key={i}
              data-flyer
              className="invisible absolute -translate-x-1/2 -translate-y-1/2"
            >
              {f.kind === "image" ? (
                <span className="relative block aspect-[16/10] w-[18vw] min-w-40 border border-ink bg-panel">
                  <Image
                    src={f.src}
                    alt=""
                    fill
                    sizes="30vw"
                    className="object-cover object-top"
                  />
                </span>
              ) : f.kind === "star" ? (
                <Star className="block h-10 w-10 text-ink" />
              ) : (
                <span className="block h-[14vw] w-[14vw] bg-ink" />
              )}
            </span>
          ))}
          <span
            data-burst-disc
            className="absolute -ml-8 -mt-8 block h-16 w-16 rounded-full border border-ink bg-bg"
          >
            <span className="absolute inset-[22%] rounded-full border border-ink" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-[6%] top-[46%] flex items-end justify-center px-4 [perspective:700px]">
          <h2
            id="contact-title"
            data-headline
            className="flex origin-bottom flex-col items-center text-center font-display uppercase leading-[0.86] text-ink [transform:rotateX(46deg)]"
          >
            <span className="block text-[clamp(1.75rem,min(5vw,9vh),4.5rem)]">
              {t.line1}
            </span>
            <span className="block text-[clamp(2.25rem,min(7vw,12vh),6.5rem)]">
              {t.line2}
            </span>
            <span className="block text-[clamp(3.25rem,min(13vw,21vh),12rem)]">
              {t.line3}
            </span>
            <span className="block" style={{ fontSize: lastLineSize(t.line4) }}>
              {t.line4}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cardRotations } from "@/lib/card-rotations";
import {
  cardX,
  cardY,
  exitPhase,
  letterArch,
  letterBob,
  letterSway,
  rowSpread,
} from "@/lib/work-gallery";
import DotPattern from "@/components/ui/dot-pattern";
import { STAGE_DOTS } from "./WorkIntro";

const ROWS = ["W", "O", "R", "K"];
/**
 * Letters per row, on a row 190vw wide: about eight fit across and the rest
 * bleed off the sides. Packed, the row closes to half its width, so the
 * whole row shows as one dense block.
 */
const PER_ROW = 15;
/** Wrapper height (vh): the stage pins for this minus one viewport. */
const WRAPPER_VH = 400;
/**
 * How far (vh) the gallery is pulled up over the intro: it pins as the intro
 * turns solid black (90% of the intro's 50vh pin), so the packed letters
 * appear with no black hold. It stays invisible while rising over the intro.
 */
const LEAD_VH = 105;
/** Cards cross between these progress points, clear of the packed ends. */
const CARDS_FROM = 0.08;
const CARDS_TO = 0.88;
/** How far (vh) the packed block's ends rise, so it bends into an arch. */
const ARCH_VH = 5;
/** Row spacing (scaleX) when fully packed; letters keep their shape. */
const PACKED = 0.5;

function GalleryCard({
  project,
  index,
  total,
  locale,
}: {
  project: Project;
  index: number;
  total: number;
  locale: Locale;
}) {
  const tilt =
    Math.round(cardRotations[index % cardRotations.length] * 100) / 100;
  const body = (
    <>
      <div className="relative aspect-[16/10] border border-bg bg-panel">
        <Image
          src={project.image!}
          alt=""
          fill
          sizes="(max-width: 768px) 62vw, (max-width: 1400px) 40vw, 560px"
          className="object-cover object-top"
        />
      </div>
      <div className="mt-2 flex justify-between gap-4 bg-ink px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-bg">
        <span className="truncate">{project.title}</span>
        <span className="tabular-nums">
          #{String(index + 1).padStart(3, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
    </>
  );

  // GSAP moves the <li>; the hover (straighten, grow, lift) lives on the
  // inner element as a CSS transition, so the two never share a transform.
  return (
    <li
      data-card
      style={{
        top: `calc(50% + ${cardY(index)}vh)`,
        transform: `translateX(${cardX(index, total, 0)}vw)`,
      }}
      className="absolute left-1/2 w-[62vw] -translate-x-1/2 -translate-y-1/2 will-change-transform hover:z-10 md:w-[min(560px,40vw)]"
    >
      <div
        style={{ "--tilt": `${tilt}deg` } as CSSProperties}
        className="gallery-card"
      >
        <a
          href={localizedPath(locale, `/projects/${project.slug}`)}
          tabIndex={-1}
          className="block"
        >
          {body}
        </a>
      </div>
    </li>
  );
}

/**
 * Black stage held for ~3 viewports (CSS sticky): swaying embossed WORK
 * letters behind screenshot cards that travel right to left, both driven by
 * one scrubbed ScrollTrigger (scrub: 1, so they lag and settle instead of
 * tracking raw scroll). The letter rows open out of a packed arch at the
 * start and pack back at the end, where the outro capsule takes over.
 * Decorative: the same links are in Work's focusable list, so this is
 * hidden from assistive tech and out of tab order.
 */
export default function WorkGallery({
  items,
  locale,
}: {
  items: Project[];
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        // Hidden while it rises over the intro; shown once pinned.
        const stage = q("[data-stage]");
        gsap.set(stage, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top top",
          onToggle: (self) =>
            gsap.set(stage, { autoAlpha: self.isActive ? 1 : 0 }),
          onLeave: () => gsap.set(stage, { autoAlpha: 1 }),
        });
        const rows = q("[data-row]");
        const letterBox = q("[data-letters]");
        const letters = q("[data-sway]");
        const cards = q("[data-card]");
        const setRow = rows.map((r) => gsap.quickSetter(r, "scaleX"));
        const setLetterX = gsap.quickSetter(q("[data-sway]"), "scaleX");
        const setLetters = gsap.quickSetter(letterBox, "opacity");
        const setRot = letters.map((l) =>
          gsap.quickSetter(l, "rotation", "deg"),
        );
        const setY = letters.map((l) => gsap.quickSetter(l, "y", "vh"));
        const setX = cards.map((c) => gsap.quickSetter(c, "x", "px"));
        const total = cards.length;
        const state = { p: 0 };

        const render = () => {
          const p = state.p;
          const vw = window.innerWidth / 100;
          const spread = rowSpread(p);
          const packed = 1 - spread;
          const k = PACKED + (1 - PACKED) * spread;
          setRow.forEach((set) => set(k));
          setLetterX(1 / k);
          letters.forEach((_, i) => {
            const col = i % PER_ROW;
            setRot[i](letterSway(i, p) * (0.4 + 0.6 * spread));
            setY[i](
              letterBob(i, p) + letterArch(col, PER_ROW) * ARCH_VH * packed,
            );
          });
          // Fade out just before the outro takes over.
          setLetters(1 - exitPhase(p, 0.97, 1));
          const cp = (p - CARDS_FROM) / (CARDS_TO - CARDS_FROM);
          // Phones show one wide card at a time, so space them further.
          const spacing = window.innerWidth < 768 ? 70 : 34;
          setX.forEach((set, i) => set(cardX(i, total, cp, spacing) * vw));
        };

        render();
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onRefresh: render,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        height: `${WRAPPER_VH}vh`,
        marginTop: `-${LEAD_VH}vh`,
      }}
      className="relative"
    >
      <div data-stage className="sticky top-0 h-screen overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <DotPattern
            color={STAGE_DOTS.color}
            gap={STAGE_DOTS.gap}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div
          data-letters
          className="absolute inset-y-0 -left-[140vw] -right-[140vw] flex flex-col justify-evenly md:-left-[45vw] md:-right-[45vw]"
        >
          {ROWS.map((letter) => (
            <div key={letter} data-row className="flex justify-around">
              {Array.from({ length: PER_ROW }, (_, c) => (
                <span
                  key={c}
                  data-sway
                  className="emboss-light inline-block font-display will-change-transform text-[16vh] leading-[0.95] text-bg md:text-[20vh]"
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <ul className="absolute inset-0">
          {items.map((p, i) => (
            <GalleryCard
              key={p.slug}
              project={p}
              index={i}
              total={items.length}
              locale={locale}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

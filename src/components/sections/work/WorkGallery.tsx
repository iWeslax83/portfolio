"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cardRotations } from "@/lib/card-rotations";
import {
  cardX,
  cardY,
  exitPhase,
  exitStartFor,
  letterSway,
} from "@/lib/work-gallery";
import DotPattern from "@/components/ui/dot-pattern";
import { STAGE_DOTS } from "./WorkIntro";

const ROWS = ["W", "O", "R", "K"];
const PER_ROW = 12;
/** Wrapper height (vh): the stage pins for this minus one viewport. */
const WRAPPER_VH = 400;
/**
 * How far (vh) the catalogue is pulled up over the end of the pinned stage.
 * The stage fades out over exactly the scroll in which the catalogue rises
 * over it, so the title bar arrives as the stage finishes, never after a
 * blank white screen.
 */
const OVERLAP_VH = 45;
const EXIT_START = exitStartFor(OVERLAP_VH, WRAPPER_VH);
const INK = "#0a0a0a";
const BG = "#ffffff";

function GalleryCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
  const tilt =
    Math.round(cardRotations[index % cardRotations.length] * 100) / 100;
  const body = (
    <>
      <div className="relative aspect-[16/10] border border-bg bg-panel">
        <Image
          src={project.image!}
          alt=""
          fill
          sizes="(max-width: 1024px) 70vw, 520px"
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
      className="absolute left-1/2 w-[min(520px,70vw)] -translate-x-1/2 -translate-y-1/2 hover:z-10"
    >
      <div
        style={{ "--tilt": `${tilt}deg` } as CSSProperties}
        className="gallery-card"
      >
        {primary ? (
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            className="block"
          >
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    </li>
  );
}

/**
 * Black stage held for ~3 viewports (CSS sticky): swaying embossed WORK
 * letters behind screenshot cards that travel right to left, both driven by
 * one scrubbed ScrollTrigger (scrub: 1, so they lag and settle instead of
 * tracking raw scroll). The catalogue overlaps the last OVERLAP_VH of the
 * wrapper, and the stage fades to white while it rises over it. Decorative duplicate of the catalogue below,
 * so it is hidden from assistive tech and out of tab order.
 */
export default function WorkGallery({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        const stage = q("[data-stage]")[0];
        const fading = q("[data-stage-fade]");
        const letters = q("[data-sway]");
        const cards = q("[data-card]");
        const setRot = letters.map((l) =>
          gsap.quickSetter(l, "rotation", "deg"),
        );
        const setX = cards.map((c) => gsap.quickSetter(c, "x", "px"));
        const setFade = gsap.quickSetter(fading, "opacity");
        const setScale = gsap.quickSetter(fading, "scale");
        const mixBg = gsap.utils.interpolate(INK, BG);
        const total = cards.length;
        const state = { p: 0 };

        const render = () => {
          const p = state.p;
          const vw = window.innerWidth / 100;
          setRot.forEach((set, i) => set(letterSway(i, p)));
          setX.forEach((set, i) => set(cardX(i, total, p) * vw));
          const e = exitPhase(p, EXIT_START);
          setFade(1 - e);
          setScale(1 - 0.06 * e);
          stage.style.backgroundColor = e > 0 ? mixBg(e) : "";
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

        return () => {
          stage.style.backgroundColor = "";
        };
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
        marginBottom: `-${OVERLAP_VH}vh`,
      }}
      className="relative bg-ink"
    >
      <div data-stage className="sticky top-0 h-screen overflow-hidden bg-ink">
        <div data-stage-fade className="absolute inset-0">
          <DotPattern
            color={STAGE_DOTS.color}
            gap={STAGE_DOTS.gap}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div
          data-stage-fade
          className="absolute inset-0 flex flex-col justify-evenly py-[max(2vh,24px)]"
        >
          {ROWS.map((letter) => (
            <div key={letter} className="flex justify-around">
              {Array.from({ length: PER_ROW }, (_, c) => (
                <span
                  key={c}
                  data-sway
                  className="emboss-light inline-block font-display text-[18vh] leading-none text-bg"
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <ul data-stage-fade className="absolute inset-0">
          {items.map((p, i) => (
            <GalleryCard
              key={p.slug}
              project={p}
              index={i}
              total={items.length}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

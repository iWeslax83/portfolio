"use client";

import { gsap, SplitText, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { polylineLength } from "@/lib/polyline-length";
import { INTRO_PENDING } from "@/lib/intro-script";
import { markIntroDone } from "@/lib/intro-state";

let releaseTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * First-load choreography: header cells drop in, the hero mesh draws from
 * the edges toward the centre, the title rises out of a clip, the stars spin
 * in, then the tickers fade up. Renders nothing; it animates elements tagged
 * with data-intro. Runs once, before paint (useGSAP is a layout effect).
 */
export default function Intro() {
  useGSAP(() => {
    clearTimeout(releaseTimer);
    const root = document.documentElement;
    if (!root.classList.contains(INTRO_PENDING)) {
      markIntroDone();
      return;
    }

    let done = false;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const row = document.querySelector<HTMLElement>(
        "[data-intro='header-row']",
      );
      const cells = gsap.utils.toArray<HTMLElement>(
        "[data-intro='header-cell']",
      );
      const svg = document.querySelector<SVGSVGElement>(
        "[data-intro='mesh'] svg",
      );
      const paths = gsap.utils.toArray<SVGPathElement>(
        "[data-intro='mesh'] path",
      );
      const words = gsap.utils.toArray<HTMLElement>(
        "[data-intro='title-word']",
      );
      const stars = gsap.utils.toArray<SVGElement>("#hero-title svg");
      const tickers = gsap.utils.toArray<HTMLElement>("[data-intro='ticker']");

      // The mesh uses non-scaling strokes on a stretched viewBox, so dashes
      // are measured in screen pixels: scale each polyline before measuring.
      const box = svg?.getBoundingClientRect();
      const sx = box ? box.width / 1000 : 1;
      const sy = box ? box.height / 600 : 1;
      const lengths = paths.map(
        (p) => polylineLength(p.getAttribute("d") ?? "", sx, sy) + 4,
      );

      // Visual characters only: the sr-only label spans are not split, and
      // aria "none" leaves the text readable. Reverted once the rise ends.
      // SplitText note: revert() restores the original markup via innerHTML,
      // so the split nodes must stay static text (no React children or refs).
      const split = SplitText.create(words, {
        type: "chars",
        mask: "chars",
        tag: "span",
        charsClass: "intro-char",
        aria: "none",
      });

      if (row) gsap.set(row, { overflow: "clip" });
      gsap.set(cells, { yPercent: -100 });
      paths.forEach((p, i) =>
        gsap.set(p, {
          strokeDasharray: `${lengths[i]} ${lengths[i]}`,
          strokeDashoffset: lengths[i],
        }),
      );
      gsap.set(split.chars, { yPercent: 100 });
      gsap.set(stars, { scale: 0, rotation: -180, transformOrigin: "50% 50%" });
      gsap.set(tickers, { autoAlpha: 0 });
      root.classList.remove(INTRO_PENDING);

      // Put the title back as plain text the moment its letters land, not
      // at the end of the whole intro: the browser counts the restored text
      // as the page's largest paint, so a late revert reads as a slow load.
      let reverted = false;
      const restoreTitle = () => {
        if (reverted) return;
        reverted = true;
        split.revert();
      };

      const finish = () => {
        done = true;
        restoreTitle();
        gsap.set([row, ...cells, ...stars, ...tickers].filter(Boolean), {
          clearProps: "transform,transformOrigin,visibility,opacity,overflow",
        });
        gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
        markIntroDone();
      };

      gsap
        .timeline({ defaults: { ease: EASE.enter }, onComplete: finish })
        .to(cells, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0)
        .to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 1.6,
            stagger: { amount: 0.9, from: "edges" },
          },
          0.1,
        )
        .to(
          split.chars,
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.03,
            onComplete: restoreTitle,
          },
          0.3,
        )
        .to(stars, { scale: 1, rotation: 0, duration: 1.2, stagger: 0.12 }, 0.6)
        .to(
          tickers,
          { autoAlpha: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 },
          1.4,
        );

      return () => {
        if (!done) restoreTitle();
      };
    });

    return () => {
      mm.revert();
      if (!done) {
        // Interrupted (React Strict Mode runs effects twice in dev): hide
        // again so the re-run can start the intro, but never leave the page
        // hidden if no re-run comes.
        root.classList.add(INTRO_PENDING);
        releaseTimer = setTimeout(
          () => root.classList.remove(INTRO_PENDING),
          0,
        );
      }
    };
  });

  return null;
}

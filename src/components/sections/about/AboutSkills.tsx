"use client";

import { useRef } from "react";
import type { Messages } from "@/lib/messages";
import type { GitHubStats } from "@/lib/types";
import type { BentoSkill, DevopsSkill } from "@/data/skills";
import { gsap, SplitText, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { revealOnce } from "@/lib/reveal";
import { countUpText } from "@/lib/count-up";
import RoomBackground from "./RoomBackground";
import SideRails from "./SideRails";
import Bento from "./Bento";
import { SECTION_BAR } from "@/components/sections/section-bar";

const PARAGRAPHS = ["p1", "p2", "p3", "p4"] as const;

export default function AboutSkills({
  stats,
  t,
  skills,
  bentoSkills,
  devops,
}: {
  stats: GitHubStats | null;
  t: Messages["about"];
  skills: Messages["skills"];
  bentoSkills: BentoSkill[];
  devops: DevopsSkill;
}) {
  const scope = useRef<HTMLElement>(null);

  // Entrances. Start states are set here (client, before paint), never in
  // the server markup, so the section reads fine without JS.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const cleanup: (() => void)[] = [];

        // Black bars wipe in from the left.
        q("[data-reveal='bar']").forEach((bar) => {
          const tl = gsap
            .timeline({ paused: true })
            .fromTo(
              bar,
              { scaleX: 0, transformOrigin: "0% 50%" },
              { scaleX: 1, duration: 1.1, ease: EASE.enter },
            );
          revealOnce(bar, () => tl.play(), "top 90%");
        });

        // Paragraphs rise and fade, one after another.
        const paras = q("[data-reveal='paras'] > p");
        const parasTl = gsap
          .timeline({ paused: true })
          .fromTo(
            paras,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: EASE.enter, stagger: 0.1 },
          );
        revealOnce(q("[data-reveal='paras']")[0], () => parasTl.play());

        // Bento cells stagger in; the big words rise out of a clip.
        q("[data-reveal='row']").forEach((row) => {
          const found = row.querySelectorAll("[data-reveal='cell']");
          const cells = found.length ? found : [row];
          const words = row.querySelectorAll("[data-reveal='word'] > span");
          // SplitText note: revert() restores the original markup via innerHTML,
          // so the split nodes must stay static text (no React children or refs).
          const split = words.length
            ? SplitText.create(words, {
                type: "words",
                mask: "words",
                aria: "none",
              })
            : null;
          const tl = gsap
            .timeline({ paused: true, onComplete: () => split?.revert() })
            .fromTo(
              cells,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: EASE.enter,
                stagger: 0.08,
              },
            );
          if (split) {
            tl.fromTo(
              split.words,
              { yPercent: 100 },
              { yPercent: 0, duration: 1.2, ease: EASE.enter, stagger: 0.08 },
              0.1,
            );
          }
          revealOnce(row, () => tl.play());
          if (split) cleanup.push(() => split.revert());
        });

        // Live GitHub numbers count up to their real value. Writes go to
        // the text node inside a dedicated span, never replacing nodes React
        // rendered, and the cleanup puts the real value back.
        q("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const text = el.querySelector("[data-count-text]")?.firstChild;
          if (
            !Number.isFinite(target) ||
            !text ||
            text.nodeType !== Node.TEXT_NODE
          ) {
            return;
          }
          const counter = { p: 0 };
          text.nodeValue = countUpText(target, 0);
          const tween = gsap.to(counter, {
            p: 1,
            duration: 1.5,
            ease: EASE.enter,
            paused: true,
            onUpdate: () => {
              text.nodeValue = countUpText(target, counter.p);
            },
          });
          revealOnce(el, () => tween.play(), "top 90%");
          cleanup.push(() => {
            text.nodeValue = String(target);
          });
        });

        return () => cleanup.forEach((fn) => fn());
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-clip"
    >
      <RoomBackground />
      <SideRails left={t.railLeft} right={t.railRight} />
      <div className="relative mx-8 max-w-[640px] border-x border-ink bg-bg sm:mx-auto">
        <h2 id="about-title" data-reveal="bar" className={SECTION_BAR}>
          {t.barAbout}
        </h2>
        <div
          data-reveal="paras"
          className="space-y-8 px-6 py-14 font-serif text-2xl leading-[1.5] tracking-[-0.01em] sm:px-[72px] sm:py-20 sm:text-[32px]"
        >
          {PARAGRAPHS.map((k) => (
            <p key={k} className="text-pretty">
              {t[k]}
            </p>
          ))}
        </div>
        <h2 data-reveal="bar" className={SECTION_BAR}>
          {t.barSkills}
        </h2>
        <Bento
          stats={stats}
          t={skills}
          bentoSkills={bentoSkills}
          devopsSkill={devops}
        />
      </div>
    </section>
  );
}

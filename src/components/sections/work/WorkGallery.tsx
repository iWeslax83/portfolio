"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Project } from "@/lib/types";
import { cardRotations } from "@/lib/card-rotations";
import { cardX, cardY, letterSway } from "@/lib/work-gallery";
import DotPattern from "@/components/ui/dot-pattern";

const ROWS = ["W", "O", "R", "K"];
const PER_ROW = 12;

function SwayLetter({
  letter,
  index,
  progress,
}: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const rotate = useTransform(progress, (p) => letterSway(index, p));
  return (
    <motion.span
      style={{ rotate }}
      className="emboss-light inline-block font-display text-[20vh] leading-none text-bg"
    >
      {letter}
    </motion.span>
  );
}

function GalleryCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, (p) => `${cardX(index, total, p)}vw`);
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
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

  return (
    <motion.li
      style={{
        x,
        rotate: cardRotations[index % cardRotations.length],
        top: `calc(50% + ${cardY(index)}vh)`,
      }}
      className="absolute left-1/2 w-[min(520px,70vw)] -translate-x-1/2 -translate-y-1/2"
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
    </motion.li>
  );
}

/**
 * Black stage pinned for ~3 viewports: swaying embossed WORK letters behind
 * screenshot cards that travel right to left. Decorative duplicate of the
 * catalogue below, so it is hidden from assistive tech and out of tab order.
 */
export default function WorkGallery({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} aria-hidden className="relative h-[400vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <DotPattern color="rgba(255,255,255,0.18)" gap={16} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex flex-col justify-around py-[2vh]">
          {ROWS.map((letter, r) => (
            <div key={letter} className="flex justify-around">
              {Array.from({ length: PER_ROW }, (_, c) => (
                <SwayLetter
                  key={c}
                  letter={letter}
                  index={r * PER_ROW + c}
                  progress={scrollYProgress}
                />
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
              progress={scrollYProgress}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

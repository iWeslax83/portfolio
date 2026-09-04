"use client";

import type { WorkStage } from "@/lib/flight-scene/useWorkCarouselProgress";

const LETTERS = ["W", "O", "R", "K"] as const;
const TILE_REPEAT = 9;

export default function WorkIntroBackground({
  stage,
  stageProgress,
}: {
  stage: WorkStage;
  stageProgress: number;
}) {
  const pillOpacity = stage === "intro" ? 1 : stage === "tile" ? Math.max(0, 1 - stageProgress * 1.4) : 0;
  const pillScale = stage === "intro" ? 1 : stage === "tile" ? 1 + stageProgress * 5 : 6;

  const tileOpacity =
    stage === "intro"
      ? 0
      : stage === "tile"
        ? Math.min(1, stageProgress * 1.4)
        : stage === "carousel"
          ? 1
          : Math.max(0, 1 - stageProgress);

  return (
    <div className="absolute inset-0 bg-bg overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="work-grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="var(--color-rule)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#work-grid)" />
      </svg>

      <div
        className="absolute left-1/2 top-1/2 flex h-[240px] w-[140px] items-center justify-center overflow-hidden rounded-[70px] bg-ink"
        style={{
          opacity: pillOpacity,
          transform: `translate(-50%, -50%) scale(${pillScale})`,
        }}
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="work-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--color-ink-3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#work-dots)" opacity="0.35" />
        </svg>
        <div className="relative flex flex-col items-center font-display text-5xl font-extrabold leading-[0.85] tracking-tight text-bg">
          {LETTERS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center gap-3" style={{ opacity: tileOpacity }}>
        {LETTERS.map((letter) => (
          <div key={letter} className="flex justify-around whitespace-nowrap">
            {Array.from({ length: TILE_REPEAT }).map((_, i) => (
              <span key={i} className="emboss-text font-display text-[9vw] font-extrabold leading-none text-ink">
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

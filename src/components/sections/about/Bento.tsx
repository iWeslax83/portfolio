"use client";

import { useId } from "react";
import type { Messages } from "@/lib/messages";
import type { GitHubStats } from "@/lib/types";
import type { BentoSkill, DevopsSkill } from "@/data/skills";
import Star from "@/components/ui/star";
import GitHubCell from "./GitHubCell";

const labelCell =
  "flex items-center justify-center p-3 text-center font-mono text-sm leading-[1.5] text-ink-2 sm:p-6";

function Globe() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="h-16 w-16 sm:h-24 sm:w-24"
    >
      <g transform="rotate(-20 50 50)">
        <ellipse cx="50" cy="50" rx="34" ry="40" />
        <ellipse cx="50" cy="50" rx="20" ry="40" />
        <ellipse cx="50" cy="50" rx="6" ry="40" />
        <ellipse cx="50" cy="50" rx="34" ry="14" />
        <ellipse cx="50" cy="50" rx="34" ry="28" />
      </g>
    </svg>
  );
}

function Hatch() {
  const id = `hatch-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden data-reveal="cell" className="h-full min-h-40 w-full">
      <defs>
        <pattern
          id={id}
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="14" stroke="var(--color-rule-strong)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function Bento({
  stats,
  t,
  bentoSkills,
  devopsSkill,
}: {
  stats: GitHubStats | null;
  t: Messages["skills"];
  /** Already in the page's language. */
  bentoSkills: BentoSkill[];
  devopsSkill: DevopsSkill;
}) {
  return (
    <div>
      <p
        data-reveal="row"
        className="text-balance border-b border-edge px-6 py-12 text-center font-mono text-lg font-bold leading-[1.3] text-accent"
      >
        {t.statement}
      </p>

      {bentoSkills.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <div
            key={s.key}
            data-reveal="row"
            className="grid grid-cols-2 border-b border-edge"
          >
            <div
              data-reveal="cell"
              className={`p-3 sm:p-5 ${
                flip ? "col-start-2 row-start-1 border-l" : "border-r"
              } border-edge`}
            >
              <h3
                data-reveal="word"
                aria-label={
                  s.key === "embedded" ? "Embedded" : s.word.join(" ")
                }
                className="font-display text-[clamp(1.9rem,5vw,3.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]"
              >
                {s.word.map((w) => (
                  <span key={w} aria-hidden className="block">
                    {w}
                  </span>
                ))}
              </h3>
              <ul className="mt-3 font-mono text-xs leading-[1.6] text-ink-2">
                {s.tools.map((x) => (
                  <li key={x}>({x})</li>
                ))}
              </ul>
            </div>
            <div
              data-reveal="cell"
              className={`${labelCell} ${flip ? "col-start-1 row-start-1" : ""}`}
            >
              <p>
                {s.label}
                <br />
                {s.sub}
              </p>
            </div>
          </div>
        );
      })}

      <div data-reveal="row" className="grid grid-cols-3 border-b border-edge">
        <div
          data-reveal="cell"
          className="relative flex items-center justify-center border-r border-edge p-4 sm:p-8"
        >
          <Star className="absolute left-3 top-3 h-4 w-4" />
          <Star className="absolute right-3 top-3 h-4 w-4" />
          <Star className="absolute bottom-3 left-3 h-4 w-4" />
          <Star className="absolute bottom-3 right-3 h-4 w-4" />
          <Globe />
        </div>
        <div data-reveal="cell" className={`${labelCell} col-span-2 flex-col`}>
          <p>
            {devopsSkill.label}
            <br />
            {devopsSkill.sub}
          </p>
          <p className="mt-3 font-mono text-xs text-ink-2">
            {devopsSkill.tools.map((x) => `(${x})`).join(" ")}
          </p>
        </div>
      </div>

      <div data-reveal="row" className="grid grid-cols-3">
        <div data-reveal="cell" className="col-span-2 border-r border-edge">
          <GitHubCell stats={stats} t={t} />
        </div>
        <Hatch />
      </div>
    </div>
  );
}

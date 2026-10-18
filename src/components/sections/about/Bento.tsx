"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import type { GitHubStats } from "@/lib/types";
import { bentoSkills, devopsSkill } from "@/data/skills";
import Star from "@/components/ui/star";
import GitHubCell from "./GitHubCell";

const labelCell =
  "flex items-center justify-center p-6 text-center font-serif text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.1]";

function Globe() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="h-24 w-24"
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
          <line x1="0" y1="0" x2="0" y2="14" stroke="var(--color-ink)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function Bento({ stats }: { stats: GitHubStats | null }) {
  const t = useTranslations("skills");

  return (
    <div>
      <p
        data-reveal="row"
        className="border-b border-ink px-6 py-12 text-center font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1]"
      >
        {t("statement")}
      </p>

      {bentoSkills.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <div
            key={s.key}
            data-reveal="row"
            className="grid border-b border-ink sm:grid-cols-2"
          >
            <div
              data-reveal="cell"
              className={`border-b border-ink p-4 sm:border-b-0 sm:p-5 ${
                flip
                  ? "sm:col-start-2 sm:row-start-1 sm:border-l"
                  : "sm:border-r"
              }`}
            >
              <h3
                data-reveal="word"
                aria-label={
                  s.key === "embedded" ? "Embedded" : s.word.join(" ")
                }
                className="font-display text-[clamp(4rem,8vw,7rem)] uppercase leading-[0.88]"
              >
                {s.word.map((w) => (
                  <span key={w} aria-hidden className="block">
                    {w}
                  </span>
                ))}
              </h3>
              <p className="mt-3 font-serif text-sm leading-[1.5]">
                {s.tools.map((x) => `(${x})`).join(" ")}
              </p>
            </div>
            <div
              data-reveal="cell"
              className={`${labelCell} ${flip ? "sm:col-start-1 sm:row-start-1" : ""}`}
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

      <div
        data-reveal="row"
        className="grid border-b border-ink sm:grid-cols-3"
      >
        <div
          data-reveal="cell"
          className="relative flex items-center justify-center border-b border-ink p-8 sm:border-b-0 sm:border-r"
        >
          <Star className="absolute left-3 top-3 h-4 w-4" />
          <Star className="absolute right-3 top-3 h-4 w-4" />
          <Star className="absolute bottom-3 left-3 h-4 w-4" />
          <Star className="absolute bottom-3 right-3 h-4 w-4" />
          <Globe />
        </div>
        <div
          data-reveal="cell"
          className={`${labelCell} flex-col sm:col-span-2`}
        >
          <p>
            {devopsSkill.label}
            <br />
            {devopsSkill.sub}
          </p>
          <p className="mt-3 font-serif text-sm">
            {devopsSkill.tools.map((x) => `(${x})`).join(" ")}
          </p>
        </div>
      </div>

      <div data-reveal="row" className="grid sm:grid-cols-3">
        <div
          data-reveal="cell"
          className="border-b border-ink sm:col-span-2 sm:border-b-0 sm:border-r"
        >
          <GitHubCell stats={stats} />
        </div>
        <Hatch />
      </div>
    </div>
  );
}

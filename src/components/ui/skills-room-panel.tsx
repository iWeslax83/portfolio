import type { ReactNode } from "react";
import { crossMarks } from "@/lib/cross-marks";

function WireframeGlobe() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
      <circle cx="24" cy="24" r="19" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      <ellipse cx="24" cy="24" rx="8" ry="19" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      <ellipse cx="24" cy="24" rx="19" ry="8" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      <path d="M5 24h38" stroke="var(--color-ink)" strokeWidth="1" />
    </svg>
  );
}

function HatchSwatch() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <defs>
        <pattern id="skills-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-ink-3)" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="64" height="64" fill="url(#skills-hatch)" />
    </svg>
  );
}

/**
 * Black inset panel wrapping the skill-category content: scattered
 * deterministic cross marks, a small wireframe-globe card, a hatch-
 * swatch card - decorative framing only, all aria-hidden. `children`
 * renders the real skill data on top, in `text-bg` for contrast against
 * the panel's black fill.
 */
export default function SkillsRoomPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-10 md:px-10 md:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {crossMarks.map((m, i) => (
          <span
            key={i}
            className="absolute font-mono text-sm text-bg/50"
            style={{ left: `${m.xPct}%`, top: `${m.yPct}%` }}
          >
            +
          </span>
        ))}
      </div>

      <div aria-hidden className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center bg-bg md:left-10 md:top-10">
        <WireframeGlobe />
      </div>

      <div aria-hidden className="absolute bottom-6 right-6 h-12 w-12 bg-bg p-1.5 md:bottom-10 md:right-10">
        <HatchSwatch />
      </div>

      <div className="relative text-bg">{children}</div>
    </div>
  );
}

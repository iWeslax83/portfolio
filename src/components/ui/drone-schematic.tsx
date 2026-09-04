"use client";

import { useMemo } from "react";

/**
 * Top-down technical line drawing of an autonomous quadrotor. Draw
 * progress is driven externally by `progress` (0 to 1) so callers can tie
 * it to a scroll position (Founder Story) or a constant fully-drawn state
 * (Hero).
 */

// Motor hub positions (top-down, diagonal X frame)
const hubs = [
  { x: 78, y: 78 },
  { x: 322, y: 78 },
  { x: 78, y: 322 },
  { x: 322, y: 322 },
];

// Each element gets a [start, end] slice of the 0-1 progress range so the
// drawing still builds up piece by piece, just driven by `progress`
// instead of a framer-motion stagger delay.
const STROKE_SLICES = 8; // 4 arms + body + hub circles group + 2 dimension/label groups

function sliceProgress(progress: number, index: number, total = STROKE_SLICES) {
  const start = index / total;
  const end = (index + 1) / total;
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

export default function DroneSchematic({ progress }: { progress: number }) {
  const clamped = Math.min(1, Math.max(0, progress));

  const armProgress = useMemo(
    () => hubs.map((_, i) => sliceProgress(clamped, i, STROKE_SLICES)),
    [clamped]
  );
  const bodyProgress = sliceProgress(clamped, 4, STROKE_SLICES);
  const hubsProgress = sliceProgress(clamped, 5, STROKE_SLICES);
  const dimensionProgress = sliceProgress(clamped, 6, STROKE_SLICES);
  const labelProgress = sliceProgress(clamped, 7, STROKE_SLICES);

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      role="img"
      aria-label="Technical line drawing of an autonomous quadrotor airframe with a 520 millimetre rotor span"
      className="w-full h-auto text-ink-3"
    >
      {hubs.map((h, i) => (
        <line
          key={`arm-${i}`}
          x1={200}
          y1={200}
          x2={h.x}
          y2={h.y}
          stroke="currentColor"
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - armProgress[i]}
        />
      ))}

      <rect
        x={166}
        y={166}
        width={68}
        height={68}
        rx={10}
        stroke="currentColor"
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - bodyProgress}
      />
      <circle
        cx={200}
        cy={200}
        r={12}
        stroke="currentColor"
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - bodyProgress}
      />

      {hubs.map((h, i) => (
        <g key={`hub-${i}`} style={{ opacity: hubsProgress }}>
          <circle cx={h.x} cy={h.y} r={18} stroke="currentColor" strokeWidth={2} />
          <circle
            cx={h.x}
            cy={h.y}
            r={46}
            stroke="var(--color-rule-strong)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
        </g>
      ))}

      <g style={{ opacity: dimensionProgress }} className="text-ink-3">
        <line x1={78} y1={40} x2={322} y2={40} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <line x1={78} y1={32} x2={78} y2={48} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <line x1={322} y1={32} x2={322} y2={48} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <path d="M86 36 L78 40 L86 44" stroke="var(--color-rule-strong)" strokeWidth={1} />
        <path d="M314 36 L322 40 L314 44" stroke="var(--color-rule-strong)" strokeWidth={1} />
      </g>
      <text
        style={{ opacity: dimensionProgress }}
        x={200}
        y={28}
        textAnchor="middle"
        className="fill-ink"
        fontFamily="var(--font-mono)"
        fontSize="13px"
        letterSpacing="0.1em"
      >
        520 mm
      </text>

      <text
        style={{ opacity: labelProgress }}
        x={200}
        y={250}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="10px"
        letterSpacing="0.18em"
      >
        FC-01
      </text>
      <text
        style={{ opacity: labelProgress }}
        x={322}
        y={360}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="10px"
        letterSpacing="0.18em"
      >
        M4
      </text>
    </svg>
  );
}

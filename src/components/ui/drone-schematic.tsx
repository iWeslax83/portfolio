"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Top-down technical line drawing of an autonomous quadrotor, drafted stroke by
 * stroke when it enters view, annotated with a real dimension callout. The hero
 * set-piece - an authentic engineering drawing in place of a faux terminal.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, ease, delay: 0.2 + i * 0.12 },
      opacity: { duration: 0.25, delay: 0.2 + i * 0.12 },
    },
  }),
};

const fade = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: 0.9 + i * 0.1 },
  }),
};

// Motor hub positions (top-down, diagonal X frame)
const hubs = [
  { x: 78, y: 78 },
  { x: 322, y: 78 },
  { x: 78, y: 322 },
  { x: 322, y: 322 },
];

export default function DroneSchematic() {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 400 400"
      fill="none"
      role="img"
      aria-label="Technical line drawing of an autonomous quadrotor airframe with a 520 millimetre rotor span"
      className="w-full h-auto text-ink-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {/* Arms - diagonal X frame */}
      {hubs.map((h, i) => (
        <motion.line
          key={`arm-${i}`}
          x1={200}
          y1={200}
          x2={h.x}
          y2={h.y}
          stroke="currentColor"
          strokeWidth={2}
          variants={draw}
          custom={i}
        />
      ))}

      {/* Center body */}
      <motion.rect
        x={166}
        y={166}
        width={68}
        height={68}
        rx={10}
        stroke="currentColor"
        strokeWidth={2}
        variants={draw}
        custom={1}
      />
      <motion.circle
        cx={200}
        cy={200}
        r={12}
        stroke="var(--color-accent)"
        strokeWidth={2}
        variants={draw}
        custom={2}
      />

      {/* Motor hubs + rotor discs */}
      {hubs.map((h, i) => (
        <g key={`hub-${i}`}>
          <motion.circle
            cx={h.x}
            cy={h.y}
            r={18}
            stroke="currentColor"
            strokeWidth={2}
            variants={draw}
            custom={i + 2}
          />
          {/* Rotor disc - faint, slowly rotating */}
          <motion.circle
            cx={h.x}
            cy={h.y}
            r={46}
            stroke="var(--color-rule-strong)"
            strokeWidth={1}
            strokeDasharray="2 7"
            variants={fade}
            custom={i}
            style={{ transformOrigin: `${h.x}px ${h.y}px` }}
            animate={
              reduce
                ? undefined
                : { rotate: i % 2 === 0 ? 360 : -360 }
            }
            transition={
              reduce
                ? undefined
                : { duration: 14 + i * 2, repeat: Infinity, ease: "linear" }
            }
          />
        </g>
      ))}

      {/* Dimension callout: overall rotor span */}
      <motion.g variants={fade} custom={3} className="text-ink-3">
        <line x1={78} y1={40} x2={322} y2={40} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <line x1={78} y1={32} x2={78} y2={48} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <line x1={322} y1={32} x2={322} y2={48} stroke="var(--color-rule-strong)" strokeWidth={1} />
        {/* arrowheads */}
        <path d="M86 36 L78 40 L86 44" stroke="var(--color-rule-strong)" strokeWidth={1} />
        <path d="M314 36 L322 40 L314 44" stroke="var(--color-rule-strong)" strokeWidth={1} />
      </motion.g>
      <motion.text
        variants={fade}
        custom={4}
        x={200}
        y={28}
        textAnchor="middle"
        className="fill-accent"
        style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: "0.1em" }}
      >
        520 mm
</motion.text>

      {/* Part labels */}
      <motion.text
        variants={fade}
        custom={5}
        x={200}
        y={250}
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em" }}
      >
        FC-01
      </motion.text>
      <motion.text
        variants={fade}
        custom={6}
        x={322}
        y={360}
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em" }}
      >
        M4
      </motion.text>
    </motion.svg>
  );
}

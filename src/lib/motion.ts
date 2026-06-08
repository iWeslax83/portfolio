import type { Variants, Transition } from "framer-motion";

/**
 * Motion vocabulary for the engineering-monograph layout. Variety in technique,
 * one consistent spring binding it together. Reveals read like a technical sheet
 * being drafted: rules draw across, figure lines lift in, headlines unmask.
 */
export const spring: Transition = {
  type: "spring",
  stiffness: 110,
  damping: 20,
};

const ease = [0.22, 1, 0.36, 1] as const;

/* Fire once, a touch before the block reaches center */
export const viewportOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;

/* ── Stagger orchestrators ───────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

/* ── Primitives ──────────────────────────────────────────────── */

/* General fade + rise - body copy, annotations, spec rows */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: spring },
};

/* Hairline rule that draws in from the left */
export const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease },
  },
};

/* Headline line unmasking upward - one per physical line */
export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "0.5em", clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 -10% 0)",
    transition: { duration: 0.75, ease },
  },
};

/* Figure codes / part labels - index in with a small lift */
export const markIn: Variants = {
  hidden: { opacity: 0, y: 8, letterSpacing: "0.4em" },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.22em",
    transition: { duration: 0.5, ease },
  },
};

/* Plate / figure block - subtle scale + lift, never a pop */
export const plateIn: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
};

/* Lateral entrances for asymmetric two-column composition */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: spring },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: spring },
};

import type { Variants, Transition } from "framer-motion";

/**
 * Shared spring. Variety in technique, consistency in physics - every section
 * animates differently but with the same weighty spring feel binding them.
 */
export const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

/* Generic in-view trigger - fire once at ~75% into viewport */
export const viewportOnce = { once: true, margin: "-15% 0px -15% 0px" } as const;

/* ── Stagger orchestrators ─────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

/* ── 1. Hero - boot sequence primitives ───────────────────── */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

export const imageUnblur: Variants = {
  hidden: { opacity: 0, scale: 0.6, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 180, damping: 16 },
  },
};

/* ── 2. STRATOS - cinematic side-sweep ────────────────────── */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -56 },
  visible: { opacity: 1, x: 0, transition: spring },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 56 },
  visible: { opacity: 1, x: 0, transition: spring },
};

export const maskWipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── 3. Selected Work - depth stack ───────────────────────── */
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring },
};

export const flipUp: Variants = {
  hidden: { opacity: 0, rotateX: -12, y: 40, transformPerspective: 1000 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transformPerspective: 1000,
    transition: spring,
  },
};

/* ── 4. Stack - pop & drift ───────────────────────────────── */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 16 },
  },
};

/* ── 6. Contact - lift in ─────────────────────────────────── */
export const liftIn: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -18, transformPerspective: 1200 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: 1200,
    transition: spring,
  },
};

export const charReveal: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

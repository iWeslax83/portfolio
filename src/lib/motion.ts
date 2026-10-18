import type { Transition } from "framer-motion";

/**
 * Motion vocabulary for the Instrument layout. Variety in technique, one
 * consistent spring binding it together. Reveals read like an instrument
 * panel powering on: panels snap into grid alignment, rules extend across,
 * headlines unmask, readouts settle into their final value.
 */
export const spring: Transition = {
  type: "spring",
  stiffness: 110,
  damping: 20,
};

/* Fire once, a touch before the block reaches center */
export const viewportOnce = {
  once: true,
  margin: "-12% 0px -12% 0px",
} as const;

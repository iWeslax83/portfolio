import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Plugins touch window, so register only in the browser.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/**
 * Every animation runs inside `gsap.matchMedia().add(MOTION_OK, ...)`, so
 * people who asked for reduced motion get the final state and nothing moves.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Motion language: see DESIGN.md section 5. */
export const EASE = {
  enter: "expo.out",
  change: "expo.inOut",
  scaleUp: "power4.in",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };

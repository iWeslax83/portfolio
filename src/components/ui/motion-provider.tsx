"use client";

import { MotionConfig } from "framer-motion";

/**
 * The globals.css reduced-motion block only collapses CSS animations and
 * transitions. The remaining Framer Motion pieces (header, mobile menu,
 * back-to-top) need this too: `reducedMotion="user"` drops their
 * transform-based movement for anyone who asked for less motion, leaving a
 * plain opacity change. Section motion is GSAP and gated by MOTION_OK.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

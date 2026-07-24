"use client";

import { MotionConfig } from "framer-motion";

/**
 * The globals.css reduced-motion block only collapses CSS animations and
 * transitions. The section reveals are Framer Motion variants, so they need
 * this too: `reducedMotion="user"` drops the transform-based movement for
 * anyone who asked for less motion, leaving a plain opacity change.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

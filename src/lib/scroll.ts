"use client";

import { useEffect, useState } from "react";

/**
 * True when the user has requested reduced motion. Every GSAP pin/scrub/
 * hijack in this codebase must check this and render its plain fallback
 * instead - not a shortened animation.
 */
export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * True below the given breakpoint (default 768px, matching Tailwind's
 * `md`). Every GSAP pin/scrub/hijack in this codebase must check this and
 * render its vertical-stack fallback instead.
 */
export function useIsMobile(breakpointPx = 768): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    setMobile(query.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, [breakpointPx]);

  return mobile;
}

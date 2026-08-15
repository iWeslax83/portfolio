"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";

export interface FlightProgressRef {
  current: number;
}

/**
 * Scroll-driven progress (0-1) across the whole flight-scene spacer.
 * Returns a ref, not React state, so the 3D render loop (CameraRig's
 * useFrame) can read it every frame without forcing a React re-render on
 * every scroll tick. Callers that need progress as render-affecting state
 * (the checkpoint overlay layer) derive their own throttled state from
 * this ref separately - this hook itself never calls setState.
 */
export function useFlightProgress(spacerRef: RefObject<HTMLElement | null>) {
  const progressRef = useRef<FlightProgressRef>({ current: 0 });
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();

  useEffect(() => {
    if (!spacerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current.current = self.progress;
        },
      });
    });

    return () => ctx.revert();
  }, [spacerRef]);

  return { progressRef, reduced, mobile };
}

"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface FlightProgressRef {
  current: number;
}

/**
 * Scroll-driven progress (0-1) across the whole flight-scene spacer.
 * Returns a ref, not React state, so callers that need progress as
 * render-affecting state (the checkpoint overlay layer, the WORK
 * carousel) derive their own throttled state from this ref separately -
 * this hook itself never calls setState.
 */
export function useFlightProgress(spacerRef: RefObject<HTMLElement | null>) {
  const progressRef = useRef<FlightProgressRef>({ current: 0 });

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

  return { progressRef };
}

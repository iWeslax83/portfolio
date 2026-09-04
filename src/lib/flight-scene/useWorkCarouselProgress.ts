"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { checkpoints, WORK_STAGE_BOUNDARIES } from "@/lib/flight-scene/route";
import type { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";

export type WorkStage = "intro" | "tile" | "carousel" | "zoomOut";

export interface WorkCarouselState {
  stage: WorkStage;
  /** 0-1 progress within the current stage only. */
  stageProgress: number;
  /** Index of the project currently in front, 0-based. */
  activeIndex: number;
  /** 0-1 progress of the slide transition from activeIndex toward
      activeIndex + 1 during the "carousel" stage. Always 0 outside that
      stage. */
  slideProgress: number;
}

const logWindow = checkpoints.find((c) => c.id === "log")!;

function computeState(globalProgress: number, projectCount: number): WorkCarouselState {
  const logLocal = Math.min(
    1,
    Math.max(0, (globalProgress - logWindow.start) / (logWindow.end - logWindow.start))
  );

  if (logLocal < WORK_STAGE_BOUNDARIES.introEnd) {
    return {
      stage: "intro",
      stageProgress: logLocal / WORK_STAGE_BOUNDARIES.introEnd,
      activeIndex: 0,
      slideProgress: 0,
    };
  }

  if (logLocal < WORK_STAGE_BOUNDARIES.tileEnd) {
    return {
      stage: "tile",
      stageProgress:
        (logLocal - WORK_STAGE_BOUNDARIES.introEnd) /
        (WORK_STAGE_BOUNDARIES.tileEnd - WORK_STAGE_BOUNDARIES.introEnd),
      activeIndex: 0,
      slideProgress: 0,
    };
  }

  if (logLocal < WORK_STAGE_BOUNDARIES.carouselEnd) {
    const carouselLocal =
      (logLocal - WORK_STAGE_BOUNDARIES.tileEnd) /
      (WORK_STAGE_BOUNDARIES.carouselEnd - WORK_STAGE_BOUNDARIES.tileEnd);
    const raw = carouselLocal * projectCount;
    const activeIndex = Math.min(projectCount - 1, Math.floor(raw));
    const slideProgress = Math.min(1, raw - activeIndex);
    return { stage: "carousel", stageProgress: carouselLocal, activeIndex, slideProgress };
  }

  return {
    stage: "zoomOut",
    stageProgress:
      (logLocal - WORK_STAGE_BOUNDARIES.carouselEnd) / (1 - WORK_STAGE_BOUNDARIES.carouselEnd),
    activeIndex: projectCount - 1,
    slideProgress: 0,
  };
}

/**
 * Derives the WORK-carousel's own local stage/progress from the shared
 * flight-scene progress ref, using the same requestAnimationFrame polling
 * pattern FlightSceneRoot already uses for activeId/pastEnd - only
 * re-renders when the derived state's rounded values actually change, not
 * on every scroll tick.
 */
export function useWorkCarouselProgress(
  progressRef: RefObject<FlightProgressRef>,
  projectCount: number
): WorkCarouselState {
  const [state, setState] = useState<WorkCarouselState>(() => computeState(0, projectCount));
  const lastKeyRef = useRef("");

  useEffect(() => {
    let raf: number;
    const poll = () => {
      const next = computeState(progressRef.current.current, projectCount);
      const key = `${next.stage}:${next.activeIndex}:${Math.round(next.slideProgress * 100)}:${Math.round(next.stageProgress * 100)}`;
      if (key !== lastKeyRef.current) {
        lastKeyRef.current = key;
        setState(next);
      }
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, projectCount]);

  return state;
}

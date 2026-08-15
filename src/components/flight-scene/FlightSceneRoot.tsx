"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlightSceneCanvas from "./Canvas";
import { checkpoints, activeCheckpoint } from "@/lib/flight-scene/route";
import { useFlightProgress } from "@/lib/flight-scene/useFlightProgress";
import Liftoff from "@/components/checkpoints/Liftoff";
import Log from "@/components/checkpoints/Log";
import Origin from "@/components/checkpoints/Origin";
import Telemetry from "@/components/checkpoints/Telemetry";
import Landing from "@/components/checkpoints/Landing";
import { RepoStats } from "@/lib/github-repo-stats";
import { GitHubStats } from "@/lib/types";

const anchorFor: Record<string, string> = {
  liftoff: "home",
  log: "flight-log",
  origin: "founder-story",
  telemetry: "telemetry",
  landing: "contact",
};

export default function FlightSceneRoot({
  repoStats,
  githubStats,
}: {
  repoStats: Record<string, RepoStats | null>;
  githubStats: GitHubStats;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [activeId, setActiveId] = useState<string>("liftoff");
  const { progressRef, reduced, mobile } = useFlightProgress(spacerRef);
  const handleFallback = useCallback(() => setFallback(true), []);

  /* Mirrors progress into React state, but only re-renders when the
     active checkpoint actually changes - not on every scroll tick. This
     is the overlay layer's own derived state; it never feeds back into
     progressRef or the camera. */
  useEffect(() => {
    let raf: number;
    const poll = () => {
      const id = activeCheckpoint(progressRef.current.current);
      setActiveId((prev) => (prev === id ? prev : id));
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  if (fallback) {
    return (
      <div className="relative">
        <Liftoff visible mode="flat" />
        <Log visible mode="flat" repoStats={repoStats} />
        <Origin visible mode="flat" />
        <Telemetry visible mode="flat" stats={githubStats} />
        <Landing visible mode="flat" />
      </div>
    );
  }

  return (
    <div ref={spacerRef} className="relative" style={{ height: "600vh" }}>
      <FlightSceneCanvas progressRef={progressRef} reduced={reduced} mobile={mobile} onFallback={handleFallback} />
      {checkpoints.map((c) => (
        <span
          key={c.id}
          id={anchorFor[c.id]}
          aria-hidden
          className="absolute left-0 w-px h-px"
          style={{ top: `${c.start * 100}%` }}
        />
      ))}
      <Liftoff visible={activeId === "liftoff"} mode="scene" />
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} />
      <Origin visible={activeId === "origin"} mode="scene" />
      <Telemetry visible={activeId === "telemetry"} mode="scene" stats={githubStats} />
      <Landing visible={activeId === "landing"} mode="scene" />
    </div>
  );
}

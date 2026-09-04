"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlightSceneCanvas from "./Canvas";
import { checkpoints, activeCheckpoint, TOTAL_SPACER_VH } from "@/lib/flight-scene/route";
import { useFlightProgress } from "@/lib/flight-scene/useFlightProgress";
import Liftoff from "@/components/checkpoints/Liftoff";
import Log from "@/components/checkpoints/Log";
import Ventures from "@/components/checkpoints/Ventures";
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
  const [pastEnd, setPastEnd] = useState(false);
  const { progressRef, reduced, mobile } = useFlightProgress(spacerRef);
  const handleFallback = useCallback(() => setFallback(true), []);

  /* Mirrors progress into React state, but only re-renders when the
     active checkpoint actually changes - not on every scroll tick. This
     is the overlay layer's own derived state; it never feeds back into
     progressRef or the camera. Also drives `pastEnd` off scroll progress
     itself rather than spacer geometry - the spacer's bottom edge never
     reaches the viewport top within the reachable scroll range, so a
     geometry-based IntersectionObserver check can never fire. */
  useEffect(() => {
    let raf: number;
    const poll = () => {
      const progress = progressRef.current.current;
      const id = activeCheckpoint(progress);
      setActiveId((prev) => (prev === id ? prev : id));
      setPastEnd((prev) => (prev === progress >= 1 ? prev : progress >= 1));
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  if (fallback) {
    return (
      <div className="relative">
        <div id="home">
          <Liftoff visible mode="flat" />
        </div>
        <div id="flight-log">
          <Log visible mode="flat" repoStats={repoStats} progressRef={progressRef} />
        </div>
        <div id="founder-story">
          <Ventures visible mode="flat" />
        </div>
        <div id="telemetry">
          <Telemetry visible mode="flat" stats={githubStats} />
        </div>
        <div id="contact">
          <Landing visible mode="flat" />
        </div>
      </div>
    );
  }

  return (
    <div ref={spacerRef} className="relative" style={{ height: `${TOTAL_SPACER_VH}vh` }}>
      {checkpoints.map((c) => (
        <span
          key={c.id}
          id={anchorFor[c.id]}
          aria-hidden
          className="absolute left-0 w-px"
          style={{
            top: `calc(${c.start} * (100% - 100vh))`,
            height: `calc(${c.end - c.start} * (100% - 100vh))`,
          }}
        />
      ))}
      <div className={pastEnd ? "hidden" : ""}>
        <FlightSceneCanvas progressRef={progressRef} reduced={reduced} mobile={mobile} onFallback={handleFallback} />
      </div>
      <Liftoff visible={activeId === "liftoff"} mode="scene" />
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} progressRef={progressRef} />
      <Ventures visible={activeId === "origin"} mode="scene" />
      <Telemetry visible={activeId === "telemetry"} mode="scene" stats={githubStats} />
      <Landing visible={activeId === "landing"} mode="scene" />
    </div>
  );
}

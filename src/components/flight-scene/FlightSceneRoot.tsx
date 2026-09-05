"use client";

import { useEffect, useRef, useState } from "react";
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
  const [activeId, setActiveId] = useState<string>("liftoff");
  const { progressRef } = useFlightProgress(spacerRef);

  /* Mirrors progress into React state, but only re-renders when the
     active checkpoint actually changes - not on every scroll tick. This
     is the overlay layer's own derived state; it never feeds back into
     progressRef. */
  useEffect(() => {
    let raf: number;
    const poll = () => {
      const progress = progressRef.current.current;
      const id = activeCheckpoint(progress);
      setActiveId((prev) => (prev === id ? prev : id));
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

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
      <Liftoff visible={activeId === "liftoff"} mode="scene" />
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} progressRef={progressRef} />
      <Ventures visible={activeId === "origin"} mode="scene" />
      <Telemetry visible={activeId === "telemetry"} mode="scene" stats={githubStats} />
      <Landing visible={activeId === "landing"} mode="scene" />
    </div>
  );
}

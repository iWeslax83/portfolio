import * as THREE from "three";

export type CheckpointId = "liftoff" | "log" | "origin" | "telemetry" | "landing";

export interface Checkpoint {
  id: CheckpointId;
  start: number;
  end: number;
}

/* Total master spacer height, consumed by FlightSceneRoot.tsx's spacer
   div. Every beat except "log" keeps its original pixel height from the
   prior 600vh system (liftoff 72vh, origin 132vh, telemetry 144vh,
   landing 108vh - 456vh total); "log" grows from 144vh to 1200vh to give
   the WORK-intro + letter-tile background + project carousel (covers
   every project in the dataset) + zoom-out sequence real scroll room.
   Fractions below are each beat's vh span divided by this total. */
export const TOTAL_SPACER_VH = 1656;

export const checkpoints: Checkpoint[] = [
  { id: "liftoff", start: 0, end: 0.043478 },
  { id: "log", start: 0.043478, end: 0.768116 },
  { id: "origin", start: 0.768116, end: 0.847826 },
  { id: "telemetry", start: 0.847826, end: 0.934783 },
  { id: "landing", start: 0.934783, end: 1 },
];

/* Local progress stage boundaries within the "log" checkpoint's own 0-1
   window (independent of the global checkpoint fractions above).
   Consumed by useWorkCarouselProgress to derive which stage of the
   WORK-intro / letter-tile / carousel / zoom-out sequence is active:
   0 - introEnd: static WORK pill.
   introEnd - tileEnd: pill scales/fades into the tiled letter rows.
   tileEnd - carouselEnd: the sliding carousel covering every project in
     the dataset (the bulk of the range).
   carouselEnd - 1: the final project card zooms to fill the viewport,
     crossfading into Telemetry. */
export const WORK_STAGE_BOUNDARIES = {
  introEnd: 0.05,
  tileEnd: 0.1,
  carouselEnd: 0.9,
} as const;

export function activeCheckpoint(progress: number): CheckpointId {
  const p = Math.min(1, Math.max(0, progress));
  for (const c of checkpoints) {
    if (p >= c.start && p < c.end) return c.id;
  }
  return checkpoints[checkpoints.length - 1].id;
}

/* Hand-authored control points: liftoff climbs from ground level, the
   three middle legs bank and vary altitude, landing descends and levels
   out. Units are arbitrary world units, tuned against the 55deg FOV
   camera set up in Canvas.tsx. */
const controlPoints: THREE.Vector3[] = [
  new THREE.Vector3(0, -4, 20),
  new THREE.Vector3(2, 2, 12),
  new THREE.Vector3(6, 5, 2),
  new THREE.Vector3(-4, 7, -8),
  new THREE.Vector3(3, 4, -18),
  new THREE.Vector3(-2, 1, -28),
  new THREE.Vector3(0, -3, -36),
];

export const flightCurve = new THREE.CatmullRomCurve3(controlPoints, false, "catmullrom", 0.5);

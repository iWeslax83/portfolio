import * as THREE from "three";

export type CheckpointId = "liftoff" | "log" | "origin" | "telemetry" | "landing";

export interface Checkpoint {
  id: CheckpointId;
  start: number;
  end: number;
}

export const checkpoints: Checkpoint[] = [
  { id: "liftoff", start: 0, end: 0.12 },
  { id: "log", start: 0.12, end: 0.36 },
  { id: "origin", start: 0.36, end: 0.58 },
  { id: "telemetry", start: 0.58, end: 0.82 },
  { id: "landing", start: 0.82, end: 1 },
];

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

"use client";

import { memo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { flightCurve, activeCheckpoint, checkpoints, type CheckpointId } from "@/lib/flight-scene/route";
import type { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";

/* Isolated leaf component, memoized: its own props (progressRef, frozen)
   only change on a reduced-motion toggle, so it must not re-render just
   because FlightSceneRoot's checkpoint state changes every frame via the
   rAF poll in Task 7. All continuous motion happens inside useFrame,
   never via React state/re-render. */
function CameraRigImpl({
  progressRef,
  frozen,
}: {
  progressRef: RefObject<FlightProgressRef>;
  /* True under prefers-reduced-motion: the camera holds a fixed pose at
     the currently active checkpoint's midpoint instead of traversing the
     spline every frame. Checkpoint switches (via activeCheckpoint) still
     move the frozen pose - only continuous per-frame motion is disabled. */
  frozen: boolean;
}) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const frozenCheckpointRef = useRef<CheckpointId | null>(null);
  const frozenPoseRef = useRef<{ pos: THREE.Vector3; look: THREE.Vector3 } | null>(null);

  useFrame(() => {
    const progress = progressRef.current?.current ?? 0;

    if (frozen) {
      const checkpointId = activeCheckpoint(progress);
      if (frozenCheckpointRef.current !== checkpointId || !frozenPoseRef.current) {
        const cp = checkpoints.find((c) => c.id === checkpointId)!;
        const mid = (cp.start + cp.end) / 2;
        frozenPoseRef.current = {
          pos: flightCurve.getPointAt(mid),
          look: flightCurve.getPointAt(Math.min(1, mid + 0.02)),
        };
        frozenCheckpointRef.current = checkpointId;
      }
      camera.position.copy(frozenPoseRef.current.pos);
      camera.lookAt(frozenPoseRef.current.look);
      return;
    }

    const point = flightCurve.getPointAt(progress);
    const lookAhead = flightCurve.getPointAt(Math.min(1, progress + 0.02));
    lookTarget.current.copy(lookAhead);

    camera.position.copy(point);
    camera.lookAt(lookTarget.current);

    /* Banking: roll around the forward axis proportional to the route's
       local lateral curvature, smoothed so it doesn't snap between
       spline segments. */
    const forward = lookAhead.clone().sub(point).normalize();
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -forward.x * 0.4, 0.1);
  });

  return null;
}

const CameraRig = memo(CameraRigImpl);
export default CameraRig;

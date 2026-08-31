"use client";

import { memo, useMemo } from "react";
import { flightCurve, checkpoints } from "@/lib/flight-scene/route";

/* The only other geometry in the scene (DroneModel) sits at the world
   origin, which the camera passes at roughly progress 0.35 - leaving
   nothing to look at for the remaining ~65% of the route (origin,
   telemetry, and landing legs). These waypoint markers and the ground
   grid give the camera something to fly past along the whole spline, so
   the route, banking, and scroll-driven motion are actually perceptible. */
function RouteMarkersImpl({ color = "#3ddc84" }: { color?: string }) {
  const waypoints = useMemo(
    () => checkpoints.map((c) => flightCurve.getPointAt((c.start + c.end) / 2)),
    []
  );

  return (
    <group>
      <gridHelper args={[60, 24, color, "#123524"]} position={[0, -8, -8]} />
      {waypoints.map((p, i) => (
        <mesh key={i} position={p}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshBasicMaterial color={color} wireframe />
        </mesh>
      ))}
    </group>
  );
}

const RouteMarkers = memo(RouteMarkersImpl);
export default RouteMarkers;

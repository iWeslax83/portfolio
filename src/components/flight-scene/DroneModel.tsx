"use client";

import { memo, useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/* Mirrors the hub layout in ui/drone-schematic.tsx (400x400 SVG units,
   center at 200,200) so the 2D fallback drawing and this 3D geometry are
   derived from the same coordinate data instead of two hand-maintained
   shapes. */
const hubs2D = [
  { x: 78, y: 78 },
  { x: 322, y: 78 },
  { x: 78, y: 322 },
  { x: 322, y: 322 },
];
const CENTER_2D = { x: 200, y: 200 };
const SCALE = 1 / 100; // 400 SVG units -> 4 world units

function to3D(p: { x: number; y: number }): [number, number, number] {
  return [(p.x - CENTER_2D.x) * SCALE, 0, (p.y - CENTER_2D.y) * SCALE];
}

/* Memoized and isolated: this leaf component's own props (color) almost
   never change, so it should never re-render just because FlightSceneRoot
   or the checkpoint overlay layer re-renders. Its geometries/materials are
   declarative R3F JSX, which R3F disposes automatically on unmount - no
   manual dispose() is needed here (that only applies to geometries built
   imperatively outside JSX). */
function DroneModelImpl({ color = "#3ddc84" }: { color?: string }) {
  const armLines = useMemo(
    () => hubs2D.map((h) => [to3D(CENTER_2D), to3D(h)] as [number, number, number][]),
    []
  );

  return (
    <group>
      {armLines.map((points, i) => (
        <Line key={i} points={points} color={color} lineWidth={1.5} />
      ))}
      {hubs2D.map((h, i) => {
        const [x, y, z] = to3D(h);
        return (
          <mesh key={i} position={[x, y, z]}>
            <ringGeometry args={[0.15, 0.18, 24]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      <mesh>
        <boxGeometry args={[0.68, 0.15, 0.68]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </group>
  );
}

const DroneModel = memo(DroneModelImpl);
export default DroneModel;

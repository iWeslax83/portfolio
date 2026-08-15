"use client";

import { useEffect, useState, type RefObject } from "react";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import DroneModel from "./DroneModel";
import type { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

export default function FlightSceneCanvas({
  progressRef,
  reduced,
  mobile,
  onFallback,
}: {
  progressRef: RefObject<FlightProgressRef>;
  reduced: boolean;
  mobile: boolean;
  onFallback: () => void;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = supportsWebGL2();
    setSupported(ok);
    if (!ok) onFallback();
  }, [onFallback]);

  if (supported !== true) return null;

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <FiberCanvas
        dpr={mobile ? 1 : [1, 1.5]}
        camera={{ fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: !mobile }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 8, mobile ? 24 : 32]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <DroneModel />
        <CameraRig progressRef={progressRef} frozen={reduced} />
      </FiberCanvas>
    </div>
  );
}

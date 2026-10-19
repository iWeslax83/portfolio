"use client";

import { HERO_MESH_CRESTS, heroMeshLines } from "@/lib/wireframe-mesh";
import WireframeMesh from "@/components/ui/wireframe-mesh";

/**
 * The hero's line field. A client component on purpose: the mesh is built
 * from a seed at module load (the canvas lens already ships that code), so
 * the server still renders the SVG into the HTML but the 140 paths are not
 * sent a second time inside the page's React payload.
 */
export default function HeroMesh() {
  return (
    <WireframeMesh
      lines={heroMeshLines}
      stroke="var(--color-ink)"
      crests={HERO_MESH_CRESTS}
      className="absolute inset-0 h-full w-full"
    />
  );
}

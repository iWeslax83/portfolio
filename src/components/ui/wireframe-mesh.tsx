import { wireframeLines, type WireframeLine } from "@/lib/wireframe-mesh";

/**
 * Decorative warped-line mesh. Deterministic (see wireframe-mesh.ts),
 * aria-hidden, safe as a server component. `crests` thickens a few lines
 * so the field has a couple of strong ridges.
 */
export default function WireframeMesh({
  className = "",
  lines = wireframeLines,
  stroke = "var(--color-rule-strong)",
  crests = [],
}: {
  className?: string;
  lines?: WireframeLine[];
  stroke?: string;
  crests?: number[];
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {lines.map((line, i) => (
        <path
          key={i}
          d={line.d}
          fill="none"
          stroke={stroke}
          strokeWidth={crests.includes(i) ? 2.5 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

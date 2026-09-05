import { wireframeLines, type WireframeLine } from "@/lib/wireframe-mesh";

/**
 * Full-bleed decorative warped-line mesh background. Deterministic (see
 * wireframe-mesh.ts), purely decorative - aria-hidden, no interaction, no
 * client-only state, safe as a server component. Pass `lines` to render
 * a different seeded mesh (e.g. `wireframeLinesAlt`) instead of the
 * default hero mesh.
 */
export default function WireframeMesh({
  className = "",
  lines = wireframeLines,
}: {
  className?: string;
  lines?: WireframeLine[];
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {lines.map((line, i) => (
        <path key={i} d={line.d} fill="none" stroke="var(--color-rule-strong)" strokeWidth="1" />
      ))}
    </svg>
  );
}

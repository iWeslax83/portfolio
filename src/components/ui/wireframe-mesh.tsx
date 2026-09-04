import { wireframeLines } from "@/lib/wireframe-mesh";

/**
 * Full-bleed decorative warped-line mesh background. Deterministic (see
 * wireframe-mesh.ts), purely decorative - aria-hidden, no interaction, no
 * client-only state, safe as a server component.
 */
export default function WireframeMesh({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {wireframeLines.map((line, i) => (
        <path key={i} d={line.d} fill="none" stroke="var(--color-rule-strong)" strokeWidth="1" />
      ))}
    </svg>
  );
}

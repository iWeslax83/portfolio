import { radialRays } from "@/lib/radial-burst";

/**
 * Deterministic radial burst of thin lines converging on a center point -
 * decorative background for the Contact beat's closing CTA statement.
 */
export default function RadialBurst({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {radialRays.map((ray, i) => (
        <line key={i} x1="500" y1="500" x2={ray.x2} y2={ray.y2} stroke="var(--color-rule)" strokeWidth="1" />
      ))}
    </svg>
  );
}

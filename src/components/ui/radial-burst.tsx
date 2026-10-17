import { radialRays, type RadialRay } from "@/lib/radial-burst";

/** Thin lines converging on one point. Decorative. */
export default function RadialBurst({
  className = "",
  rays = radialRays,
  cx = 500,
  cy = 500,
  stroke = "var(--color-rule)",
}: {
  className?: string;
  rays?: RadialRay[];
  cx?: number;
  cy?: number;
  stroke?: string;
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={ray.x2}
          y2={ray.y2}
          stroke={stroke}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

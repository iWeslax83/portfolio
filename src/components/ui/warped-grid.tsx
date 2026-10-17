import type { GridPath } from "@/lib/warped-grid";

export default function WarpedGrid({
  paths,
  className = "",
}: {
  paths: GridPath[];
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

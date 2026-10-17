import { useId } from "react";

/** Even dot grid as an SVG pattern (no CSS gradients). Decorative. */
export default function DotPattern({
  color = "currentColor",
  gap = 12,
  radius = 1,
  className = "",
}: {
  color?: string;
  gap?: number;
  radius?: number;
  className?: string;
}) {
  const id = `dots-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden className={`pointer-events-none ${className}`}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={radius} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

const RAY_COUNT = 48;

export interface RadialRay {
  x2: number;
  y2: number;
}

/**
 * Deterministic radial burst of rays from a center point (500,500 in a
 * 1000x1000 viewBox), evenly spaced by angle. Purely decorative background
 * for the Contact beat's closing CTA statement.
 */
export const radialRays: RadialRay[] = Array.from({ length: RAY_COUNT }, (_, i) => {
  const angle = (i / RAY_COUNT) * Math.PI * 2;
  return {
    x2: 500 + Math.cos(angle) * 900,
    y2: 500 + Math.sin(angle) * 900,
  };
});

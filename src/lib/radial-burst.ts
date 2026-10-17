const RAY_COUNT = 48;

export interface RadialRay {
  x2: number;
  y2: number;
}

/**
 * Evenly spaced rays from (cx, cy). Rounded to 2 decimals: Math.cos/sin can
 * differ in the last bit between Node and browsers, and rounding keeps the
 * server and client SVG strings identical.
 */
export function radialRaysFrom(
  cx: number,
  cy: number,
  count: number,
  length: number,
): RadialRay[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x2: Math.round((cx + Math.cos(angle) * length) * 100) / 100,
      y2: Math.round((cy + Math.sin(angle) * length) * 100) / 100,
    };
  });
}

export const radialRays: RadialRay[] = radialRaysFrom(500, 500, RAY_COUNT, 900);

const POINT_COUNT = 48;

/**
 * Deterministic gentle sine-wave path (0-1000 x 0-40 viewBox) for the
 * Contact beat's divider lines bracketing the GO button. Pure math, no
 * seed needed - not randomized, just a sampled sine curve, so it's
 * trivially identical on server and client.
 */
export const wavyDividerPath: string = (() => {
  const points: string[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const x = (i / (POINT_COUNT - 1)) * 1000;
    const y = 20 + Math.sin((i / (POINT_COUNT - 1)) * Math.PI * 2) * 8;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
})();

/**
 * Length of an `M x,y L x,y ...` polyline after scaling x by `sx` and y by
 * `sy`. The hero mesh is drawn with preserveAspectRatio="none" and
 * non-scaling strokes, so its dashes live in screen space: the draw-in needs
 * the on-screen length, which getTotalLength() (user space) cannot give.
 */
export function polylineLength(d: string, sx = 1, sy = 1): number {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!nums || nums.length < 4) return 0;
  let total = 0;
  let px = Number(nums[0]) * sx;
  let py = Number(nums[1]) * sy;
  for (let i = 2; i + 1 < nums.length; i += 2) {
    const x = Number(nums[i]) * sx;
    const y = Number(nums[i + 1]) * sy;
    total += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return total;
}

/**
 * Length of a polyline path (`M x,y` then absolute `L x,y` or relative
 * `l dx,dy` steps, with implicit repeats) after scaling x by `sx` and y by
 * `sy`. The hero mesh is drawn with preserveAspectRatio="none" and
 * non-scaling strokes, so its dashes live in screen space: the draw-in needs
 * the on-screen length, which getTotalLength() (user space) cannot give.
 */
export function polylineLength(d: string, sx = 1, sy = 1): number {
  const tokens = d.match(/[MLml]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi);
  if (!tokens) return 0;
  let total = 0;
  let cmd = "M";
  let first = true;
  let x = 0;
  let y = 0;
  for (let i = 0; i < tokens.length;) {
    if (/^[MLml]$/.test(tokens[i])) {
      cmd = tokens[i++];
      continue;
    }
    if (i + 1 >= tokens.length) break;
    const a = Number(tokens[i]);
    const b = Number(tokens[i + 1]);
    i += 2;
    const relative = (cmd === "l" || cmd === "m") && !first;
    const nx = relative ? x + a : a;
    const ny = relative ? y + b : b;
    if (!first && cmd !== "M" && cmd !== "m") {
      total += Math.hypot((nx - x) * sx, (ny - y) * sy);
    }
    x = nx;
    y = ny;
    first = false;
    // Pairs after a moveto are implicit linetos of the same kind.
    if (cmd === "M") cmd = "L";
    else if (cmd === "m") cmd = "l";
  }
  return total;
}

const DIGIT_COUNT = 140;
const SEED = 7331;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic 0/1 digit string, generated once at module load from a
 * fixed seed - identical server/client output, no hydration mismatch.
 * Purely decorative divider strip for the hero beat.
 */
export const binaryDigits: string = (() => {
  const rand = mulberry32(SEED);
  let out = "";
  for (let i = 0; i < DIGIT_COUNT; i++) {
    out += rand() < 0.5 ? "0" : "1";
  }
  return out;
})();

const SEED = 1337;
const ROWS = 24;
const COLS = 96;

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
 * Deterministic binary (0/1) character field, generated once at module
 * load from a fixed seed. Server and client produce identical output -
 * no hydration mismatch, no per-render flicker. Purely decorative.
 */
export const binaryRows: string[] = (() => {
  const rand = mulberry32(SEED);
  const rows: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let row = "";
    for (let c = 0; c < COLS; c++) {
      row += rand() > 0.5 ? "1" : "0";
    }
    rows.push(row);
  }
  return rows;
})();

/**
 * Text for a number counting up from 0 to `target` at `progress` (0..1,
 * clamped). Whole numbers only, so the readout never shows a fraction of a
 * repo, and progress 1 always prints the exact real value.
 */
export function countUpText(target: number, progress: number): string {
  const p = Math.min(1, Math.max(0, progress));
  return String(Math.round(target * p));
}

import type { Messages } from "@/lib/messages";
import { CONTACT_EMAIL } from "@/data/contact";
import { lensGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

/** Lens centre in the grid's 1000x600 viewBox; GO sits on it. */
const LENS = { cx: 500, cy: 270 };
const grid = lensGrid({
  cols: 12,
  rows: 8,
  ...LENS,
  radius: 160,
  strength: 0.5,
});

export default function GoPanel({ t }: { t: Messages["closing"] }) {
  return (
    <div className="relative h-[75vh] min-h-[460px] overflow-clip border-t border-ink">
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={t.goLabel}
        style={{ top: `${(LENS.cy / 600) * 100}%` }}
        className="group absolute left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-4xl text-bg transition-[scale] duration-[400ms] hover:scale-[1.18] focus-visible:scale-[1.18] active:scale-95"
      >
        {/* Breathes via CSS (go-breathe); the link carries the hover scale,
            so the two transforms never fight over one element. */}
        <span
          aria-hidden
          className="go-breathe absolute inset-0 rounded-full bg-ink"
        />
        <span className="relative">{t.go}</span>
      </a>
    </div>
  );
}

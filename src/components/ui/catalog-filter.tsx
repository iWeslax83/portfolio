"use client";

const FILTERS = ["ALL", "SHIPPED", "IN_PROGRESS", "ARCHIVED"] as const;
export type CatalogFilterValue = (typeof FILTERS)[number];

const LABELS: Record<CatalogFilterValue, string> = {
  ALL: "ALL",
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

/**
 * Pill-shaped segmented filter control - a scoped exception to the
 * repo-wide no-pill-badge rule (see DESIGN.md "Scoped exceptions").
 * The active segment is filled; inactive segments are plain bordered text.
 */
export default function CatalogFilter({
  value,
  onChange,
}: {
  value: CatalogFilterValue;
  onChange: (value: CatalogFilterValue) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 font-mono text-xs">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`rounded-full px-4 py-1.5 transition-[background-color,color,transform] duration-200 ${
            value === f
              ? "bg-accent text-bg scale-100"
              : "border border-rule text-ink-3 hover:text-ink-2 hover:border-rule-strong"
          }`}
          aria-pressed={value === f}
        >
          {LABELS[f]}
        </button>
      ))}
    </div>
  );
}

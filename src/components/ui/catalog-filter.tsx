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
 * Plain-text status filter, not a pill row - underline marks the active
 * value per the repo-wide no-pill-badge rule.
 */
export default function CatalogFilter({
  value,
  onChange,
}: {
  value: CatalogFilterValue;
  onChange: (value: CatalogFilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`pb-0.5 transition-colors ${
            value === f
              ? "text-accent underline decoration-accent underline-offset-4"
              : "link-draw text-ink-3 hover:text-ink-2"
          }`}
          aria-pressed={value === f}
        >
          {LABELS[f]}
        </button>
      ))}
    </div>
  );
}

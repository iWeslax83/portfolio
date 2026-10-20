"use client";

import { CATALOG_FILTERS, type CatalogFilterValue } from "@/lib/catalog-filter";

const LABELS: Record<CatalogFilterValue, string> = {
  ALL: "ALL",
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

/**
 * Segmented filter control: bordered rectangular tags, never fully rounded.
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
      {CATALOG_FILTERS.map((f) => (
        <button
          type="button"
          key={f}
          onClick={() => onChange(f)}
          className={`border px-4 py-1.5 transition-colors duration-[350ms] ${
            value === f
              ? "border-ink bg-ink text-bg"
              : "border-rule text-ink-3 hover:border-ink hover:text-ink focus-visible:border-ink focus-visible:text-ink"
          }`}
          aria-pressed={value === f}
        >
          {LABELS[f]}
        </button>
      ))}
    </div>
  );
}

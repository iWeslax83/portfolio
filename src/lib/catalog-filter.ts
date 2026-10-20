export const CATALOG_FILTERS = [
  "ALL",
  "SHIPPED",
  "IN_PROGRESS",
  "ARCHIVED",
] as const;
export type CatalogFilterValue = (typeof CATALOG_FILTERS)[number];

const PARAM = "status";

/** The filter a `?status=` query asks for (e.g. `in-progress`), else ALL. */
export function filterFromSearch(search: string): CatalogFilterValue {
  const raw = new URLSearchParams(search).get(PARAM);
  const value = raw?.toUpperCase().replace(/-/g, "_");
  return CATALOG_FILTERS.find((f) => f === value) ?? "ALL";
}

/** The query string for a filter, keeping any other params. */
export function searchForFilter(
  search: string,
  filter: CatalogFilterValue,
): string {
  const params = new URLSearchParams(search);
  if (filter === "ALL") params.delete(PARAM);
  else params.set(PARAM, filter.toLowerCase().replace(/_/g, "-"));
  const query = params.toString();
  return query ? `?${query}` : "";
}

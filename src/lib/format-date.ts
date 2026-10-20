// Fixed locale and UTC, so the server and the browser print the same text.
const DAY = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-08-09" to "Aug 9, 2026". Anything unparseable comes back as is. */
export function formatDay(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : DAY.format(date);
}

/** One note's front matter, kept in the hand-maintained registry. */
export interface NoteMeta {
  slug: string;
  title: string;
  summary: string;
  /** YYYY-MM-DD */
  date: string;
  /** Drafts show in `next dev` only. */
  draft: boolean;
}

/** Drafts are visible everywhere except a production build. */
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

/** The notes to list, newest first; drafts only when `includeDrafts`. */
export function publishedNotes(
  all: NoteMeta[],
  includeDrafts: boolean,
): NoteMeta[] {
  return all
    .filter((n) => includeDrafts || !n.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { publishedNotes, type NoteMeta } from "./notes";
import { notes } from "@/content/notes/meta";

const base = { title: "T", summary: "S" };
const sample: NoteMeta[] = [
  { ...base, slug: "draft", date: "2026-02-01", draft: true },
  { ...base, slug: "january", date: "2026-01-01", draft: false },
  { ...base, slug: "march", date: "2026-03-01", draft: false },
];

describe("publishedNotes", () => {
  it("drops drafts and puts the newest first", () => {
    expect(publishedNotes(sample, false).map((n) => n.slug)).toEqual([
      "march",
      "january",
    ]);
  });

  it("keeps drafts when asked", () => {
    expect(publishedNotes(sample, true).map((n) => n.slug)).toEqual([
      "march",
      "draft",
      "january",
    ]);
  });

  it("does not reorder its input", () => {
    publishedNotes(sample, true);
    expect(sample.map((n) => n.slug)).toEqual(["draft", "january", "march"]);
  });
});

describe("notes registry", () => {
  const dir = fileURLToPath(new URL("../content/notes/", import.meta.url));

  it("has at least one entry", () => {
    expect(notes.length).toBeGreaterThan(0);
  });

  it.each(notes.map((n) => [n.slug, n] as const))(
    "%s has an .mdx file and a YYYY-MM-DD date",
    (slug, note) => {
      expect(existsSync(`${dir}${slug}.mdx`)).toBe(true);
      expect(note.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(`${note.date}T00:00:00Z`))).toBe(false);
    },
  );

  it("has unique slugs", () => {
    expect(new Set(notes.map((n) => n.slug)).size).toBe(notes.length);
  });
});

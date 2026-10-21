import type { NoteMeta } from "@/lib/notes";

/**
 * Every note, one entry per `.mdx` file in this folder. Kept apart from
 * `index.ts` so the header and footer can read it without pulling the MDX
 * loaders into the client bundle.
 */
export const notes: NoteMeta[] = [
  {
    slug: "prose-step-list",
    title: "The model writes a list, not a graph",
    summary:
      "How PROSE keeps a language model from handing the engine a broken task graph: the model picks the steps, and code assigns ids, edges, types and the checksum.",
    date: "2026-10-21",
    draft: true,
  },
];

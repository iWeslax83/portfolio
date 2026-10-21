import type { MDXContent } from "mdx/types";

export { notes } from "./meta";

/** One static import per note, so the bundler sees every file. */
const loaders: Record<string, () => Promise<{ default: MDXContent }>> = {
  "prose-step-list": () => import("./prose-step-list.mdx"),
};

export function loadNote(slug: string): Promise<{ default: MDXContent }> {
  const load = loaders[slug];
  if (!load) throw new Error(`No note registered for "${slug}"`);
  return load();
}

/**
 * The black full-width label bar (About, Skills, Ventures, notes). Lives in
 * a plain module, not a "use client" one: a server component that imports a
 * value from a client module gets a client reference, not the string.
 */
export const SECTION_BAR =
  "bg-ink py-1 text-center font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg";

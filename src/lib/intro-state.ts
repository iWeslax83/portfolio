/**
 * Tells other client code when the first-load intro has finished (or was
 * skipped), so nothing takes over an element the intro is still animating.
 * The hero canvas waits on this before it replaces the SVG mesh.
 */
let done = false;
const waiters = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  waiters.forEach((fn) => fn());
  waiters.clear();
}

/** Runs `fn` once the intro is done (right away if it already is). */
export function whenIntroDone(fn: () => void): () => void {
  if (done) {
    fn();
    return () => {};
  }
  waiters.add(fn);
  return () => {
    waiters.delete(fn);
  };
}

import { ScrollTrigger } from "./gsap";

/**
 * Calls `play` once, the first time `trigger` reaches `start`. Also covers
 * the cases a plain onEnter misses: the page loading (or restoring its
 * scroll) already at or past the trigger, where ScrollTrigger refreshes
 * without firing callbacks. Without this, content set to its hidden start
 * state above the viewport would never appear.
 */
export function revealOnce(
  trigger: Element | null,
  play: () => void,
  start = "top 85%",
): ScrollTrigger | null {
  if (!trigger) return null;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    play();
  };
  return ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: run,
    onRefresh: (self) => {
      if (self.progress > 0) run();
    },
  });
}

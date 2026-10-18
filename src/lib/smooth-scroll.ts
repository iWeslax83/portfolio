import type Lenis from "lenis";
import { expoOut, focusTarget, scrollToHash, syncLenis } from "./anchor";

/**
 * The page's single Lenis instance, or null when smooth scroll is off
 * (reduced motion, before mount). Set by <SmoothScroll />. Other code calls
 * getLenis()?.stop() / start() / scrollTo() through this module.
 */
let instance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return instance;
}

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll to the section with this id (Lenis when active, native otherwise)
 * and keep the URL hash and focus behaviour of a normal anchor jump.
 */
export function scrollToId(id: string): boolean {
  const ok = scrollToHash(id, {
    lenis: instance,
    getElement: (target) => document.getElementById(target),
    currentScroll: () => window.scrollY,
    nativeScroll: (el) =>
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      }),
  });
  if (!ok) return false;
  const el = document.getElementById(id);
  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, "", `#${id}`);
  }
  // Native fragment navigation moves the focus start point to the target;
  // preventDefault skipped that, so do it here without moving the scroll.
  if (el) focusTarget(el);
  return true;
}

export function scrollToTop() {
  if (instance) {
    syncLenis(instance, window.scrollY);
    instance.scrollTo(0, { duration: 1.2, easing: expoOut, force: true });
  } else {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }
}

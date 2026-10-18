/** The bits of Lenis that anchor scrolling needs. */
export interface ScrollerLike {
  animatedScroll: number;
  isScrolling: boolean | "native" | "smooth";
  scrollTo: (
    target: HTMLElement | number,
    options?: {
      duration?: number;
      easing?: (t: number) => number;
      force?: boolean;
      immediate?: boolean;
    },
  ) => void;
}

export interface ScrollDeps {
  lenis: ScrollerLike | null;
  getElement: (id: string) => HTMLElement | null;
  nativeScroll: (el: HTMLElement) => void;
  /** The real scroll position (window.scrollY). */
  currentScroll: () => number;
}

/** Expo-out, matching the site's entrance curve. */
export const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Id of the section an in-page link points at, or null when the href is not
 * a same-page `#id` link (external, mailto, bare `#`, or a path + hash).
 */
export function hashTargetId(href: string | null | undefined): string | null {
  if (!href || !href.startsWith("#") || href.length < 2) return null;
  return href.slice(1);
}

/**
 * Scroll to the element with `id`: through Lenis when smooth scroll is on,
 * natively otherwise. Returns false when there is no such element.
 */
export function scrollToHash(id: string, deps: ScrollDeps): boolean {
  const el = deps.getElement(id);
  if (!el) return false;
  const lenis = deps.lenis;
  if (lenis) {
    // An instant native jump (focus scroll, find-in-page) can land in the
    // same frame as the click, before Lenis hears its scroll event. Lenis
    // would then measure from a stale position, so sync it first.
    const now = deps.currentScroll();
    if (lenis.isScrolling !== "smooth" && Math.abs(lenis.animatedScroll - now) > 1) {
      lenis.scrollTo(now, { immediate: true, force: true });
    }
    lenis.scrollTo(el, { duration: 1.2, easing: expoOut, force: true });
  } else {
    deps.nativeScroll(el);
  }
  return true;
}

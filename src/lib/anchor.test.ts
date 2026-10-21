import { describe, expect, it, vi } from "vitest";
import {
  focusTarget,
  hashTargetId,
  scrollToHash,
  syncLenis,
  type ScrollDeps,
} from "./anchor";

describe("hashTargetId", () => {
  it("returns the id of an in-page hash link", () => {
    expect(hashTargetId("#about")).toBe("about");
    expect(hashTargetId("#main")).toBe("main");
  });

  it("ignores empty hashes, external links and missing hrefs", () => {
    expect(hashTargetId("#")).toBeNull();
    expect(hashTargetId("")).toBeNull();
    expect(hashTargetId(null)).toBeNull();
    expect(hashTargetId("https://github.com/iWeslax83")).toBeNull();
    expect(hashTargetId("mailto:a@b.c")).toBeNull();
    expect(hashTargetId("/projects#ventures")).toBeNull();
  });

  it("treats a root path + hash as in-page only on the home page", () => {
    expect(hashTargetId("/#about", "/")).toBe("about");
    expect(hashTargetId("/#about", "/projects")).toBeNull();
    expect(hashTargetId("/#about")).toBeNull();
    expect(hashTargetId("/#", "/")).toBeNull();
  });

  it("treats /tr as a home page too", () => {
    expect(hashTargetId("/tr#about", "/tr")).toBe("about");
    expect(hashTargetId("/tr#about", "/")).toBe(null);
    expect(hashTargetId("/#about", "/tr")).toBe(null);
  });
});

function deps(overrides: Partial<ScrollDeps> = {}): ScrollDeps {
  const el = { id: "about" } as unknown as HTMLElement;
  return {
    lenis: null,
    getElement: (id) => (id === "about" ? el : null),
    nativeScroll: vi.fn(),
    currentScroll: () => 0,
    ...overrides,
  };
}

describe("scrollToHash", () => {
  it("uses Lenis when it exists", () => {
    const scrollTo = vi.fn();
    const d = deps({
      lenis: { scrollTo, animatedScroll: 0, isScrolling: false },
    });
    expect(scrollToHash("about", d)).toBe(true);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo.mock.calls[0][0]).toBe(d.getElement("about"));
    expect(d.nativeScroll).not.toHaveBeenCalled();
  });

  it("falls back to a native scroll without Lenis", () => {
    const d = deps();
    expect(scrollToHash("about", d)).toBe(true);
    expect(d.nativeScroll).toHaveBeenCalledWith(d.getElement("about"));
  });

  it("does nothing for a missing target", () => {
    const scrollTo = vi.fn();
    const d = deps({
      lenis: { scrollTo, animatedScroll: 0, isScrolling: false },
    });
    expect(scrollToHash("nope", d)).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
    expect(d.nativeScroll).not.toHaveBeenCalled();
  });

  it("resyncs a stale Lenis position before animating", () => {
    // An instant native jump (focus, find-in-page) whose scroll event has
    // not reached Lenis yet leaves animatedScroll behind the real position.
    const scrollTo = vi.fn();
    const d = deps({
      lenis: { scrollTo, animatedScroll: 100, isScrolling: false },
      currentScroll: () => 5000,
    });
    scrollToHash("about", d);
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(scrollTo.mock.calls[0]).toEqual([
      5000,
      { immediate: true, force: true },
    ]);
    expect(scrollTo.mock.calls[1][0]).toBe(d.getElement("about"));
  });

  it("does not resync while Lenis is mid smooth scroll", () => {
    const scrollTo = vi.fn();
    const d = deps({
      lenis: { scrollTo, animatedScroll: 100, isScrolling: "smooth" },
      currentScroll: () => 5000,
    });
    scrollToHash("about", d);
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});

describe("syncLenis", () => {
  it("jumps Lenis to the real position when it is stale and idle", () => {
    const scrollTo = vi.fn();
    syncLenis({ scrollTo, animatedScroll: 10, isScrolling: false }, 900);
    expect(scrollTo).toHaveBeenCalledWith(900, {
      immediate: true,
      force: true,
    });
  });

  it("leaves Lenis alone when in sync or mid smooth scroll", () => {
    const scrollTo = vi.fn();
    syncLenis({ scrollTo, animatedScroll: 900, isScrolling: false }, 900);
    syncLenis({ scrollTo, animatedScroll: 10, isScrolling: "smooth" }, 900);
    expect(scrollTo).not.toHaveBeenCalled();
  });
});

function fakeEl(tabindex: string | null) {
  const attrs = new Map<string, string>();
  if (tabindex !== null) attrs.set("tabindex", tabindex);
  const listeners: Record<string, () => void> = {};
  return {
    attrs,
    listeners,
    hasAttribute: (n: string) => attrs.has(n),
    setAttribute: (n: string, v: string) => void attrs.set(n, v),
    removeAttribute: (n: string) => void attrs.delete(n),
    focus: vi.fn(),
    addEventListener: (t: string, fn: () => void) => {
      listeners[t] = fn;
    },
  };
}

describe("focusTarget", () => {
  it("focuses without scrolling and adds a temporary tabindex", () => {
    const el = fakeEl(null);
    focusTarget(el);
    expect(el.attrs.get("tabindex")).toBe("-1");
    expect(el.focus).toHaveBeenCalledWith({ preventScroll: true });
    el.listeners.blur();
    expect(el.attrs.has("tabindex")).toBe(false);
  });

  it("keeps an existing tabindex (main for the skip link)", () => {
    const el = fakeEl("-1");
    focusTarget(el);
    expect(el.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(el.listeners.blur).toBeUndefined();
    expect(el.attrs.get("tabindex")).toBe("-1");
  });
});

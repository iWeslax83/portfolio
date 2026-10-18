import { describe, expect, it, vi } from "vitest";
import { hashTargetId, scrollToHash, type ScrollDeps } from "./anchor";

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
    expect(hashTargetId("/#about")).toBeNull();
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
    const d = deps({ lenis: { scrollTo, animatedScroll: 0, isScrolling: false } });
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
    const d = deps({ lenis: { scrollTo, animatedScroll: 0, isScrolling: false } });
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
    expect(scrollTo.mock.calls[0]).toEqual([5000, { immediate: true, force: true }]);
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

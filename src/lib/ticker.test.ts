import { describe, expect, it } from "vitest";
import { buildTickerSegments } from "./ticker";

const commits = [
  { hash: "dda1ef8", message: "docs(resume): update certifications" },
  {
    hash: "f583459",
    message:
      "chore: add eslint and prettier config with a very long subject line that keeps going",
  },
];

describe("buildTickerSegments", () => {
  it("is deterministic for the same seed", () => {
    expect(buildTickerSegments(commits, 7)).toEqual(
      buildTickerSegments(commits, 7),
    );
  });

  it("returns exactly `count` segments", () => {
    expect(buildTickerSegments(commits, 7, 18)).toHaveLength(18);
  });

  it("uses real commits, starting with the hash", () => {
    const segs = buildTickerSegments(commits, 7);
    const commitSegs = segs.filter((s) => s.kind === "commit");
    expect(commitSegs.length).toBeGreaterThan(0);
    expect(commitSegs[0].text.startsWith("dda1ef8 ")).toBe(true);
  });

  it("truncates long subjects to 48 characters with '...'", () => {
    const segs = buildTickerSegments(commits, 7);
    const long = segs.find((s) => s.text.startsWith("f583459"));
    expect(long).toBeDefined();
    expect(long!.text.endsWith("...")).toBe(true);
    expect(long!.text.length).toBe("f583459 ".length + 48);
  });

  it("never invents commit text when there is no git history", () => {
    const segs = buildTickerSegments([], 7, 12);
    expect(segs).toHaveLength(12);
    expect(segs.every((s) => s.kind !== "commit")).toBe(true);
  });

  it("emits only 0/1 for binary and only / for rules", () => {
    for (const s of buildTickerSegments(commits, 99, 30)) {
      if (s.kind === "binary") expect(s.text).toMatch(/^[01]+$/);
      if (s.kind === "rule") expect(s.text).toMatch(/^\/+$/);
    }
  });
});

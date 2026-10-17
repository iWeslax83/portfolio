import { describe, expect, it } from "vitest";
import { perspectiveRoom } from "./perspective-room";

const opts = { columnLeft: 350, columnRight: 650, rows: 6, rails: [120, 215] };

describe("perspectiveRoom", () => {
  const lines = perspectiveRoom(opts);

  it("emits two rails per rail position and two lines per row", () => {
    expect(lines).toHaveLength(opts.rails.length * 2 + opts.rows * 2);
  });

  it("mirrors rails across the center", () => {
    const xs = lines.filter((l) => l.x1 === l.x2).map((l) => l.x1);
    expect(xs).toEqual([120, 880, 215, 785]);
  });

  it("pulls every floor line toward the vertical center at the column edge", () => {
    for (const l of lines.filter((l) => l.x1 !== l.x2)) {
      expect(Math.abs(l.y2 - 500)).toBeLessThan(Math.abs(l.y1 - 500));
      expect([opts.columnLeft, opts.columnRight]).toContain(l.x2);
    }
  });

  it("rounds to two decimals so server and client strings match", () => {
    for (const l of lines) {
      for (const v of [l.x1, l.y1, l.x2, l.y2]) {
        expect(Math.round(v * 100) / 100).toBe(v);
      }
    }
  });
});

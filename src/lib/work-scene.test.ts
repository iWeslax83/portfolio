import { describe, expect, it } from "vitest";
import {
  cardCrossing,
  cardKey,
  cardLayout,
  cardPose,
  cardProgress,
  frontLetters,
  holeGeometry,
  letterCounts,
  letterPose,
  maxZoom,
  pinProgress,
  rowLoopX,
  zoomState,
} from "./work-scene";

const W = 1440;
const H = 900;

describe("letterCounts", () => {
  it("matches the reference counts at the measured sizes", () => {
    expect(letterCounts(1440, 900)).toEqual([10, 15, 15, 14]);
    expect(letterCounts(390, 844)).toEqual([4, 5, 5, 4]);
    expect(letterCounts(1024, 768)).toEqual([8, 13, 13, 12]);
  });
});

describe("pinProgress", () => {
  it("clamps rel to 0..1 over the 3.5-viewport pin", () => {
    expect(pinProgress(-100, H)).toBe(0);
    expect(pinProgress(0, H)).toBe(0);
    expect(pinProgress(1.75 * H, H)).toBe(0.5);
    expect(pinProgress(4 * H, H)).toBe(1);
  });
});

describe("rowLoopX", () => {
  it("stays inside [-0.715w, 0.715w) for all slots and t", () => {
    for (let t = 0; t <= 1.01; t += 0.05) {
      for (let slot = 0; slot < 15; slot++) {
        const x = rowLoopX(slot, 15, 0, t, W);
        expect(x).toBeGreaterThanOrEqual(-0.715 * W);
        expect(x).toBeLessThan(0.715 * W);
      }
    }
  });

  it("drifts left (modulo wrap) as t grows", () => {
    let prev = rowLoopX(0, 10, 0, 0, W);
    let movedLeft = 0;
    for (let t = 0.01; t <= 0.5; t += 0.01) {
      const x = rowLoopX(0, 10, 0, t, W);
      if (x < prev) movedLeft++;
      prev = x;
    }
    expect(movedLeft).toBeGreaterThan(30);
  });

  it("drifts slower for lower rows", () => {
    // Over a small t step no letter can wrap, so the displacement is the
    // raw drift and rows can be compared directly.
    const drift = (row: number) =>
      rowLoopX(0, 10, row, 0, W) - rowLoopX(0, 10, row, 0.005, W);
    const d = [0, 1, 2, 3].map(drift);
    expect(d[0]).toBeGreaterThan(d[1]);
    expect(d[1]).toBeGreaterThan(d[2]);
    expect(d[2]).toBeGreaterThan(d[3]);
  });
});

describe("letterPose", () => {
  it("matches the reference anchor at x=-759, row 0, W=1440", () => {
    const p = letterPose(-759, 0, W);
    expect(p.z).toBeCloseTo(144, 0);
    expect(Math.abs(p.z - 144)).toBeLessThanOrEqual(6);
    expect(p.y).toBeCloseTo(-66, 0);
    expect(Math.abs(p.y + 66)).toBeLessThanOrEqual(4);
    expect(Math.sin(p.rotY)).toBeCloseTo(0.187, 2);
    expect(Math.abs(Math.sin(p.rotY) - 0.187)).toBeLessThanOrEqual(0.01);
    expect(p.rotY).toBeGreaterThan(0);
  });

  it("is all zeros at the centre", () => {
    for (let row = 0; row < 4; row++) {
      expect(letterPose(0, row, W)).toEqual({ x: 0, y: 0, z: 0, rotY: 0 });
    }
  });
});

describe("zoomState", () => {
  it("is 0 before the pin, 1 during it, 0 after it", () => {
    expect(zoomState(-0.2 * H, H)).toBe(0);
    expect(zoomState(0.53 * H, H)).toBe(1);
    expect(zoomState(1.8 * H, H)).toBe(1);
    expect(zoomState(2.9 * H, H)).toBe(1);
    expect(zoomState(3.45 * H, H)).toBe(0);
    expect(zoomState(4 * H, H)).toBe(0);
  });

  it("rises monotonically on the in-phase", () => {
    let prev = -1;
    for (let rel = -0.17 * H; rel <= 0.53 * H; rel += 0.05 * H) {
      const v = zoomState(rel, H);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("falls monotonically on the out-phase", () => {
    let prev = 2;
    for (let rel = 2.9 * H; rel <= 3.45 * H; rel += 0.05 * H) {
      const v = zoomState(rel, H);
      expect(v).toBeLessThanOrEqual(prev);
      prev = v;
    }
  });
});

describe("cardCrossing and cardProgress", () => {
  it("spans 0.77 to 2.76 viewport heights", () => {
    expect(cardCrossing(0, 8)).toBeCloseTo(0.77);
    expect(cardCrossing(7, 8)).toBeCloseTo(2.76);
    expect(cardCrossing(0, 1)).toBe(0.77);
  });

  it("is 1 well before the crossing, -1 well after, 0 at it", () => {
    const c = cardCrossing(2, 8);
    expect(cardProgress(2, 8, (c - 0.5) * H, H)).toBe(1);
    expect(cardProgress(2, 8, (c + 0.5) * H, H)).toBe(-1);
    expect(cardProgress(2, 8, c * H, H)).toBe(0);
  });
});

describe("cardPose", () => {
  it("matches the reference anchor at p=-0.48, W=1440", () => {
    const p = cardPose(-0.48, W);
    expect(Math.abs(p.z - 159)).toBeLessThanOrEqual(3);
    expect(Math.abs(Math.sin(p.rotY) - 0.101)).toBeLessThanOrEqual(0.01);
  });
});

describe("cardLayout", () => {
  it("keeps size in [0.52, 0.93] and |y| in [0.5, 0.9] with alternating signs", () => {
    const layout = cardLayout(8);
    expect(layout).toHaveLength(8);
    layout.forEach((c, i) => {
      expect(c.size).toBeGreaterThanOrEqual(0.52);
      expect(c.size).toBeLessThanOrEqual(0.93);
      expect(Math.abs(c.y)).toBeGreaterThanOrEqual(0.5);
      expect(Math.abs(c.y)).toBeLessThanOrEqual(0.9);
      expect(Math.sign(c.y)).toBe(i % 2 === 0 ? 1 : -1);
    });
  });

  it("is deterministic", () => {
    expect(cardLayout(8)).toEqual(cardLayout(8));
  });
});

describe("cardKey", () => {
  const slugs = [
    "otonom-iha",
    "prose",
    "teluvane",
    "tabletab",
    "akademi",
    "stratos",
    "5cypress",
    "ventures-hub",
  ];

  it("matches the reference format", () => {
    expect(cardKey("prose", 1, 8)).toMatch(/^#[0-9A-Z]{4}-\d{4}\/\d{2}$/);
  });

  it("is deterministic and distinct across the real slugs", () => {
    const keys = slugs.map((s, i) => cardKey(s, i, 8));
    expect(keys).toEqual(slugs.map((s, i) => cardKey(s, i, 8)));
    expect(new Set(keys).size).toBe(8);
  });
});

describe("frontLetters", () => {
  it("returns 5 distinct sorted indices below the total", () => {
    const f = frontLetters(54);
    expect(f).toHaveLength(5);
    expect(new Set(f).size).toBe(5);
    expect([...f].sort((a, b) => a - b)).toEqual(f);
    f.forEach((i) => expect(i).toBeLessThan(54));
    expect(frontLetters(54)).toEqual(f);
  });
});

describe("holeGeometry and maxZoom", () => {
  it("centres a 0.764h capsule with the ring offset", () => {
    const g = holeGeometry(1440, 900, 1440);
    expect(g.height).toBeCloseTo(0.764 * 900);
    expect(g.top).toBeCloseTo((900 - g.height) / 2);
    expect(g.width).toBeCloseTo(Math.min(0.225 * 900, 0.46 * 1440));
    expect(g.r).toBe(g.width / 2);
    expect(g.cx).toBe(720);
    expect(g.ring).toBe(16);
    expect(holeGeometry(390, 844, 390).ring).toBe(10);
  });

  it("caps zoom so the sheet always ends black", () => {
    expect(maxZoom(1440, 202.5)).toBeCloseTo(
      Math.max(12.3, (1.2 * 1440) / 202.5),
    );
    expect(maxZoom(390, 120)).toBeCloseTo(12.3);
  });
});

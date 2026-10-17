export type RoomLine = { x1: number; y1: number; x2: number; y2: number };

/** How far floor lines bend toward the vertical center at the column. */
const PULL = 0.18;

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Line geometry for the About "room": vertical rails mirrored on both
 * sides, and horizontal lines from the frame edge to the content column
 * that bend toward y=500, so they read as converging behind the column.
 * Coordinates are in a 0-1000 square viewBox.
 */
export function perspectiveRoom({
  columnLeft,
  columnRight,
  rows,
  rails,
}: {
  columnLeft: number;
  columnRight: number;
  rows: number;
  rails: number[];
}): RoomLine[] {
  const lines: RoomLine[] = [];
  for (const x of rails) {
    lines.push({ x1: r2(x), y1: 0, x2: r2(x), y2: 1000 });
    lines.push({ x1: r2(1000 - x), y1: 0, x2: r2(1000 - x), y2: 1000 });
  }
  for (let i = 0; i < rows; i++) {
    const y = ((i + 0.5) / rows) * 1000;
    const inner = y + (500 - y) * PULL;
    lines.push({ x1: 0, y1: r2(y), x2: r2(columnLeft), y2: r2(inner) });
    lines.push({ x1: 1000, y1: r2(y), x2: r2(columnRight), y2: r2(inner) });
  }
  return lines;
}

/** The About section's room. Line ends sit under the white column. */
export const aboutRoom: RoomLine[] = perspectiveRoom({
  columnLeft: 350,
  columnRight: 650,
  rows: 10,
  rails: [120, 215, 265],
});

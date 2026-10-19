import type { CommitEntry } from "@/lib/git-history";
import { mulberry32 } from "@/lib/prng";

export type TickerSegment = {
  kind: "commit" | "binary" | "rule";
  text: string;
};

const MAX_MESSAGE = 48;

function truncate(message: string): string {
  return message.length > MAX_MESSAGE
    ? `${message.slice(0, MAX_MESSAGE - 3)}...`
    : message;
}

/**
 * Segments for one hero ticker row: this repo's real commits (hash +
 * subject) alternating with seeded binary runs and slash rules. With no git
 * history the row is binary and rules only, never invented commit text.
 */
export function buildTickerSegments(
  commits: CommitEntry[],
  seed: number,
  count = 18,
): TickerSegment[] {
  const rand = mulberry32(seed);
  const out: TickerSegment[] = [];
  let next = 0;

  for (let i = 0; i < count; i++) {
    const slot = i % 3;
    if (slot === 0 && commits.length > 0) {
      const commit = commits[next++ % commits.length];
      out.push({
        kind: "commit",
        text: `${commit.hash} ${truncate(commit.message)}`,
      });
    } else if (slot === 2) {
      out.push({
        kind: "rule",
        text: "/".repeat(12 + Math.floor(rand() * 24)),
      });
    } else {
      const len = 8 + Math.floor(rand() * 40);
      let bits = "";
      for (let b = 0; b < len; b++) bits += rand() > 0.5 ? "1" : "0";
      out.push({ kind: "binary", text: bits });
    }
  }
  return out;
}

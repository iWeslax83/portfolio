import { execFileSync } from "node:child_process";

export interface CommitEntry {
  hash: string;
  message: string;
}

/**
 * Reads this repo's own git history at build/request time to drive the
 * background motif. Real data only - no invented commit strings.
 */
export function getRecentCommits(limit = 40): CommitEntry[] {
  try {
    const output = execFileSync(
      "git",
      ["log", `-n${limit}`, "--pretty=format:%h%x1f%s"],
      { cwd: process.cwd(), encoding: "utf-8" }
    );
    return output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, message] = line.split("\x1f");
        return { hash, message };
      });
  } catch {
    // No git history available (e.g. a shallow-cloned deploy artifact) -
    // an empty motif is acceptable; the texture layer simply renders nothing
    // rather than falling back to fabricated strings.
    return [];
  }
}

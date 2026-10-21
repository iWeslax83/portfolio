import { execFileSync } from "node:child_process";

/** Used when git history is unavailable (e.g. a shallow deploy checkout). */
export const FALLBACK_DATE = new Date("2026-10-20");

function gitLog(args: string[]): string {
  return execFileSync("git", args, { cwd: process.cwd(), encoding: "utf-8" });
}

/**
 * Date of the latest commit that touched any of `paths`, read from git.
 * Falls back to FALLBACK_DATE if git fails or prints nothing.
 */
export function lastModified(
  paths: string[],
  run: (args: string[]) => string = gitLog,
): Date {
  try {
    const out = run(["log", "-1", "--format=%cI", "--", ...paths]).trim();
    const date = new Date(out);
    return out && !Number.isNaN(date.getTime()) ? date : FALLBACK_DATE;
  } catch {
    return FALLBACK_DATE;
  }
}

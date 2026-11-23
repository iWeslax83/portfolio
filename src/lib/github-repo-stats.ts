import { fetchGitHubRest } from "./github-fetch";

export interface RepoStats {
  commitCount: number;
  lastCommitDate: string; // ISO date, e.g. "2026-08-09"
}

async function fetchOneRepoStats(repo: string): Promise<RepoStats | null> {
  try {
    const commitsRes = await fetchGitHubRest(
      `https://api.github.com/repos/${repo}/commits?per_page=1`,
    );
    const linkHeader = commitsRes.headers.get("link");
    const commits = await commitsRes.json();
    const lastCommitDate: string =
      commits[0]?.commit?.author?.date?.slice(0, 10) ?? "";

    // GitHub exposes total commit count only via the Link header's "last"
    // page rel on a per_page=1 listing - parse it, falling back to 1 if the
    // repo has too few commits to paginate (no Link header at all).
    let commitCount = 1;
    if (linkHeader) {
      const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
      if (match) commitCount = parseInt(match[1], 10);
    }

    return { commitCount, lastCommitDate };
  } catch {
    return null;
  }
}

/**
 * Fetches real commit count + last-commit date per repo, in parallel.
 * Repos that fail (rate limit, 404, network) resolve to null - callers must
 * render "no data" rather than a fabricated number.
 */
export async function fetchRepoStats(
  repos: string[],
): Promise<Record<string, RepoStats | null>> {
  const results = await Promise.all(
    repos.map(async (repo) => [repo, await fetchOneRepoStats(repo)] as const),
  );
  return Object.fromEntries(results);
}

import { GitHubStats } from "./types";

const GITHUB_USERNAME = "iWeslax83";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REVALIDATE_SECONDS = 86400;
const MAX_REPOS_FOR_LANG_BREAKDOWN = 30;

/**
 * Set once GitHub answers 401 to the token (expired or revoked). From then
 * on calls go out anonymously, so the repo count still shows instead of the
 * whole cell going to "unavailable".
 */
let tokenRejected = false;
const hasToken = () => Boolean(GITHUB_TOKEN) && !tokenRejected;

async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (hasToken()) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const res = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (res.status === 401 && headers.Authorization) {
    if (!tokenRejected) {
      console.warn("GITHUB_TOKEN was rejected (401); using anonymous calls.");
    }
    tokenRejected = true;
    return githubFetch(url);
  }
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

type ContributionDay = { contributionCount: number };
type ContributionWeek = { contributionDays: ContributionDay[] };

async function fetchContributions(): Promise<number | null> {
  if (!hasToken()) {
    return null;
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (res.status === 401) tokenRejected = true;
  if (!res.ok) return null;

  const data = await res.json();
  const cal = data.data?.user?.contributionsCollection?.contributionCalendar;
  if (data.errors || !cal) return null;

  const weeks: ContributionWeek[] = cal.weeks ?? [];
  let total = 0;
  for (const week of weeks) {
    for (const day of week.contributionDays) total += day.contributionCount;
  }
  return total;
}

async function fetchLanguageBreakdown(
  repos: { languages_url: string; pushed_at: string }[],
): Promise<GitHubStats["languages"]> {
  // Unauthenticated GitHub API is 60 req/hr - skip per-repo language fan-out
  // entirely when no working token is configured (one call per repo would burn
  // the quota).
  if (!hasToken()) {
    return [];
  }

  const topRepos = [...repos]
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, MAX_REPOS_FOR_LANG_BREAKDOWN);

  const results = await Promise.allSettled(
    topRepos.map((repo) => githubFetch(repo.languages_url)),
  );

  const langBytes: Record<string, number> = {};
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const [lang, bytes] of Object.entries(result.value) as [
      string,
      number,
    ][]) {
      langBytes[lang] = (langBytes[lang] || 0) + bytes;
    }
  }

  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
  if (totalBytes === 0) return [];

  const langColors: Record<string, string> = {
    TypeScript: "#c8c8ce",
    JavaScript: "var(--color-ink-2)",
    Python: "#8b8c94",
    HTML: "#6a6b73",
    CSS: "#55565e",
  };

  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: langColors[name] || "#55565e",
    }));
}

export async function fetchGitHubStats(): Promise<GitHubStats | null> {
  try {
    const [user, repos, contributions] = await Promise.all([
      githubFetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      githubFetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
      ),
      fetchContributions(),
    ]);

    const languages = await fetchLanguageBreakdown(repos);

    return {
      publicRepos: user.public_repos,
      contributions,
      languages,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return null;
  }
}

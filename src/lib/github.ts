import {
  fetchGitHubRest,
  githubTimeout,
  githubToken,
  GITHUB_REVALIDATE_SECONDS,
  rejectGitHubToken,
} from "./github-fetch";
import type { GitHubStats } from "./types";

const GITHUB_USERNAME = "iWeslax83";
const MAX_REPOS_FOR_LANG_BREAKDOWN = 30;

async function githubFetch(url: string) {
  const res = await fetchGitHubRest(url);
  return res.json();
}

type ContributionDay = { contributionCount: number };
type ContributionWeek = { contributionDays: ContributionDay[] };

async function fetchContributions(): Promise<number | null> {
  const token = githubToken();
  if (!token) {
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
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
    signal: githubTimeout(),
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  });

  if (res.status === 401) rejectGitHubToken();
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

async function fetchLanguageBreakdown(): Promise<GitHubStats["languages"]> {
  // Unauthenticated GitHub API is 60 req/hr - skip per-repo language fan-out
  // entirely when no working token is configured (one call per repo would burn
  // the quota).
  if (!githubToken()) {
    return [];
  }

  const repos: { languages_url: string; pushed_at: string }[] =
    await githubFetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
    );
  if (!githubToken()) return [];

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

async function fetchPublicRepoCount(): Promise<number | null> {
  const user = await githubFetch(
    `https://api.github.com/users/${GITHUB_USERNAME}`,
  );
  return typeof user?.public_repos === "number" ? user.public_repos : null;
}

async function statsPart<T>(name: string, request: Promise<T>, fallback: T) {
  try {
    return await request;
  } catch (error) {
    console.error(`Failed to fetch GitHub ${name}:`, error);
    return fallback;
  }
}

export async function fetchGitHubStats(): Promise<GitHubStats | null> {
  const [publicRepos, contributions, languages] = await Promise.all([
    statsPart("public repo count", fetchPublicRepoCount(), null),
    statsPart("contributions", fetchContributions(), null),
    statsPart("language breakdown", fetchLanguageBreakdown(), []),
  ]);
  return publicRepos === null && contributions === null && languages.length === 0
    ? null
    : { publicRepos, contributions, languages };
}

import { GitHubStats } from "./types";

const GITHUB_USERNAME = "iWeslax83";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REVALIDATE_SECONDS = 86400;
const MAX_REPOS_FOR_LANG_BREAKDOWN = 30;

const FALLBACK_STATS: GitHubStats = {
  publicRepos: 7,
  contributions: 0,
  languages: [
    { name: "TypeScript", percentage: 45, color: "#d4a373" },
    { name: "JavaScript", percentage: 30, color: "#a08060" },
    { name: "Python", percentage: 18, color: "#777777" },
    { name: "Other", percentage: 7, color: "#444444" },
  ],
  contributionGraph: [],
};

async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const res = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

type ContributionDay = { contributionCount: number };
type ContributionWeek = { contributionDays: ContributionDay[] };

async function fetchContributions(): Promise<{
  graph: number[][];
  total: number;
}> {
  if (!GITHUB_TOKEN) {
    return { graph: [], total: 0 };
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

  if (!res.ok) return { graph: [], total: 0 };

  const data = await res.json();
  const weeks: ContributionWeek[] =
    data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  let total = 0;
  const graph = weeks.map((week) =>
    week.contributionDays.map((day) => {
      const count = day.contributionCount;
      total += count;
      if (count === 0) return 0;
      if (count <= 2) return 1;
      if (count <= 5) return 2;
      if (count <= 10) return 3;
      return 4;
    })
  );

  return { graph, total };
}

async function fetchLanguageBreakdown(
  repos: { languages_url: string; pushed_at: string }[]
): Promise<GitHubStats["languages"]> {
  // Unauthenticated GitHub API is 60 req/hr — skip per-repo language fan-out
  // entirely when no token is configured (one call per repo would burn the quota).
  if (!GITHUB_TOKEN) {
    return FALLBACK_STATS.languages;
  }

  const topRepos = [...repos]
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, MAX_REPOS_FOR_LANG_BREAKDOWN);

  const results = await Promise.allSettled(
    topRepos.map((repo) => githubFetch(repo.languages_url))
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
  if (totalBytes === 0) return FALLBACK_STATS.languages;

  const langColors: Record<string, string> = {
    TypeScript: "#d4a373",
    JavaScript: "#a08060",
    Python: "#777777",
    HTML: "#555555",
    CSS: "#444444",
  };

  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: langColors[name] || "#444444",
    }));
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const [user, repos, contributions] = await Promise.all([
      githubFetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      githubFetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`
      ),
      fetchContributions(),
    ]);

    const languages = await fetchLanguageBreakdown(repos);

    return {
      publicRepos: user.public_repos,
      contributions: contributions.total,
      languages,
      contributionGraph: contributions.graph,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return FALLBACK_STATS;
  }
}

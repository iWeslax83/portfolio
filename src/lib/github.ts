import { GitHubStats } from "./types";

const GITHUB_USERNAME = "iWeslax83";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers, next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

async function fetchContributionGraph(): Promise<number[][]> {
  if (!GITHUB_TOKEN) {
    return [];
  }

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
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
    body: JSON.stringify({ query }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const weeks =
    data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  return weeks.map((week: { contributionDays: { contributionCount: number }[] }) =>
    week.contributionDays.map((day) => {
      const count = day.contributionCount;
      if (count === 0) return 0;
      if (count <= 2) return 1;
      if (count <= 5) return 2;
      if (count <= 10) return 3;
      return 4;
    })
  );
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const [user, repos, contributionGraph] = await Promise.all([
      githubFetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      githubFetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
      fetchContributionGraph(),
    ]);

    const langBytes: Record<string, number> = {};
    const langResponses = await Promise.all(
      repos.map((repo: { languages_url: string }) => githubFetch(repo.languages_url))
    );
    for (const repoLangs of langResponses) {
      for (const [lang, bytes] of Object.entries(repoLangs) as [string, number][]) {
        langBytes[lang] = (langBytes[lang] || 0) + bytes;
      }
    }

    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    const langColors: Record<string, string> = {
      TypeScript: "#d4a373",
      JavaScript: "#a08060",
      Python: "#777777",
      HTML: "#555555",
      CSS: "#444444",
    };

    const languages = Object.entries(langBytes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: langColors[name] || "#444444",
      }));

    const totalContributions = contributionGraph.flat().reduce((sum, level) => {
      const estimates = [0, 1, 3, 7, 12];
      return sum + (estimates[level] || 0);
    }, 0);

    return {
      publicRepos: user.public_repos,
      contributions: totalContributions || 0,
      languages,
      contributionGraph,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return {
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
  }
}

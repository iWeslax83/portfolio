const token = process.env.GITHUB_TOKEN;
let tokenRejected = false;

export const GITHUB_REVALIDATE_SECONDS = 86_400;

export function githubTimeout() {
  return AbortSignal.timeout(3_000);
}

export function githubToken() {
  return tokenRejected ? undefined : token;
}

export function rejectGitHubToken() {
  if (!tokenRejected) {
    console.warn("GITHUB_TOKEN was rejected (401); using anonymous calls.");
  }
  tokenRejected = true;
}

export async function fetchGitHubRest(
  url: string,
  signal = githubTimeout(),
): Promise<Response> {
  const auth = githubToken();
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(auth && { Authorization: `Bearer ${auth}` }),
    },
    signal,
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  });
  if (res.status === 401 && auth) {
    rejectGitHubToken();
    return fetchGitHubRest(url, signal);
  }
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res;
}

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGitHubStats } from "./github";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("fetchGitHubStats", () => {
  it("returns null, not made-up numbers, when GitHub fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("down", { status: 500 })),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchGitHubStats()).resolves.toBeNull();
  });

  it("returns null when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchGitHubStats()).resolves.toBeNull();
  });

  it("reports unknown contributions as null and no languages without a token", async () => {
    vi.resetModules();
    vi.stubEnv("GITHUB_TOKEN", "");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (url: string) => {
        const body = String(url).endsWith("/users/iWeslax83")
          ? { public_repos: 7 }
          : [];
        return new Response(JSON.stringify(body), { status: 200 });
      }),
    );
    const { fetchGitHubStats: fresh } = await import("./github");
    const stats = await fresh();
    expect(stats).not.toBeNull();
    expect(stats?.publicRepos).toBe(7);
    expect(stats?.contributions).toBeNull();
    expect(stats?.languages).toEqual([]);
  });
  it("falls back to anonymous calls when the token is rejected", async () => {
    vi.resetModules();
    vi.stubEnv("GITHUB_TOKEN", "expired");
    const fetchMock = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = (init?.headers ?? {}) as Record<string, string>;
        if (headers.Authorization) {
          return new Response("bad credentials", { status: 401 });
        }
        const body = String(url).endsWith("/users/iWeslax83")
          ? { public_repos: 7 }
          : [];
        return new Response(JSON.stringify(body), { status: 200 });
      });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { fetchGitHubStats: fresh } = await import("./github");
    const stats = await fresh();
    expect(stats?.publicRepos).toBe(7);
    expect(stats?.contributions).toBeNull();
    expect(stats?.languages).toEqual([]);
    vi.resetModules();
  });

  it("reports null contributions when GraphQL answers 200 with errors", async () => {
    vi.resetModules();
    vi.stubEnv("GITHUB_TOKEN", "x");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (url: string) => {
        if (String(url).endsWith("/graphql")) {
          return new Response(JSON.stringify({ errors: [{ message: "x" }] }), {
            status: 200,
          });
        }
        const body = String(url).endsWith("/users/iWeslax83")
          ? { public_repos: 7 }
          : [];
        return new Response(JSON.stringify(body), { status: 200 });
      }),
    );
    const { fetchGitHubStats: fresh } = await import("./github");
    const stats = await fresh();
    expect(stats).not.toBeNull();
    expect(stats?.contributions).toBeNull();
    vi.resetModules();
  });
});

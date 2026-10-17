import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGitHubStats } from "./github";

afterEach(() => {
  vi.unstubAllGlobals();
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
});

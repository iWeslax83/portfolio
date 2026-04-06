import { fetchGitHubStats } from "@/lib/github";

export default async function Home() {
  const githubStats = await fetchGitHubStats();

  return (
    <main className="relative">
      {/* Components will be added in Tasks 7-13 */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-text-muted">Portfolio loading...</p>
      </section>
    </main>
  );
}

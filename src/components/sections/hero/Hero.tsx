import type { CommitEntry } from "@/lib/git-history";
import { heroMeshLines } from "@/lib/wireframe-mesh";
import { buildTickerSegments } from "@/lib/ticker";
import WireframeMesh from "@/components/ui/wireframe-mesh";
import Star from "@/components/ui/star";
import Ticker from "./Ticker";

export default function Hero({ commits }: { commits: CommitEntry[] }) {
  return (
    <section id="home" aria-labelledby="hero-title">
      <div className="relative h-[45vh] overflow-hidden lg:h-[62vh]">
        <WireframeMesh
          lines={heroMeshLines}
          stroke="var(--color-ink)"
          crests={[30, 98]}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <Ticker segments={buildTickerSegments(commits, 101)} speed={0.15} />
      <h1
        id="hero-title"
        className="flex flex-wrap items-center justify-center gap-x-[0.3em] px-4 py-8 text-center font-display-accent text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] text-ink"
      >
        <span className="sr-only">Emir Sakarya: </span>
        <span>UAV</span>
        <span className="sr-only">, </span>
        <Star className="h-[0.4em] w-[0.4em]" />
        <span>AI</span>
        <span className="sr-only">, </span>
        <Star className="h-[0.4em] w-[0.4em]" />
        <span>FOUNDER</span>
      </h1>
      <Ticker
        segments={buildTickerSegments(commits.slice(12), 202)}
        speed={0.25}
      />
    </section>
  );
}

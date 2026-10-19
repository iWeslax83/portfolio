import type { CommitEntry } from "@/lib/git-history";
import { buildTickerSegments } from "@/lib/ticker";
import Star from "@/components/ui/star";
import Ticker from "./Ticker";
import HeroMesh from "./HeroMesh";
import HeroMeshCanvas from "./HeroMeshCanvas";

export default function Hero({ commits }: { commits: CommitEntry[] }) {
  return (
    <section id="home" aria-labelledby="hero-title">
      <div
        data-intro="mesh"
        className="relative h-[60vh] overflow-hidden sm:h-[45vh] lg:h-[55vh]"
      >
        <HeroMesh />
        <HeroMeshCanvas />
      </div>
      <div data-intro="ticker">
        <Ticker segments={buildTickerSegments(commits, 101)} speed={0.15} />
      </div>
      <h1
        id="hero-title"
        className="flex flex-col items-center px-4 py-4 text-center font-display-accent text-[clamp(3rem,min(9vw,13vh),8.25rem)] leading-[0.74] tracking-[-0.003em] text-ink [-webkit-text-stroke:0.025em_currentColor]"
      >
        <span className="sr-only">Emir Sakarya: </span>
        <span className="flex items-center justify-center gap-x-[0.3em]">
          <span data-intro="title-word">UAV</span>
          <span className="sr-only">, </span>
          <Star className="h-[0.4em] w-[0.4em]" />
          <span data-intro="title-word">AI</span>
          <span className="sr-only">, </span>
          <Star className="h-[0.4em] w-[0.4em]" />
        </span>
        <span data-intro="title-word" className="block">
          FOUNDER
        </span>
      </h1>
      <div data-intro="ticker">
        <Ticker
          segments={buildTickerSegments(commits.slice(12), 202)}
          speed={0.25}
        />
      </div>
    </section>
  );
}

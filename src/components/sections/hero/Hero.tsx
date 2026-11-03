import type { CommitEntry } from "@/lib/git-history";
import type { Messages } from "@/lib/messages";
import { buildTickerSegments } from "@/lib/ticker";
import Ticker from "./Ticker";
import HeroMesh from "./HeroMesh";
import HeroMeshCanvas from "./HeroMeshCanvas";

const teleCell =
  "flex flex-col gap-1 border-l border-edge px-4 py-3 font-mono first:border-l-0";

export default function Hero({
  commits,
  t,
}: {
  commits: CommitEntry[];
  t: Messages["hero"];
}) {
  const cells: [string, string][] = [
    [t.loc, t.locValue],
    [t.org, t.orgValue],
    [t.team, t.teamValue],
    [t.rides, t.ridesValue],
    [t.status, t.statusValue],
  ];
  const logs = [t.log1, t.log2, t.log3, t.log4];
  return (
    <section id="home" aria-labelledby="hero-title">
      <div data-intro="ticker">
        <Ticker segments={buildTickerSegments(commits, 101)} speed={0.15} />
      </div>
      <div
        data-intro="mesh"
        className="relative h-[38vh] overflow-hidden border-b border-edge sm:h-[30vh] lg:h-[38vh]"
      >
        <HeroMesh />
        <HeroMeshCanvas />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-10 sm:py-20">
        <p className="font-mono text-sm text-ink-2">
          <span className="text-accent">emir@bursa</span>
          {t.prompt.replace("emir@bursa", "")}
        </p>
        <h1
          id="hero-title"
          className="mt-6 font-mono text-[clamp(2.4rem,8.5vw,6.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink"
        >
          <span className="sr-only">Emir Sakarya: </span>
          <span data-intro="title-word" className="block">
            UAV <span className="text-accent">/</span> AI{" "}
            <span className="text-accent">/</span>
          </span>
          <span data-intro="title-word" className="block">
            FOUNDER
            <span
              aria-hidden
              className="cursor-blink ml-3 inline-block h-[0.8em] w-[0.5em] translate-y-[0.08em] bg-accent"
            />
          </span>
        </h1>

        <dl
          data-intro="ticker"
          className="mt-12 grid grid-cols-2 border border-edge sm:grid-cols-5"
        >
          {cells.map(([k, v]) => (
            <div key={k} className={teleCell}>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-2">
                {k}
              </dt>
              <dd className="text-sm font-medium text-accent">{v}</dd>
            </div>
          ))}
        </dl>

        <div
          data-intro="ticker"
          className="mt-8 font-mono text-xs leading-[2] text-ink-2 sm:text-[13px]"
        >
          {logs.map((line, i) => (
            <p key={line}>
              <span className="text-ink-3">
                [00:0{i}.{i + 1}]
              </span>{" "}
              {line}
            </p>
          ))}
        </div>
      </div>

      <div data-intro="ticker">
        <Ticker
          segments={buildTickerSegments(commits.slice(12), 202)}
          speed={0.25}
        />
      </div>
    </section>
  );
}

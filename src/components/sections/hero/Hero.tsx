import type { CommitEntry } from "@/lib/git-history";
import type { Messages } from "@/lib/messages";
import { buildTickerSegments } from "@/lib/ticker";
import { RESUME_PATH } from "@/data/contact";
import Ticker from "./Ticker";
import HeroMesh from "./HeroMesh";
import HeroMeshCanvas from "./HeroMeshCanvas";

export default function Hero({
  commits,
  t,
  resumeLabel,
}: {
  commits: CommitEntry[];
  t: Messages["hero"];
  resumeLabel: string;
}) {
  const cells: [string, string][] = [
    [t.loc, t.locValue],
    [t.org, t.orgValue],
    [t.team, t.teamValue],
  ];
  return (
    <section id="home" aria-labelledby="hero-title">
      <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-9 sm:px-10 sm:pb-12 sm:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div>
            <p className="font-mono text-sm text-ink-3">
              <span className="text-accent">emir@bursa</span>
              {t.prompt.replace("emir@bursa", "")}
            </p>
            <h1
              id="hero-title"
              className="mt-4 font-mono text-[clamp(2.1rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.055em] text-ink"
            >
              Emir Sakarya
            </h1>
            <p className="mt-4 max-w-[42ch] text-pretty font-mono text-base leading-relaxed text-ink-3 sm:text-lg">
              {t.specialty}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#work"
                className="inline-flex min-h-11 items-center gap-3 border border-accent bg-accent px-4 py-2 text-sm font-bold text-bg transition-colors hover:border-ink hover:bg-ink"
              >
                {t.viewWork} <span aria-hidden>↓</span>
              </a>
              <a
                href={RESUME_PATH}
                hrefLang="en"
                className="inline-flex min-h-11 items-center text-sm font-bold text-ink underline decoration-edge underline-offset-4 hover:text-accent"
              >
                {resumeLabel}
              </a>
            </div>
          </div>
          <div
            aria-hidden
            className="relative h-[120px] overflow-hidden border border-edge bg-bg sm:h-[180px] lg:h-[240px]"
          >
            <div data-intro="mesh" className="absolute inset-0 opacity-70">
              <HeroMesh />
              <HeroMeshCanvas />
            </div>
            <span
              className="cursor-blink absolute bottom-3 right-3 h-3 w-2 bg-accent"
            />
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-edge pt-4 sm:mt-8 sm:grid-cols-3">
          {cells.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-3">
                {k}
              </dt>
              <dd className="mt-1 text-xs font-bold text-ink sm:text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div data-intro="ticker">
        <Ticker segments={buildTickerSegments(commits, 101)} speed={0.15} />
      </div>
    </section>
  );
}

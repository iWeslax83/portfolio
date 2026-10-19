import type { CommitEntry } from "@/lib/git-history";
import { buildTickerSegments } from "@/lib/ticker";
import Ticker from "@/components/sections/hero/Ticker";
import BurstHeadline from "./BurstHeadline";
import DreamBuild from "./DreamBuild";
import GoPanel from "./GoPanel";

export default function Closing({ commits }: { commits: CommitEntry[] }) {
  return (
    <section id="contact" aria-labelledby="contact-title">
      <Ticker
        segments={buildTickerSegments(commits.slice(24), 303)}
        speed={0.2}
      />
      <BurstHeadline />
      <DreamBuild />
      <GoPanel />
    </section>
  );
}

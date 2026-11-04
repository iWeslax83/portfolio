import type { CommitEntry } from "@/lib/git-history";
import type { Messages } from "@/lib/messages";
import { buildTickerSegments } from "@/lib/ticker";
import { contactLinks } from "@/data/contact";
import Ticker from "@/components/sections/hero/Ticker";

const LINE =
  "block font-mono text-[clamp(2.2rem,9vw,7rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em]";

/**
 * Terminal close: a prompt, the four headline lines (2 and 4 in accent),
 * and the contact channels as a bordered grid. Replaces the old
 * burst/DREAM IT/GO sequence.
 */
export default function Closing({
  commits,
  t,
}: {
  commits: CommitEntry[];
  t: Messages["closing"];
}) {
  const lines = [
    { text: t.line1, accent: false },
    { text: t.line2, accent: true },
    { text: t.line3, accent: false },
    { text: t.line4, accent: true },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title">
      <Ticker
        segments={buildTickerSegments(commits.slice(24), 303)}
        speed={0.2}
      />
      <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-10 sm:py-28">
        <p className="font-mono text-sm text-ink-2">
          <span className="text-accent">emir@bursa</span> ~ %{" "}
          ./initiate-contact.sh
          <span
            aria-hidden
            className="cursor-blink ml-2 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-accent"
          />
        </p>
        <h2 id="contact-title" className="mt-10">
          {lines.map((l) => (
            <span
              key={l.text}
              className={`${LINE} ${l.accent ? "text-accent" : "text-ink"}`}
            >
              {l.text}
            </span>
          ))}
        </h2>
        <ul className="mt-16 grid grid-cols-1 border border-edge sm:grid-cols-2 lg:grid-cols-4">
          {contactLinks.map((c, i) => {
            const external =
              c.href.startsWith("http") || c.href.endsWith(".pdf");
            return (
              <li
                key={c.label}
                className="border-b border-edge last:border-b-0 sm:border-b-0 sm:border-l sm:first:border-l-0"
              >
                <a
                  href={c.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col gap-2 p-5 font-mono text-xs transition-colors hover:bg-panel-2 focus-visible:bg-panel-2"
                >
                  <span className="uppercase tracking-[0.2em] text-accent">
                    CH-{i + 1} {c.label}
                  </span>
                  <span className="truncate text-ink-2 transition-colors group-hover:text-ink">
                    {c.value}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import type { CommitEntry } from "@/lib/git-history";
import type { Messages } from "@/lib/messages";
import { buildTickerSegments } from "@/lib/ticker";
import { CONTACT_EMAIL, RESUME_PATH, contactLinks } from "@/data/contact";
import Ticker from "@/components/sections/hero/Ticker";

const secondaryLinks = contactLinks.filter(({ href }) => !href.startsWith("mailto:"));

export default function Closing({
  commits,
  t,
  resumeLabel,
}: {
  commits: CommitEntry[];
  t: Messages["closing"];
  resumeLabel: string;
}) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-edge">
      <Ticker segments={buildTickerSegments(commits.slice(24), 303)} speed={0.2} />
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-12 sm:px-10 sm:py-16 lg:grid-cols-[3fr_2fr] lg:items-end lg:gap-12">
        <div>
          <p className="font-mono text-xs text-ink-3 sm:text-sm">
            <span className="text-accent">emir@bursa</span> ~ %{" "}
            <span className="inline-block">
              ./initiate-contact.sh
              <span aria-hidden className="cursor-blink ml-2 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-accent" />
            </span>
          </p>
          <h2 id="contact-title" className="mt-5 max-w-[17ch] text-balance text-[clamp(2.25rem,6vw,4.75rem)] font-extrabold leading-[1.04] tracking-tight text-ink">
            {t.headline}
          </h2>
          <p className="mt-4 max-w-[47ch] text-pretty text-base leading-relaxed text-ink-3">{t.invite}</p>
        </div>
        <div className="border-t border-edge pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex min-h-12 items-center gap-5 border border-accent bg-accent px-5 py-3 text-base font-bold text-bg transition-colors hover:border-ink hover:bg-ink"
          >
            {t.emailAction}
            <span aria-hidden className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1">→</span>
          </a>
          <p className="mt-3 break-words text-sm text-ink-3">{CONTACT_EMAIL}</p>
          <ul className="mt-3 flex flex-wrap gap-x-5">
            {secondaryLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  hrefLang={href === RESUME_PATH ? "en" : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-ink underline decoration-edge underline-offset-4 hover:text-accent focus-visible:text-accent"
                >
                  {href === RESUME_PATH ? resumeLabel : label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

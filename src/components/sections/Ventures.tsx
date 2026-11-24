import type { Messages } from "@/lib/messages";
import type { Venture } from "@/data/ventures";
import { SECTION_BAR } from "@/components/sections/section-bar";

export default function Ventures({
  t,
  ventures,
}: {
  t: Messages["ventures"];
  ventures: Venture[];
}) {
  return (
    <section id="ventures" aria-labelledby="ventures-title" className="border-t border-edge bg-panel">
      <h2 id="ventures-title" className={SECTION_BAR}>{t.title}</h2>
      <ul className="mx-auto max-w-[1200px] divide-y divide-edge px-4 sm:px-10">
        {ventures.map((venture) => (
          <li key={venture.name} className="grid gap-2 py-6 md:grid-cols-[2fr_3fr] md:gap-x-10 md:py-8">
            <h3 className="text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
              {venture.href ? (
                <a
                  href={venture.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-accent underline decoration-edge underline-offset-4 hover:decoration-accent"
                >
                  {venture.name}<span aria-hidden className="text-base">↗</span>
                </a>
              ) : venture.name}
            </h3>
            <div>
              <p className="text-base font-bold text-ink">{venture.role}</p>
              <p className="mt-2 max-w-[60ch] text-pretty text-sm leading-relaxed text-ink-3">{venture.proof}</p>
              {venture.units && (
                <ul className="mt-3 space-y-1 text-xs leading-relaxed text-ink-3">
                  {venture.units.map((unit) => (
                    <li key={unit.name}><strong className="text-ink">{unit.name}</strong> · {unit.detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

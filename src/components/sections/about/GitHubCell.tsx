"use client";

import { useTranslations } from "next-intl";
import type { GitHubStats } from "@/lib/types";

const label = "font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2";

/** Live GitHub numbers. Real data or an honest "unavailable", never filler. */
export default function GitHubCell({ stats }: { stats: GitHubStats | null }) {
  const t = useTranslations("skills");

  return (
    <div className="flex flex-col p-6">
      <p className={label}>{t("githubLabel")}</p>
      {stats ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col-reverse">
              <dt className={label}>{t("publicRepos")}</dt>
              <dd className="font-display text-5xl leading-none tabular-nums">
                {stats.publicRepos}
              </dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className={label}>{t("contributions")}</dt>
              <dd className="font-display text-5xl leading-none tabular-nums">
                {stats.contributions}
              </dd>
            </div>
          </dl>
          {stats.languages.length > 0 && (
            <div className="mt-5">
              <div className="flex h-1.5 overflow-hidden">
                {stats.languages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{ flex: lang.percentage, backgroundColor: lang.color }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-2">
                {stats.languages.map((lang) => (
                  <li key={lang.name}>
                    <span style={{ color: lang.color }} aria-hidden>
                      ■
                    </span>{" "}
                    {lang.name} {lang.percentage}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 font-serif text-xl leading-[1.5]">
          {t("githubUnavailable")}
        </p>
      )}
      <a
        href="https://github.com/iWeslax83"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-5 font-mono text-xs underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {t("githubLink")} ↗
      </a>
    </div>
  );
}

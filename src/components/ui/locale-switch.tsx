"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locales";
import { switchLocalePath } from "@/lib/locale-path";

const LOCALES: Locale[] = ["en", "tr"];

/**
 * EN / TR as two plain links to the same page in the other language. The
 * current query string and section hash are carried over on click, so
 * switching keeps the reader's filter and place. `className` lays out the
 * group, `linkClassName` styles each link (header cell or mobile-menu row).
 */
export default function LocaleSwitch({
  locale,
  labels,
  className,
  linkClassName,
}: {
  locale: Locale;
  labels: { en: string; tr: string; label: string };
  className?: string;
  linkClassName?: string;
}) {
  const pathname = usePathname();
  return (
    <div role="group" aria-label={labels.label} className={className}>
      {LOCALES.map((to) => {
        const current = to === locale;
        const href = switchLocalePath(pathname, to);
        return (
          <a
            key={to}
            href={href}
            lang={to}
            hrefLang={to}
            title={labels[to]}
            aria-current={current ? "true" : undefined}
            onClick={(e) => {
              e.currentTarget.href =
                href + window.location.search + window.location.hash;
            }}
            className={`${linkClassName ?? ""} ${
              current ? "underline decoration-1 underline-offset-4" : ""
            }`}
          >
            {to.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}

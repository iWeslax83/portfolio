import Image from "next/image";
import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";

/** Reduced-motion version: a WORK band and stacked cards. */
export default function StaticGallery({
  items,
  locale,
}: {
  items: Project[];
  locale: Locale;
}) {
  return (
    <div aria-hidden className="bg-ink px-4 py-12 text-bg">
      <p className="emboss-light text-center font-display text-[28vw] leading-none md:text-[14rem]">
        WORK
      </p>
      <ul className="mx-auto mt-10 max-w-[640px] space-y-10">
        {items.map((p, i) => {
          const body = (
            <>
              <div className="relative aspect-[16/10] border border-bg bg-panel">
                <Image
                  src={p.image!}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 640px"
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-2 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="truncate">{p.title}</span>
                <span className="tabular-nums">
                  #{String(i + 1).padStart(3, "0")}/
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </>
          );
          return (
            <li key={p.slug}>
              <a
                href={localizedPath(locale, `/projects/${p.slug}`)}
                tabIndex={-1}
                className="block"
              >
                {body}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

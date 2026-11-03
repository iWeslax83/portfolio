import Image from "next/image";
import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/locales";
import { cardLinkProps } from "@/lib/work-gallery";
import { cardKey } from "@/lib/work-scene";

/** Reduced-motion version: a WORK band and stacked cards. */
export default function StaticGallery({
  items,
  locale,
}: {
  items: Project[];
  locale: Locale;
}) {
  return (
    <div aria-hidden className="bg-deep px-4 py-12 text-ink">
      <p className="text-center font-display font-extrabold text-[26vw] leading-none md:text-[12rem]">
        <span
          data-letter="W"
          className="work-letter relative isolate inline-block"
        >
          W
        </span>
        <span
          data-letter="O"
          className="work-letter relative isolate inline-block"
        >
          O
        </span>
        <span
          data-letter="R"
          className="work-letter relative isolate inline-block"
        >
          R
        </span>
        <span
          data-letter="K"
          className="work-letter relative isolate inline-block"
        >
          K
        </span>
      </p>
      <ul className="mx-auto mt-10 max-w-[640px] space-y-10">
        {items.map((p, i) => {
          const body = (
            <>
              <div className="relative aspect-[16/10] border border-edge bg-panel">
                <Image
                  src={p.image!}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 640px"
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-2 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em]">
                <span className="truncate">{p.title}</span>
                <span className="tabular-nums">
                  {cardKey(p.slug, i, items.length)}
                </span>
              </div>
            </>
          );
          return (
            <li key={p.slug}>
              <a {...cardLinkProps(p, locale)} tabIndex={-1} className="block">
                {body}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

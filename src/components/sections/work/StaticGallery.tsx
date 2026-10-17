import Image from "next/image";
import type { Project } from "@/lib/types";

/** Phone and reduced-motion version: a WORK band and stacked cards. */
export default function StaticGallery({ items }: { items: Project[] }) {
  return (
    <div aria-hidden className="bg-ink px-4 py-12 text-bg">
      <p className="emboss-light text-center font-display text-[28vw] leading-none md:text-[14rem]">
        WORK
      </p>
      <ul className="mx-auto mt-10 max-w-[640px] space-y-10">
        {items.map((p, i) => {
          const primary = p.links.find((l) => l.isPrimary) ?? p.links[0];
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
                  #{String(i + 1).padStart(3, "0")}/{String(items.length).padStart(2, "0")}
                </span>
              </div>
            </>
          );
          return (
            <li key={p.slug}>
              {primary ? (
                <a href={primary.href} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="block">
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

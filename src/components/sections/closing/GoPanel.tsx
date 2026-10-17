"use client";

import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/data/contact";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

const grid = warpedGrid({ cols: 12, rows: 5, bulge: -20 });

export default function GoPanel() {
  const t = useTranslations("closing");
  return (
    <div className="relative h-[60vh] min-h-[420px] overflow-clip border-t border-ink">
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={t("goLabel")}
        className="absolute left-1/2 top-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-ink font-display text-4xl text-bg transition-transform hover:scale-105 active:scale-95"
      >
        {t("go")}
      </a>
    </div>
  );
}

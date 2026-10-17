"use client";

import { useTranslations } from "next-intl";
import { radialRaysFrom } from "@/lib/radial-burst";
import RadialBurst from "@/components/ui/radial-burst";

const rays = radialRaysFrom(500, 40, 64, 1400);

export default function BurstHeadline() {
  const t = useTranslations("closing");
  return (
    <div className="relative h-[90vh] min-h-[560px] overflow-clip">
      <RadialBurst
        rays={rays}
        cx={500}
        cy={40}
        stroke="var(--color-ink)"
        className="absolute inset-0 h-full w-full"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-[4%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-bg"
      />
      <div className="absolute inset-x-0 bottom-[22%] flex justify-center [perspective:600px]">
        <h2
          id="contact-title"
          className="flex origin-bottom flex-col items-center text-center font-display uppercase leading-[0.82] text-ink [transform:rotateX(24deg)]"
        >
          <span className="text-[clamp(1.5rem,3vw,2.5rem)]">{t("line1")}</span>
          <span className="text-[clamp(2rem,4.5vw,3.75rem)]">{t("line2")}</span>
          <span className="text-[clamp(3rem,8vw,6.5rem)]">{t("line3")}</span>
          <span className="text-[clamp(4.5rem,15vw,13rem)]">{t("line4")}</span>
        </h2>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 grid h-[16%] grid-cols-12 border-t border-ink bg-bg"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="border-r border-ink last:border-r-0" />
        ))}
      </div>
    </div>
  );
}

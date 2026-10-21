import type { BentoSkill, DevopsSkill } from "@/data/skills";

/**
 * Turkish copy for the bento rows, keyed by `key`. The big words (EMBEDDED,
 * AI, FRONT END, BACK END) are display type and stay as designed.
 */
export const bentoSkillsTr: Record<
  string,
  Partial<Pick<BentoSkill, "tools" | "label" | "sub">>
> = {
  embedded: {
    tools: ["Uçuş Kontrolcüleri", "PCB Tasarımı", "Pixhawk 6C", "ArduPilot"],
    sub: "Uçuş Yazılımı",
  },
  ai: { sub: "Ajan Sistemleri" },
  frontend: { sub: "Modern Arayüz" },
  backend: { sub: "Backend ve Veri" },
};

export const devopsSkillTr: Partial<DevopsSkill> = {
  sub: "Paketle ve Yayına Al",
};

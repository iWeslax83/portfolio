import type { Venture } from "@/data/ventures";

/**
 * Turkish copy for `ventures`, keyed by venture name. Names, links and units
 * are not copy: names stay, units come from `stratosUnitsTr`.
 */
export const venturesTr: Record<string, Pick<Venture, "role" | "proof">> = {
  "STRATOS İHA": {
    role: "Kurucu ve Baş Mühendis",
    proof:
      "25 kişilik mühendislik ekibi · TEKNOFEST döner kanat finalisti · NASA Space Apps Türkiye finalisti",
  },
  Teluvane: {
    role: "Kurucu",
    proof:
      "Yapay zeka ajanları için çok kiracılı uyumluluk platformu · hash zincirli denetim kaydı · EU AI Act / ISO 42001 / NIST AI RMF / SOC 2",
  },
  Viyaro: {
    role: "Kurucu ve CEO",
    proof:
      "Otonom mobilite · BOSİAD destekli · 10’dan fazla şirkette, canlı kullanımda 50.000+ yolculuk",
  },
};

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto pb-12">
      <div className="border-t border-rule pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="font-mono text-[11px] text-ink-3">{t("colophon")}</p>
        <p className="annotate">{t("meta")}</p>
      </div>
    </footer>
  );
}

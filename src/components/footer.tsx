import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="px-6 md:px-10 max-w-[1320px] mx-auto pb-10">
      <div className="border-t border-card-border pt-6 flex justify-between items-center">
        <p className="font-mono text-xs text-text-muted">{t("author")}</p>
        <p className="font-mono text-xs text-text-muted">
          <span className="text-accent">$</span> {t("exit")}
        </p>
      </div>
    </footer>
  );
}

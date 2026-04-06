import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="px-6 md:px-10 max-w-5xl mx-auto pb-8">
      <div className="border-t border-white/[0.05] pt-5 flex justify-between items-center">
        <p className="font-mono text-xs text-text-muted">{t("builtWith")}</p>
        <p className="font-mono text-xs text-text-muted">
          <span className="text-accent">$</span> exit 0
        </p>
      </div>
    </footer>
  );
}

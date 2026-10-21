"use client";

import { useEffect, useRef } from "react";
import type { Messages } from "@/lib/messages";
import { X } from "lucide-react";
import { navItems } from "@/data/nav-items";
import { hashTargetId } from "@/lib/anchor";
import { getLenis, scrollToId } from "@/lib/smooth-scroll";
import { localizedPath } from "@/lib/locale-path";
import LocaleSwitch from "@/components/ui/locale-switch";
import type { Locale } from "@/lib/locales";

/** Full-screen black menu sheet with numbered serif links. */
export default function MobileNav({
  open,
  onClose,
  t,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  t: Messages["nav"];
  locale: Locale;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      const dialog = dialogRef.current;
      if (e.key !== "Tab" || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = active !== null && dialog.contains(active);
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      getLenis()?.start();
      // preventScroll: the burger sits at the top of the page, and focusing
      // it must not yank the viewport away from a section just chosen.
      previous?.focus({ preventScroll: true });
    };
  }, [open]);

  // Close first (which restarts scrolling), then scroll on the next frame.
  const onNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = hashTargetId(
      e.currentTarget.getAttribute("href"),
      window.location.pathname,
    );
    onClose();
    if (!id) return;
    e.preventDefault();
    requestAnimationFrame(() => scrollToId(id));
  };

  // Always mounted so it can fade out; closed means invisible, which also
  // takes it out of the tab order and the accessibility tree.
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.menu}
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] flex flex-col bg-ink p-6 text-bg duration-200 ${
        // Visibility flips at once on open (so the close button can take
        // focus right away) and only waits out the fade on close.
        open
          ? "visible opacity-100 transition-opacity"
          : "invisible opacity-0 transition-[opacity,visibility]"
      }`}
    >
      <div className="flex justify-end">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.closeMenu}
          className="flex h-12 w-12 items-center justify-center border border-bg/30 transition-colors duration-[350ms] hover:bg-bg hover:text-ink focus-visible:bg-bg focus-visible:text-ink active:bg-bg active:text-ink"
        >
          <X size={22} />
        </button>
      </div>

      <nav aria-label={t.menu} className="mt-10 flex flex-col">
        {navItems.map((item) => (
          <a
            key={item.key}
            href={localizedPath(locale, item.href)}
            onClick={onNavigate}
            className="flex items-baseline gap-4 border-b border-bg/20 py-5 font-serif text-4xl transition-opacity duration-[350ms] hover:opacity-70 active:opacity-70"
          >
            <span className="font-mono text-xs text-bg/60">{item.num}</span>
            {t[item.key]}
          </a>
        ))}
      </nav>

      <LocaleSwitch
        locale={locale}
        labels={{ en: t.langEn, tr: t.langTr, label: t.language }}
        className="mt-8 flex gap-6 font-mono text-xs uppercase tracking-[0.1em]"
        linkClassName="py-2 transition-opacity duration-[350ms] hover:opacity-70 active:opacity-70"
      />

      <div className="mt-auto flex gap-6 font-mono text-xs uppercase tracking-[0.1em] text-bg/70">
        <a
          href="https://github.com/iWeslax83"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-[350ms] hover:text-bg"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/emirsakarya"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-[350ms] hover:text-bg"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

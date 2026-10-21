"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/smooth-scroll";

export default function BackToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The button hides once the page is at the top, so hand focus to <main>
  // (tabIndex -1) instead of dropping it on <body>.
  const onClick = () => {
    scrollToTop();
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  // Hidden means invisible too, so it leaves the tab order. The CSS
  // transitions collapse for reduced motion (globals.css).
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center border border-rule bg-panel text-ink transition-[opacity,translate,scale,visibility,color,background-color,border-color] duration-[350ms] ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-[3px] hover:border-ink hover:bg-ink hover:text-bg focus-visible:border-ink focus-visible:bg-ink focus-visible:text-bg active:scale-90 ${
        show
          ? "visible opacity-100"
          : "invisible translate-y-2.5 scale-[0.6] opacity-0"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}

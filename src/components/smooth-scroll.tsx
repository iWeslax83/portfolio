"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { hashTargetId } from "@/lib/anchor";
import { getLenis, scrollToId, setLenis } from "@/lib/smooth-scroll";

/**
 * Smooth scroll for people who have not asked for reduced motion. Lenis is
 * driven by GSAP's ticker so ScrollTrigger and the scroll stay in the same
 * frame. In-page `#id` links scroll through Lenis; without Lenis the browser
 * handles them natively.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      const tick = (time: number) => lenis.raf(time * 1000);
      const offScroll = lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
      return () => {
        setLenis(null);
        offScroll();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    // Window bubble phase runs after React's own handlers, so a component
    // that takes over its link (the mobile menu) can preventDefault first.
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        !getLenis()
      ) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const id = hashTargetId(link?.getAttribute("href"));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    };
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
      mm.revert();
    };
  }, []);

  return <>{children}</>;
}

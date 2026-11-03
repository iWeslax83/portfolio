"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";
import type { Locale } from "@/lib/locales";
import { cardLinkProps } from "@/lib/work-gallery";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import DotPattern from "@/components/ui/dot-pattern";
import {
  ROW_LETTERS,
  SECTION_VH,
  cardKey,
  cardLayout,
  cardPose,
  cardProgress,
  frontLetters,
  holeGeometry,
  letterCounts,
  letterPose,
  maxZoom,
  pinProgress,
  rowLoopX,
  zoomState,
} from "@/lib/work-scene";

/** Server and first client render share these; resize refines them. */
const BASE_COUNTS = [10, 15, 15, 14];

const capsuleD = (x0: number, y0: number, x1: number, y1: number, r: number) =>
  `M${x0} ${y0 + r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}L${x1} ${y1 - r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}Z`;

/**
 * The reference's Work scene: a fixed black stage clipped to a 4.5-viewport
 * section, a sticky white sheet with a capsule hole sliding over it, and a
 * shared zoom that flies into the hole. Packed WORK rows fan out into
 * perspective as screenshot cards cross in front of and behind them.
 * Decorative: Work carries the same links in a focusable list.
 */
export default function WorkStage({
  items,
  locale,
}: {
  items: Project[];
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const clipId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [counts, setCounts] = useState<number[]>(BASE_COUNTS);
  const [showCards, setShowCards] = useState(false);

  // Counts depend on the real aspect ratio, so they settle after mount.
  useEffect(() => {
    let timer = 0;
    const update = () =>
      setCounts((prev) => {
        const next = letterCounts(innerWidth, innerHeight);
        return next.every((n, i) => n === prev[i]) ? prev : next;
      });
    const onResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(update, 150);
    };
    update();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Lazy images inside a fixed stage can pop in on entry; mount them once
  // the section is within about 1.5 viewports instead.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowCards(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const total = counts.reduce((a, b) => a + b, 0);
  const front = useMemo(() => new Set(frontLetters(total)), [total]);
  const layout = useMemo(() => cardLayout(items.length), [items.length]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        const stage = q("[data-stage]")[0] as HTMLElement;
        // Hidden until the section scrolls in; the no-JS fallback keeps the
        // server-rendered stage (packed WORK column) instead of a blank hold.
        stage.style.visibility = "hidden";
        const scene = q("[data-scene]")[0] as HTMLElement;
        const sticky = q("[data-sticky]")[0] as HTMLElement;
        const svg = <T extends Element>(sel: string) =>
          ref.current!.querySelector<T>(sel)!;
        const mask = svg<SVGSVGElement>("[data-mask]");
        const sheet = svg<SVGPathElement>("[data-sheet]");
        const ring = svg<SVGPathElement>("[data-ring]");
        const clip = svg<SVGPathElement>("[data-clip-shape]");
        const grid = svg<SVGPathElement>("[data-grid]");
        const letterEls = q("[data-letter]") as HTMLElement[];
        const cardEls = q("[data-card]") as HTMLElement[];
        const meta = letterEls.map((el) => ({
          row: Number(el.dataset.row),
          slot: Number(el.dataset.slot),
          count: Number(el.dataset.count),
        }));
        const geo = { w: 0, h: 0, sheetW: 0, zoom: 1 };
        let active = false;

        const measure = () => {
          geo.w = innerWidth;
          geo.h = innerHeight;
          geo.sheetW = sticky.clientWidth;
          const hole = holeGeometry(geo.sheetW, geo.h, geo.w);
          geo.zoom = maxZoom(geo.w, hole.width);
          const { sheetW: sw, h } = geo;
          const rect = `M0 0H${sw}V${h}H0Z`;
          const x0 = hole.cx - hole.width / 2;
          const x1 = hole.cx + hole.width / 2;
          const y0 = hole.top;
          const y1 = hole.top + hole.height;
          const ringD = capsuleD(
            x0 - hole.ring,
            y0 - hole.ring,
            x1 + hole.ring,
            y1 + hole.ring,
            hole.r + hole.ring,
          );
          sheet.setAttribute("d", rect + capsuleD(x0, y0, x1, y1, hole.r));
          ring.setAttribute("d", ringD);
          clip.setAttribute("d", rect + ringD);
          const cols = geo.w < 768 ? 8 : 12;
          let g = "";
          for (let i = 1; i < cols; i++) g += `M${(i * sw) / cols} 0V${h}`;
          for (let j = 1; j < 10; j++) g += `M0 ${(j * h) / 10}H${sw}`;
          grid.setAttribute("d", g);
          mask.setAttribute("viewBox", `0 0 ${sw} ${h}`);
        };

        const proxy = { p: 0 };
        const render = () => {
          if (!active) return;
          const { w, h } = geo;
          const rel = -h + proxy.p * (SECTION_VH + 1) * h;
          const s = zoomState(rel, h);
          const t = pinProgress(rel, h);
          scene.style.transform = `scale(${0.75 + 0.25 * s})`;
          mask.style.transform = `scale(${1 + (geo.zoom - 1) * s})`;
          letterEls.forEach((el, i) => {
            const m = meta[i];
            const pose = letterPose(
              rowLoopX(m.slot, m.count, m.row, t, w) * s,
              m.row,
              w,
            );
            el.style.transform = `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateY(${pose.rotY}rad)`;
          });
          cardEls.forEach((el, i) => {
            const p = cardProgress(i, items.length, rel, h);
            if (Math.abs(p) >= 1) {
              el.style.visibility = "hidden";
              return;
            }
            el.style.visibility = "visible";
            const pose = cardPose(p, w);
            el.style.transform = `translate3d(${pose.x}px, ${layout[i].y * 0.255 * h}px, ${pose.z}px) rotateY(${pose.rotY}rad) scale(${layout[i].size})`;
          });
        };

        measure();
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onToggle: (self) => {
              active = self.isActive;
              stage.style.visibility = self.isActive ? "visible" : "hidden";
              if (self.isActive) render();
            },
            onRefresh: () => {
              measure();
              render();
            },
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [counts, items.length] },
  );

  let index = 0;
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-[450vh] [clip-path:inset(0)]"
    >
      <div data-stage className="fixed inset-0 z-0 bg-ink">
        <DotPattern
          color="rgba(255,255,255,0.7)"
          gap={24}
          radius={0.75}
          className="absolute inset-0 h-full w-full"
        />
        <div
          data-scene
          className="absolute inset-0 [perspective:640px]"
          style={{ perspectiveOrigin: "50% 50%" }}
        >
          {counts.map((count, row) =>
            Array.from({ length: count }, (_, slot) => {
              const i = index++;
              return (
                <span
                  key={`${row}-${slot}`}
                  data-letter={ROW_LETTERS[row]}
                  data-row={row}
                  data-slot={slot}
                  data-count={count}
                  style={
                    {
                      top: `${10 + row * 21.25}vh`,
                      zIndex: front.has(i) ? 3 : 1,
                      "--side": count > 1 ? (2 * slot) / (count - 1) - 1 : 0,
                    } as CSSProperties
                  }
                  className="work-letter absolute left-1/2 -translate-x-1/2 font-display text-[22.8vh] leading-[0.74] text-bg"
                >
                  {ROW_LETTERS[row]}
                </span>
              );
            }),
          )}
          {items.map((p, i) => (
            <div
              key={p.slug}
              data-card
              style={{ zIndex: 2, visibility: "hidden" }}
              className="absolute top-1/2 left-1/2 w-[86vw] -translate-x-1/2 -translate-y-1/2 p-[4px_4px_0] md:w-[50vw] md:p-[8px_8px_0]"
            >
              <a {...cardLinkProps(p, locale)} tabIndex={-1} className="block">
                <div className="relative aspect-[16/10] bg-panel">
                  {showCards && (
                    <Image
                      src={p.image!}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 86vw, 50vw"
                      className="object-cover object-top"
                    />
                  )}
                </div>
                <div className="flex justify-between p-2 font-mono text-[11px] uppercase tracking-[0.15em] text-bg">
                  <span className="truncate">{p.title}</span>
                  <span className="tabular-nums">
                    {cardKey(p.slug, i, items.length)}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div
        data-sticky
        className="pointer-events-none sticky top-0 z-[1] h-screen"
      >
        <svg
          data-mask
          aria-hidden
          className="block h-full w-full"
          style={{ transformOrigin: "50% 50%" }}
        >
          <clipPath id={clipId}>
            <path data-clip-shape clipRule="evenodd" d="" />
          </clipPath>
          <path data-sheet fillRule="evenodd" fill="var(--color-bg)" d="" />
          <path
            data-ring
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            d=""
          />
          <g clipPath={`url(#${clipId})`}>
            <path
              data-grid
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              d=""
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

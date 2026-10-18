"use client";

import { useEffect, useRef } from "react";
import { MOTION_OK } from "@/lib/gsap";
import { whenIntroDone } from "@/lib/intro-state";
import { HERO_MESH_CRESTS, heroMeshPoints } from "@/lib/wireframe-mesh";
import {
  MESH_RADIUS,
  damp,
  displaceLine,
  subdivide,
} from "@/lib/mesh-displacement";

/** Mouse or pen users who have not asked for reduced motion. */
const POINTER_OK = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;
/** Longest the canvas waits for the intro before taking over anyway. */
const INTRO_FALLBACK_MS = 5000;
/** Smoothing speeds (per second) for the pointer and for the bend itself. */
const FOLLOW = 14;
const EASE_IN = 6;
const EASE_OUT = 4;
/** Extra points per segment, so a bend reads as a curve, not facets. */
const DETAIL = 3;

/**
 * Interactive layer over the hero's SVG mesh. After the intro has drawn the
 * SVG, this canvas redraws the same 140 lines (same points, same crests) and
 * hides the SVG, then bends the lines away from the pointer. The SVG stays
 * in the server HTML as the static fallback for no JS, touch screens and
 * reduced motion. Rendering only runs while something is moving, and never
 * while the hero is off screen or the tab is hidden.
 */
export default function HeroMeshCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const svg = host?.querySelector("svg");
    if (!canvas || !host || !svg) return;

    const mq = window.matchMedia(POINTER_OK);
    let stop: (() => void) | null = null;
    const sync = () => {
      if (mq.matches && !stop) stop = start(canvas, host, svg);
      else if (!mq.matches && stop) {
        stop();
        stop = null;
      }
    };

    let ready = false;
    const begin = () => {
      if (ready) return;
      ready = true;
      clearTimeout(fallback);
      mq.addEventListener("change", sync);
      sync();
    };
    const fallback = setTimeout(begin, INTRO_FALLBACK_MS);
    const offIntro = whenIntroDone(begin);

    return () => {
      clearTimeout(fallback);
      offIntro();
      mq.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

function start(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  svg: SVGSVGElement,
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const color =
    getComputedStyle(host).getPropertyValue("--color-ink").trim() || "#0a0a0a";
  // Flat lines draw from the SVG's own points, so the takeover is pixel
  // exact. Bent lines use a finer, collinear copy so the bend is smooth.
  const fine = heroMeshPoints.map((pts) => subdivide(pts, DETAIL));
  const flat = heroMeshPoints.map((pts) => new Float32Array(pts.length));
  const base = fine.map((pts) => new Float32Array(pts.length));
  const out = fine.map((pts) => new Float32Array(pts.length));
  const minX = new Float32Array(fine.length);
  const maxX = new Float32Array(fine.length);

  let w = 0;
  let h = 0;
  let dpr = 1;
  // Pointer in viewport coordinates, smoothed pointer in canvas coordinates,
  // and the bend amplitude (0 = flat mesh, 1 = full push).
  let tx = 0;
  let ty = 0;
  let pointerIn = false;
  let px = 0;
  let py = 0;
  let amp = 0;

  let raf = 0;
  let last = 0;
  let onScreen = true;
  let pageVisible = !document.hidden;

  const strokeLines = (crest: boolean) => {
    ctx.beginPath();
    for (let i = 0; i < base.length; i++) {
      if (HERO_MESH_CRESTS.includes(i) !== crest) continue;
      let pts = flat[i];
      if (amp > 0 && px + MESH_RADIUS > minX[i] && px - MESH_RADIUS < maxX[i]) {
        displaceLine(base[i], out[i], px, py, amp);
        pts = out[i];
      }
      ctx.moveTo(pts[0], pts[1]);
      for (let j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1]);
    }
    ctx.lineWidth = crest ? 2.5 : 1;
    ctx.stroke();
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    strokeLines(false);
    strokeLines(true);
  };

  const resize = () => {
    const box = host.getBoundingClientRect();
    w = box.width;
    h = box.height;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const sx = w / 1000;
    const sy = h / 600;
    fine.forEach((pts, i) => {
      let lo = Infinity;
      let hi = -Infinity;
      for (let j = 0; j < pts.length; j += 2) {
        const x = pts[j] * sx;
        base[i][j] = x;
        base[i][j + 1] = pts[j + 1] * sy;
        if (x < lo) lo = x;
        if (x > hi) hi = x;
      }
      minX[i] = lo;
      maxX[i] = hi;
    });
    heroMeshPoints.forEach((pts, i) => {
      for (let j = 0; j < pts.length; j += 2) {
        flat[i][j] = pts[j] * sx;
        flat[i][j + 1] = pts[j + 1] * sy;
      }
    });
    draw();
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const box = host.getBoundingClientRect();
    const lx = tx - box.left;
    const ly = ty - box.top;
    const over =
      pointerIn && lx >= 0 && ly >= 0 && lx <= box.width && ly <= box.height;

    if (over) {
      if (amp < 0.01) {
        px = lx;
        py = ly;
      } else {
        px = damp(px, lx, FOLLOW, dt);
        py = damp(py, ly, FOLLOW, dt);
      }
      amp = damp(amp, 1, EASE_IN, dt);
      if (amp > 0.998) amp = 1;
    } else {
      amp = damp(amp, 0, EASE_OUT, dt);
      if (amp < 0.002) amp = 0;
    }
    draw();

    const moving = over
      ? amp < 1 || Math.abs(px - lx) > 0.1 || Math.abs(py - ly) > 0.1
      : amp > 0;
    if (moving) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (raf || !onScreen || !pageVisible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const halt = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    tx = e.clientX;
    ty = e.clientY;
    pointerIn = true;
    kick();
  };
  const onLeave = () => {
    pointerIn = false;
    kick();
  };
  // Scrolling moves the mesh under a still pointer, with no pointer event.
  const onScroll = () => {
    if (pointerIn || amp > 0) kick();
  };
  const onVisibility = () => {
    pageVisible = !document.hidden;
    if (pageVisible) kick();
    else halt();
  };

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) kick();
    else halt();
  });
  const ro = new ResizeObserver(resize);

  resize();
  // Same lines, same place: the canvas replaces the SVG in one frame.
  svg.style.visibility = "hidden";
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  io.observe(host);
  ro.observe(host);

  return () => {
    halt();
    io.disconnect();
    ro.disconnect();
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    svg.style.visibility = "";
    canvas.width = 0;
    canvas.height = 0;
  };
}

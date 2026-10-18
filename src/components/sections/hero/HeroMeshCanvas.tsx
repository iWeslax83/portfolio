"use client";

import { useEffect, useRef } from "react";
import { MOTION_OK } from "@/lib/gsap";
import { whenIntroDone } from "@/lib/intro-state";
import { HERO_MESH_CRESTS, heroMeshPoints } from "@/lib/wireframe-mesh";
import {
  MESH_RADIUS,
  MESH_STRENGTH,
  damp,
  displaceLine,
  subdivide,
} from "@/lib/mesh-displacement";

/** Mouse or pen users who have not asked for reduced motion. */
const POINTER_OK = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;
/** Longest the lens waits for the intro before it starts reacting anyway. */
const INTRO_FALLBACK_MS = 5000;
/** Smoothing speeds (per second) for the pointer and for the bend itself. */
const FOLLOW = 14;
const EASE_IN = 6;
const EASE_OUT = 4;
/** Extra points per segment, so a bend reads as a curve, not facets. */
const DETAIL = 2;
/**
 * How far (CSS px) from the pointer the bend can move a pixel: the radius,
 * the largest push, and slack for segment length and stroke width. The lens
 * is a square of twice this, so every bent pixel lands inside it.
 */
const REACH = MESH_RADIUS + MESH_STRENGTH + 12;
const LENS = REACH * 2;
/** Stroke bleed (CSS px) of the thickest line, for picking lines to draw. */
const BLEED = 3;

/**
 * Pointer lens over the hero's SVG mesh. The SVG always draws the flat mesh.
 * While the pointer bends it, a small canvas square follows the pointer,
 * paints the background and redraws the same lines (same points, same
 * crests) bent away from the pointer. Outside the bend the lines match the
 * SVG underneath, so the square has no visible edge, and once the bend has
 * eased back to zero the canvas hides again. Keeping the canvas small keeps
 * every frame cheap on high-DPR screens. Only for mouse and pen users
 * without reduced motion, only after the intro has drawn the mesh, and
 * never while the hero is off screen or the tab is hidden.
 */
export default function HeroMeshCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const mq = window.matchMedia(POINTER_OK);
    let stop: (() => void) | null = null;
    const sync = () => {
      if (mq.matches && !stop) stop = start(canvas, host);
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
      style={{ width: LENS, height: LENS }}
      className="pointer-events-none invisible absolute left-0 top-0 will-change-transform"
    />
  );
}

function start(canvas: HTMLCanvasElement, host: HTMLElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const tokens = getComputedStyle(host);
  const ink = tokens.getPropertyValue("--color-ink").trim() || "#0a0a0a";
  const paper = tokens.getPropertyValue("--color-bg").trim() || "#ffffff";
  // Unbent segments draw from the SVG's own points, so the lens matches the
  // SVG under it. Bent segments use a finer, collinear copy so they curve.
  const fine = heroMeshPoints.map((pts) => subdivide(pts, DETAIL));
  const flat = heroMeshPoints.map((pts) => new Float32Array(pts.length));
  const base = fine.map((pts) => new Float32Array(pts.length));
  const out = fine.map((pts) => new Float32Array(pts.length));
  const minX = new Float32Array(fine.length);
  const maxX = new Float32Array(fine.length);

  let dpr = 1;
  /** Height (CSS px) between two vertices of a line; every line shares it. */
  let rowH = 1;
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

  /**
   * Adds one line to the current path. Segments the bend did not touch are
   * emitted from the SVG's own coarse points, so pixels away from the
   * pointer rasterize like the flat mesh; only moved segments use the finer
   * points.
   */
  const addLine = (i: number, v0: number, v1: number) => {
    const f = flat[i];
    if (
      amp === 0 ||
      px + MESH_RADIUS <= minX[i] ||
      px - MESH_RADIUS >= maxX[i]
    ) {
      ctx.moveTo(f[v0 * 2], f[v0 * 2 + 1]);
      for (let v = v0 + 1; v <= v1; v++) ctx.lineTo(f[v * 2], f[v * 2 + 1]);
      return;
    }
    const b = base[i];
    const o = out[i];
    displaceLine(b, o, px, py, amp);
    const moved = (k: number) => o[k] !== b[k] || o[k + 1] !== b[k + 1];
    const step = DETAIL * 2;
    const k0 = v0 * step;
    if (moved(k0)) ctx.moveTo(o[k0], o[k0 + 1]);
    else ctx.moveTo(f[v0 * 2], f[v0 * 2 + 1]);
    for (let v = v0 + 1; v <= v1; v++) {
      const end = v * step;
      const s = end - step;
      let bent = false;
      for (let k = s; k <= end && !bent; k += 2) bent = moved(k);
      if (bent) for (let k = s + 2; k < end; k += 2) ctx.lineTo(o[k], o[k + 1]);
      if (moved(end)) ctx.lineTo(o[end], o[end + 1]);
      else ctx.lineTo(f[v * 2], f[v * 2 + 1]);
    }
  };

  /**
   * Strokes the lines that can reach the lens box (CSS px), and only the
   * vertices of each line that fall in its rows: the stroker never works
   * on segments the lens cannot show.
   */
  const strokeLines = (
    crest: boolean,
    left: number,
    right: number,
    top: number,
    bottom: number,
  ) => {
    const last = heroMeshPoints[0].length / 2 - 1;
    const v0 = Math.max(0, Math.floor(top / rowH) - 1);
    const v1 = Math.min(last, Math.ceil(bottom / rowH) + 1);
    if (v1 <= v0) return;
    ctx.lineWidth = crest ? 2.5 : 1;
    // One stroke per line, like the SVG's one path per line. It also keeps
    // the rasterizer to two edges per row instead of every line at once.
    for (let i = 0; i < base.length; i++) {
      if (HERO_MESH_CRESTS.includes(i) !== crest) continue;
      if (maxX[i] < left || minX[i] > right) continue;
      ctx.beginPath();
      addLine(i, v0, v1);
      ctx.stroke();
    }
  };

  /** Moves the lens to the pointer (on whole device pixels) and redraws it. */
  const draw = () => {
    if (amp === 0) {
      canvas.style.visibility = "";
      return;
    }
    const ox = Math.round((px - REACH) * dpr) / dpr;
    const oy = Math.round((py - REACH) * dpr) / dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
    ctx.strokeStyle = ink;
    const l = ox - BLEED;
    const r = ox + LENS + BLEED;
    const t = oy - BLEED;
    const btm = oy + LENS + BLEED;
    strokeLines(false, l, r, t, btm);
    strokeLines(true, l, r, t, btm);
    canvas.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
    canvas.style.visibility = "visible";
  };

  const resize = () => {
    const box = host.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(LENS * dpr);
    canvas.height = Math.round(LENS * dpr);
    const sx = box.width / 1000;
    const sy = box.height / 600;
    rowH = Math.max(1e-3, box.height / (heroMeshPoints[0].length / 2 - 1));
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
    canvas.style.visibility = "";
    canvas.style.transform = "";
    canvas.width = 0;
    canvas.height = 0;
  };
}

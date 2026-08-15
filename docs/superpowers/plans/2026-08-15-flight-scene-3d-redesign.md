# Flight Scene 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current GSAP-scrollytelling site with a single persistent Three.js scene: scroll drives a camera flying along a fixed spline route, while HTML content panels fade in/out per checkpoint on top.

**Architecture:** One `<Canvas>` (react-three-fiber) mounted at the page root, fixed full-viewport. A single GSAP `ScrollTrigger` (scrub) converts scroll position into a `progress: 0-1` ref. The 3D camera rig and the HTML checkpoint-overlay layer both read that same progress ref independently, never animating each other's properties. No WebGL support falls back to a plain vertical HTML flow with the same five content blocks.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, framer-motion 12 (overlay fades only), GSAP 3 + `@gsap/react` (scroll-to-progress only), three.js + `@react-three/fiber` + `@react-three/drei` (new).

**Spec:** `docs/superpowers/specs/2026-08-15-flight-scene-3d-redesign-design.md`

## Global Constraints

- No gradients, no glassmorphism, no purple. Flat fills, single accent color (terminal green, unchanged).
- Background off-black/zinc-950, never pure `#000000`.
- No `rounded-full` pill status chips anywhere, including inside checkpoint panels — use a small dot + text or bordered rectangle.
- Plain, human copy — no hype words, no decorative emoji.
- Font stack unchanged: Cabinet Grotesk (display) + JetBrains Mono (mono/UI), via existing `font-display`/`font-mono`/`font-body` Tailwind classes.
- GSAP and Three.js never animate the same property on the same element. GSAP only produces the `progress` number; Three.js's `useFrame` is the only thing that moves the camera; Framer Motion only fades HTML overlay panels based on derived checkpoint state.
- `npm run build` must stay green after every task (no test framework in this repo — this is the verification bar, consistent with prior work here).
- If `npm run build` surfaces a webpack/Next.js issue specific to bundling `three`/`@react-three/fiber` (e.g. needing `transpilePackages` in `next.config.ts`), fix it as part of the task that first imports those packages (Task 3) rather than deferring it.

---

## File Structure

| File | Purpose |
|---|---|
| `package.json` | Add `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` |
| `src/lib/flight-scene/route.ts` | Spline control points, checkpoint progress ranges, `activeCheckpoint()` helper |
| `src/lib/flight-scene/useFlightProgress.ts` | Scroll → progress(0-1) ref hook |
| `src/components/flight-scene/DroneModel.tsx` | Procedural 3D drone geometry (derived from the same hub data as `drone-schematic.tsx`) |
| `src/components/flight-scene/CameraRig.tsx` | `useFrame` camera-on-spline leaf component |
| `src/components/flight-scene/Canvas.tsx` | R3F `<Canvas>` mount, WebGL capability check |
| `src/components/checkpoints/CheckpointShell.tsx` | Shared wrapper: fixed-overlay-fade (`scene`) vs normal-flow (`flat`) |
| `src/components/checkpoints/Liftoff.tsx` | Hero content (replaces `hero.tsx`) |
| `src/components/checkpoints/Log.tsx` | Project log content (replaces `flight-log.tsx`) |
| `src/components/checkpoints/Origin.tsx` | Founder story content (replaces `founder-story.tsx`) |
| `src/components/checkpoints/Telemetry.tsx` | GitHub/skills content (replaces `telemetry.tsx`) |
| `src/components/checkpoints/Landing.tsx` | Contact content (replaces `contact.tsx`) |
| `src/components/flight-scene/FlightSceneRoot.tsx` | Client root: mounts spacer, canvas, anchors, checkpoints, fallback switch |
| `src/app/page.tsx` | Rewired to render `FlightSceneRoot` |

Deleted at Task 7: `src/components/hero.tsx`, `src/components/flight-log.tsx`, `src/components/founder-story.tsx`, `src/components/telemetry.tsx`, `src/components/contact.tsx`. `src/components/ui/drone-schematic.tsx` is kept (still used by `Liftoff.tsx` in `flat` fallback mode).

---

### Task 1: Dependencies + flight route data

**Files:**
- Modify: `package.json`
- Create: `src/lib/flight-scene/route.ts`

**Interfaces:**
- Produces: `flightCurve: THREE.CatmullRomCurve3`, `checkpoints: Checkpoint[]`, `activeCheckpoint(progress: number): CheckpointId`, `type CheckpointId = "liftoff" | "log" | "origin" | "telemetry" | "landing"`

- [ ] **Step 1: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Write `src/lib/flight-scene/route.ts`**

```ts
import * as THREE from "three";

export type CheckpointId = "liftoff" | "log" | "origin" | "telemetry" | "landing";

export interface Checkpoint {
  id: CheckpointId;
  start: number;
  end: number;
}

export const checkpoints: Checkpoint[] = [
  { id: "liftoff", start: 0, end: 0.12 },
  { id: "log", start: 0.12, end: 0.36 },
  { id: "origin", start: 0.36, end: 0.58 },
  { id: "telemetry", start: 0.58, end: 0.82 },
  { id: "landing", start: 0.82, end: 1 },
];

export function activeCheckpoint(progress: number): CheckpointId {
  const p = Math.min(1, Math.max(0, progress));
  for (const c of checkpoints) {
    if (p >= c.start && p < c.end) return c.id;
  }
  return checkpoints[checkpoints.length - 1].id;
}

/* Hand-authored control points: liftoff climbs from ground level, the
   three middle legs bank and vary altitude, landing descends and levels
   out. Units are arbitrary world units, tuned against the 55deg FOV
   camera set up in Canvas.tsx. */
const controlPoints: THREE.Vector3[] = [
  new THREE.Vector3(0, -4, 20),
  new THREE.Vector3(2, 2, 12),
  new THREE.Vector3(6, 5, 2),
  new THREE.Vector3(-4, 7, -8),
  new THREE.Vector3(3, 4, -18),
  new THREE.Vector3(-2, 1, -28),
  new THREE.Vector3(0, -3, -36),
];

export const flightCurve = new THREE.CatmullRomCurve3(controlPoints, false, "catmullrom", 0.5);
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds (this file has no consumers yet, so it only needs to type-check).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/flight-scene/route.ts
git commit -m "feat(design): add three.js deps and flight route data"
```

---

### Task 2: Scroll-to-progress hook

**Files:**
- Create: `src/lib/flight-scene/useFlightProgress.ts`

**Interfaces:**
- Consumes: `useReducedMotionPref`, `useIsMobile` from `@/lib/scroll` (existing); `gsap`, `ScrollTrigger` from `@/lib/gsap` (existing)
- Produces: `useFlightProgress(spacerRef: RefObject<HTMLElement | null>): { progressRef: RefObject<FlightProgressRef>, reduced: boolean, mobile: boolean }`, `interface FlightProgressRef { current: number }`

- [ ] **Step 1: Write `src/lib/flight-scene/useFlightProgress.ts`**

```ts
"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";

export interface FlightProgressRef {
  current: number;
}

/**
 * Scroll-driven progress (0-1) across the whole flight-scene spacer.
 * Returns a ref, not React state, so the 3D render loop (CameraRig's
 * useFrame) can read it every frame without forcing a React re-render on
 * every scroll tick. Callers that need progress as render-affecting state
 * (the checkpoint overlay layer) derive their own throttled state from
 * this ref separately - this hook itself never calls setState.
 */
export function useFlightProgress(spacerRef: RefObject<HTMLElement | null>) {
  const progressRef = useRef<FlightProgressRef>({ current: 0 });
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();

  useEffect(() => {
    if (!spacerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current.current = self.progress;
        },
      });
    });

    return () => ctx.revert();
  }, [spacerRef]);

  return { progressRef, reduced, mobile };
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (still no consumers, type-checks against existing `@/lib/gsap` and `@/lib/scroll`).

- [ ] **Step 3: Commit**

```bash
git add src/lib/flight-scene/useFlightProgress.ts
git commit -m "feat(design): add scroll-to-progress hook for flight scene"
```

---

### Task 3: Procedural drone model

**Files:**
- Create: `src/components/flight-scene/DroneModel.tsx`

**Interfaces:**
- Produces: `export default function DroneModel({ color?: string }): JSX.Element`

- [ ] **Step 1: Write `src/components/flight-scene/DroneModel.tsx`**

```tsx
"use client";

import { memo, useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/* Mirrors the hub layout in ui/drone-schematic.tsx (400x400 SVG units,
   center at 200,200) so the 2D fallback drawing and this 3D geometry are
   derived from the same coordinate data instead of two hand-maintained
   shapes. */
const hubs2D = [
  { x: 78, y: 78 },
  { x: 322, y: 78 },
  { x: 78, y: 322 },
  { x: 322, y: 322 },
];
const CENTER_2D = { x: 200, y: 200 };
const SCALE = 1 / 100; // 400 SVG units -> 4 world units

function to3D(p: { x: number; y: number }): [number, number, number] {
  return [(p.x - CENTER_2D.x) * SCALE, 0, (p.y - CENTER_2D.y) * SCALE];
}

/* Memoized and isolated: this leaf component's own props (color) almost
   never change, so it should never re-render just because FlightSceneRoot
   or the checkpoint overlay layer re-renders. Its geometries/materials are
   declarative R3F JSX, which R3F disposes automatically on unmount - no
   manual dispose() is needed here (that only applies to geometries built
   imperatively outside JSX). */
function DroneModelImpl({ color = "#3ddc84" }: { color?: string }) {
  const armLines = useMemo(
    () => hubs2D.map((h) => [to3D(CENTER_2D), to3D(h)] as [number, number, number][]),
    []
  );

  return (
    <group>
      {armLines.map((points, i) => (
        <Line key={i} points={points} color={color} lineWidth={1.5} />
      ))}
      {hubs2D.map((h, i) => {
        const [x, y, z] = to3D(h);
        return (
          <mesh key={i} position={[x, y, z]}>
            <ringGeometry args={[0.15, 0.18, 24]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      <mesh>
        <boxGeometry args={[0.68, 0.15, 0.68]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </group>
  );
}

const DroneModel = memo(DroneModelImpl);
export default DroneModel;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds. This is the first file importing `@react-three/fiber`/`@react-three/drei` transitively (via `three`) — if Next.js's webpack build errors on the `three` package specifically, add `transpilePackages: ["three"]` to `next.config.ts` and re-run.

- [ ] **Step 3: Commit**

```bash
git add src/components/flight-scene/DroneModel.tsx
git commit -m "feat(design): add procedural 3D drone model"
```

---

### Task 4: Camera rig

**Files:**
- Create: `src/components/flight-scene/CameraRig.tsx`

**Interfaces:**
- Consumes: `flightCurve`, `activeCheckpoint`, `checkpoints` from `@/lib/flight-scene/route` (Task 1); `FlightProgressRef` type from `@/lib/flight-scene/useFlightProgress` (Task 2)
- Produces: `export default function CameraRig({ progressRef, frozen }: { progressRef: RefObject<FlightProgressRef>, frozen: boolean }): null`

- [ ] **Step 1: Write `src/components/flight-scene/CameraRig.tsx`**

```tsx
"use client";

import { memo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { flightCurve, activeCheckpoint, checkpoints, type CheckpointId } from "@/lib/flight-scene/route";
import type { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";

/* Isolated leaf component, memoized: its own props (progressRef, frozen)
   only change on a reduced-motion toggle, so it must not re-render just
   because FlightSceneRoot's checkpoint state changes every frame via the
   rAF poll in Task 7. All continuous motion happens inside useFrame,
   never via React state/re-render. */
function CameraRigImpl({
  progressRef,
  frozen,
}: {
  progressRef: RefObject<FlightProgressRef>;
  /* True under prefers-reduced-motion: the camera holds a fixed pose at
     the currently active checkpoint's midpoint instead of traversing the
     spline every frame. Checkpoint switches (via activeCheckpoint) still
     move the frozen pose - only continuous per-frame motion is disabled. */
  frozen: boolean;
}) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const frozenCheckpointRef = useRef<CheckpointId | null>(null);
  const frozenPoseRef = useRef<{ pos: THREE.Vector3; look: THREE.Vector3 } | null>(null);

  useFrame(() => {
    const progress = progressRef.current?.current ?? 0;

    if (frozen) {
      const checkpointId = activeCheckpoint(progress);
      if (frozenCheckpointRef.current !== checkpointId || !frozenPoseRef.current) {
        const cp = checkpoints.find((c) => c.id === checkpointId)!;
        const mid = (cp.start + cp.end) / 2;
        frozenPoseRef.current = {
          pos: flightCurve.getPointAt(mid),
          look: flightCurve.getPointAt(Math.min(1, mid + 0.02)),
        };
        frozenCheckpointRef.current = checkpointId;
      }
      camera.position.copy(frozenPoseRef.current.pos);
      camera.lookAt(frozenPoseRef.current.look);
      return;
    }

    const point = flightCurve.getPointAt(progress);
    const lookAhead = flightCurve.getPointAt(Math.min(1, progress + 0.02));
    lookTarget.current.copy(lookAhead);

    camera.position.copy(point);
    camera.lookAt(lookTarget.current);

    /* Banking: roll around the forward axis proportional to the route's
       local lateral curvature, smoothed so it doesn't snap between
       spline segments. */
    const forward = lookAhead.clone().sub(point).normalize();
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -forward.x * 0.4, 0.1);
  });

  return null;
}

const CameraRig = memo(CameraRigImpl);
export default CameraRig;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/flight-scene/CameraRig.tsx
git commit -m "feat(design): add spline camera rig"
```

---

### Task 5: Canvas mount + WebGL fallback detection

**Files:**
- Create: `src/components/flight-scene/Canvas.tsx`

**Interfaces:**
- Consumes: `CameraRig` (Task 4), `DroneModel` (Task 3), `FlightProgressRef` type (Task 2)
- Produces: `export default function FlightSceneCanvas({ progressRef, reduced, mobile, onFallback }: { progressRef: RefObject<FlightProgressRef>, reduced: boolean, mobile: boolean, onFallback: () => void }): JSX.Element | null`

- [ ] **Step 1: Write `src/components/flight-scene/Canvas.tsx`**

```tsx
"use client";

import { useEffect, useState, type RefObject } from "react";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import DroneModel from "./DroneModel";
import type { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

export default function FlightSceneCanvas({
  progressRef,
  reduced,
  mobile,
  onFallback,
}: {
  progressRef: RefObject<FlightProgressRef>;
  reduced: boolean;
  mobile: boolean;
  onFallback: () => void;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = supportsWebGL2();
    setSupported(ok);
    if (!ok) onFallback();
  }, [onFallback]);

  if (supported !== true) return null;

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <FiberCanvas
        dpr={mobile ? 1 : [1, 1.5]}
        camera={{ fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: !mobile }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 8, mobile ? 24 : 32]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <DroneModel />
        <CameraRig progressRef={progressRef} frozen={reduced} />
      </FiberCanvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/flight-scene/Canvas.tsx
git commit -m "feat(design): add flight scene canvas with WebGL fallback detection"
```

---

### Task 6: Checkpoint overlay panels

**Files:**
- Create: `src/components/checkpoints/CheckpointShell.tsx`
- Create: `src/components/checkpoints/Liftoff.tsx`
- Create: `src/components/checkpoints/Log.tsx`
- Create: `src/components/checkpoints/Origin.tsx`
- Create: `src/components/checkpoints/Telemetry.tsx`
- Create: `src/components/checkpoints/Landing.tsx`

**Interfaces:**
- Produces: `CheckpointShell({ visible: boolean, mode: "scene" | "flat", children: ReactNode })`; each checkpoint component signature `({ visible, mode, ...contentProps })`
- Consumes: existing `@/components/ui/section-header`, `@/components/ui/catalog-filter`, `@/components/ui/drone-schematic`, `@/data/projects`, `@/data/stratos`, `@/data/skills`, `@/lib/types`, `@/lib/github-repo-stats`, all unchanged from current codebase

All five checkpoint components carry over copy/data verbatim from the components they replace (via the same `useTranslations` namespaces: `hero`, `projects`, `stratos`, `github`, `skills`, `contact` — none of these translation namespaces change, so `src/messages/en.json` needs no edits in this task). GSAP pin/scrub mechanics are dropped entirely — motion now comes from the camera, not from these panels — so no `useGSAP`/`gsap` imports appear in any of them.

- [ ] **Step 1: Write `src/components/checkpoints/CheckpointShell.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function CheckpointShell({
  visible,
  mode,
  children,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  children: ReactNode;
}) {
  if (mode === "flat") {
    return (
      <div className="relative z-10 py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      inert={!visible}
      className="fixed inset-0 z-10 flex items-center px-6 md:px-10 lg:px-14"
    >
      <div className="max-w-[1320px] mx-auto w-full max-h-[85vh] overflow-y-auto py-4">{children}</div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write `src/components/checkpoints/Liftoff.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";

export default function Liftoff({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("hero");
  const credentials = [t("cred1"), t("cred2"), t("cred3"), t("cred4")];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div className={`grid w-full ${mode === "flat" ? "lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center" : ""}`}>
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
            <span className="annotate text-accent">{t("role")}</span>
            <span className="h-px w-8 bg-rule" aria-hidden />
            <span className="annotate">{t("org")}</span>
          </div>

          <h1 className="font-display text-[clamp(3rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
            <span className="block">{t("hLine1")}</span>
            <span className="block text-accent">{t("hLine2")}</span>
          </h1>

          <p className="annotate text-accent mt-7">{t("rev")}</p>

          <p className="font-body text-base md:text-lg text-ink-2 mt-6 max-w-xl leading-relaxed">{t("lead")}</p>

          <ul className="mt-9 space-y-2.5">
            {credentials.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-rule-strong" aria-hidden />
                <span className="font-mono text-xs text-ink-2">{c}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#flight-log"
              className="group inline-flex items-center gap-2 bg-accent text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
            >
              {t("viewWork")}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#contact" className="link-draw font-mono text-xs text-ink-2 hover:text-ink transition-colors">
              {t("getInTouch")}
            </a>
          </div>
        </div>

        {mode === "flat" && (
          <figure className="relative hidden lg:block">
            <div className="relative border border-rule p-8 md:p-10">
              <DroneSchematic progress={1} />
            </div>
            <figcaption className="mt-4 annotate">{t("panelReadout")}</figcaption>
          </figure>
        )}
      </div>
    </CheckpointShell>
  );
}
```

- [ ] **Step 3: Write `src/components/checkpoints/Log.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import { RepoStats } from "@/lib/github-repo-stats";
import SectionHeader from "@/components/ui/section-header";
import CatalogFilter, { CatalogFilterValue } from "@/components/ui/catalog-filter";
import CheckpointShell from "./CheckpointShell";

const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

function StatusTag({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3">
      <span
        className={`h-1.5 w-1.5 ${
          status === "SHIPPED" ? "bg-accent" : status === "IN_PROGRESS" ? "bg-accent-2" : "bg-ink-3"
        }`}
        aria-hidden
      />
      {statusLabel[status]}
    </span>
  );
}

function Links({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`link-draw inline-flex items-center gap-1 font-mono text-xs transition-colors ${
            link.isPrimary ? "text-accent hover:text-accent/80" : "text-ink-2 hover:text-ink"
          }`}
        >
          {link.label}
          <ArrowUpRight size={12} />
        </a>
      ))}
    </div>
  );
}

export default function Log({
  visible,
  mode,
  repoStats,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  repoStats: Record<string, RepoStats | null>;
}) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");

  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];
  const visibleProjects = ordered.filter((p) => filter === "ALL" || p.status === filter);

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("count", { count: projects.length })} />
        <div className="mt-6 mb-6">
          <CatalogFilter value={filter} onChange={setFilter} />
        </div>
        <div>
          {visibleProjects.map((project, i) => {
            const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
            return (
              <article key={project.slug} className="relative grid gap-x-8 border-t border-rule py-8">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-3">
                  <span className="font-display text-3xl font-semibold text-ink-3 leading-none tabular-nums">
                    #{String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="annotate">{project.tag}</span>
                  <StatusTag status={project.status} />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-medium text-ink leading-tight tracking-[-0.01em]">
                    {project.title}
                  </h3>
                  {primary && (
                    <a
                      href={primary.href}
                      target={primary.href.startsWith("http") ? "_blank" : undefined}
                      rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={`${project.title} - ${primary.label}`}
                      className="mt-1 shrink-0 text-ink-3 hover:text-accent transition-colors"
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                </div>
                <p className="font-body text-sm text-ink-2 mt-2.5 leading-relaxed max-w-2xl">{project.description}</p>
                <p className="font-mono text-[11px] text-ink-3 mt-4 leading-relaxed">{project.techPills.join("  ·  ")}</p>
                <Links links={project.links} />
                {project.image && mode === "flat" && (
                  <div className="relative border border-rule overflow-hidden bg-panel/40 min-h-[160px] flex items-center justify-center p-6 mt-5 max-w-[280px]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={280}
                      height={200}
                      className="w-full h-auto object-contain opacity-90"
                    />
                  </div>
                )}
                {project.repo && repoStats[project.repo] && (
                  <p className="mt-4 font-mono text-[11px] text-ink-3">
                    {repoStats[project.repo]!.commitCount} commits · last commit {repoStats[project.repo]!.lastCommitDate}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </CheckpointShell>
  );
}
```

- [ ] **Step 4: Write `src/components/checkpoints/Origin.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { stratosUnits, STRATOS_URL } from "@/data/stratos";
import CheckpointShell from "./CheckpointShell";

export default function Origin({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("stratos");

  const stats = [
    { value: "04", label: t("departments") },
    { value: "07", label: t("members") },
    { value: "2026", label: t("founded") },
  ];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="annotate text-accent">{t("roleBadge")}</p>
            <p className="font-body text-lg md:text-xl text-ink mt-6 leading-relaxed max-w-xl">{t("body")}</p>
            <dl className="mt-10 grid grid-cols-3 max-w-md border-t border-rule pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">{s.value}</dt>
                  <dd className="annotate mt-1.5">{s.label}</dd>
                </div>
              ))}
            </dl>
            <a
              href={STRATOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent mt-9 hover:text-accent/80 transition-colors"
            >
              {t("visit")}
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="annotate">{t("unitsLabel")}</span>
              <span className="h-px flex-1 bg-rule" />
            </div>
            <ul>
              {stratosUnits.map((unit, i) => (
                <li key={unit.name} className="grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5">
                  <span className="font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink">{unit.name}</h3>
                    <p className="font-mono text-[11px] text-ink-3 mt-1.5 leading-relaxed">{unit.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CheckpointShell>
  );
}
```

- [ ] **Step 5: Write `src/components/checkpoints/Telemetry.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import { skills } from "@/data/skills";
import SectionHeader from "@/components/ui/section-header";
import CheckpointShell from "./CheckpointShell";

const cellTone = ["bg-rule", "bg-ink-3", "bg-ink-2", "bg-accent/55", "bg-accent"];

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai_embedded: "AI & Embedded",
  devops: "DevOps & Infra",
};

function ContributionGraph({ graph, label }: { graph: number[][]; label: string }) {
  if (graph.length === 0) return null;
  return (
    <figure>
      <figcaption className="annotate mb-4">{label}</figcaption>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {graph.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((level, di) => (
              <span key={di} title={`activity level ${level}`} className={`h-[10px] w-[10px] ${cellTone[level]}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-1.5 annotate">
        <span>less</span>
        {cellTone.map((c, i) => (
          <span key={i} className={`h-[9px] w-[9px] ${c}`} />
        ))}
        <span>more</span>
      </div>
    </figure>
  );
}

function LanguageBar({ languages, label }: { languages: GitHubStats["languages"]; label: string }) {
  return (
    <figure>
      <figcaption className="annotate mb-4">{label}</figcaption>
      <div className="flex h-1.5 overflow-hidden">
        {languages.map((lang) => (
          <div key={lang.name} style={{ flex: lang.percentage, backgroundColor: lang.color }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5">
        {languages.map((lang) => (
          <span key={lang.name} className="font-mono text-[11px] text-ink-2">
            <span style={{ color: lang.color }}>{"■"}</span> {lang.name} <span className="text-ink-3">{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </figure>
  );
}

export default function Telemetry({
  visible,
  mode,
  stats,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  stats: GitHubStats;
}) {
  const t = useTranslations("github");
  const tSkills = useTranslations("skills");

  const specs = [
    { value: stats.publicRepos, label: t("publicRepos") },
    { value: stats.contributions, label: t("contributions") },
    { value: stats.languages.length, label: t("languages") },
  ];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("status")} />

        <dl className="grid sm:grid-cols-3 gap-4 lg:gap-5">
          {specs.map((s) => (
            <div key={s.label} className="border border-rule p-5 md:p-6">
              <dt className="font-display text-6xl md:text-7xl font-semibold text-ink tabular-nums tracking-tight">
                {s.value}
              </dt>
              <dd className="annotate mt-2">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <div className="border border-rule p-5 md:p-6">
            <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
          </div>
          <div className="border border-rule p-5 md:p-6">
            <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <div className="md:col-span-2 border border-rule p-5 md:p-6">
            <p className="annotate mb-4">{tSkills("kicker")}</p>
            {skills.map((category) => (
              <div key={category.key} className="border-t border-rule first:border-t-0 py-4">
                <div className="flex items-baseline gap-3 mb-2.5">
                  <span className="font-mono text-[11px] text-accent tabular-nums">
                    {String(category.items.length).padStart(2, "0")}
                  </span>
                  <h4 className="font-display text-base font-medium text-ink">
                    {categoryLabels[category.key] ?? category.key}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {category.items.map((item) => (
                    <span key={item} className="font-mono text-xs text-ink-2 border border-rule px-2 py-0.5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <a
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent/80 transition-colors"
          >
            github.com/iWeslax83
            <ArrowUpRight size={13} />
          </a>
          <span className="h-px flex-1 bg-rule" />
        </div>
      </div>
    </CheckpointShell>
  );
}
```

- [ ] **Step 6: Write `src/components/checkpoints/Landing.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Mail, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import CheckpointShell from "./CheckpointShell";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const contacts = [
  { key: "email", code: "01", icon: <Mail size={18} strokeWidth={1.6} />, value: "emirsakarya00@gmail.com", href: "mailto:emirsakarya00@gmail.com" },
  { key: "githubLabel", code: "02", icon: <GitHubIcon className="w-[18px] h-[18px]" />, value: "github.com/iWeslax83", href: "https://github.com/iWeslax83" },
  { key: "linkedin", code: "03", icon: <LinkedInIcon className="w-[18px] h-[18px]" />, value: "linkedin.com/in/emirsakarya", href: "https://linkedin.com/in/emirsakarya" },
];

export default function Landing({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("contact");

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-start">
          <div>
            <h3 className="font-display text-[2.1rem] sm:text-5xl md:text-[3.25rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
              <span className="block">{t("ctaLine1")}</span>
              <span className="block text-accent">{t("ctaLine2")}</span>
            </h3>
            <p className="font-body text-base text-ink-2 mt-6 max-w-md leading-relaxed">{t("subtitle")}</p>
            <p className="annotate mt-7 flex items-center gap-2.5">
              <span className="status-dot animate-signal" aria-hidden />
              {t("availability")}
            </p>
          </div>

          <div>
            {contacts.map((contact) => (
              <a
                key={contact.key}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-rule py-6 hover:border-rule-strong last:border-b transition-colors"
              >
                <span className="font-mono text-[11px] text-accent tabular-nums">{contact.code}</span>
                <div>
                  <div className="flex items-center gap-2.5 text-ink group-hover:text-accent transition-colors">
                    <span className="text-ink-2 group-hover:text-accent transition-colors">{contact.icon}</span>
                    <span className="font-display text-lg font-medium">{t(contact.key)}</span>
                  </div>
                  <p className="font-mono text-[11px] text-ink-3 mt-1.5 truncate">{contact.value}</p>
                </div>
                <ArrowUpRight size={18} className="text-ink-3 group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </CheckpointShell>
  );
}
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: succeeds. These components aren't mounted anywhere yet, so this only type-checks them.

- [ ] **Step 8: Commit**

```bash
git add src/components/checkpoints
git commit -m "feat(design): add checkpoint overlay panels"
```

---

### Task 7: Wire the flight scene root into the page, remove old sections

**Files:**
- Create: `src/components/flight-scene/FlightSceneRoot.tsx`
- Modify: `src/app/page.tsx`
- Delete: `src/components/hero.tsx`, `src/components/flight-log.tsx`, `src/components/founder-story.tsx`, `src/components/telemetry.tsx`, `src/components/contact.tsx`

**Interfaces:**
- Consumes: `FlightSceneCanvas` (Task 5), `useFlightProgress` (Task 2), `checkpoints`/`activeCheckpoint` (Task 1), `Liftoff`/`Log`/`Origin`/`Telemetry`/`Landing` (Task 6)
- Produces: `export default function FlightSceneRoot({ repoStats, githubStats }: { repoStats: Record<string, RepoStats | null>, githubStats: GitHubStats }): JSX.Element`

- [ ] **Step 1: Write `src/components/flight-scene/FlightSceneRoot.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlightSceneCanvas from "./Canvas";
import { checkpoints, activeCheckpoint } from "@/lib/flight-scene/route";
import { useFlightProgress } from "@/lib/flight-scene/useFlightProgress";
import Liftoff from "@/components/checkpoints/Liftoff";
import Log from "@/components/checkpoints/Log";
import Origin from "@/components/checkpoints/Origin";
import Telemetry from "@/components/checkpoints/Telemetry";
import Landing from "@/components/checkpoints/Landing";
import { RepoStats } from "@/lib/github-repo-stats";
import { GitHubStats } from "@/lib/types";

const anchorFor: Record<string, string> = {
  liftoff: "home",
  log: "flight-log",
  origin: "founder-story",
  telemetry: "telemetry",
  landing: "contact",
};

export default function FlightSceneRoot({
  repoStats,
  githubStats,
}: {
  repoStats: Record<string, RepoStats | null>;
  githubStats: GitHubStats;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [activeId, setActiveId] = useState<string>("liftoff");
  const { progressRef, reduced, mobile } = useFlightProgress(spacerRef);
  const handleFallback = useCallback(() => setFallback(true), []);

  /* Mirrors progress into React state, but only re-renders when the
     active checkpoint actually changes - not on every scroll tick. This
     is the overlay layer's own derived state; it never feeds back into
     progressRef or the camera. */
  useEffect(() => {
    let raf: number;
    const poll = () => {
      const id = activeCheckpoint(progressRef.current.current);
      setActiveId((prev) => (prev === id ? prev : id));
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  if (fallback) {
    return (
      <div className="relative">
        <Liftoff visible mode="flat" />
        <Log visible mode="flat" repoStats={repoStats} />
        <Origin visible mode="flat" />
        <Telemetry visible mode="flat" stats={githubStats} />
        <Landing visible mode="flat" />
      </div>
    );
  }

  return (
    <div ref={spacerRef} className="relative" style={{ height: "600vh" }}>
      <FlightSceneCanvas progressRef={progressRef} reduced={reduced} mobile={mobile} onFallback={handleFallback} />
      {checkpoints.map((c) => (
        <span
          key={c.id}
          id={anchorFor[c.id]}
          aria-hidden
          className="absolute left-0 w-px h-px"
          style={{ top: `${c.start * 100}%` }}
        />
      ))}
      <Liftoff visible={activeId === "liftoff"} mode="scene" />
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} />
      <Origin visible={activeId === "origin"} mode="scene" />
      <Telemetry visible={activeId === "telemetry"} mode="scene" stats={githubStats} />
      <Landing visible={activeId === "landing"} mode="scene" />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/page.tsx`**

```tsx
import { fetchGitHubStats } from "@/lib/github";
import { fetchRepoStats } from "@/lib/github-repo-stats";
import { getRecentCommits } from "@/lib/git-history";
import { projects } from "@/data/projects";
import Nav from "@/components/nav";
import BackToTop from "@/components/ui/back-to-top";
import CommitMotif from "@/components/ui/commit-motif";
import FlightSceneRoot from "@/components/flight-scene/FlightSceneRoot";
import Footer from "@/components/footer";

export default async function Home() {
  const githubStats = await fetchGitHubStats();
  const commits = getRecentCommits();
  const repoStats = await fetchRepoStats(
    projects.filter((p) => p.repo).map((p) => p.repo as string)
  );

  return (
    <>
      <CommitMotif commits={commits} />
      <Nav />
      <main>
        <FlightSceneRoot repoStats={repoStats} githubStats={githubStats} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
```

- [ ] **Step 3: Delete replaced files**

```bash
git rm src/components/hero.tsx src/components/flight-log.tsx src/components/founder-story.tsx src/components/telemetry.tsx src/components/contact.tsx
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds, no unresolved imports (the deleted files must have no remaining references — check `src/app/page.tsx` and any test/story files if present).

- [ ] **Step 5: Commit**

```bash
git add src/components/flight-scene/FlightSceneRoot.tsx src/app/page.tsx
git commit -m "feat(design): wire flight scene root into page, remove replaced sections"
```

---

## Post-implementation manual QA checklist (carry into final report, browser required)

- [ ] Desktop: full scroll traverses all 5 checkpoints, camera banks smoothly, no checkpoint panel ever overlaps another at full opacity
- [ ] Nav links (`#home`, `#flight-log`, `#founder-story`, `#telemetry`, `#contact`) jump to the correct checkpoint and the overlay updates within one frame of landing
- [ ] Mobile viewport (`<768px`): lightweight 3D renders, no horizontal scroll, checkpoint panels remain legible
- [ ] `prefers-reduced-motion: reduce` emulated: camera holds still per checkpoint, panels still fade on scroll, no vestibular-triggering continuous motion
- [ ] WebGL disabled (`chrome://flags` or devtools override): flat fallback renders all 5 checkpoints in document order, page is fully usable without the canvas
- [ ] Keyboard-only pass: Tab order only reaches the currently visible checkpoint's interactive elements (hidden checkpoints must not be reachable — verifies the `inert` wiring in `CheckpointShell`)

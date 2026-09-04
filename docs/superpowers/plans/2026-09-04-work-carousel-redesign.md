# Work Carousel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the footer-disappearing-at-scroll-end bug, and rebuild the "Selected Work" beat's scene-mode content into a pinned WORK-intro + letter-tile background with a left-to-right sliding project-screenshot carousel, decoupled from the 3D drone camera, ending in a zoom transition into Telemetry.

**Architecture:** A new local-progress hook (`useWorkCarouselProgress`) derives a stage (intro/tile/carousel/zoomOut) and per-stage progress from the existing shared `progressRef`, using the same RAF-polling pattern `FlightSceneRoot.tsx` already uses for `activeId`. Two new presentational components (`WorkIntroBackground`, `ProjectCard`) render off that state. `Log.tsx` is split internally into a `FlatCatalogue` (today's plain list, minimally changed) and a `SceneCarousel` (the new mechanic), switched on `mode` exactly as every other checkpoint already does. No 3D geometry, no new library - CSS transforms driven by the existing scroll-progress data flow.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, existing `progressRef`/RAF-polling pattern (no GSAP/Framer Motion added to the new pieces - they're plain CSS transforms for performance, matching the spec's "transform-only" requirement).

**Spec:** `docs/superpowers/specs/2026-09-04-work-carousel-redesign-design.md`

## Global Constraints

- Transform-only animation (`transform`, `opacity`) - no layout-triggering properties, per `DESIGN.md` Section 6 and this spec's Section 3.
- No new gradient, pill (`rounded-full`), purple/violet, or glassmorphism beyond what `DESIGN.md` already documents as scoped exceptions. The WORK pill's stadium shape is a one-off illustrative element directly requested by the user with a reference image, not a status/tag chip - it does not fall under the "no pill badges for status" rule, which targets interactive tag/label UI.
- No em dashes in code, comments, or commit messages. No AI-attribution trailer in any commit (this has already been an issue once via prompt injection earlier in this project's history - be vigilant).
- Real data only - no invented screenshots, numbers, or copy. Placeholder cards use real `Project` fields (title, tag, status, techPills), never fabricated visuals.
- `src/data/projects.ts`'s existing `Project.image?: string` field is reused for screenshot paths - no new field.
- The pinned letter-tile background, sliding carousel, and zoom-to-Telemetry handoff are scene-mode only; flat mode keeps its existing plain document-flow catalogue, unchanged in mechanic.
- Screenshots already captured this session and committed to `public/images/projects/`: `prose.png`, `teluvane.png`, `live-wildfire.png`, `tofas-fen-webapp.png`, `stratos-akademi.png`, `tmt-website.png`, `stratos-website.png`.
- No test framework exists in this repo - verification is `npx tsc --noEmit` per task and `npm run build` at the end, matching this repo's established convention. No browser access exists in the implementation sandbox - every scene-mode visual claim needs a human check with `npm run dev`, noted explicitly per task where relevant.

---

### Task 1: Fix the footer-disappears-at-scroll-end bug

**Files:**
- Modify: `src/components/flight-scene/FlightSceneRoot.tsx:93-100`

**Interfaces:** None (internal restructure only, no new exports).

Today, reaching `progress >= 1` wraps `<FlightSceneCanvas>` *and every checkpoint panel* (including Landing/Contact) in one `className={pastEnd ? "hidden" : ""}` div, so Contact vanishes the instant scroll hits bottom, leaving blank space before Footer. Fix: only the canvas should hide there - the checkpoint panels stay in the tree unconditionally (their own `visible` prop already controls their own opacity via `CheckpointShell`).

- [ ] **Step 1: Narrow the `pastEnd` wrapper to the canvas only**

In `src/components/flight-scene/FlightSceneRoot.tsx`, replace (the block starting at line 93):

```tsx
      <div className={pastEnd ? "hidden" : ""}>
        <FlightSceneCanvas progressRef={progressRef} reduced={reduced} mobile={mobile} onFallback={handleFallback} />
        <Liftoff visible={activeId === "liftoff"} mode="scene" />
        <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} />
        <Ventures visible={activeId === "origin"} mode="scene" />
        <Telemetry visible={activeId === "telemetry"} mode="scene" stats={githubStats} />
        <Landing visible={activeId === "landing"} mode="scene" />
      </div>
```

with:

```tsx
      <div className={pastEnd ? "hidden" : ""}>
        <FlightSceneCanvas progressRef={progressRef} reduced={reduced} mobile={mobile} onFallback={handleFallback} />
      </div>
      <Liftoff visible={activeId === "liftoff"} mode="scene" />
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} />
      <Ventures visible={activeId === "origin"} mode="scene" />
      <Telemetry visible={activeId === "telemetry"} mode="scene" stats={githubStats} />
      <Landing visible={activeId === "landing"} mode="scene" />
```

(Note: `Log`'s call site here gains a `progressRef` prop in Task 3 - don't add it yet in this task, keep this step's diff scoped to only the `pastEnd` restructure. The `Log`/`Ventures` names above already reflect the prior session's `Origin` -> `Ventures` rename, already shipped.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification note**

This cannot be visually confirmed in the implementation sandbox (no browser access). Note in the report: a human must run `npm run dev`, scroll to the very bottom, and confirm Contact (email/GitHub/LinkedIn) stays visible and Footer appears normally beneath it, with no blank gap.

- [ ] **Step 4: Commit**

```bash
git add src/components/flight-scene/FlightSceneRoot.tsx
git commit -m "fix(design): stop hiding contact panel when scroll reaches the bottom"
```

---

### Task 2: Populate `projects.ts` with the captured screenshots

**Files:**
- Modify: `src/data/projects.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `Project.image` populated for 7 entries, consumed by `ProjectCard` (Task 7) in scene mode and by the existing flat-mode `<img>` render (already present in `Log.tsx` today) in flat mode.

Seven real screenshots already exist at `public/images/projects/{prose,teluvane,live-wildfire,tofas-fen-webapp,stratos-akademi,tmt-website,stratos-website}.png`, captured this session via Playwright against each project's live URL. This task wires them into the data file's existing optional `image` field.

- [ ] **Step 1: Add `image` to the seven live-URL projects**

In `src/data/projects.ts`, add an `image` field to these seven project objects (do not touch any other field):

- `prose`: add `image: "/images/projects/prose.png",`
- `teluvane`: add `image: "/images/projects/teluvane.png",`
- `live-wildfire`: add `image: "/images/projects/live-wildfire.png",`
- `tofas-fen-webapp`: add `image: "/images/projects/tofas-fen-webapp.png",`
- `stratos-akademi`: add `image: "/images/projects/stratos-akademi.png",`
- `tmt-website`: add `image: "/images/projects/tmt-website.png",`
- `stratos-website`: add `image: "/images/projects/stratos-website.png",`

Place the new `image:` line directly after each entry's `links:` array closes, matching the existing style already used on `otonom-iha` (which keeps its current `image: "/images/uav.svg"` unchanged - it is not one of the seven above).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify the flat-mode fallback already renders these**

Read `src/components/checkpoints/Log.tsx`'s current flat-mode render (the `{project.image && mode === "flat" && (...)}` block, around line 116). Confirm it already renders any `image` field present via a plain `<img>` tag with no other change needed - this step is verification only, not a code change (Task 8 will restructure this file, but this confirms the field alone is sufficient to activate the existing flat-mode image display for these seven projects ahead of that task).

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(data): add captured screenshots to seven live projects"
```

---

### Task 3: Scroll mechanics - widen the Selected Work checkpoint, thread progress down

**Files:**
- Modify: `src/lib/flight-scene/route.ts` (full file, see below)
- Modify: `src/components/flight-scene/FlightSceneRoot.tsx` (spacer height + `Log` prop)
- Modify: `src/components/checkpoints/CheckpointShell.tsx` (add `fullBleed` prop)

**Interfaces:**
- Produces: `TOTAL_SPACER_VH` (number, `1656`), `WORK_STAGE_BOUNDARIES` (`{ introEnd: 0.05, tileEnd: 0.1, carouselEnd: 0.9 }`) from `route.ts`, consumed by Task 5's hook. `CheckpointShell`'s new optional `fullBleed?: boolean` prop, consumed by Task 8.

Every beat except `"log"` keeps its exact current pixel height (liftoff 72vh, origin/ventures 132vh, telemetry 144vh, landing 108vh - 456vh total, unchanged); `"log"` grows from 144vh to 1200vh to give the WORK-intro, letter-tile expansion, 13-project carousel, and zoom-out sequence real scroll room. New total spacer: 1656vh.

- [ ] **Step 1: Replace `src/lib/flight-scene/route.ts` in full**

```ts
import * as THREE from "three";

export type CheckpointId = "liftoff" | "log" | "origin" | "telemetry" | "landing";

export interface Checkpoint {
  id: CheckpointId;
  start: number;
  end: number;
}

/* Total master spacer height, consumed by FlightSceneRoot.tsx's spacer
   div. Every beat except "log" keeps its original pixel height from the
   prior 600vh system (liftoff 72vh, origin 132vh, telemetry 144vh,
   landing 108vh - 456vh total); "log" grows from 144vh to 1200vh to give
   the WORK-intro + letter-tile background + 13-project carousel +
   zoom-out sequence real scroll room. Fractions below are each beat's vh
   span divided by this total. */
export const TOTAL_SPACER_VH = 1656;

export const checkpoints: Checkpoint[] = [
  { id: "liftoff", start: 0, end: 0.043478 },
  { id: "log", start: 0.043478, end: 0.768116 },
  { id: "origin", start: 0.768116, end: 0.847826 },
  { id: "telemetry", start: 0.847826, end: 0.934783 },
  { id: "landing", start: 0.934783, end: 1 },
];

/* Local progress stage boundaries within the "log" checkpoint's own 0-1
   window (independent of the global checkpoint fractions above).
   Consumed by useWorkCarouselProgress to derive which stage of the
   WORK-intro / letter-tile / carousel / zoom-out sequence is active:
   0 - introEnd: static WORK pill.
   introEnd - tileEnd: pill scales/fades into the tiled letter rows.
   tileEnd - carouselEnd: the 13-project sliding carousel (the bulk of
     the range).
   carouselEnd - 1: the final project card zooms to fill the viewport,
     crossfading into Telemetry. */
export const WORK_STAGE_BOUNDARIES = {
  introEnd: 0.05,
  tileEnd: 0.1,
  carouselEnd: 0.9,
} as const;

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

- [ ] **Step 2: Update `FlightSceneRoot.tsx`'s spacer height**

Replace (the spacer div's `style` prop):

```tsx
    <div ref={spacerRef} className="relative" style={{ height: "600vh" }}>
```

with:

```tsx
    <div ref={spacerRef} className="relative" style={{ height: `${TOTAL_SPACER_VH}vh` }}>
```

And update the import line to pull in the new constant:

```tsx
import { checkpoints, activeCheckpoint, TOTAL_SPACER_VH } from "@/lib/flight-scene/route";
```

- [ ] **Step 3: Thread `progressRef` down to `Log` at both call sites**

In `FlightSceneRoot.tsx`, the flat-mode fallback branch's `Log` call site:

```tsx
        <div id="flight-log">
          <Log visible mode="flat" repoStats={repoStats} />
        </div>
```

becomes:

```tsx
        <div id="flight-log">
          <Log visible mode="flat" repoStats={repoStats} progressRef={progressRef} />
        </div>
```

And the scene-mode call site (updated in Task 1, Step 1's replacement block):

```tsx
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} />
```

becomes:

```tsx
      <Log visible={activeId === "log"} mode="scene" repoStats={repoStats} progressRef={progressRef} />
```

(`Log.tsx` itself gains the `progressRef` prop in Task 8 - this task only updates the call sites; `Log.tsx` will not compile cleanly again until Task 8, which is expected and fine mid-plan.)

- [ ] **Step 4: Add `fullBleed` to `CheckpointShell`**

Replace the full contents of `src/components/checkpoints/CheckpointShell.tsx` with:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function CheckpointShell({
  visible,
  mode,
  fullBleed = false,
  children,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  fullBleed?: boolean;
  children: ReactNode;
}) {
  if (mode === "flat") {
    return (
      <div className="relative z-10 py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
        {children}
      </div>
    );
  }

  if (fullBleed) {
    return (
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        inert={!visible}
        className="fixed inset-0 z-10 overflow-hidden"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      inert={!visible}
      className="fixed inset-0 z-10 flex items-center px-6 md:px-10 lg:px-14"
    >
      <div className="max-w-[1320px] mx-auto w-full max-h-[85vh] overflow-hidden py-4">{children}</div>
    </motion.div>
  );
}
```

`fullBleed` defaults to `false`, so every existing call site (`Liftoff`, `Ventures`, `Telemetry`, `Landing`, and `Log`'s flat-mode path) is unaffected - only `Log`'s scene-mode path (Task 8) will opt in.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: errors ONLY in `src/components/checkpoints/Log.tsx` (it doesn't yet accept `progressRef` - that's Task 8). No errors anywhere else. If you see errors outside `Log.tsx`, stop and re-check this task's edits.

- [ ] **Step 6: Commit**

```bash
git add src/lib/flight-scene/route.ts src/components/flight-scene/FlightSceneRoot.tsx src/components/checkpoints/CheckpointShell.tsx
git commit -m "feat(design): widen Selected Work scroll window, add full-bleed checkpoint mode"
```

---

### Task 4: Extract `StatusTag` into its own shared file

**Files:**
- Create: `src/components/ui/status-tag.tsx`
- Modify: `src/components/checkpoints/Log.tsx:14-32` (remove the local definition, import from the new location)

**Interfaces:**
- Produces: `StatusTag` default export, `{ status: Project["status"] }` props - consumed by Task 7's `ProjectCard` and by `Log.tsx`'s existing catalogue row rendering.

`StatusTag` currently lives as an unexported local function inside `Log.tsx`. The new `ProjectCard` component (Task 7) needs it too, so it moves to `src/components/ui/`, matching where every other small reusable UI piece in this codebase already lives (`catalog-filter.tsx`, `section-header.tsx`, `back-to-top.tsx`).

- [ ] **Step 1: Create `src/components/ui/status-tag.tsx`**

```tsx
import { Project } from "@/lib/types";

const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

export default function StatusTag({ status }: { status: Project["status"] }) {
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
```

This is a verbatim move of the existing local component - no behavior change.

- [ ] **Step 2: Remove the local definition from `Log.tsx` and import instead**

In `src/components/checkpoints/Log.tsx`, delete lines 14-32 (the `statusLabel` const and the local `StatusTag` function), and add this import near the top of the file (alongside the other `@/components/ui/*` imports):

```tsx
import StatusTag from "@/components/ui/status-tag";
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: same pre-existing `progressRef`-related error in `Log.tsx` as after Task 3 (not yet fixed until Task 8) - no *new* errors related to `StatusTag`.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/status-tag.tsx src/components/checkpoints/Log.tsx
git commit -m "refactor(design): extract StatusTag into a shared component"
```

---

### Task 5: `useWorkCarouselProgress` hook

**Files:**
- Create: `src/lib/flight-scene/useWorkCarouselProgress.ts`

**Interfaces:**
- Consumes: `checkpoints`, `WORK_STAGE_BOUNDARIES` from `@/lib/flight-scene/route` (Task 3); `FlightProgressRef` type from `@/lib/flight-scene/useFlightProgress` (existing, unchanged).
- Produces: `WorkStage` type (`"intro" | "tile" | "carousel" | "zoomOut"`), `WorkCarouselState` interface (`{ stage: WorkStage; stageProgress: number; activeIndex: number; slideProgress: number }`), `useWorkCarouselProgress(progressRef, projectCount): WorkCarouselState` - consumed by Task 8's `Log.tsx`.

Derives the carousel's own local stage/progress from the shared `progressRef`, using the same `requestAnimationFrame` polling pattern `FlightSceneRoot.tsx` already uses for `activeId`/`pastEnd` - a new instance of an existing pattern, not a new mechanism.

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { checkpoints, WORK_STAGE_BOUNDARIES } from "@/lib/flight-scene/route";
import type { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";

export type WorkStage = "intro" | "tile" | "carousel" | "zoomOut";

export interface WorkCarouselState {
  stage: WorkStage;
  /** 0-1 progress within the current stage only. */
  stageProgress: number;
  /** Index of the project currently in front, 0-based. */
  activeIndex: number;
  /** 0-1 progress of the slide transition from activeIndex toward
      activeIndex + 1 during the "carousel" stage. Always 0 outside that
      stage. */
  slideProgress: number;
}

const logWindow = checkpoints.find((c) => c.id === "log")!;

function computeState(globalProgress: number, projectCount: number): WorkCarouselState {
  const logLocal = Math.min(
    1,
    Math.max(0, (globalProgress - logWindow.start) / (logWindow.end - logWindow.start))
  );

  if (logLocal < WORK_STAGE_BOUNDARIES.introEnd) {
    return {
      stage: "intro",
      stageProgress: logLocal / WORK_STAGE_BOUNDARIES.introEnd,
      activeIndex: 0,
      slideProgress: 0,
    };
  }

  if (logLocal < WORK_STAGE_BOUNDARIES.tileEnd) {
    return {
      stage: "tile",
      stageProgress:
        (logLocal - WORK_STAGE_BOUNDARIES.introEnd) /
        (WORK_STAGE_BOUNDARIES.tileEnd - WORK_STAGE_BOUNDARIES.introEnd),
      activeIndex: 0,
      slideProgress: 0,
    };
  }

  if (logLocal < WORK_STAGE_BOUNDARIES.carouselEnd) {
    const carouselLocal =
      (logLocal - WORK_STAGE_BOUNDARIES.tileEnd) /
      (WORK_STAGE_BOUNDARIES.carouselEnd - WORK_STAGE_BOUNDARIES.tileEnd);
    const raw = carouselLocal * projectCount;
    const activeIndex = Math.min(projectCount - 1, Math.floor(raw));
    const slideProgress = Math.min(1, raw - activeIndex);
    return { stage: "carousel", stageProgress: carouselLocal, activeIndex, slideProgress };
  }

  return {
    stage: "zoomOut",
    stageProgress:
      (logLocal - WORK_STAGE_BOUNDARIES.carouselEnd) / (1 - WORK_STAGE_BOUNDARIES.carouselEnd),
    activeIndex: projectCount - 1,
    slideProgress: 0,
  };
}

/**
 * Derives the WORK-carousel's own local stage/progress from the shared
 * flight-scene progress ref, using the same requestAnimationFrame polling
 * pattern FlightSceneRoot already uses for activeId/pastEnd - only
 * re-renders when the derived state's rounded values actually change, not
 * on every scroll tick.
 */
export function useWorkCarouselProgress(
  progressRef: RefObject<FlightProgressRef>,
  projectCount: number
): WorkCarouselState {
  const [state, setState] = useState<WorkCarouselState>(() => computeState(0, projectCount));
  const lastKeyRef = useRef("");

  useEffect(() => {
    let raf: number;
    const poll = () => {
      const next = computeState(progressRef.current.current, projectCount);
      const key = `${next.stage}:${next.activeIndex}:${Math.round(next.slideProgress * 100)}:${Math.round(next.stageProgress * 100)}`;
      if (key !== lastKeyRef.current) {
        lastKeyRef.current = key;
        setState(next);
      }
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, projectCount]);

  return state;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors from this file (the pre-existing `Log.tsx` `progressRef` error from Task 3 is still expected until Task 8).

- [ ] **Step 3: Commit**

```bash
git add src/lib/flight-scene/useWorkCarouselProgress.ts
git commit -m "feat(design): add scroll-progress hook for the Selected Work carousel"
```

---

### Task 6: `WorkIntroBackground` component

**Files:**
- Create: `src/components/checkpoints/work-carousel/WorkIntroBackground.tsx`

**Interfaces:**
- Consumes: `WorkStage` type from `@/lib/flight-scene/useWorkCarouselProgress` (Task 5).
- Produces: `WorkIntroBackground` default export, `{ stage: WorkStage; stageProgress: number }` props - consumed by Task 8's `Log.tsx`.

Renders the WORK pill (static entry frame) and the tiled-letter background it expands into, per spec Sections 2-3. Built as a single component driven purely by `stage`/`stageProgress` props (no internal scroll listening - `Log.tsx` calls the hook once and passes state down, avoiding duplicate RAF loops). SVG `<pattern>` elements for the grid and dot textures, not CSS `linear-gradient`/`radial-gradient` - this repo's global rules scope gradient usage to two named exceptions, neither of which is this screen, so hairline/dot textures are drawn with SVG shapes instead.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import type { WorkStage } from "@/lib/flight-scene/useWorkCarouselProgress";

const LETTERS = ["W", "O", "R", "K"] as const;
const TILE_REPEAT = 9;

export default function WorkIntroBackground({
  stage,
  stageProgress,
}: {
  stage: WorkStage;
  stageProgress: number;
}) {
  const pillOpacity = stage === "intro" ? 1 : stage === "tile" ? Math.max(0, 1 - stageProgress * 1.4) : 0;
  const pillScale = stage === "intro" ? 1 : stage === "tile" ? 1 + stageProgress * 5 : 6;

  const tileOpacity =
    stage === "intro"
      ? 0
      : stage === "tile"
        ? Math.min(1, stageProgress * 1.4)
        : stage === "carousel"
          ? 1
          : Math.max(0, 1 - stageProgress);

  return (
    <div className="absolute inset-0 bg-bg overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="work-grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="var(--color-rule)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#work-grid)" />
      </svg>

      <div
        className="absolute left-1/2 top-1/2 flex h-[240px] w-[140px] items-center justify-center overflow-hidden rounded-[70px] border-2 border-ink bg-bg"
        style={{
          opacity: pillOpacity,
          transform: `translate(-50%, -50%) scale(${pillScale})`,
        }}
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="work-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--color-ink-3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#work-dots)" opacity="0.35" />
        </svg>
        <div className="relative flex flex-col items-center font-display text-5xl font-extrabold leading-[0.85] tracking-tight text-ink">
          {LETTERS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center gap-3" style={{ opacity: tileOpacity }}>
        {LETTERS.map((letter) => (
          <div key={letter} className="flex justify-around whitespace-nowrap">
            {Array.from({ length: TILE_REPEAT }).map((_, i) => (
              <span key={i} className="font-display text-[9vw] font-extrabold leading-none text-ink">
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

Note for implementation: `pillOpacity`/`pillScale`/`tileOpacity`'s exact multipliers (`1.4`, `5`, `6`) are a starting point tuned by feel, not measured against a live render (no browser access in this sandbox) - flag in the report that a human should adjust these during the manual visual check (Task 10) if the pill-to-tile transition feels too abrupt or too slow.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/checkpoints/work-carousel/WorkIntroBackground.tsx
git commit -m "feat(design): add WORK intro pill and letter-tile background"
```

---

### Task 7: `ProjectCard` component

**Files:**
- Create: `src/components/checkpoints/work-carousel/ProjectCard.tsx`

**Interfaces:**
- Consumes: `Project` type from `@/lib/types` (existing), `StatusTag` from `@/components/ui/status-tag` (Task 4).
- Produces: `ProjectCard` default export, `{ project: Project; index: number; total: number; translateX: number; scale?: number; opacity?: number }` props (`translateX` in `vw` units; `scale`/`opacity` default to `1`) - consumed by Task 8's `Log.tsx`.

Renders one project's mockup-window card: a real screenshot when `project.image` is set, otherwise a typographic placeholder built from real `Project` fields. Name bottom-left, index code bottom-right (`#00X/13` style, matching the tabular-index idiom already used in `Log.tsx`'s flat-mode rows and `Ventures.tsx`).

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/types";
import StatusTag from "@/components/ui/status-tag";

export default function ProjectCard({
  project,
  index,
  total,
  translateX,
  scale = 1,
  opacity = 1,
}: {
  project: Project;
  index: number;
  total: number;
  translateX: number;
  scale?: number;
  opacity?: number;
}) {
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[min(560px,80vw)] border border-rule bg-bg"
      style={{
        opacity,
        transform: `translate(calc(-50% + ${translateX}vw), -50%) scale(${scale})`,
      }}
    >
      <div className="flex items-center gap-1.5 border-b border-rule px-3 py-2">
        <span className="h-2 w-2 bg-rule-strong" aria-hidden />
        <span className="h-2 w-2 bg-rule-strong" aria-hidden />
        <span className="h-2 w-2 bg-rule-strong" aria-hidden />
      </div>

      <div className="relative aspect-[16/10] bg-panel">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 80vw, 560px"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <h3 className="font-display text-xl font-medium text-ink">{project.title}</h3>
            <span className="annotate">{project.tag}</span>
            <StatusTag status={project.status} />
            <p className="font-mono text-[11px] text-ink-3 leading-relaxed">
              {project.techPills.join("  ·  ")}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-rule px-3 py-2">
        <span className="font-mono text-[11px] text-ink-3">{project.title}</span>
        <div className="flex items-center gap-2">
          {primary && (
            <a
              href={primary.href}
              target={primary.href.startsWith("http") ? "_blank" : undefined}
              rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={`${project.title} - ${primary.label}`}
              className="text-ink-3 hover:text-accent transition-colors"
            >
              <ArrowUpRight size={13} />
            </a>
          )}
          <span className="font-mono text-[11px] text-accent tabular-nums">
            #{String(index + 1).padStart(3, "0")}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}
```

Note: the three small square marks in the top bar are a plain window-chrome cue (deliberately square, not `rounded-full`, per the global no-pill rule) - not an interactive control, no `aria-hidden` needed removal, they're purely decorative alongside the frame.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/checkpoints/work-carousel/ProjectCard.tsx
git commit -m "feat(design): add project screenshot/placeholder card for the carousel"
```

---

### Task 8: Wire the carousel into `Log.tsx`

**Files:**
- Modify: `src/components/checkpoints/Log.tsx` (full rewrite)

**Interfaces:**
- Consumes: `useWorkCarouselProgress` (Task 5), `WorkIntroBackground` (Task 6), `ProjectCard` (Task 7), `StatusTag` (Task 4), `FlightProgressRef` type (existing), `CheckpointShell`'s `fullBleed` prop (Task 3).
- Produces: `Log` default export now accepts `progressRef: RefObject<FlightProgressRef>` in addition to its existing `visible`/`mode`/`repoStats` props (both call sites already updated in Task 3, Step 3).

Splits `Log.tsx` into two internal pieces switched on `mode`, exactly as every other checkpoint already does: `FlatCatalogue` (today's plain list, unchanged mechanic, now importing `StatusTag` from its new location and reusing the `image` field Task 2 populated) and `SceneCarousel` (the new WORK-intro/tile/carousel/zoomOut mechanic, driving `WorkIntroBackground` and up to two `ProjectCard`s at a time).

- [ ] **Step 1: Replace `src/components/checkpoints/Log.tsx` in full**

```tsx
"use client";

import { useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import { RepoStats } from "@/lib/github-repo-stats";
import { FlightProgressRef } from "@/lib/flight-scene/useFlightProgress";
import { useWorkCarouselProgress } from "@/lib/flight-scene/useWorkCarouselProgress";
import SectionHeader from "@/components/ui/section-header";
import CatalogFilter, { CatalogFilterValue } from "@/components/ui/catalog-filter";
import StatusTag from "@/components/ui/status-tag";
import CheckpointShell from "./CheckpointShell";
import WorkIntroBackground from "./work-carousel/WorkIntroBackground";
import ProjectCard from "./work-carousel/ProjectCard";

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

function FlatCatalogue({ repoStats }: { repoStats: Record<string, RepoStats | null> }) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");

  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];
  const displayedProjects = ordered.filter((p) => filter === "ALL" || p.status === filter);

  return (
    <div>
      <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("count", { count: projects.length })} />
      <div className="mt-6 mb-6">
        <CatalogFilter value={filter} onChange={setFilter} />
      </div>
      <div>
        {displayedProjects.map((project, i) => {
          const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
          return (
            <article
              key={project.slug}
              className={`relative grid gap-x-8 py-8 ${
                project.slug === flagship.slug ? "gradient-border px-6 md:px-8" : "border-t border-rule"
              }`}
            >
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
              <p className="font-mono text-[11px] text-ink-3 mt-4 leading-relaxed">
                {project.techPills.join("  ·  ")}
              </p>
              <Links links={project.links} />
              {project.image && (
                <div className="relative border border-rule overflow-hidden bg-panel/40 min-h-[160px] flex items-center justify-center p-6 mt-5 max-w-[280px]">
                  <img src={project.image} alt={project.title} className="w-full h-auto object-contain opacity-90" />
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
  );
}

function SceneCarousel({ progressRef }: { progressRef: RefObject<FlightProgressRef> }) {
  const ordered = [...projects].sort((a, b) => a.order - b.order);
  const state = useWorkCarouselProgress(progressRef, ordered.length);

  if (state.stage === "intro" || state.stage === "tile") {
    return <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />;
  }

  if (state.stage === "carousel") {
    return (
      <div className="relative h-full w-full">
        <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
        <ProjectCard
          project={ordered[state.activeIndex]}
          index={state.activeIndex}
          total={ordered.length}
          translateX={-state.slideProgress * 70}
        />
        {state.activeIndex < ordered.length - 1 && (
          <ProjectCard
            project={ordered[state.activeIndex + 1]}
            index={state.activeIndex + 1}
            total={ordered.length}
            translateX={70 - state.slideProgress * 70}
          />
        )}
      </div>
    );
  }

  const lastIndex = ordered.length - 1;
  return (
    <div className="relative h-full w-full">
      <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
      <ProjectCard
        project={ordered[lastIndex]}
        index={lastIndex}
        total={ordered.length}
        translateX={0}
        scale={1 + state.stageProgress * 4}
        opacity={Math.max(0, 1 - Math.max(0, state.stageProgress - 0.6) / 0.4)}
      />
    </div>
  );
}

export default function Log({
  visible,
  mode,
  repoStats,
  progressRef,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  repoStats: Record<string, RepoStats | null>;
  progressRef: RefObject<FlightProgressRef>;
}) {
  if (mode === "flat") {
    return (
      <CheckpointShell visible={visible} mode={mode}>
        <FlatCatalogue repoStats={repoStats} />
      </CheckpointShell>
    );
  }

  return (
    <CheckpointShell visible={visible} mode={mode} fullBleed>
      <SceneCarousel progressRef={progressRef} />
    </CheckpointShell>
  );
}
```

Notes for implementation:
- `translateX`'s `70`/`-70` (vw) slide distance and the zoom-out stage's `scale`/`opacity` formulas are starting points tuned by feel, not measured against a live render - flag for the human visual check (Task 10) same as Task 6's note.
- The Log-to-Telemetry crossfade at the very end of `zoomOut` relies on `CheckpointShell`'s existing `visible`-driven opacity transition on *both* `Log` (fading out as `activeId` leaves `"log"`) and `Telemetry` (fading in as `activeId` becomes `"telemetry"`) happening at the same boundary - this is the existing mechanism every checkpoint transition already uses, not new code. Combined with the `ProjectCard`'s own scale-up-and-fade in the last 40% of `zoomOut`, this should read as one continuous zoom-through rather than a hard cut, but confirm this visually - if the two fades feel out of sync, the fix is tuning `WORK_STAGE_BOUNDARIES.carouselEnd` (Task 3) or the `0.6`/`0.4` constants in the `opacity` formula above, not new integration code.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors anywhere in the project (this resolves the `Log.tsx` `progressRef` prop error that's been expected since Task 3).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: succeeds with no errors. This exercises the full page render pipeline including the now-substantially-larger `1656vh` spacer and the new carousel components.

- [ ] **Step 4: Manual verification note**

This cannot be visually confirmed in the implementation sandbox. Note in the report: a human must run `npm run dev` and scroll through the Selected Work beat in scene mode, confirming: the WORK pill appears, scroll expands it into tiled letters, 13 project cards are reachable in order sliding left-to-right, screenshot cards show real project screenshots, non-screenshot projects show the typographic placeholder with real data (no invented visuals), and the final card zooms into Telemetry without a jarring hard cut. Also confirm flat mode is completely unaffected (plain scrolling list, same as before this plan, now with seven real screenshots visible).

- [ ] **Step 5: Commit**

```bash
git add src/components/checkpoints/Log.tsx
git commit -m "feat(design): rebuild Selected Work scene mode into a WORK-intro carousel"
```

---

### Task 9: Update `DESIGN.md`

**Files:**
- Modify: `DESIGN.md`

**Interfaces:** None (documentation only).

Per this repo's established convention, every design pass updates `DESIGN.md` to describe what changed. This task documents the new mechanic and corrects the now-stale "Flight Log catalogue" description (Section 4) and "600vh" references.

- [ ] **Step 1: Add a changelog line**

Near the top of `DESIGN.md`, in the `> **Changelog:**` blockquote (or add a new one directly beneath the existing one if the file only has one changelog entry), add:

```
> **Changelog:** Work Carousel redesign (see
> `docs/superpowers/specs/2026-09-04-work-carousel-redesign-design.md`)
> replaces the Flight Log catalogue's scene-mode content with a pinned
> WORK-intro and letter-tile background, a 13-project left-to-right
> sliding screenshot carousel, and a zoom transition into Telemetry -
> fully decoupled from the 3D drone camera during this beat. Flat mode's
> plain catalogue list is unchanged. Also fixes a bug where the Contact
> panel disappeared the instant scroll reached the page bottom.
```

- [ ] **Step 2: Replace the stale "Flight Log catalogue" paragraph**

In Section 4 ("Component Stylings"), replace the existing "Flight Log catalogue" bullet (the one describing the checkpoint's HTML panel fading in/out, capped to 4 rows in scene mode) with:

```
- **Selected Work beat (`src/components/checkpoints/Log.tsx`):** flat mode
  (the no-WebGL fallback, which scrolls normally) renders the full project
  catalogue as a real indexed list, never a card grid - vertical bordered
  rows (`#00X`, tabular-nums index) beside a status tag, with the catalog
  filter above it. Scene mode is a different mechanic entirely: a pinned
  WORK-intro pill (a black stadium shape holding "WORK" spelled vertically
  on a white grid background) expands on scroll into four full-width tiled
  letter rows, which stay pinned as a background while one project's
  mockup-window screenshot card slides through at a time, left to right -
  thirteen steps, one per project, real screenshots where a live URL
  exists, a typographic placeholder card (real title/tag/status/tech data,
  no invented visuals) otherwise. The final card zooms to fill the
  viewport and crossfades into Telemetry. Built entirely with CSS
  transforms (`work-carousel/WorkIntroBackground.tsx`,
  `work-carousel/ProjectCard.tsx`), decoupled from the 3D drone camera,
  which is why the flagship UAV project's earlier "3D camera flying
  through this beat" feel is gone - the drone scene simply isn't visible
  behind this beat's fully opaque, full-bleed panel.
```

- [ ] **Step 3: Fix stale scroll-length references**

Search `DESIGN.md` for `600vh` and update any remaining reference to reflect the new `1656vh` total spacer height (from `TOTAL_SPACER_VH` in `route.ts`), noting that only the Selected Work beat's share grew - every other beat's absolute scroll height is unchanged.

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): document the Work Carousel redesign"
```

---

### Task 10: Final verification pass

**Files:** None modified - verification only.

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds, no errors.

- [ ] **Step 3: Six-rule polish audit**

Grep `src/components/checkpoints/work-carousel/` and the modified `Log.tsx`/`CheckpointShell.tsx` for `rounded-full`, `gradient`, `purple`, `violet`, `backdrop-blur`, `blur-`. Confirm every hit (if any) is one of: the WORK pill's stadium shape (`rounded-[70px]`, a deliberate one-off illustrative element per the Global Constraints note, not a status pill), or an already-documented pre-existing exception elsewhere in the codebase untouched by this plan. No new violations.

- [ ] **Step 4: Confirm screenshot assets are committed**

Run: `git log --oneline -- public/images/projects/` and `ls public/images/projects/`
Expected: seven PNG files present and tracked in git history from Task 2's commit.

- [ ] **Step 5: Reproduce the human manual-check list from Tasks 1 and 8 in one place**

Write a consolidated list (for the final report, not a code change) covering: footer/Contact visibility at scroll-bottom (Task 1), the full WORK-intro-to-carousel-to-zoomOut sequence in scene mode at desktop and mobile widths (Task 8), and flat mode being fully unaffected. Note explicitly that none of this could be visually verified in the implementation sandbox (no browser access) - a human must run `npm run dev` before this work is considered visually complete, same limitation as every prior design pass in this repo's history.

- [ ] **Step 6: Confirm the master spacer height change doesn't break anything else**

Grep the codebase for any other reference to the flight-scene spacer height (`600vh`, `TOTAL_SPACER_VH`) outside `route.ts`/`FlightSceneRoot.tsx`/`DESIGN.md` (already handled) - e.g. `sitemap.ts`, any SEO/analytics code that might assume a page-height constant. If found, note it in the report; if none, say so.

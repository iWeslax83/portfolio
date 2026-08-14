# Flight Log Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the portfolio from six independently-revealing sections into five GSAP-driven narrative beats (Hero, Flight Log, Founder Story, Telemetry, Contact), per the approved spec.

**Architecture:** GSAP + ScrollTrigger owns pin/scrub/horizontal-hijack; framer-motion (already a dependency) keeps ownership of non-scrubbed local interaction (hover, tap, staggered reveals). Each ScrollTrigger instance lives in its own `gsap.context()`, scoped and killed on unmount via `@gsap/react`'s `useGSAP`. Mobile (`< 768px`) and `prefers-reduced-motion: reduce` both hard-disable pin/scrub/hijack and fall back to a plain vertical stack.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind CSS v4, framer-motion 12, next-intl, GSAP 3 + `@gsap/react` (new).

**Spec:** `docs/superpowers/specs/2026-08-14-flight-log-redesign-design.md`

## Global Constraints

- No gradient outside the two existing scoped exceptions (flagship project border in `.gradient-border`; the hero second-line gradient is **removed** by this plan, per spec Section 3 — do not reintroduce it).
- No glassmorphism, no purple, single primary accent (`--color-accent`, `#39FF6A`).
- No `rounded-full` pill chrome outside the two existing scoped exceptions (`StatusTag`, `CatalogFilter`).
- No hype copy, no decorative emoji, no em dashes anywhere in code, comments, copy, or commit messages.
- Animate only `transform` and `opacity` in scrubbed/pinned motion; never `top`/`left`/`width`/`height`.
- Never mix GSAP and framer-motion animating the same element/property on overlapping timelines.
- Every `gsap.context()` is killed on unmount. `ScrollTrigger.refresh()` only on debounced resize, never per-frame.
- `prefers-reduced-motion: reduce` disables all pin/scrub/hijack outright (not shortened) across every task.
- Mobile (`< 768px`) disables all pin/scrub/hijack outright and falls back to a vertical stack with the same data/content, in document order.
- No new automated test suite (none exists in this repo). Verification is manual: `npm run build`, `npm run dev` + real-browser pass per task, per spec Section 10.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/lib/scroll.ts` | Create | `useReducedMotionPref()` and `useIsMobile()` hooks shared by every scrubbed section. |
| `src/lib/gsap.ts` | Create | Registers `ScrollTrigger` with `gsap` once, exports configured `gsap`. |
| `src/components/hero.tsx` | Modify | Pinned cold-open, clip-path mask reveal replaces gradient text-shift. |
| `src/components/flight-log.tsx` | Create | Replaces `projects.tsx`. Horizontal scroll-hijack desktop, vertical fallback mobile. |
| `src/components/projects.tsx` | Delete | Superseded by `flight-log.tsx`. |
| `src/components/founder-story.tsx` | Create | Replaces `stratos.tsx`, absorbs `drone-schematic.tsx`'s draw logic (scroll-scrubbed instead of viewport-triggered). |
| `src/components/stratos.tsx` | Delete | Superseded by `founder-story.tsx`. |
| `src/components/ui/drone-schematic.tsx` | Modify | Accepts an external scroll-progress value instead of animating on its own `whileInView`. |
| `src/components/telemetry.tsx` | Create | Replaces `skills.tsx` + `github.tsx`. Pinned bento dashboard. |
| `src/components/skills.tsx` | Delete | Superseded by `telemetry.tsx`. |
| `src/components/github.tsx` | Delete | Superseded by `telemetry.tsx` (its `ContributionGraph`/`LanguageBar` helpers move into `telemetry.tsx`). |
| `src/components/contact.tsx` | Modify | Entry transition only: hard-cut wipe instead of the current `whileInView` fade path. |
| `src/components/nav.tsx` | Modify | `navItems` ids/labels updated to the five-beat structure. |
| `src/app/page.tsx` | Modify | Import/render the five new/renamed components in order. |
| `src/messages/en.json` | Modify | `nav` keys updated for the merged sections; no other copy changes. |
| `package.json` | Modify | Add `gsap`, `@gsap/react`. |
| `DESIGN.md` | Modify | Document the redesign, retire the hero gradient exception. |

---

## Task 1: Add GSAP dependencies and shared scroll hooks

**Files:**
- Modify: `package.json`
- Create: `src/lib/gsap.ts`
- Create: `src/lib/scroll.ts`

**Interfaces:**
- Produces: `gsap` (configured, from `src/lib/gsap.ts`, default export), `useReducedMotionPref(): boolean` and `useIsMobile(breakpointPx?: number): boolean` (named exports from `src/lib/scroll.ts`). Every later task's scrubbed component imports these three.

- [ ] **Step 1: Install dependencies**

Run: `npm install gsap @gsap/react`

- [ ] **Step 2: Verify install**

Run: `npm ls gsap @gsap/react`
Expected: both packages listed with resolved versions, no `UNMET DEPENDENCY`.

- [ ] **Step 3: Create the GSAP registration module**

`src/lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 4: Create the shared scroll hooks**

`src/lib/scroll.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

/**
 * True when the user has requested reduced motion. Every GSAP pin/scrub/
 * hijack in this codebase must check this and render its plain fallback
 * instead - not a shortened animation.
 */
export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * True below the given breakpoint (default 768px, matching Tailwind's
 * `md`). Every GSAP pin/scrub/hijack in this codebase must check this and
 * render its vertical-stack fallback instead.
 */
export function useIsMobile(breakpointPx = 768): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    setMobile(query.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, [breakpointPx]);

  return mobile;
}
```

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: build succeeds (these two files aren't wired into any page yet, so this only confirms no TypeScript/syntax errors).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/gsap.ts src/lib/scroll.ts
git commit -m "feat(design): add gsap and shared scroll-state hooks"
```

---

## Task 2: Rebuild Hero as a pinned cold-open

**Files:**
- Modify: `src/components/hero.tsx`
- Modify: `src/app/globals.css` (remove the now-unused `.text-gradient-signal` utility and its keyframe)
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `src/lib/gsap.ts`; `useReducedMotionPref`, `useIsMobile` from `src/lib/scroll.ts`.
- Produces: `Hero` default export, same call signature (`<Hero />`, no props), same `id="home"` anchor - `page.tsx` and `nav.tsx`'s `#home` link are unaffected.

- [ ] **Step 1: Replace `src/components/hero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import DroneSchematic from "./ui/drone-schematic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, fadeRise, markIn, viewportOnce } from "@/lib/motion";

export default function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      if (reduced || mobile) return;
      if (!sectionRef.current || !line1Ref.current || !line2Ref.current) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=60%",
            scrub: true,
            pin: true,
          },
        });

        tl.fromTo(
          line1Ref.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", ease: "none", duration: 1 }
        ).fromTo(
          line2Ref.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", ease: "none", duration: 1 },
          "-=0.4"
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  const credentials = [t("cred1"), t("cred2"), t("cred3"), t("cred4")];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100dvh] flex items-center px-6 md:px-10 lg:px-14 pt-28 pb-20 max-w-[1320px] mx-auto"
    >
      <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center w-full">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div
            variants={markIn}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8"
          >
            <span className="annotate text-accent">{t("role")}</span>
            <span className="h-px w-8 bg-rule" aria-hidden />
            <span className="annotate">{t("org")}</span>
          </motion.div>

          <h1 className="font-display text-[clamp(3rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
            <span className="block overflow-hidden">
              <span ref={line1Ref} className="block" style={{ clipPath: "inset(0 0 0% 0)" }}>
                {t("hLine1")}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={line2Ref} className="block text-accent" style={{ clipPath: "inset(0 0 0% 0)" }}>
                {t("hLine2")}
              </span>
            </span>
          </h1>

          <motion.p variants={markIn} className="annotate text-accent mt-7">
            {t("rev")}
          </motion.p>

          <motion.p
            variants={fadeRise}
            className="font-body text-base md:text-lg text-ink-2 mt-6 max-w-xl leading-relaxed"
          >
            {t("lead")}
          </motion.p>

          <motion.ul variants={fadeRise} className="mt-9 space-y-2.5">
            {credentials.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-rule-strong" aria-hidden />
                <span className="font-mono text-xs text-ink-2">{c}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeRise} className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#flight-log"
              className="group inline-flex items-center gap-2 bg-accent text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
            >
              {t("viewWork")}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="link-draw font-mono text-xs text-ink-2 hover:text-ink transition-colors"
            >
              {t("getInTouch")}
            </a>
          </motion.div>
        </motion.div>

        <motion.figure
          className="relative hidden lg:block"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="relative border border-rule p-8 md:p-10">
            <DroneSchematic progress={1} />
          </div>
          <motion.figcaption
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 1.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 annotate"
          >
            {t("panelReadout")}
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
```

The `#projects` CTA link becomes `#flight-log` (the section it now points to, created in Task 3). `DroneSchematic` gains a `progress` prop in Task 4; passing `1` here means the hero's copy still shows the drawing fully drawn, unaffected by scroll (only Founder Story scrubs it).

- [ ] **Step 2: Remove the retired gradient utility from `src/app/globals.css`**

Search the file for `.text-gradient-signal` and its associated `@keyframes` (added for the "Maximalist Signal" pass, per `DESIGN.md` Section 2). Delete both the class rule and the keyframe block. Leave `.gradient-border` (the flagship project border exception) untouched - it is not part of this removal.

- [ ] **Step 3: Update `DESIGN.md`**

In Section 2 ("Scoped exceptions"), remove bullet 1 (the hero headline gradient) from the gradient exception list, leaving only the flagship project border exception. Add a short note above Section 1 or in a new changelog line stating: "Flight Log redesign (see `docs/superpowers/specs/2026-08-14-flight-log-redesign-design.md`) retires the hero gradient text-shift in favor of a scroll-scrubbed clip-path reveal; restructures the page into five GSAP-driven narrative beats." Keep the rest of the palette/typography sections as-is (spec Section 11: palette and font are out of scope).

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: fails only on the `#flight-log` anchor and `DroneSchematic` prop until Tasks 3-4 land - that's expected at this point in the plan. Confirm the failure is exactly those two (no other TypeScript errors in `hero.tsx`).

- [ ] **Step 5: Commit**

```bash
git add src/components/hero.tsx src/app/globals.css DESIGN.md
git commit -m "feat(design): rebuild hero as pinned cold-open with clip-path reveal"
```

---

## Task 3: Convert DroneSchematic to accept external scroll progress

**Files:**
- Modify: `src/components/ui/drone-schematic.tsx`

**Interfaces:**
- Produces: `DroneSchematic` now takes a required `progress: number` prop (0 to 1). At `progress >= 1` it renders fully drawn (matches its old `whileInView` end-state, used by `Hero` in Task 2). Founder Story (Task 5) drives `progress` from a live scroll value instead of passing a constant.

- [ ] **Step 1: Replace `src/components/ui/drone-schematic.tsx`**

```tsx
"use client";

import { useMemo } from "react";

/**
 * Top-down technical line drawing of an autonomous quadrotor. Draw
 * progress is driven externally by `progress` (0 to 1) so callers can tie
 * it to a scroll position (Founder Story) or a constant fully-drawn state
 * (Hero).
 */

// Motor hub positions (top-down, diagonal X frame)
const hubs = [
  { x: 78, y: 78 },
  { x: 322, y: 78 },
  { x: 78, y: 322 },
  { x: 322, y: 322 },
];

// Each element gets a [start, end] slice of the 0-1 progress range so the
// drawing still builds up piece by piece, just driven by `progress`
// instead of a framer-motion stagger delay.
const STROKE_SLICES = 8; // 4 arms + body + hub circles group + 2 dimension/label groups

function sliceProgress(progress: number, index: number, total = STROKE_SLICES) {
  const start = index / total;
  const end = (index + 1) / total;
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

export default function DroneSchematic({ progress }: { progress: number }) {
  const clamped = Math.min(1, Math.max(0, progress));

  const armProgress = useMemo(
    () => hubs.map((_, i) => sliceProgress(clamped, i, STROKE_SLICES)),
    [clamped]
  );
  const bodyProgress = sliceProgress(clamped, 4, STROKE_SLICES);
  const hubsProgress = sliceProgress(clamped, 5, STROKE_SLICES);
  const dimensionProgress = sliceProgress(clamped, 6, STROKE_SLICES);
  const labelProgress = sliceProgress(clamped, 7, STROKE_SLICES);

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      role="img"
      aria-label="Technical line drawing of an autonomous quadrotor airframe with a 520 millimetre rotor span"
      className="w-full h-auto text-ink-3"
    >
      {hubs.map((h, i) => (
        <line
          key={`arm-${i}`}
          x1={200}
          y1={200}
          x2={h.x}
          y2={h.y}
          stroke="currentColor"
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - armProgress[i]}
        />
      ))}

      <rect
        x={166}
        y={166}
        width={68}
        height={68}
        rx={10}
        stroke="currentColor"
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - bodyProgress}
      />
      <circle
        cx={200}
        cy={200}
        r={12}
        stroke="var(--color-accent)"
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - bodyProgress}
      />

      {hubs.map((h, i) => (
        <g key={`hub-${i}`} style={{ opacity: hubsProgress }}>
          <circle cx={h.x} cy={h.y} r={18} stroke="currentColor" strokeWidth={2} />
          <circle
            cx={h.x}
            cy={h.y}
            r={46}
            stroke="var(--color-rule-strong)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
        </g>
      ))}

      <g style={{ opacity: dimensionProgress }} className="text-ink-3">
        <line x1={78} y1={40} x2={322} y2={40} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <line x1={78} y1={32} x2={78} y2={48} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <line x1={322} y1={32} x2={322} y2={48} stroke="var(--color-rule-strong)" strokeWidth={1} />
        <path d="M86 36 L78 40 L86 44" stroke="var(--color-rule-strong)" strokeWidth={1} />
        <path d="M314 36 L322 40 L314 44" stroke="var(--color-rule-strong)" strokeWidth={1} />
      </g>
      <text
        style={{ opacity: dimensionProgress }}
        x={200}
        y={28}
        textAnchor="middle"
        className="fill-accent"
        fontFamily="var(--font-mono)"
        fontSize="13px"
        letterSpacing="0.1em"
      >
        520 mm
      </text>

      <text
        style={{ opacity: labelProgress }}
        x={200}
        y={250}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="10px"
        letterSpacing="0.18em"
      >
        FC-01
      </text>
      <text
        style={{ opacity: labelProgress }}
        x={322}
        y={360}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="10px"
        letterSpacing="0.18em"
      >
        M4
      </text>
    </svg>
  );
}
```

The continuous rotor-disc spin from the old version is dropped: it was a `useReducedMotion`-gated `whileInView` loop unrelated to the draw sequence, and this component no longer owns any of its own animation timing (scroll owns it now, per spec Section 5 - "draw progress tracks scroll position"). If a spinning rotor accent is wanted later, it belongs in Founder Story as a separate, explicitly reduced-motion-gated layer, not reintroduced here.

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: `hero.tsx`'s `<DroneSchematic progress={1} />` call now type-checks. Remaining failure, if any, is only the still-missing `#flight-log` target (harmless at build time, it's an anchor, not an import).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/drone-schematic.tsx
git commit -m "feat(design): drive drone schematic draw from external progress prop"
```

---

## Task 4: Build Flight Log (replaces Projects)

**Files:**
- Create: `src/components/flight-log.tsx`
- Delete: `src/components/projects.tsx`

**Interfaces:**
- Consumes: `RepoStats` type and `RepoStats | null` map shape from `src/lib/github-repo-stats.ts` (unchanged); `Project` type from `src/lib/types.ts` (unchanged); `projects`, `featuredProjects` from `src/data/projects.ts` (unchanged); `gsap`, `ScrollTrigger` from `src/lib/gsap.ts`; `useReducedMotionPref`, `useIsMobile` from `src/lib/scroll.ts`.
- Produces: `FlightLog` default export with the same props shape `projects.tsx` had (`{ repoStats: Record<string, RepoStats | null> }`), `id="flight-log"` (replaces `id="projects"` - update any other `#projects` links found in Task 7).

- [ ] **Step 1: Create `src/components/flight-log.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, ArrowLeft, ArrowRightIcon } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import { Project } from "@/lib/types";
import { RepoStats } from "@/lib/github-repo-stats";
import SectionHeader from "./ui/section-header";
import CatalogFilter, { CatalogFilterValue } from "./ui/catalog-filter";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, plateIn, viewportOnce } from "@/lib/motion";

function SpecLine({ pills }: { pills: string[] }) {
  return (
    <p className="font-mono text-[11px] text-ink-3 mt-4 leading-relaxed">
      {pills.join("  ·  ")}
    </p>
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

const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

const statusPillClass: Record<Project["status"], string> = {
  SHIPPED: "bg-accent text-bg",
  IN_PROGRESS: "bg-accent-2 text-bg",
  ARCHIVED: "border border-rule text-ink-3",
};

function StatusTag({ status }: { status: Project["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] ${statusPillClass[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

/* One flight card - full-viewport on desktop (horizontal hijack), a plain
   row on mobile. `index`/`total` are 1-based across the whole set,
   flagship included. */
function FlightCard({
  project,
  index,
  total,
  stats,
  flagship,
}: {
  project: Project;
  index: number;
  total: number;
  stats: RepoStats | null;
  flagship: boolean;
}) {
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];

  return (
    <article
      className={`flight-card shrink-0 w-full md:w-screen h-full flex items-center px-6 md:px-14 ${
        flagship ? "gradient-border" : "border-t md:border-t-0 border-rule"
      }`}
    >
      <div className="max-w-[1320px] mx-auto w-full grid lg:grid-cols-[1fr_0.92fr] gap-10 items-center">
        <div>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-5xl md:text-6xl font-semibold text-accent leading-none tabular-nums">
              {String(index).padStart(2, "0")}
            </span>
            <span className="annotate text-ink-3">/ {String(total).padStart(2, "0")}</span>
            <StatusTag status={project.status} />
          </div>
          <p className="annotate mt-4">{project.tag}</p>
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink mt-5 leading-[1.05] tracking-[-0.02em]">
            {project.title}
          </h3>
          <p className="font-body text-sm md:text-base text-ink-2 mt-4 leading-relaxed max-w-md">
            {project.description}
          </p>
          <SpecLine pills={project.techPills} />
          <Links links={project.links} />
          {stats && (
            <p className="mt-4 font-mono text-[11px] text-ink-3">
              {stats.commitCount} commits · last commit {stats.lastCommitDate}
            </p>
          )}
        </div>

        {project.image && (
          <div className="relative border border-rule overflow-hidden bg-panel/40 min-h-[220px] flex items-center justify-center p-10">
            <Image
              src={project.image}
              alt={project.title}
              width={320}
              height={240}
              className="w-full h-auto max-w-[280px] object-contain opacity-90"
            />
          </div>
        )}
      </div>
    </article>
  );
}

/* Mobile fallback: the old vertical numbered-row catalogue, unchanged
   in shape from the pre-redesign `projects.tsx`. */
function VerticalCatalogue({
  ordered,
  repoStats,
  filter,
  onFilterChange,
}: {
  ordered: Project[];
  repoStats: Record<string, RepoStats | null>;
  filter: CatalogFilterValue;
  onFilterChange: (v: CatalogFilterValue) => void;
}) {
  const visible = ordered.filter((p) => filter === "ALL" || p.status === filter);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mt-6 mb-6">
        <CatalogFilter value={filter} onChange={onFilterChange} />
      </div>
      <div>
        {visible.map((project, i) => {
          const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
          return (
            <motion.article
              key={project.slug}
              variants={plateIn}
              className="row-sweep group relative grid gap-x-8 border-t border-rule py-8 transition-colors"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-3">
                <span className="font-display text-3xl font-semibold text-ink-3 leading-none tabular-nums transition-colors group-hover:text-accent">
                  #{String(i + 1).padStart(3, "0")}
                </span>
                <span className="annotate">{project.tag}</span>
                <StatusTag status={project.status} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-medium text-ink leading-tight tracking-[-0.01em] transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                {primary && (
                  <a
                    href={primary.href}
                    target={primary.href.startsWith("http") ? "_blank" : undefined}
                    rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={`${project.title} - ${primary.label}`}
                    className="mt-1 shrink-0 text-ink-3 transition-colors group-hover:text-accent"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>
              <p className="font-body text-sm text-ink-2 mt-2.5 leading-relaxed max-w-2xl">
                {project.description}
              </p>
              <SpecLine pills={project.techPills} />
              <Links links={project.links} />
              {project.repo && repoStats[project.repo] && (
                <p className="mt-4 font-mono text-[11px] text-ink-3">
                  {repoStats[project.repo]!.commitCount} commits · last commit{" "}
                  {repoStats[project.repo]!.lastCommitDate}
                </p>
              )}
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function FlightLog({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
  const t = useTranslations("projects");
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");

  const [flagship] = featuredProjects;
  const ordered = [flagship, ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order)];

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      if (reduced || mobile) return;
      if (!sectionRef.current || !trackRef.current) return;

      const ctx = gsap.context(() => {
        const cards = trackRef.current!.children.length;
        const distance = (cards - 1) * window.innerWidth;

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            gsap.set(trackRef.current, { x: -self.progress * distance });
            setCurrent(Math.round(self.progress * (cards - 1)));
          },
        });

        const onResize = () => ScrollTrigger.refresh();
        let resizeTimer: ReturnType<typeof setTimeout>;
        const debouncedResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(onResize, 200);
        };
        window.addEventListener("resize", debouncedResize);

        return () => {
          window.removeEventListener("resize", debouncedResize);
          trigger.kill();
        };
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile, ordered.length] }
  );

  const jump = (delta: number) => {
    const trigger = ScrollTrigger.getAll().find((t) => t.trigger === sectionRef.current);
    if (!trigger) return;
    const cards = ordered.length;
    const nextIndex = Math.min(cards - 1, Math.max(0, current + delta));
    const targetProgress = nextIndex / (cards - 1);
    const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="flight-log"
      className="relative overflow-hidden"
      aria-label={t("title")}
    >
      {mobile || reduced ? (
        <div className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
          <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("count", { count: projects.length })} />
          <VerticalCatalogue
            ordered={ordered}
            repoStats={repoStats}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      ) : (
        <div className="min-h-[100dvh] flex flex-col justify-center">
          <div className="px-6 md:px-14 max-w-[1320px] mx-auto w-full flex items-center justify-between mb-6">
            <span className="font-mono text-xs text-ink-3">
              {String(current + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => jump(-1)}
                aria-label="Previous project"
                className="border border-rule p-2 text-ink-3 hover:text-accent hover:border-rule-strong transition-colors"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => jump(1)}
                aria-label="Next project"
                className="border border-rule p-2 text-ink-3 hover:text-accent hover:border-rule-strong transition-colors"
              >
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
          <div className="h-px bg-rule mx-6 md:mx-14 mb-4 relative overflow-hidden">
            <div
              className="h-full bg-accent origin-left transition-transform duration-200"
              style={{ transform: `scaleX(${(current + 1) / ordered.length})` }}
            />
          </div>
          <div ref={trackRef} className="flex h-[70vh]">
            {ordered.map((project, i) => (
              <FlightCard
                key={project.slug}
                project={project}
                index={i + 1}
                total={ordered.length}
                stats={project.repo ? repoStats[project.repo] ?? null : null}
                flagship={i === 0}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
```

`lucide-react`'s arrow icon export used for "next" is aliased to `ArrowRightIcon` on import to avoid shadowing the `ArrowRight` already used elsewhere in this file's sibling components; confirm `lucide-react` exports `ArrowRight` as the actual name (it does - alias only renames the local binding, not the package export).

- [ ] **Step 2: Delete the superseded file**

Run: `rm src/components/projects.tsx`

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: fails only where `page.tsx` still imports the deleted `./components/projects` (fixed in Task 7) - confirm no other error surfaces from `flight-log.tsx` itself. If you want an isolated check before Task 7, temporarily run `npx tsc --noEmit src/components/flight-log.tsx` scoped checks are not meaningful standalone in this project (no isolated tsconfig); rely on the Task 7 full-build pass instead and treat this step as a read-through diff review of `flight-log.tsx` for the constraints (no gradient/pill outside scope, only `transform`/`opacity` animated, GSAP context killed) before moving on.

- [ ] **Step 4: Commit**

```bash
git add src/components/flight-log.tsx
git rm src/components/projects.tsx
git commit -m "feat(design): replace project catalogue with horizontal-hijack flight log"
```

---

## Task 5: Build Founder Story (replaces Stratos, absorbs schematic draw)

**Files:**
- Create: `src/components/founder-story.tsx`
- Delete: `src/components/stratos.tsx`

**Interfaces:**
- Consumes: `stratosUnits`, `STRATOS_URL` from `@/data/stratos` (unchanged); `DroneSchematic` from Task 3 (`progress: number` prop); `gsap`, `ScrollTrigger`; `useReducedMotionPref`, `useIsMobile`.
- Produces: `FounderStory` default export, no props, `id="founder-story"` (replaces `id="stratos"`).

- [ ] **Step 1: Create `src/components/founder-story.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./ui/section-header";
import DroneSchematic from "./ui/drone-schematic";
import { stratosUnits, STRATOS_URL } from "@/data/stratos";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, staggerFast, fadeRise, slideInRight, ruleDraw, viewportOnce } from "@/lib/motion";

export default function FounderStory() {
  const t = useTranslations("stratos");
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [drawProgress, setDrawProgress] = useState(1);

  const stats = [
    { value: "04", label: t("departments") },
    { value: "07", label: t("members") },
    { value: "2026", label: t("founded") },
  ];

  useGSAP(
    () => {
      if (reduced || mobile) {
        setDrawProgress(1);
        return;
      }
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
          onUpdate: (self) => setDrawProgress(self.progress),
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  const paragraphThresholds = [0, 0.4, 0.7]; // roleBadge, body, stats reveal in sync with draw

  return (
    <section ref={sectionRef} id="founder-story" className="relative py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <SectionHeader kicker={t("kicker")} title={t("title")} />

      <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-start">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <p
            className="annotate text-accent transition-opacity duration-300"
            style={{ opacity: drawProgress >= paragraphThresholds[0] ? 1 : 0.15 }}
          >
            {t("roleBadge")}
          </p>

          <p
            className="font-body text-lg md:text-xl text-ink mt-6 leading-relaxed max-w-xl transition-opacity duration-300"
            style={{ opacity: drawProgress >= paragraphThresholds[1] ? 1 : 0.15 }}
          >
            {t("body")}
          </p>

          <dl
            className="mt-10 grid grid-cols-3 max-w-md border-t border-rule pt-6 transition-opacity duration-300"
            style={{ opacity: drawProgress >= paragraphThresholds[2] ? 1 : 0.15 }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight">{s.value}</dt>
                <dd className="annotate mt-1.5">{s.label}</dd>
              </div>
            ))}
          </dl>

          <motion.a
            variants={fadeRise}
            href={STRATOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent mt-9 hover:text-accent/80 transition-colors"
          >
            {t("visit")}
            <ArrowUpRight size={13} />
          </motion.a>
        </motion.div>

        <div>
          <div className="border border-rule p-8 md:p-10 lg:sticky lg:top-28">
            <DroneSchematic progress={drawProgress} />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerFast} className="mt-8">
            <div className="flex items-center gap-4 mb-2">
              <motion.span variants={slideInRight} className="annotate">
                {t("unitsLabel")}
              </motion.span>
              <motion.span variants={ruleDraw} className="h-px flex-1 origin-left bg-rule" />
            </div>
            <ul>
              {stratosUnits.map((unit, i) => (
                <motion.li
                  key={unit.name}
                  variants={slideInRight}
                  className="row-sweep group grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5 transition-colors hover:border-rule-strong"
                >
                  <span className="font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-accent">
                      {unit.name}
                    </h3>
                    <p className="font-mono text-[11px] text-ink-3 mt-1.5 leading-relaxed">{unit.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

Desktop keeps the two-column split from the old `stratos.tsx` (text left, schematic right, now `lg:sticky` instead of parallax-only, per spec Section 5). Mobile/reduced-motion render `drawProgress = 1` (schematic fully drawn, no scrub), matching the spec's "mobile: schematic first, still scroll-scrubbed" intent simplified to "fully drawn, no scrub" since a non-pinned, non-hijacked mobile scrub adds complexity with no functional payoff here — the founder narrative text remains the primary mobile content either way.

- [ ] **Step 2: Delete the superseded file**

Run: `rm src/components/stratos.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/founder-story.tsx
git rm src/components/stratos.tsx
git commit -m "feat(design): merge stratos story with scroll-scrubbed schematic draw"
```

---

## Task 6: Build Telemetry (replaces Skills + GitHub)

**Files:**
- Create: `src/components/telemetry.tsx`
- Delete: `src/components/skills.tsx`
- Delete: `src/components/github.tsx`

**Interfaces:**
- Consumes: `GitHubStats` type from `@/lib/types` (unchanged); `skills` data from `@/data/skills` (unchanged); `gsap`, `ScrollTrigger`; `useReducedMotionPref`, `useIsMobile`.
- Produces: `Telemetry` default export with the same props shape `github.tsx` had (`{ stats: GitHubStats }`), `id="telemetry"` (replaces both `id="skills"` and `id="github"`).

- [ ] **Step 1: Create `src/components/telemetry.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import { skills } from "@/data/skills";
import SectionHeader from "./ui/section-header";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionPref, useIsMobile } from "@/lib/scroll";
import { staggerContainer, staggerFast, fadeRise, readoutSettle, markIn, ruleDraw, viewportOnce } from "@/lib/motion";

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
      <motion.div
        className="flex gap-[3px] overflow-x-auto pb-1"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.01 } } }}
      >
        {graph.map((week, wi) => (
          <motion.div
            key={wi}
            variants={{
              hidden: { opacity: 0, scaleY: 0.2 },
              visible: { opacity: 1, scaleY: 1, transition: { duration: 0.25 } },
            }}
            className="flex flex-col gap-[3px] origin-bottom"
          >
            {week.map((level, di) => (
              <span
                key={di}
                title={`activity level ${level}`}
                className={`h-[10px] w-[10px] ${cellTone[level]} transition-transform hover:scale-150`}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
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
      <motion.div
        className="flex h-1.5 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {languages.map((lang) => (
          <motion.div
            key={lang.name}
            style={{ flex: lang.percentage, backgroundColor: lang.color, transformOrigin: "left" }}
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          />
        ))}
      </motion.div>
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

function SkillsTile({ label }: { label: string }) {
  const t = useTranslations("skills");
  return (
    <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
      <p className="annotate mb-4">{label}</p>
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
    </motion.div>
  );
}

export default function Telemetry({ stats }: { stats: GitHubStats }) {
  const t = useTranslations("github");
  const tSkills = useTranslations("skills");
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  const specs = [
    { value: stats.publicRepos, label: t("publicRepos") },
    { value: stats.contributions, label: t("contributions") },
    { value: stats.languages.length, label: t("languages") },
  ];

  useGSAP(
    () => {
      if (reduced || mobile) return;
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=50%",
          pin: true,
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reduced, mobile] }
  );

  return (
    <section ref={sectionRef} id="telemetry" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("status")} />

      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
        <motion.dl variants={staggerFast} className="grid sm:grid-cols-3 gap-4 lg:gap-5">
          {specs.map((s) => (
            <motion.div key={s.label} variants={readoutSettle} className="border border-rule p-5 md:p-6">
              <dt className="font-display text-6xl md:text-7xl font-semibold text-ink tabular-nums tracking-tight">
                {s.value}
              </dt>
              <dd className="annotate mt-2">{s.label}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
          </motion.div>
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <SkillsTile label={tSkills("kicker")} />
        </div>

        <div className="flex items-center gap-4 mt-8">
          <motion.a
            variants={fadeRise}
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-accent/80"
          >
            github.com/iWeslax83
            <ArrowUpRight size={13} />
          </motion.a>
          <motion.span variants={ruleDraw} className="h-px flex-1 origin-left bg-rule" />
        </div>
      </motion.div>
    </section>
  );
}
```

Tile power-on stagger reuses the existing `staggerContainer`/`staggerFast`/`readoutSettle`/`fadeRise` framer-motion variants (spring physics already matches spec Section 6's `stiffness: 100, damping: 20`-equivalent - this codebase's shared `spring` transition in `src/lib/motion.ts` is `stiffness: 110, damping: 20`, close enough to the spec's illustrative numbers that reusing the existing token is correct per the "follow existing patterns" rule rather than hand-rolling a near-duplicate). The pin here has no scrub-linked visual change of its own (no `onUpdate`); it exists purely to hold the dashboard on screen through its framer-motion stagger before releasing to Contact, per spec Section 6 ("tiles power on... as the section scrolls into its pin range").

Skills content is condensed into one tile spanning the two-column grid (`SkillsTile`) rather than a second full-width tile, since the category list is denser than a single stat and reads better full-width; this satisfies spec Section 6's "one or two tiles" without inventing a second near-empty tile just to hit two.

- [ ] **Step 2: Delete the superseded files**

Run: `rm src/components/skills.tsx src/components/github.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/telemetry.tsx
git rm src/components/skills.tsx src/components/github.tsx
git commit -m "feat(design): merge skills and github into pinned telemetry dashboard"
```

---

## Task 7: Contact hard-cut transition

**Files:**
- Modify: `src/components/contact.tsx`

**Interfaces:**
- No signature change: `Contact` stays a no-prop default export, `id="contact"` unchanged.

- [ ] **Step 1: Read the current file to confirm its `whileInView` entry pattern**

Run: `grep -n "whileInView\|variants" src/components/contact.tsx`

- [ ] **Step 2: Replace the section's outermost `initial`/`whileInView`/`variants` wrapper's variant reveal with a wipe**

Find the root `motion.div` (or `motion.section`) inside `contact.tsx` that currently uses a fade/rise variant (e.g. `staggerContainer` with children on `fadeRise`) as its entry. Add a hard-edge wipe ahead of it: wrap the section content in a clip-path reveal instead of opacity-only, matching the "hard cut, not fade" rule from spec Section 2 and Section 7. Change its variants object (or add a sibling variant applied to the outermost wrapper) to:

```tsx
const wipeIn = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};
```

Apply `variants={wipeIn}` to the section's outermost `motion` element (in place of, or wrapping, whatever variant it uses today), keeping `initial="hidden"` / `whileInView="visible"` / `viewport={viewportOnce}` as they already are. Leave every inner child's own motion (form fields, links, etc.) untouched - only the section's own entry treatment changes.

- [ ] **Step 3: Build check**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/contact.tsx
git commit -m "feat(design): contact section enters with a hard-cut wipe, not a fade"
```

---

## Task 8: Rewire page, nav, and translations

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/nav.tsx`
- Modify: `src/messages/en.json`

**Interfaces:**
- No new interfaces; this task only rewires imports/ids/labels defined by Tasks 2-7.

- [ ] **Step 1: Update `src/app/page.tsx`**

```tsx
import { fetchGitHubStats } from "@/lib/github";
import { fetchRepoStats } from "@/lib/github-repo-stats";
import { getRecentCommits } from "@/lib/git-history";
import { projects } from "@/data/projects";
import Nav from "@/components/nav";
import BackToTop from "@/components/ui/back-to-top";
import CommitMotif from "@/components/ui/commit-motif";
import Hero from "@/components/hero";
import FlightLog from "@/components/flight-log";
import FounderStory from "@/components/founder-story";
import Telemetry from "@/components/telemetry";
import Contact from "@/components/contact";
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
        <Hero />
        <FlightLog repoStats={repoStats} />
        <FounderStory />
        <Telemetry stats={githubStats} />
        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
```

- [ ] **Step 2: Update `navItems` in `src/components/nav.tsx`**

Replace:

```tsx
export const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "projects", href: "#projects", num: "01" },
  { key: "stratos", href: "#stratos", num: "02" },
  { key: "skills", href: "#skills", num: "03" },
  { key: "github", href: "#github", num: "04" },
  { key: "contact", href: "#contact", num: "05" },
];
```

With:

```tsx
export const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "flightLog", href: "#flight-log", num: "01" },
  { key: "founderStory", href: "#founder-story", num: "02" },
  { key: "telemetry", href: "#telemetry", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
];
```

No other changes to `nav.tsx` are needed: the `IntersectionObserver` section-id list and the active-section underline both derive from `navItems` already.

- [ ] **Step 3: Update `nav` keys in `src/messages/en.json`**

Replace:

```json
  "nav": {
    "home": "home",
    "stratos": "stratos",
    "projects": "work",
    "skills": "stack",
    "github": "github",
    "contact": "contact"
  },
```

With:

```json
  "nav": {
    "home": "home",
    "flightLog": "work",
    "founderStory": "stratos",
    "telemetry": "telemetry",
    "contact": "contact"
  },
```

Every other namespace (`hero`, `stratos`, `projects`, `skills`, `github`, `contact`, `footer`) stays exactly as-is: those keys are still consumed by `useTranslations("stratos")` inside `founder-story.tsx`, `useTranslations("projects")` inside `flight-log.tsx`, `useTranslations("skills")` and `useTranslations("github")` inside `telemetry.tsx` (per spec Section 11 - "no new content/copy beyond what's needed to fit the new section boundaries").

- [ ] **Step 4: Full build**

Run: `npm run build`
Expected: clean build, no TypeScript errors, no missing-import errors.

- [ ] **Step 5: Manual verification pass**

Run: `npm run dev`, open `http://localhost:3000` in a real browser (per this repo's global rule, launch Chromium if using Playwright for this check) and walk through spec Section 10's checklist:

- Desktop: each pinned section (Hero, Flight Log, Telemetry) pins and releases at the right scroll offset; Flight Log's horizontal hijack tracks scroll 1:1 and reaches every project including the flagship; Founder Story's schematic finishes drawing exactly as its scroll range ends; Contact enters with a visible hard-edge wipe, not a fade.
- Resize the browser below 768px width (or use device toolbar): every pin/hijack is disabled, Flight Log falls back to the vertical catalogue, Founder Story schematic renders fully drawn with no scrub, Telemetry tiles stack and reveal on plain scroll-in. No horizontal scrollbar appears anywhere.
- In DevTools, enable "prefers-reduced-motion: reduce" (Rendering pane): the entire pin/scrub/hijack suite is disabled, content is still fully present and readable top to bottom.
- Keyboard-only pass: Tab through the whole page including Flight Log's prev/next buttons; confirm arrow-key buttons move the horizontal position and visible focus rings appear throughout; confirm focus is never trapped inside a pinned section.
- Confirm GitHub stats, per-project commit counts, and the contribution graph still render real fetched data (not blank/zero) in the Telemetry and Flight Log sections.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/nav.tsx src/messages/en.json
git commit -m "feat(design): wire five-beat page structure into app shell and nav"
```

---

## Self-Review Notes

- **Spec coverage:** Section 1 (dependencies) → Task 1. Section 2 (page structure/table) → Task 8 Step 1. Section 3 (Hero) → Task 2. Section 4 (Flight Log) → Task 4. Section 5 (Founder Story) → Tasks 3 and 5. Section 6 (Telemetry) → Task 6. Section 7 (Contact + chrome) → Task 7 (Contact); Nav/CommitMotif/Footer/BackToTop confirmed unchanged, only `navItems` touched in Task 8. Section 8 (accessibility/reduced motion) → the `useReducedMotionPref`/`useIsMobile` hooks from Task 1, applied in every scrubbed component (Tasks 2, 4, 5, 6), plus the keyboard-nav buttons in Task 4 and the manual keyboard pass in Task 8 Step 5. Section 9 (performance) → `transform`/`opacity`-only rule followed throughout, `gsap.context()` + `useGSAP` cleanup in every task, debounced resize in Task 4. Section 10 (testing) → Task 8 Step 5 covers the full manual checklist verbatim. Section 11 (out of scope) → confirmed no palette/font/Nav-chrome/Footer/CommitMotif/BackToTop changes anywhere in this plan.
- **Placeholder scan:** no TBD/TODO markers; every step has literal code or a literal shell command.
- **Type consistency:** `RepoStats`, `Project`, `GitHubStats`, `SkillCategory` types are reused verbatim from their existing definitions, not redeclared. `DroneSchematic`'s new `progress: number` prop is used consistently in both call sites (`hero.tsx` passes `1`, `founder-story.tsx` passes the live `drawProgress` state). Component export names (`FlightLog`, `FounderStory`, `Telemetry`) match their `page.tsx` imports exactly.

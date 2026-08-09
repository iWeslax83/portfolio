# Instrument Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portfolio's "engineering monograph" visual system (figure codes, registration marks, drafting rules) with the "Instrument" system defined in `DESIGN.md`: a neutral near-black canvas, one saturated signal-orange accent, `Instrument Sans` + `JetBrains Mono`, and bordered instrument-panel chrome instead of drafting marks - while keeping the same section structure, the same founder-first narrative, and the hand-built drone SVG asset.

**Architecture:** Tailwind v4 `@theme` tokens in `globals.css` keep their existing names (`--color-bg`, `--color-accent`, etc.) - only the hex values and a handful of drafting-specific utility classes change, so most section components need zero color-token edits. The real work is (1) swapping fonts, (2) replacing the `FigureMarker` component with a `SectionHeader` component that drops the `FIG. 0X` code, (3) removing registration-mark/tick-rule chrome from `hero.tsx` and `projects.tsx`, and (4) touching the specific copy strings tied to the retired motif.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion 12, next-intl, TypeScript. No test framework is installed in this project (`package.json` has no `test` script, no Jest/Vitest/Playwright dependency) - this is a personal portfolio with a single content locale (`en` only, `i18n/routing.ts` defines `locales: ["en"]`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-instrument-redesign-design.md` (mirrored at repo-root `DESIGN.md`, the project's established source of truth - already written and committed).
- No em dashes anywhere (code, copy, commits) - use normal hyphens.
- No gradients, no glassmorphism/blur panels, no purple. Flat fills only, one accent (`--color-accent: #FF7A29`).
- No pill badges (`rounded-full` + tint) for status/tags - plain text, a small square dot, or a bordered rectangular tag.
- No AI-cliche copy ("Elevate", "Empower", "Unleash", "Revolutionize", "Supercharge", "Seamless", "Next-Gen").
- No emoji.
- Keep founder-first framing in all copy edits - do not soften to craft-only verbs.
- **No test framework exists and none is being added for this redesign** (YAGNI - a personal portfolio's visual redesign does not justify scaffolding Jest/Vitest/RTL from zero). The verification gate for every task is: `npm run build` (runs Next's TypeScript + ESLint + production build, catches type errors, unused imports, and broken JSX) plus a `grep` check that no leftover references to removed classes/components survive. Task 10 adds a manual, browser-based visual QA pass since this is UI work and automated tests can't catch a visual regression here.
- Only one content locale (`en`) exists - edit `src/messages/en.json` only, no other locale files.
- Framer Motion variant names in `src/lib/motion.ts` (`plateIn`, `ruleDraw`, `markIn`, `fadeRise`, etc.) are **kept as-is** to avoid churning every import across 9 components for a naming-only change; only their doc comments are reframed to describe the new "instrument" intent instead of the old "drafting" intent. The underlying spring physics (`stiffness: 110, damping: 20`) is unchanged - DESIGN.md requires the same spring, not new physics.

---

### Task 1: Foundation - tokens, fonts, motion doc

**Files:**
- Modify: `src/app/globals.css` (full file - token values, remove drafting-only utilities, add status-dot utility)
- Modify: `src/app/layout.tsx:1-30` (font imports and instantiation)
- Modify: `src/lib/motion.ts:1-7` (file header comment only)

**Interfaces:**
- Produces: CSS custom properties consumed unchanged by name (`bg-accent`, `text-ink-2`, `border-rule`, etc.) in every later task. New utility class `.status-dot` (square, `--color-accent` background, uses existing `.animate-signal` keyframe for the pulse) for Task 8. `--font-display` and `--font-body` CSS variables now point at `Instrument Sans` instead of `Bricolage Grotesque`/`Manrope`.
- Consumes: nothing from earlier tasks.

- [ ] **Step 1: Replace the color tokens in `globals.css`**

Replace lines 3-32 (the `@theme` block) with:

```css
@theme {
  /* ── Canvas: neutral near-black, never warm, never pure black ── */
  --color-bg: #09090b;
  --color-panel: #121214;
  --color-panel-2: #1a1a1d;

  /* ── Ink: neutral whites and grays ────────────────────────── */
  --color-ink: #f2f1ed;
  --color-ink-2: #93939a;
  --color-ink-3: #67676d;

  /* ── Accent: signal orange, used scarcely as a single signal ── */
  --color-accent: #ff7a29;
  --color-accent-soft: rgba(255, 122, 41, 0.1);

  /* ── Structure ─────────────────────────────────────────────── */
  --color-rule: rgba(255, 255, 255, 0.08);
  --color-rule-strong: rgba(255, 255, 255, 0.18);
  --color-card: #121214;
  --color-card-border: rgba(255, 255, 255, 0.08);
  --color-card-border-hover: rgba(255, 122, 41, 0.4);

  /* ── Type ─────────────────────────────────────────────────── */
  --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "JetBrains Mono", monospace;
}
```

Note: `--font-display` self-referencing `var(--font-display)` matches the existing pattern in this file (the actual font family class is injected by `next/font` on the `<html>` element as a CSS custom property of the same name - see Step 3 below) - keep this quirk, it already works.

- [ ] **Step 2: Remove drafting-only utilities and add the status-dot utility**

Delete the `.reg-mark` block and its modifiers (currently lines 120-158: `.reg-mark`, `.reg-mark::before`, `.reg-mark::after`, `.reg-tr`, `.reg-bl`, `.reg-br`) and the `.tick-rule` block (currently lines 160-169).

In their place, add:

```css
/* Square status dot - replaces the old circular signal dot. Paired with
   .animate-signal (kept, below) for the pulse. */
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--color-accent);
}
```

Keep `.annotate`, `.link-draw`, the scrollbar rules, `.skip-link`, `::selection`, `:focus-visible`, `.animate-drift`/`@keyframes drift-y`, `.animate-signal`/`@keyframes signal`, and the `prefers-reduced-motion` block exactly as they are - none of them are drafting-specific.

- [ ] **Step 3: Swap the font imports in `layout.tsx`**

Replace lines 1-30 with:

```tsx
import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/ui/motion-provider";
import "./globals.css";

// Display + body: Instrument Sans - a single geometric grotesk driving the
// whole hierarchy by weight and size. Deliberately not Inter used as a bare
// default, not Space Grotesk.
const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

// Mono carries the technical-readout voice: data values, status lines, nav
// index, spec rows.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});
```

Then update the `<html>` tag's `className` (currently `` `${display.variable} ${body.variable} ${mono.variable}` ``) to:

```tsx
      className={`${instrumentSans.variable} ${mono.variable}`}
```

Instrument Sans now drives both `--font-display` and `--font-body` (both point at `--font-instrument-sans` per Step 1), so only two font objects are needed instead of three.

- [ ] **Step 4: Reframe the `motion.ts` file header comment**

Replace lines 1-7 with:

```ts
import type { Variants, Transition } from "framer-motion";

/**
 * Motion vocabulary for the Instrument layout. Variety in technique, one
 * consistent spring binding it together. Reveals read like an instrument
 * panel powering on: panels snap into grid alignment, rules extend across,
 * headlines unmask, readouts settle into their final value.
 */
```

Leave every export below this comment (`spring`, `viewportOnce`, `staggerContainer`, `staggerFast`, `fadeRise`, `ruleDraw`, `lineReveal`, `markIn`, `plateIn`, `slideInLeft`, `slideInRight`) untouched - same names, same values, same physics.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors. (Visual output will look broken/unstyled in places until later tasks replace `FigureMarker` usages and remove `reg-mark` JSX references - that's expected, later tasks fix it. This step only confirms nothing in this task itself is a type/syntax error.)

If `next build` fails because `reg-mark`/`tick-rule` classNames are still referenced in JSX (Tailwind won't error on an unknown class, but confirm no TypeScript error came from the font variable rename) - fix any reference to the removed `display`/`body` variable names in `layout.tsx` before proceeding.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/motion.ts
git commit -m "feat(design): switch tokens and fonts to the Instrument system

Neutral near-black canvas, signal-orange accent, Instrument Sans +
JetBrains Mono. Drops the drafting-only reg-mark/tick-rule CSS."
```

---

### Task 2: SectionHeader component

**Files:**
- Create: `src/components/ui/section-header.tsx`

**Interfaces:**
- Produces: `SectionHeader` React component, default export, props `{ kicker: string; title: string; meta?: string }`. Consumed by Tasks 4-7.
- Consumes: `markIn`, `ruleDraw`, `lineReveal`, `viewportOnce` from `@/lib/motion` (Task 1, unchanged).

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import { markIn, ruleDraw, lineReveal, viewportOnce } from "@/lib/motion";

/**
 * Section header in the Instrument language: a mono kicker label, a hairline
 * rule extending across the section, an optional right-aligned mono meta
 * value, and the section title set large. Replaces FigureMarker - no figure
 * code, no registration marks.
 */
export default function SectionHeader({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4">
        <motion.span variants={markIn} className="annotate shrink-0 text-accent">
          {kicker}
        </motion.span>
        <motion.span
          variants={ruleDraw}
          className="h-px flex-1 origin-left bg-rule"
        />
        {meta && (
          <motion.span variants={markIn} className="annotate shrink-0">
            {meta}
          </motion.span>
        )}
      </div>
      <div className="mt-5 overflow-hidden">
        <motion.h2
          variants={lineReveal}
          className="font-display text-[2.25rem] sm:text-5xl md:text-[3.5rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
        >
          {title}
        </motion.h2>
      </div>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds. `section-header.tsx` is not imported anywhere yet, so this only confirms the new file itself compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/section-header.tsx
git commit -m "feat(design): add SectionHeader, the Instrument section-header component"
```

---

### Task 3: Hero rebuild

**Files:**
- Modify: `src/components/hero.tsx:35-139`
- Modify: `src/messages/en.json` (`hero` object, currently lines 9-23)

**Interfaces:**
- Consumes: `DroneSchematic` (unchanged, `src/components/ui/drone-schematic.tsx`), motion variants from Task 1.
- Produces: nothing consumed by later tasks (Hero is a leaf section).

- [ ] **Step 1: Remove the registration marks**

In `hero.tsx`, delete these two lines (currently 41-42):

```tsx
      <span className="reg-mark reg-tr" aria-hidden />
      <span className="reg-mark reg-bl" aria-hidden />
```

- [ ] **Step 2: Change the credential tick marks from L-corner ticks to square dots**

Replace (currently lines 90-95):

```tsx
          <motion.ul variants={fadeRise} className="mt-9 space-y-2.5">
            {credentials.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 border-l border-b border-rule-strong" aria-hidden />
                <span className="font-mono text-xs text-ink-2">{c}</span>
              </li>
            ))}
          </motion.ul>
```

with:

```tsx
          <motion.ul variants={fadeRise} className="mt-9 space-y-2.5">
            {credentials.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-rule-strong" aria-hidden />
                <span className="font-mono text-xs text-ink-2">{c}</span>
              </li>
            ))}
          </motion.ul>
```

- [ ] **Step 3: Wrap the drone schematic in a bordered instrument panel and replace the figure caption**

Replace (currently lines 117-135):

```tsx
        <motion.figure
          style={{ y: figureY, opacity: figureOpacity }}
          className="relative hidden lg:block"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="relative px-6">
            <DroneSchematic />
          </div>
          <motion.figcaption
            variants={markIn}
            className="mt-4 flex items-center gap-3 annotate"
          >
            <span className="text-accent">Fig. 00</span>
            <span className="h-px flex-1 bg-rule" />
            <span>Autonomous quadrotor · top view</span>
          </motion.figcaption>
        </motion.figure>
```

with:

```tsx
        <motion.figure
          style={{ y: figureY, opacity: figureOpacity }}
          className="relative hidden lg:block"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="relative border border-rule p-8 md:p-10">
            <DroneSchematic />
          </div>
          <motion.figcaption variants={markIn} className="mt-4 annotate">
            {t("panelReadout")}
          </motion.figcaption>
        </motion.figure>
```

- [ ] **Step 4: Add the `panelReadout` copy key**

In `src/messages/en.json`, inside the `hero` object, add a new key after `"rev"` (currently line 13):

```json
    "panelReadout": "Object · Autonomous quadrotor — Status · Flight-ready",
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds, no unresolved `reg-mark` or `Fig.` references remain in `hero.tsx`.

Run: `grep -n "reg-mark\|Fig\. 00" src/components/hero.tsx`
Expected: no output (both removed).

- [ ] **Step 6: Commit**

```bash
git add src/components/hero.tsx src/messages/en.json
git commit -m "feat(design): rebuild hero for the Instrument system

Drone schematic now sits in a bordered instrument panel with a readout
caption instead of a Fig. 00 registration-mark frame. Credential ticks
are square dots instead of L-corner drafting ticks."
```

---

### Task 4: STRATOS section

**Files:**
- Modify: `src/components/stratos.tsx:1,29`

**Interfaces:**
- Consumes: `SectionHeader` (Task 2).
- Consumes: `stratosUnits`, `STRATOS_URL` from `@/data/stratos` (unchanged).

- [ ] **Step 1: Swap the import**

Replace line 6:

```tsx
import FigureMarker from "./ui/figure-marker";
```

with:

```tsx
import SectionHeader from "./ui/section-header";
```

- [ ] **Step 2: Swap the usage**

Replace line 29:

```tsx
      <FigureMarker code="FIG. 01" title={t("title")} annotation={t("kicker")} />
```

with:

```tsx
      <SectionHeader kicker={t("kicker")} title={t("title")} />
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "FigureMarker\|FIG\." src/components/stratos.tsx`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/stratos.tsx
git commit -m "feat(design): migrate STRATOS section to SectionHeader"
```

---

### Task 5: Projects section

**Files:**
- Modify: `src/components/projects.tsx:10,64-65,104,161-165`
- Modify: `src/messages/en.json` (`projects` object, currently lines 40-45)

**Interfaces:**
- Consumes: `SectionHeader` (Task 2).

- [ ] **Step 1: Swap the import**

Replace line 10:

```tsx
import FigureMarker from "./ui/figure-marker";
```

with:

```tsx
import SectionHeader from "./ui/section-header";
```

- [ ] **Step 2: Remove the registration marks from the Flagship plate**

Delete these two lines (currently 64-65):

```tsx
      <span className="reg-mark reg-tr" aria-hidden />
      <span className="reg-mark reg-bl" aria-hidden />
```

- [ ] **Step 3: Replace the flagship image figcaption**

Replace line 104:

```tsx
          <figcaption className="absolute bottom-4 left-5 annotate">
            Fig. 02a · UAV airframe
          </figcaption>
```

with:

```tsx
          <figcaption className="absolute bottom-4 left-5 annotate">
            UAV airframe · Spec 01
          </figcaption>
```

(This is hardcoded English in the component already, matching the existing pattern - not a `t()` call.)

- [ ] **Step 4: Swap the section header usage**

Replace (currently lines 161-165):

```tsx
      <FigureMarker
        code="FIG. 02"
        title={t("title")}
        annotation={t("count", { count: projects.length })}
      />
```

with:

```tsx
      <SectionHeader
        kicker={t("kicker")}
        title={t("title")}
        meta={t("count", { count: projects.length })}
      />
```

- [ ] **Step 5: Add the `kicker` copy key**

In `src/messages/en.json`, inside the `projects` object, add a new key before `"title"` (currently line 41):

```json
    "kicker": "build log",
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "FigureMarker\|reg-mark\|Fig\. 02a" src/components/projects.tsx`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/components/projects.tsx src/messages/en.json
git commit -m "feat(design): migrate Projects section to SectionHeader

Flagship plate drops registration marks; caption reads as an
instrument-panel readout instead of a Fig. label."
```

---

### Task 6: Skills section

**Files:**
- Modify: `src/components/skills.tsx:1,6,27`

**Interfaces:**
- Consumes: `SectionHeader` (Task 2).

- [ ] **Step 1: Swap the import**

Replace line 6:

```tsx
import FigureMarker from "./ui/figure-marker";
```

with:

```tsx
import SectionHeader from "./ui/section-header";
```

- [ ] **Step 2: Swap the usage**

Replace line 27:

```tsx
      <FigureMarker code="FIG. 03" title={t("title")} annotation={t("kicker")} />
```

with:

```tsx
      <SectionHeader kicker={t("kicker")} title={t("title")} />
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "FigureMarker\|FIG\." src/components/skills.tsx`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/skills.tsx
git commit -m "feat(design): migrate Skills section to SectionHeader"
```

---

### Task 7: GitHub section

**Files:**
- Modify: `src/components/github.tsx:1,7,114`

**Interfaces:**
- Consumes: `SectionHeader` (Task 2).

- [ ] **Step 1: Swap the import**

Replace line 7:

```tsx
import FigureMarker from "./ui/figure-marker";
```

with:

```tsx
import SectionHeader from "./ui/section-header";
```

- [ ] **Step 2: Swap the usage**

Replace line 114:

```tsx
      <FigureMarker code="FIG. 04" title={t("title")} annotation={t("kicker")} />
```

with:

```tsx
      <SectionHeader kicker={t("kicker")} title={t("title")} />
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "FigureMarker\|FIG\." src/components/github.tsx`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/github.tsx
git commit -m "feat(design): migrate GitHub section to SectionHeader"
```

---

### Task 8: Contact section

**Files:**
- Modify: `src/components/contact.tsx:1,6,61,90`

**Interfaces:**
- Consumes: `SectionHeader` (Task 2), `.status-dot` utility (Task 1).

- [ ] **Step 1: Swap the import**

Replace line 6:

```tsx
import FigureMarker from "./ui/figure-marker";
```

with:

```tsx
import SectionHeader from "./ui/section-header";
```

- [ ] **Step 2: Swap the header usage**

Replace line 61:

```tsx
      <FigureMarker code="FIG. 05" title={t("title")} annotation={t("kicker")} />
```

with:

```tsx
      <SectionHeader kicker={t("kicker")} title={t("title")} />
```

- [ ] **Step 3: Change the availability status dot from a circle to a square**

Replace line 90:

```tsx
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-signal" aria-hidden />
```

with:

```tsx
            <span className="status-dot animate-signal" aria-hidden />
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "FigureMarker\|FIG\.\|rounded-full bg-accent" src/components/contact.tsx`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/components/contact.tsx
git commit -m "feat(design): migrate Contact section to SectionHeader, square status dot"
```

---

### Task 9: Cleanup - delete FigureMarker and dead CSS

**Files:**
- Delete: `src/components/ui/figure-marker.tsx`

**Interfaces:**
- Consumes: nothing (this task only removes dead code once Tasks 3-8 have migrated every consumer).

- [ ] **Step 1: Confirm no remaining references**

Run: `grep -rn "figure-marker\|FigureMarker" src/`
Expected: no output. If anything is still found, stop and fix that file before deleting - it means a consumer from Tasks 3-8 was missed.

Run: `grep -rn "reg-mark\|tick-rule" src/`
Expected: no output (the CSS classes were removed in Task 1 Step 2, and all JSX usages were removed in Tasks 3 and 5).

- [ ] **Step 2: Delete the file**

```bash
git rm src/components/ui/figure-marker.tsx
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds with no missing-module errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(design): remove FigureMarker, fully retired by SectionHeader"
```

---

### Task 10: Visual QA pass

**Files:** none (verification only, fixes go back into whichever task's files if something is wrong)

**Interfaces:** none.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (in the background, or a separate terminal)

- [ ] **Step 2: Load the site and check every section against `DESIGN.md`**

Open `http://localhost:3000` in a browser (Chromium, per this machine's global Playwright convention if scripted) at a desktop width (~1440px) and a mobile width (~390px). Walk Home, STRATOS, Projects, Skills, GitHub, Contact, footer. For each:
- Confirm the canvas reads neutral near-black (`#09090B`), not the old warm tone.
- Confirm the accent (`#FF7A29`) appears at most once per zone - CTA, active nav item, kicker label, key number.
- Confirm no `FIG.`, no L-corner registration marks, no circular status dot remain anywhere (visually, not just via grep).
- Confirm the hero drone panel has a visible border and the new readout caption.
- Confirm headings render in the new geometric grotesk (Instrument Sans), not the old Bricolage Grotesque.

- [ ] **Step 3: Check `prefers-reduced-motion`**

Enable "reduce motion" in the OS/browser and reload. Confirm reveals collapse to instant (no transform-based motion), per the existing `@media (prefers-reduced-motion: reduce)` block in `globals.css` and `MotionProvider`'s `reducedMotion="user"`.

- [ ] **Step 4: Check for console errors**

Open the browser devtools console. Confirm no errors (missing font 404s, React warnings, hydration mismatches).

- [ ] **Step 5: Run a final production build**

Run: `npm run build`
Expected: succeeds cleanly.

- [ ] **Step 6: Fix anything found, otherwise stop - no commit needed for this task if nothing changed**

If Step 2-4 surfaced an issue, fix it in the relevant component file, re-run `npm run build`, and commit that fix on its own with a description of what was visually wrong (e.g. `fix(design): border missing on hero instrument panel at mobile width`).

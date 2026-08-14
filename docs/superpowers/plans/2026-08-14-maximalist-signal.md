# Maximalist Signal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Push the shipped "Maximalist Headline" design system further toward bekirerdem.dev's energy - bigger type, a visible layered background texture, and a scoped second-accent/gradient/pill exception - without restructuring page flow or copy.

**Architecture:** Pure visual-layer pass on top of the existing Next.js 16 / Tailwind v4 / framer-motion system. No new pages, no new data sources beyond a deterministic generated texture. Color/gradient/pill changes are additive CSS tokens and utility classes consumed by existing components; no component's public props change.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4 (`@theme` in `src/app/globals.css`, no `tailwind.config.*`), framer-motion 12.

**Spec:** `docs/superpowers/specs/2026-08-14-maximalist-signal-design.md`

## Global Constraints

- Second accent color: electric amber `#FF6A39`. Verified 6.99:1 contrast on `#09090B` canvas (exceeds AA for both body and large text).
- Primary accent stays terminal green `#39FF6A` (unchanged, 14.86:1 contrast).
- Gradient use is permitted **only** at two call sites: hero headline second line (text-fill gradient), flagship project panel border (gradient stroke). No gradients anywhere else.
- `rounded-full` pill chrome is permitted **only** for `StatusTag` and `CatalogFilter`. No other component adopts pill shapes.
- Everything else in the repo's global design rules stays in force: no glassmorphism/blur, no purple, flat fills elsewhere, plain copy, no em dashes, no three-card row, animate only `transform`/`opacity`, respect `prefers-reduced-motion`.
- This is a density/scale/motion/color pass only - no section reordering, no copy changes, no new page structure.

---

### Task 1: Color tokens and gradient/pill utility CSS

**Files:**
- Modify: `src/app/globals.css:1-33` (theme block), and append new utilities near the end of the file (after the existing `.row-sweep` block, before `Micro-motion`).

**Interfaces:**
- Produces: CSS custom property `--color-accent-2` (`#FF6A39`), `--color-accent-2-soft` (`rgba(255,106,57,0.12)`); utility classes `.text-gradient-signal` (gradient text-fill, green -> amber, looping) and `.gradient-border` (1px gradient stroke border, green -> amber). Later tasks (3, 5) consume these by class name.

- [ ] **Step 1: Add the second accent token to the `@theme` block**

In `src/app/globals.css`, inside the existing `@theme { ... }` block, right after the `--color-accent-soft` line:

```css
  --color-accent: #39ff6a;
  --color-accent-soft: rgba(57, 255, 106, 0.1);

  /* ── Second accent: electric amber, scoped exception for this pass ──
     Used only for: IN_PROGRESS status color, the hero gradient headline,
     and the flagship panel's gradient border. See DESIGN.md "Scoped
     exceptions" section. Verified 6.99:1 contrast on #09090b. ── */
  --color-accent-2: #ff6a39;
  --color-accent-2-soft: rgba(255, 106, 57, 0.12);
```

- [ ] **Step 2: Add the gradient text and gradient border utilities**

In `src/app/globals.css`, after the `.row-sweep:hover::before { transform: scaleX(1); }` block and before the `/* ── Micro-motion ── */` comment, add:

```css
/* ── Scoped gradient exception (hero headline + flagship panel only) ── */
.text-gradient-signal {
  background: linear-gradient(
    90deg,
    var(--color-accent),
    var(--color-accent-2),
    var(--color-accent)
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 6s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gradient-border {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--color-bg), var(--color-bg)) padding-box,
    linear-gradient(120deg, var(--color-accent), var(--color-accent-2)) border-box;
}
```

Note: `.text-gradient-signal`'s `gradient-shift` animation is already covered by the existing `@media (prefers-reduced-motion: reduce)` block at the bottom of this file (it zeroes `animation-duration` for all elements) - no separate reduced-motion rule needed.

- [ ] **Step 3: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: no errors (this step only touches CSS, but confirms nothing else is broken before continuing).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(design): add amber accent token and scoped gradient utilities"
```

---

### Task 2: Layered background texture (binary field + parallax)

**Files:**
- Create: `src/lib/binary-texture.ts`
- Modify: `src/components/ui/commit-motif.tsx`

**Interfaces:**
- Consumes: none new (existing `CommitEntry` from `@/lib/git-history`).
- Produces: `binaryRows: string[]` exported from `src/lib/binary-texture.ts`, consumed only by `commit-motif.tsx`.

- [ ] **Step 1: Create the deterministic binary texture generator**

Create `src/lib/binary-texture.ts`:

```typescript
const SEED = 1337;
const ROWS = 24;
const COLS = 96;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic binary (0/1) character field, generated once at module
 * load from a fixed seed. Server and client produce identical output -
 * no hydration mismatch, no per-render flicker. Purely decorative.
 */
export const binaryRows: string[] = (() => {
  const rand = mulberry32(SEED);
  const rows: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let row = "";
    for (let c = 0; c < COLS; c++) {
      row += rand() > 0.5 ? "1" : "0";
    }
    rows.push(row);
  }
  return rows;
})();
```

- [ ] **Step 2: Add the binary layer and scroll parallax to the motif component**

Replace the full contents of `src/components/ui/commit-motif.tsx`:

```tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CommitEntry } from "@/lib/git-history";
import { binaryRows } from "@/lib/binary-texture";

/**
 * Two-layer decorative background texture: this repo's own real commit
 * history (visible layer) plus a deterministic binary field (fill layer),
 * each drifting at a different scroll-linked speed for a subtle parallax
 * separation. Purely decorative - aria-hidden, never focusable, sits
 * behind section content (z-index below `main`'s z-index: 2 in globals.css).
 */
export default function CommitMotif({ commits }: { commits: CommitEntry[] }) {
  const { scrollYProgress } = useScroll();
  const commitY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const binaryY = useTransform(scrollYProgress, [0, 1], [0, -260]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {commits.length > 0 && (
        <motion.div
          style={{ y: commitY }}
          className="absolute inset-0 opacity-[0.13] font-mono text-[11px] leading-[1.8] tracking-wide text-ink whitespace-nowrap -rotate-2"
        >
          {commits.map((c, i) => (
            <div key={c.hash + i}>
              {c.hash} {c.message}
            </div>
          ))}
        </motion.div>
      )}
      <motion.div
        style={{ y: binaryY }}
        className="absolute inset-0 opacity-[0.06] font-mono text-[10px] leading-[1.6] tracking-[0.15em] text-ink whitespace-pre rotate-1"
      >
        {binaryRows.join("\n")}
      </motion.div>
    </div>
  );
}
```

Note: the binary layer always renders (it's not gated on `commits.length`, unlike the commit-hash layer) - it has no real-data dependency, so there's nothing to fall back from.

- [ ] **Step 3: Verify types and build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check in dev server**

Run: `npm run dev` (if not already running), then `curl -s http://localhost:3000/ | grep -o 'opacity-\[0\.[0-9]*\]'`
Expected: output includes both `opacity-[0.13]` and `opacity-[0.06]`, confirming both texture layers are present in the rendered HTML.

- [ ] **Step 5: Commit**

```bash
git add src/lib/binary-texture.ts src/components/ui/commit-motif.tsx
git commit -m "feat(design): add layered binary texture with scroll parallax"
```

---

### Task 3: Hero headline scale and gradient second line

**Files:**
- Modify: `src/components/hero.tsx:58-70`

**Interfaces:**
- Consumes: `.text-gradient-signal` class from Task 1 (`src/app/globals.css`).
- Produces: no new exported interface - visual change only, `Hero` keeps its existing no-props signature.

- [ ] **Step 1: Replace the headline block**

In `src/components/hero.tsx`, replace lines 58-70 (the `<h1>...</h1>` block):

```tsx
          {/* Headline - two lines, each unmasking upward. Aggressive
              viewport-filling scale; second line carries the scoped
              gradient exception (green -> amber). */}
          <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                {t("hLine1")}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={lineReveal}
                className="block text-gradient-signal"
              >
                {t("hLine2")}
              </motion.span>
            </span>
          </h1>
```

- [ ] **Step 2: Verify types and build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check in dev server**

Run: `curl -s http://localhost:3000/ | grep -o 'text-gradient-signal'`
Expected: output includes `text-gradient-signal`, confirming the class landed on the second headline line.

- [ ] **Step 4: Commit**

```bash
git add src/components/hero.tsx
git commit -m "feat(design): scale hero headline and add gradient second line"
```

---

### Task 4: Section header scale increase

**Files:**
- Modify: `src/components/ui/section-header.tsx:42-49`

**Interfaces:**
- Consumes: none new.
- Produces: no interface change - `SectionHeader` keeps its existing `{ kicker, title, meta? }` props.

- [ ] **Step 1: Enlarge the title, keep the kicker label's size unchanged**

In `src/components/ui/section-header.tsx`, replace lines 42-49:

```tsx
      <div className="mt-5 overflow-hidden">
        <motion.h2
          variants={lineReveal}
          className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
        >
          {title}
        </motion.h2>
      </div>
```

(The `kicker` span above stays on the existing `.annotate` class untouched - widening the contrast between the small tracked-out label and the now-larger title is the point.)

- [ ] **Step 2: Verify types and build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check in dev server**

Run: `curl -s http://localhost:3000/ | grep -o 'clamp(2.75rem,7vw,5.5rem)'`
Expected: at least one match, confirming the new size landed (section header renders on every section, so it appears once in the server-rendered HTML per section instance).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/section-header.tsx
git commit -m "feat(design): enlarge section header titles relative to kicker"
```

---

### Task 5: Project catalog exceptions (pill status/filter, gradient flagship border, always-visible density)

**Files:**
- Modify: `src/components/ui/catalog-filter.tsx` (full rewrite)
- Modify: `src/components/projects.tsx:46-122` (`Flagship`, `StatusTag`) and `:173-179` (`WorkRow` stats block)

**Interfaces:**
- Consumes: `.gradient-border` class from Task 1.
- Produces: no prop/type changes - `CatalogFilter`'s `{ value, onChange }` props and `StatusTag`'s internal-only usage stay the same shape.

- [ ] **Step 1: Rewrite `CatalogFilter` as a pill segmented control**

Replace the full contents of `src/components/ui/catalog-filter.tsx`:

```tsx
"use client";

const FILTERS = ["ALL", "SHIPPED", "IN_PROGRESS", "ARCHIVED"] as const;
export type CatalogFilterValue = (typeof FILTERS)[number];

const LABELS: Record<CatalogFilterValue, string> = {
  ALL: "ALL",
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

/**
 * Pill-shaped segmented filter control - a scoped exception to the
 * repo-wide no-pill-badge rule (see DESIGN.md "Scoped exceptions").
 * The active segment is filled; inactive segments are plain bordered text.
 */
export default function CatalogFilter({
  value,
  onChange,
}: {
  value: CatalogFilterValue;
  onChange: (value: CatalogFilterValue) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 font-mono text-xs">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`rounded-full px-4 py-1.5 transition-[background-color,color,transform] duration-200 ${
            value === f
              ? "bg-accent text-bg scale-100"
              : "border border-rule text-ink-3 hover:text-ink-2 hover:border-rule-strong"
          }`}
          aria-pressed={value === f}
        >
          {LABELS[f]}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `StatusTag` as a pill with per-status color**

In `src/components/projects.tsx`, replace the `StatusTag` function (lines 110-122):

```tsx
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
```

This drops the separate square dot (redundant once the pill itself is color-coded per status) and removes the now-unused `Project["status"]`-keyed `bg-*` dot logic. `--color-accent-2` needs a matching Tailwind utility - Tailwind v4 auto-generates `bg-accent-2` / `text-accent-2` from the `--color-accent-2` custom property defined in `@theme` (Task 1), same mechanism already producing `bg-accent` from `--color-accent`.

- [ ] **Step 3: Apply the gradient border to the flagship panel**

In `src/components/projects.tsx`, in the `Flagship` component, change the outer `<motion.article>` className (around line 56-58) from:

```tsx
      className="relative border border-rule grid lg:grid-cols-[1fr_0.92fr]"
```

to:

```tsx
      className="gradient-border relative grid lg:grid-cols-[1fr_0.92fr]"
```

- [ ] **Step 4: Make catalog row stats always-visible instead of hover-only**

In `src/components/projects.tsx`, replace the `WorkRow` component's stats block (the `{stats && (...)}` block, lines 173-179):

```tsx
        {stats && (
          <p className="mt-4 font-mono text-[11px] text-ink-3">
            {stats.commitCount} commits · last commit {stats.lastCommitDate}
          </p>
        )}
```

This drops the `max-h-0`/`opacity-0`/hover-reveal wrapper - the row's real per-project commit data (commit count, status) is now always visible, matching the spec's density requirement. Status is already always-visible via the `StatusTag` in the row's left column, unchanged by this step.

- [ ] **Step 5: Verify types and build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual check in dev server**

Run: `curl -s http://localhost:3000/ | grep -o 'rounded-full'`
Expected: multiple matches (filter pills + status pills), confirming the pill exception rendered.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/catalog-filter.tsx src/components/projects.tsx
git commit -m "feat(design): pill status/filter, gradient flagship border, always-visible row density"
```

---

### Task 6: Nav mini scroll-progress bar

**Files:**
- Modify: `src/components/nav.tsx`

**Interfaces:**
- Consumes: none new.
- Produces: no exported interface change - `Nav` and `navItems` keep their existing shape (`navItems` is imported by `mobile-nav.tsx` and stays untouched).

- [ ] **Step 1: Add scroll progress tracking and render a mini bar next to the index chip**

In `src/components/nav.tsx`, add the import and a scroll-progress hook, then render the bar. First, update the imports at the top:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Menu } from "lucide-react";
import MobileNav from "./mobile-nav";
```

Then, inside the `Nav` function, right after the existing `activeSection` state hook (after the `useEffect` blocks, before the `activeNum` line), add:

```tsx
  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });
```

Then, in the JSX, replace the existing index-chip span (the `<span className="hidden sm:inline border border-rule px-1.5 py-0.5 ...">{activeNum}</span>` line) with a wrapping element that adds the mini progress bar beside it:

```tsx
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1">
              <span className="border border-rule px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-ink-3">
                {activeNum}
              </span>
              <span className="relative h-3.5 w-8 border border-rule overflow-hidden">
                <motion.span
                  style={{ scaleX: barScale }}
                  className="absolute inset-0 origin-left bg-accent"
                />
              </span>
            </span>
```

- [ ] **Step 2: Verify types and build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check in dev server**

Run: `curl -s http://localhost:3000/ | grep -c 'origin-left bg-accent'`
Expected: a count of at least 1 (the progress bar's inner span renders server-side at its initial `scaleX` value).

- [ ] **Step 4: Commit**

```bash
git add src/components/nav.tsx
git commit -m "feat(design): add mini scroll-progress bar to nav index chip"
```

---

### Task 7: GitHub numeric readout scale

**Files:**
- Modify: `src/components/github.tsx:125`

**Interfaces:**
- Consumes: none new.
- Produces: no interface change - `GitHub`'s `{ stats }` prop is untouched.

- [ ] **Step 1: Enlarge the three readout panel values**

In `src/components/github.tsx`, change line 125 from:

```tsx
              <dt className="font-display text-4xl md:text-5xl font-semibold text-ink tabular-nums tracking-tight">
```

to:

```tsx
              <dt className="font-display text-6xl md:text-7xl font-semibold text-ink tabular-nums tracking-tight">
```

- [ ] **Step 2: Verify types and build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check in dev server**

Run: `curl -s http://localhost:3000/ | grep -o 'text-6xl md:text-7xl'`
Expected: at least one match.

- [ ] **Step 4: Commit**

```bash
git add src/components/github.tsx
git commit -m "feat(design): enlarge GitHub stat readout numerals"
```

---

### Task 8: DESIGN.md rewrite and final verification pass

**Files:**
- Modify: `DESIGN.md` (full rewrite of sections 1, 2, 3, 4, 6, 7, 8 to reflect this pass; sections 5 unaffected except status tag/filter chrome notes)

**Interfaces:**
- Consumes: none (documentation only).
- Produces: none (documentation only) - this is the plan's final task, no later task depends on it.

- [ ] **Step 1: Rewrite `DESIGN.md`**

Update the document to reflect, at minimum:
- Section 1 (Visual Theme): note the "Maximalist Signal" pass - increased scale, layered texture, scoped color exception - alongside the existing "Maximalist Headline" system description. Density rating moves from 4/10 toward 6/10 (real per-row data now always-visible rather than hover-gated); Motion rating moves from 7/10 to 9/10.
- Section 2 (Color Palette): add `--color-accent-2` (`#FF6A39`, 6.99:1 contrast) with an explicit **"Scoped exceptions"** subsection stating: gradient permitted only at the hero headline second line and the flagship panel border; pill (`rounded-full`) chrome permitted only for `StatusTag` and `CatalogFilter`; both are documented deviations from the repo's global single-accent/no-gradient/no-pill rules, not a global rule change.
- Section 3 (Typography): note the hero headline and section header title sizes now use `clamp()` for viewport-filling scale rather than fixed breakpoint steps.
- Section 4 (Component Stylings): update the `StatusTag` and `Catalog filter` bullets to describe the pill treatment (replacing the old "never `rounded-full`" language for these two components specifically - leave the general no-pill-badge rule intact for everything else); add a bullet for the two-layer background texture (commit-hash layer + deterministic binary field, differing parallax speeds).
- Section 6 (Motion & Interaction): add the hero gradient's continuous loop as the system's one time-based (non-scroll-gated) motion beyond the existing scroll-progress rule and status dot; note the texture layers' parallax.
- Section 7 (Hero Spec): update the headline description to note the `clamp()` scale and the second line's gradient fill.
- Section 8 (Anti-Patterns): add a note directly under the existing "No gradients... no purple" and "no pill clouds" bullets clarifying these are now scoped exceptions for the two named call sites and two named components respectively, not repo-wide bans - link to section 2's "Scoped exceptions" subsection.

Write the full updated file content directly (read the current `DESIGN.md` first, then produce the complete replacement text incorporating the above).

- [ ] **Step 2: Full build verification**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed with no errors or type warnings.

- [ ] **Step 3: Manual golden-path check in dev server**

Run: `npm run dev` (start if not already running), then:
`curl -s http://localhost:3000/ -o /tmp/maximalist-signal-check.html && grep -o 'text-gradient-signal\|gradient-border\|rounded-full\|bg-accent-2' /tmp/maximalist-signal-check.html | sort | uniq -c`

Expected: non-zero counts for all four patterns, confirming the gradient headline, gradient flagship border, pill chrome, and second accent color all render in the actual page output. Then visually skim the raw HTML for the binary texture rows (`grep -c "1001\|0110"` or similar - the binary layer's generated content) to confirm it's present.

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): document maximalist signal pass and scoped exceptions"
```

---

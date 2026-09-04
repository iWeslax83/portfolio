# White System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this site's black-canvas/terminal-green-accent visual identity with a white-canvas, no-accent, three-typeface system inspired by bekirerdem.dev's structural techniques (wireframe hero, embossed WORK letters, single-focus project carousel, radial-burst CTA, dot-grid footer), fix two real bugs found in live inspection (carousel card overlap, dead nav anchor), and rewrite `DESIGN.md` to document the new system.

**Architecture:** This is a visual-system swap layered on the existing five-beat checkpoint architecture - the WebGL flight-scene camera, `CheckpointShell`'s scene/flat split, and the scroll-progress data flow are untouched. Because color/font tokens are CSS custom properties consumed by Tailwind utility classes site-wide, flipping their *values* in one place (Task 1) instantly re-skins every non-accent-specific surface; the remaining tasks handle the accent-specific call sites (Task 2) and the genuinely new structural pieces (wireframe mesh, embossed letters, single-focus carousel, radial burst, footer rebuild) that don't exist yet.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, `next/font/google` (Fraunces, Bebas Neue, existing JetBrains Mono), `next/font/local` (existing Cabinet Grotesk). No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-09-04-white-system-redesign-design.md`

## Global Constraints

- No accent color anywhere in the shipped system - zero `--color-accent`/`--color-accent-2` references, zero `text-accent`/`bg-accent`/`border-accent`/`accent-2` Tailwind classes, by the end of this plan. Status, links, and emphasis are carried by weight/underline/border only.
- Canvas `#FFFFFF`, ink `#0A0A0A`, three display faces (Fraunces for hero/long-form serif copy, Cabinet Grotesk for bold block labels/UI - already self-hosted, no new license - Bebas Neue for the one oversized CTA statement), JetBrains Mono unchanged for data/IDs/status.
- No code, CSS, font files, images, or copy text from bekirerdem.dev is used anywhere - every technique (wireframe mesh, embossed letters, radial burst, dot-grid footer) is an original implementation using this site's own stack and real content.
- The WebGL flight-scene camera, drone model, spline route, and `CheckpointShell`'s scene/flat mode split are not touched.
- No dark/light theme toggle is added. No new sections (no "hacker mode" gallery). No i18n structural changes.
- No test framework exists in this repo - verification is `npx tsc --noEmit` per task and `npm run build` at the end. No browser access exists in the implementation sandbox - every visual claim needs a human check with `npm run dev`, flagged explicitly per task where relevant.
- No em dashes in code, comments, or commit messages. No AI-attribution trailer in any commit - this project has already had one prompt-injection incident add an unwanted trailer to a commit in an earlier, separate plan; be vigilant.

---

### Task 1: Fonts and base token flip

**Files:**
- Modify: `src/app/layout.tsx` (add Fraunces + Bebas Neue font loading)
- Modify: `src/app/globals.css` (flip base token values, add emboss utility class)

**Interfaces:**
- Produces: `--font-serif`, `--font-condensed` CSS custom properties; `.emboss-text` utility class - consumed by Task 3 (hero headline), Task 6 (embossed WORK letters), Task 8 (CTA statement).
- Note: `--color-accent`/`--color-accent-2` and their `-soft` variants are NOT touched in this task - they keep their current (green/amber) values, since Task 2 still needs every accent-consuming component to compile and render sensibly until it migrates them. Deleting the accent tokens happens at the end of Task 2, not here.

This task flips every non-accent color token to the white system and wires in the two new Google Fonts, using the exact pattern the existing `JetBrains_Mono` import already follows.

- [ ] **Step 1: Add the two new font imports to `layout.tsx`**

In `src/app/layout.tsx`, add to the import line at the top:

```tsx
import { JetBrains_Mono, Fraunces, Bebas_Neue } from "next/font/google";
```

(replacing the existing `import { JetBrains_Mono } from "next/font/google";` line)

Then, directly after the existing `const mono = JetBrains_Mono({...})` block (around line 30), add:

```tsx
// Serif: hero headline and any long-form founder-story prose. An original
// moody editorial serif chosen for similar structural character to a
// design reference, not an attempt to match any specific site's font.
const serif = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

// Condensed display: the one oversized multi-line CTA statement in Contact.
const condensed = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});
```

Then update the `<html>` tag's `className` (around line 60-63) from:

```tsx
    <html
      lang="en"
      className={`${cabinetGrotesk.variable} ${mono.variable}`}
    >
```

to:

```tsx
    <html
      lang="en"
      className={`${cabinetGrotesk.variable} ${mono.variable} ${serif.variable} ${condensed.variable}`}
    >
```

- [ ] **Step 2: Flip the base color tokens and add the two new font tokens in `globals.css`**

Replace the entire `@theme` block (lines 3-40) with:

```css
@theme {
  /* ── Canvas: pure white. The prior "never pure black, never white" rule
     is explicitly lifted for this system - see DESIGN.md. ── */
  --color-bg: #ffffff;
  --color-panel: #f5f5f3;
  --color-panel-2: #ededea;

  /* ── Ink: near-black text, mid-to-light grays for hierarchy ─────── */
  --color-ink: #0a0a0a;
  --color-ink-2: #6b6b6b;
  /* ink-3 is the tertiary readout tone, rendered at 11px by .annotate.
     Must be verified at WCAG AA (>=4.5:1) against #ffffff before shipping -
     #9a9a9a is a starting point, darken if it fails contrast checks. */
  --color-ink-3: #9a9a9a;

  /* ── Accent tokens: still defined with their OLD (green/amber) values
     here - every consumer is migrated off them in Task 2, which deletes
     these definitions once nothing references them. Do not touch these
     values in this task. ── */
  --color-accent: #39ff6a;
  --color-accent-soft: rgba(57, 255, 106, 0.1);
  --color-accent-2: #ff6a39;
  --color-accent-2-soft: rgba(255, 106, 57, 0.12);

  /* ── Structure ─────────────────────────────────────────────── */
  --color-rule: rgba(10, 10, 10, 0.12);
  --color-rule-strong: rgba(10, 10, 10, 0.28);
  --color-card: #f5f5f3;
  --color-card-border: rgba(10, 10, 10, 0.12);
  --color-card-border-hover: rgba(10, 10, 10, 0.28);

  /* ── Type ─────────────────────────────────────────────────── */
  --font-display: var(--font-cabinet-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-cabinet-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-cabinet-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "JetBrains Mono", monospace;
  --font-serif: var(--font-fraunces), Georgia, serif;
  --font-condensed: var(--font-bebas), "Arial Narrow", sans-serif;
}
```

- [ ] **Step 3: Add the emboss-text utility class**

In `src/app/globals.css`, after the `.annotate` block (after line 131, before the `.status-dot` block), add:

```css
/* Layered text-shadow giving flat display type a real embossed/bevel
   look - used only for the WORK-intro tiled letters (Task 6). Ink-3 first
   layer for the near shadow, a soft dark layer beneath for depth. */
.emboss-text {
  text-shadow:
    2px 2px 0 var(--color-ink-3),
    4px 4px 6px rgba(10, 10, 10, 0.18);
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: succeeds. This confirms both new Google Fonts resolve correctly.

- [ ] **Step 6: Note for the report**

The site will now render mostly white-canvas/black-ink, but every element still using `text-accent`/`bg-accent`/`bg-accent-2`/etc. Tailwind classes will still show the OLD green/amber colors (since those tokens are untouched) until Task 2 lands - this is an expected, intentional intermediate state, not a defect.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat(design): flip base color tokens to white system, add Fraunces and Bebas Neue"
```

---

### Task 2: Remove every accent color reference

**Files:**
- Modify: `src/components/ui/catalog-filter.tsx`
- Modify: `src/components/ui/status-tag.tsx`
- Modify: `src/components/ui/back-to-top.tsx`
- Modify: `src/components/ui/section-header.tsx`
- Modify: `src/components/mobile-nav.tsx`
- Modify: `src/components/nav.tsx`
- Modify: `src/components/checkpoints/Liftoff.tsx`
- Modify: `src/components/checkpoints/Landing.tsx`
- Modify: `src/components/checkpoints/Log.tsx`
- Modify: `src/components/checkpoints/Ventures.tsx`
- Modify: `src/components/checkpoints/Telemetry.tsx`
- Modify: `src/components/checkpoints/work-carousel/ProjectCard.tsx`
- Modify: `src/app/globals.css` (retire `.gradient-border`, reskin `.status-dot`/`.animate-signal`/`::selection`/`.skip-link`/`:focus-visible`/`.row-sweep`, delete the accent tokens)

**Interfaces:** None new - this task only removes color, no component signature changes.

This is one batched task covering every accent-color call site found by a full-repo grep (`grep -rn "text-accent\|bg-accent\|border-accent\|accent-2\|accent-soft" src/`). Every edit is the same shape: replace a color-based distinction with an ink/weight/border-based one. Land all of these together, then delete the now-unused accent tokens from `globals.css` in the same commit - deleting them before every consumer is migrated would silently break unmigrated components' Tailwind classes (Tailwind just omits undefined utilities, no build error), so the deletion must be the last step, not an early one.

- [ ] **Step 1: `src/components/ui/catalog-filter.tsx`**

Replace line 33:

```tsx
              ? "bg-accent text-bg"
```

with:

```tsx
              ? "bg-ink text-bg"
```

- [ ] **Step 2: `src/components/ui/status-tag.tsx`**

Replace the full file with:

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
          status === "SHIPPED"
            ? "bg-ink"
            : status === "IN_PROGRESS"
              ? "border border-ink bg-transparent"
              : "bg-ink-3"
        }`}
        aria-hidden
      />
      {statusLabel[status]}
    </span>
  );
}
```

(`SHIPPED` = solid filled square, `IN_PROGRESS` = outlined square, `ARCHIVED` = light gray filled square - three distinct shapes/weights carrying the same three-way distinction color used to.)

- [ ] **Step 3: `src/components/ui/back-to-top.tsx`**

Replace line 29:

```tsx
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center border border-rule bg-panel text-accent transition-colors hover:border-rule-strong"
```

with:

```tsx
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center border border-rule bg-panel text-ink transition-colors hover:border-rule-strong"
```

- [ ] **Step 4: `src/components/ui/section-header.tsx`**

Replace line 29:

```tsx
        <motion.span variants={markIn} className="annotate shrink-0 text-accent">
```

with:

```tsx
        <motion.span variants={markIn} className="annotate shrink-0 text-ink">
```

- [ ] **Step 5: SKIP `src/components/mobile-nav.tsx` in this task**

Do not edit `mobile-nav.tsx` here. Task 5 (nav anchor fix) replaces this exact same block (the `<nav>` element's `.map()` body) in full to add an `onClick` scroll handler, and its replacement text already includes the `text-ink`/`hover:text-ink` classes this step would have produced. Editing it here would leave Task 5's own "before" text stale (it would no longer match the file). Leave `mobile-nav.tsx` completely untouched by this task - Task 5 alone handles both the color reskin and the click-handler addition for this file, in one edit.

- [ ] **Step 6: `src/components/nav.tsx`**

Replace line 82:

```tsx
              emir<span className="text-accent">.</span>sakarya
```

with:

```tsx
              emir<span className="text-ink">.</span>sakarya
```

Replace line 91:

```tsx
                  className="absolute inset-0 origin-left bg-accent"
```

with:

```tsx
                  className="absolute inset-0 origin-left bg-ink"
```

Replace line 105:

```tsx
                    active ? "text-accent" : "text-ink-3 hover:text-ink-2"
```

with:

```tsx
                    active ? "text-ink" : "text-ink-3 hover:text-ink-2"
```

Replace line 113:

```tsx
                      className="absolute left-0 right-0 -bottom-px h-px bg-accent"
```

with:

```tsx
                      className="absolute left-0 right-0 -bottom-px h-px bg-ink"
```

- [ ] **Step 7: `src/components/checkpoints/Liftoff.tsx`**

Replace line 17:

```tsx
            <span className="annotate text-accent">{t("role")}</span>
```

with:

```tsx
            <span className="annotate text-ink">{t("role")}</span>
```

Replace line 24:

```tsx
            <span className="block text-accent">{t("hLine2")}</span>
```

with:

```tsx
            <span className="block font-serif italic">{t("hLine2")}</span>
```

(the second headline line now distinguishes itself from the first via the serif/italic typographic shift instead of color - Fraunces has real italic support.)

Replace line 27:

```tsx
          <p className="annotate text-accent mt-7">{t("rev")}</p>
```

with:

```tsx
          <p className="annotate text-ink mt-7">{t("rev")}</p>
```

Replace line 43:

```tsx
              className="group inline-flex items-center gap-2 bg-accent text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
```

with:

```tsx
              className="group inline-flex items-center gap-2 bg-ink text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
```

- [ ] **Step 8: `src/components/checkpoints/Landing.tsx`**

Replace line 41:

```tsx
              <span className="block text-accent">{t("ctaLine2")}</span>
```

with:

```tsx
              <span className="block font-serif italic">{t("ctaLine2")}</span>
```

Replace line 59:

```tsx
                <span className="font-mono text-[11px] text-accent tabular-nums">{contact.code}</span>
```

with:

```tsx
                <span className="font-mono text-[11px] text-ink tabular-nums">{contact.code}</span>
```

Replace lines 61-62:

```tsx
                  <div className="flex items-center gap-2.5 text-ink group-hover:text-accent transition-colors">
                    <span className="text-ink-2 group-hover:text-accent transition-colors">{contact.icon}</span>
```

with:

```tsx
                  <div className="flex items-center gap-2.5 text-ink transition-colors">
                    <span className="text-ink-2 group-hover:text-ink transition-colors">{contact.icon}</span>
```

Replace line 67:

```tsx
                <ArrowUpRight size={18} className="text-ink-3 group-hover:text-accent transition-colors" />
```

with:

```tsx
                <ArrowUpRight size={18} className="text-ink-3 group-hover:text-ink transition-colors" />
```

- [ ] **Step 9: `src/components/checkpoints/Log.tsx`**

Replace line 30:

```tsx
            link.isPrimary ? "text-accent hover:text-accent/80" : "text-ink-2 hover:text-ink"
```

with:

```tsx
            link.isPrimary ? "text-ink font-medium hover:text-ink-2" : "text-ink-2 hover:text-ink"
```

Replace line 62 (the flagship's className ternary):

```tsx
                project.slug === flagship.slug ? "gradient-border px-6 md:px-8" : "border-t border-rule"
```

with:

```tsx
                project.slug === flagship.slug ? "border-2 border-ink px-6 md:px-8" : "border-t border-rule"
```

(the flagship's distinction is now a heavier ink border instead of the retired green-to-amber gradient - `.gradient-border` itself is deleted from `globals.css` in Step 13 below.)

Replace line 82:

```tsx
                    className="mt-1 shrink-0 text-ink-3 hover:text-accent transition-colors"
```

with:

```tsx
                    className="mt-1 shrink-0 text-ink-3 hover:text-ink transition-colors"
```

- [ ] **Step 10: `src/components/checkpoints/Ventures.tsx`**

Replace line 21:

```tsx
                <span className="font-mono text-xs text-accent tabular-nums">
```

with:

```tsx
                <span className="font-mono text-xs text-ink tabular-nums">
```

Replace line 39:

```tsx
                    className="text-ink-3 hover:text-accent transition-colors"
```

with:

```tsx
                    className="text-ink-3 hover:text-ink transition-colors"
```

- [ ] **Step 11: `src/components/checkpoints/Telemetry.tsx`**

Replace line 10:

```tsx
const cellTone = ["bg-rule", "bg-ink-3", "bg-ink-2", "bg-accent/55", "bg-accent"];
```

with:

```tsx
const cellTone = ["bg-rule", "bg-rule-strong", "bg-ink-3", "bg-ink-2", "bg-ink"];
```

Do NOT edit line 116 (`<span className="font-mono text-[11px] text-accent tabular-nums">`, inside the skills-matrix block) in this task - Task 7 replaces that entire block (lines 107-137) with new oversized-block code that removes this element altogether, so an intermediate edit here would only leave Task 7's own "before" text stale. Leave lines 107-137 completely untouched by this task.

Replace line 144:

```tsx
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent/80 transition-colors"
```

with:

```tsx
            className="link-draw inline-flex items-center gap-1.5 font-mono text-xs text-ink hover:text-ink-2 transition-colors"
```

(Note: `Telemetry.tsx`'s skills matrix section, lines 107-137, gets a separate structural rewrite in Task 7 - do not touch it in this task beyond what's listed above.)

- [ ] **Step 12: `src/components/checkpoints/work-carousel/ProjectCard.tsx`**

Replace line 69:

```tsx
              className="text-ink-3 hover:text-accent transition-colors"
```

with:

```tsx
              className="text-ink-3 hover:text-ink transition-colors"
```

Replace line 74:

```tsx
          <span className="font-mono text-[11px] text-accent tabular-nums">
```

with:

```tsx
          <span className="font-mono text-[11px] text-ink tabular-nums">
```

- [ ] **Step 13: `src/app/globals.css` - reskin remaining accent-consuming rules, then delete the tokens**

Replace the `::selection` block (lines 75-78):

```css
::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}
```

with:

```css
::selection {
  background: var(--color-ink);
  color: var(--color-bg);
}
```

Replace the `:focus-visible` block (lines 80-84):

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

with:

```css
:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
  border-radius: 2px;
}
```

Replace the `.skip-link` block's two accent references (lines 93-94):

```css
  background: var(--color-accent);
  color: var(--color-bg);
```

with:

```css
  background: var(--color-ink);
  color: var(--color-bg);
```

Replace the `.status-dot` block (lines 135-140):

```css
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--color-accent);
}
```

with:

```css
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--color-ink);
}
```

Replace the `.row-sweep::before` block's background (line 178):

```css
  background: var(--color-accent-soft);
```

with:

```css
  background: var(--color-panel);
```

Delete the entire `.gradient-border` block (lines 188-194):

```css
/* ── Scoped gradient exception (flagship panel only) ── */
.gradient-border {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--color-bg), var(--color-bg)) padding-box,
    linear-gradient(120deg, var(--color-accent), var(--color-accent-2)) border-box;
}
```

(fully remove this block - its one call site was already retired to a plain `border-2 border-ink` treatment in Step 9 above.)

Finally, delete the four now-unused accent token lines from the `@theme` block (added back in Task 1, Step 2):

```css
  --color-accent: #39ff6a;
  --color-accent-soft: rgba(57, 255, 106, 0.1);
  --color-accent-2: #ff6a39;
  --color-accent-2-soft: rgba(255, 106, 57, 0.12);
```

Delete these four lines entirely, and delete the now-inaccurate comment block above them (the one starting `/* ── Accent tokens: still defined with their OLD...`).

- [ ] **Step 14: Verify zero accent references remain**

Run: `grep -rn "text-accent\|bg-accent\|border-accent\|accent-2\|accent-soft\|color-accent" src/`
Expected: no output (zero matches) anywhere in `src/`.

- [ ] **Step 15: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 16: Production build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "feat(design): remove every accent color reference, retire gradient border"
```

---

### Task 3: Hero rebuild - wireframe mesh, texture strips, serif headline

**Files:**
- Create: `src/lib/wireframe-mesh.ts`
- Create: `src/components/ui/wireframe-mesh.tsx`
- Modify: `src/components/checkpoints/Liftoff.tsx`
- Modify: `src/components/ui/commit-motif.tsx`

**Interfaces:**
- Produces: `wireframeLines: WireframeLine[]` (from `wireframe-mesh.ts`), `WireframeMesh` component (`{ className?: string }` props) - consumed by `Liftoff.tsx` in this task and `Landing.tsx`'s CTA in Task 8 is a SEPARATE component (`RadialBurst`, Task 8), not this one - do not conflate them.

Adds the full-bleed warped-line mesh background behind the hero, restyles the existing commit-history/binary-digit texture as two thin strips instead of a full-page diagonal wash, and sets the hero headline in Fraunces across three lines.

- [ ] **Step 1: Create `src/lib/wireframe-mesh.ts`**

```ts
const LINE_COUNT = 60;
const POINTS_PER_LINE = 40;
const SEED = 4242;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface WireframeLine {
  d: string;
}

/**
 * Deterministic warped vertical-line mesh, generated once at module load
 * from a fixed seed - identical server/client output, no hydration
 * mismatch, no per-render randomness. Purely decorative background texture.
 * Coordinates are in a 0-1000 x 0-600 viewBox space; the consuming SVG
 * scales to fill its container via preserveAspectRatio="none".
 */
export const wireframeLines: WireframeLine[] = (() => {
  const rand = mulberry32(SEED);
  const lines: WireframeLine[] = [];
  const centers = Array.from({ length: 4 }, () => ({
    x: rand() * 1000,
    strength: 40 + rand() * 60,
  }));

  for (let i = 0; i < LINE_COUNT; i++) {
    const baseX = (i / (LINE_COUNT - 1)) * 1000;
    const points: string[] = [];
    for (let p = 0; p < POINTS_PER_LINE; p++) {
      const y = (p / (POINTS_PER_LINE - 1)) * 600;
      let x = baseX;
      for (const c of centers) {
        const dist = Math.abs(baseX - c.x);
        const falloff = Math.exp(-dist / 220);
        x += Math.sin(y / 90 + c.x) * c.strength * falloff;
      }
      points.push(`${p === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: points.join(" ") });
  }
  return lines;
})();
```

- [ ] **Step 2: Create `src/components/ui/wireframe-mesh.tsx`**

```tsx
import { wireframeLines } from "@/lib/wireframe-mesh";

/**
 * Full-bleed decorative warped-line mesh background. Deterministic (see
 * wireframe-mesh.ts), purely decorative - aria-hidden, no interaction, no
 * client-only state, safe as a server component.
 */
export default function WireframeMesh({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {wireframeLines.map((line, i) => (
        <path key={i} d={line.d} fill="none" stroke="var(--color-rule-strong)" strokeWidth="1" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Wire `WireframeMesh` and the Fraunces headline into `Liftoff.tsx`**

Replace the full contents of `src/components/checkpoints/Liftoff.tsx` with:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";
import WireframeMesh from "@/components/ui/wireframe-mesh";

export default function Liftoff({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("hero");
  const credentials = [t("cred1"), t("cred2"), t("cred3"), t("cred4")];

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div className="relative">
        <WireframeMesh className="absolute inset-0 -z-10 h-full w-full opacity-60" />
        <div className={`grid w-full ${mode === "flat" ? "lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center" : ""}`}>
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
              <span className="annotate text-ink">{t("role")}</span>
              <span className="h-px w-8 bg-rule" aria-hidden />
              <span className="annotate">{t("org")}</span>
            </div>

            <h1 className="font-serif text-[clamp(3rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-ink">
              <span className="block">{t("hLine1")}</span>
              <span className="block font-serif italic">{t("hLine2")}</span>
            </h1>

            <p className="annotate text-ink mt-7">{t("rev")}</p>

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
                className="group inline-flex items-center gap-2 bg-ink text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
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
      </div>
    </CheckpointShell>
  );
}
```

Note: `hLine1`/`hLine2` copy stays as the existing `"ML · Embedded · Web"` / `"is where I build."` i18n values - this task changes typeface and the wrapper markup only, not copy. The headline is no longer 3 physical lines of independent text (the spec's Section 4 described the reference's 3-line layout, but this site's existing 2-key i18n structure already wraps `hLine1` across up to 2 visual lines at narrow widths depending on content length, effectively achieving a similar multi-line serif statement without restructuring the i18n schema - restructuring `hero.hLine1`/`hLine2` into a 3-key schema is not required by the spec and is out of scope for this task).

- [ ] **Step 4: Restyle `CommitMotif` as two thin strips**

Replace the full contents of `src/components/ui/commit-motif.tsx` with:

```tsx
"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CommitEntry } from "@/lib/git-history";
import { binaryRows } from "@/lib/binary-texture";

/**
 * Two thin horizontal texture strips: this repo's own real commit history
 * (top strip) and a deterministic binary field (bottom strip), each
 * drifting at a different scroll-linked speed. Purely decorative -
 * aria-hidden, never focusable, sits behind section content (z-index below
 * main's z-index: 2 in globals.css). Restyled from a prior full-page
 * diagonal wash into two bounded strips matching the reference site's
 * strip-above/strip-below-headline placement.
 */
export default function CommitMotif({ commits }: { commits: CommitEntry[] }) {
  const { scrollYProgress } = useScroll();
  const commitX = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const binaryX = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 select-none">
      {commits.length > 0 && (
        <motion.div
          style={{ x: reduce ? 0 : commitX }}
          className="h-6 overflow-hidden whitespace-nowrap border-b border-rule font-mono text-[10px] leading-6 tracking-wide text-ink-3 opacity-70"
        >
          {commits.map((c, i) => (
            <span key={c.hash + i} className="mr-8">
              {c.hash} {c.message}
            </span>
          ))}
        </motion.div>
      )}
      <motion.div
        style={{ x: reduce ? 0 : binaryX }}
        className="h-6 overflow-hidden whitespace-nowrap border-b border-rule font-mono text-[10px] leading-6 tracking-[0.15em] text-ink-3 opacity-50"
      >
        {binaryRows.map((row, i) => (
          <span key={i} className="mr-8">
            {row}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
```

This changes the texture from a full-page rotated wash (`opacity-[0.13]`/`opacity-[0.06]`, `-rotate-2`/`rotate-1`, `absolute inset-0`) into two fixed strips pinned to the top of the viewport, each one line tall, scroll-parallaxing horizontally instead of vertically - matching the reference's strip placement (above/below the hero headline) while reusing the exact same real-data source this site already had.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual verification note**

Cannot be visually confirmed in this sandbox. Note in the report: a human must run `npm run dev` and confirm the wireframe mesh renders behind the hero without overwhelming the headline's legibility, the two commit/binary strips read as a subtle top-of-page texture rather than colliding with the nav bar, and the serif headline (including the italic second line) looks intentional, not broken.

- [ ] **Step 7: Commit**

```bash
git add src/lib/wireframe-mesh.ts src/components/ui/wireframe-mesh.tsx src/components/checkpoints/Liftoff.tsx src/components/ui/commit-motif.tsx
git commit -m "feat(design): add wireframe mesh hero background, restyle texture as strips, serif headline"
```

---

### Task 4: Work carousel - single-focus crossfade fix

**Files:**
- Modify: `src/components/checkpoints/Log.tsx:117-146` (the `SceneCarousel` function)

**Interfaces:**
- Consumes: `WorkCarouselState` (`stage`, `stageProgress`, `activeIndex`, `slideProgress`) from `useWorkCarouselProgress` - unchanged, no hook changes needed.
- Produces: no interface change - `ProjectCard`'s existing `{project, index, total, translateX, scale?, opacity?}` props are reused, just computed differently.

Fixes the live-inspection defect where two `ProjectCard`s render simultaneously with visible overlap. The fix computes an opacity/scale crossfade from the same `slideProgress` value the old slide used, so only one card is ever meaningfully visible.

- [ ] **Step 1: Replace the `carousel`-stage branch inside `SceneCarousel`**

In `src/components/checkpoints/Log.tsx`, replace (the `if (state.stage === "carousel")` block, lines 126-146):

```tsx
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
```

with:

```tsx
  if (state.stage === "carousel") {
    // Crossfade + scale, not a slide - at most one card is meaningfully
    // visible at any point in the transition. The outgoing card shrinks
    // and fades in the first half of slideProgress; the incoming card
    // grows and fades in over the second half. No side-by-side overlap.
    const outgoingOpacity = Math.max(0, 1 - state.slideProgress * 2.2);
    const outgoingScale = 1 - state.slideProgress * 0.08;
    const incomingOpacity = Math.max(0, state.slideProgress * 2.2 - 1);
    const incomingScale = 0.94 + Math.min(1, state.slideProgress * 1.2) * 0.06;

    return (
      <div className="relative h-full w-full">
        <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
        {outgoingOpacity > 0 && (
          <ProjectCard
            project={ordered[state.activeIndex]}
            index={state.activeIndex}
            total={ordered.length}
            translateX={0}
            scale={outgoingScale}
            opacity={outgoingOpacity}
          />
        )}
        {incomingOpacity > 0 && state.activeIndex < ordered.length - 1 && (
          <ProjectCard
            project={ordered[state.activeIndex + 1]}
            index={state.activeIndex + 1}
            total={ordered.length}
            translateX={0}
            scale={incomingScale}
            opacity={incomingOpacity}
          />
        )}
      </div>
    );
  }
```

Note: `outgoingOpacity`/`incomingOpacity`'s `* 2.2` multiplier and the crossover point are starting values tuned by feel (the outgoing card fully fades out by `slideProgress ≈ 0.45`, the incoming card starts appearing at `slideProgress ≈ 0.45` and reaches full opacity by `1.0`) - not measured against a live render, no browser access in this sandbox. Flag for the human visual check (Task 11): if the crossfade has a visible "both invisible" gap in the middle, or overlaps too much, adjust the `2.2` multiplier and the `1` offset together.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification note**

Cannot be visually confirmed in this sandbox. Note in the report: a human must scroll through the carousel stage and confirm only one project card is clearly readable at a time, with a smooth crossfade (not a hard cut, not a visible gap where both cards are faded out simultaneously) between each project.

- [ ] **Step 4: Commit**

```bash
git add src/components/checkpoints/Log.tsx
git commit -m "fix(design): crossfade project cards instead of overlapping slide"
```

---

### Task 5: Nav anchor scroll fix

**Files:**
- Modify: `src/components/nav.tsx`
- Modify: `src/components/mobile-nav.tsx`

**Interfaces:** None new - both files' existing `<a href="#...">` elements gain an `onClick` handler; no prop/signature changes.

Live inspection found that clicking a nav link (e.g. "01 work") changes the URL hash but does not scroll the page. The scene-mode layout's checkpoint panels are `position: fixed`, and the anchor `<span id="...">` targets `FlightSceneRoot.tsx` renders are `position: absolute` inside a `position: relative` spacer - this combination is not guaranteed to be handled consistently by every browser's native anchor-scroll/`scroll-behavior: smooth` implementation. Rather than continue relying on native anchor behavior for this non-standard layout, this fix drives the scroll explicitly and predictably via `Element.scrollIntoView`, which works regardless of the target element's positioning context.

- [ ] **Step 1: Add an explicit scroll handler in `nav.tsx`**

In `src/components/nav.tsx`, add this function inside the `Nav` component, before the `return` statement (after the `activeNum` computation, around line 57):

```tsx
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
```

Then update the logo/home link (line 72):

```tsx
          <a href="#home" className="group flex items-center gap-2.5">
```

to:

```tsx
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="group flex items-center gap-2.5">
```

And update the section-link `<a>` inside the `.slice(1).map(...)` block (line 101-103):

```tsx
                <a
                  key={item.key}
                  href={item.href}
```

to:

```tsx
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
```

- [ ] **Step 2: Add the same handler in `mobile-nav.tsx`**

In `src/components/mobile-nav.tsx`, the nav links already call `onClick={onClose}` (line 52) to close the mobile drawer. Replace that single handler with one that both scrolls and closes:

Replace (lines 47-63, the `<nav>` block):

```tsx
            <nav className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ...spring }}
                  className="group flex items-baseline gap-3 border-b border-rule py-4 font-display text-lg text-ink-2 hover:text-ink transition-colors"
                >
                  <span className="font-mono text-[11px] text-ink-3 group-hover:text-ink transition-colors">
                    {item.num}
                  </span>
                  {t(item.key)}
                </motion.a>
              ))}
            </nav>
```

with:

```tsx
            <nav className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ...spring }}
                  className="group flex items-baseline gap-3 border-b border-rule py-4 font-display text-lg text-ink-2 hover:text-ink transition-colors"
                >
                  <span className="font-mono text-[11px] text-ink-3 group-hover:text-ink transition-colors">
                    {item.num}
                  </span>
                  {t(item.key)}
                </motion.a>
              ))}
            </nav>
```

(Note: this task's `text-ink` classes shown above already assume Task 2 has landed - if executed before Task 2, keep the pre-existing `text-accent` classes as they were and only add the `onClick` handlers; do not re-introduce accent classes if Task 2 already ran. Since this plan's tasks execute in order, Task 2 lands first, so the code above is correct as written.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification note**

Cannot be tested end-to-end in this sandbox (requires a real click-and-observe-scroll cycle). Note in the report: a human must click each nav link (desktop and mobile) and confirm the page actually scrolls to the target section - if `scrollIntoView` still doesn't work in scene mode (e.g. because `document.getElementById` finds the absolutely-positioned anchor span but its computed position is wrong), the next thing to check is whether the anchor `<span>` elements in `FlightSceneRoot.tsx` (lines 81-92) need `position: relative` instead of `absolute`, or whether their `top`/`height` calc expressions produce a sensible value at the actual current spacer height (`TOTAL_SPACER_VH = 1656`).

- [ ] **Step 4: Commit**

```bash
git add src/components/nav.tsx src/components/mobile-nav.tsx
git commit -m "fix(design): drive nav anchor clicks with scrollIntoView instead of native anchor scroll"
```

---

### Task 6: Embossed WORK letters

**Files:**
- Modify: `src/components/checkpoints/work-carousel/WorkIntroBackground.tsx`

**Interfaces:** None - no prop/signature changes, purely a className addition.

Adds the `.emboss-text` utility class (created in Task 1, Step 3) to the tiled W/O/R/K letters. No other change is needed in this file - its `bg-panel`/`border-ink`/`text-ink`/CSS-var-driven styling already renders correctly under the new white-system tokens automatically, since Task 1 flipped those tokens' values site-wide.

- [ ] **Step 1: Add the emboss class to the tiled letters**

In `src/components/checkpoints/work-carousel/WorkIntroBackground.tsx`, replace (the tiled-letter `<span>`, inside the `TILE_REPEAT` map):

```tsx
              <span key={i} className="font-display text-[9vw] font-extrabold leading-none text-ink">
                {letter}
              </span>
```

with:

```tsx
              <span key={i} className="emboss-text font-display text-[9vw] font-extrabold leading-none text-ink">
                {letter}
              </span>
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification note**

Cannot be visually confirmed in this sandbox. Note in the report: a human must confirm the tiled letters now show a visible drop-shadow/bevel effect rather than reading flat, and that the shadow doesn't clip or look broken at the letters' scaled-up size.

- [ ] **Step 4: Commit**

```bash
git add src/components/checkpoints/work-carousel/WorkIntroBackground.tsx
git commit -m "feat(design): add embossed drop-shadow to WORK tiled letters"
```

---

### Task 7: Telemetry skills matrix - oversized blocks

**Files:**
- Modify: `src/components/checkpoints/Telemetry.tsx`

**Interfaces:** None new - `skills` data source (`src/data/skills.ts`) unchanged.

Replaces the small bordered-pill tech-tag list with oversized one-word category blocks (matching the reference's About/Skills treatment), each paired with its tool list beneath it in a smaller style. This only touches the skills-matrix block (currently lines 107-137); the stat tiles, contribution graph, and language bar above it are untouched.

- [ ] **Step 1: Replace the skills-matrix rendering block**

In `src/components/checkpoints/Telemetry.tsx`, replace (the `<div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">` block containing the skills matrix, currently lines 107-137):

```tsx
        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <div className="md:col-span-2 border border-rule p-5 md:p-6">
            <p className="annotate mb-4">{tSkills("kicker")}</p>
            {skills.map((category) => {
              const displayedItems = mode === "scene" ? category.items.slice(0, 4) : category.items;
              const hiddenCount = category.items.length - displayedItems.length;
              return (
                <div key={category.key} className="border-t border-rule first:border-t-0 py-4">
                  <div className="flex items-baseline gap-3 mb-2.5">
                    <span className="font-mono text-[11px] text-ink tabular-nums">
                      {String(category.items.length).padStart(2, "0")}
                    </span>
                    <h4 className="font-display text-base font-medium text-ink">
                      {categoryLabels[category.key] ?? category.key}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {displayedItems.map((item) => (
                      <span key={item} className="font-mono text-xs text-ink-2 border border-rule px-2 py-0.5">
                        {item}
                      </span>
                    ))}
                    {hiddenCount > 0 && (
                      <span className="font-mono text-xs text-ink-3">+{hiddenCount} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
```

with:

```tsx
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <p className="sm:col-span-2 annotate">{tSkills("kicker")}</p>
          {skills.map((category) => {
            const displayedItems = mode === "scene" ? category.items.slice(0, 6) : category.items;
            const hiddenCount = category.items.length - displayedItems.length;
            return (
              <div key={category.key} className="border border-rule p-5 md:p-6">
                <h4 className="font-display text-3xl md:text-4xl font-extrabold leading-none tracking-tight text-ink uppercase">
                  {categoryLabels[category.key] ?? category.key}
                </h4>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {displayedItems.map((item) => (
                    <span key={item} className="font-mono text-xs text-ink-2">
                      {item}
                    </span>
                  ))}
                  {hiddenCount > 0 && (
                    <span className="font-mono text-xs text-ink-3">+{hiddenCount} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
```

Each category is now its own bordered cell with the category name as an oversized display-weight word (matching the reference's "FRONT END"/"WEB3" block treatment) and its tools listed as plain mono text beneath - no more small bordered pill tags per item. The scene-mode truncation safeguard (added in an earlier plan to prevent viewport overflow) is preserved, just with a slightly higher cap (6 instead of 4) since the new layout is a 2-column grid of cells rather than one stacked list, giving more usable width per cell.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification note**

Cannot be visually confirmed in this sandbox. Note in the report: a human must confirm the four skill-category blocks read clearly at both mobile (1-column) and desktop (2-column) widths, the oversized category words don't overflow their bordered cells, and scene mode doesn't clip the block grid within its fixed viewport budget.

- [ ] **Step 4: Commit**

```bash
git add src/components/checkpoints/Telemetry.tsx
git commit -m "feat(design): rebuild skills matrix as oversized category blocks"
```

---

### Task 8: Contact - radial burst CTA statement

**Files:**
- Create: `src/lib/radial-burst.ts`
- Create: `src/components/ui/radial-burst.tsx`
- Modify: `src/components/checkpoints/Landing.tsx`

**Interfaces:**
- Produces: `radialRays: RadialRay[]` (from `radial-burst.ts`), `RadialBurst` component (`{ className?: string }` props) - consumed only by `Landing.tsx` in this task.

Adds a new oversized CTA statement, set in Bebas Neue, backed by a radial burst of converging lines, above the existing contact-channel list.

- [ ] **Step 1: Create `src/lib/radial-burst.ts`**

```ts
const RAY_COUNT = 48;

export interface RadialRay {
  x2: number;
  y2: number;
}

/**
 * Deterministic radial burst of rays from a center point (500,500 in a
 * 1000x1000 viewBox), evenly spaced by angle. Purely decorative background
 * for the Contact beat's closing CTA statement.
 */
export const radialRays: RadialRay[] = Array.from({ length: RAY_COUNT }, (_, i) => {
  const angle = (i / RAY_COUNT) * Math.PI * 2;
  return {
    x2: 500 + Math.cos(angle) * 900,
    y2: 500 + Math.sin(angle) * 900,
  };
});
```

- [ ] **Step 2: Create `src/components/ui/radial-burst.tsx`**

```tsx
import { radialRays } from "@/lib/radial-burst";

/**
 * Deterministic radial burst of thin lines converging on a center point -
 * decorative background for the Contact beat's closing CTA statement.
 */
export default function RadialBurst({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {radialRays.map((ray, i) => (
        <line key={i} x1="500" y1="500" x2={ray.x2} y2={ray.y2} stroke="var(--color-rule)" strokeWidth="1" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Add the CTA statement to `Landing.tsx`**

In `src/components/checkpoints/Landing.tsx`, add the import:

```tsx
import RadialBurst from "@/components/ui/radial-burst";
```

Then replace the opening of the component's returned JSX (the `<CheckpointShell>` block's first `<div>`, currently starting at line 35) - insert a new CTA block directly after `<SectionHeader .../>` (line 36) and before the existing `<div className="grid lg:grid-cols-...">` (line 37):

Replace:

```tsx
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-start">
```

with:

```tsx
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />

        <div className="relative flex items-center justify-center py-16 md:py-24 mb-12 md:mb-16">
          <RadialBurst className="absolute inset-0 -z-10 h-full w-full opacity-40" />
          <p className="font-condensed text-center text-[clamp(2.5rem,9vw,6rem)] leading-[0.95] tracking-wide text-ink uppercase">
            {t("ctaBurstLine1")}
            <br />
            {t("ctaBurstLine2")}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-start">
```

- [ ] **Step 4: Add the two new i18n keys**

In `src/messages/en.json`, inside the `"contact"` object (after `"ctaLine2": "that flies.",`), add:

```json
    "ctaBurstLine1": "Let's build",
    "ctaBurstLine2": "something amazing",
```

The full `"contact"` block should read:

```json
  "contact": {
    "title": "Get in Touch",
    "kicker": "open to work",
    "ctaLine1": "Let's build something",
    "ctaLine2": "that flies.",
    "ctaBurstLine1": "Let's build",
    "ctaBurstLine2": "something amazing",
    "subtitle": "Open to internships and engineering work in embedded systems, autonomous robotics, AI agents, and full-stack software - the same range this site covers.",
    "availability": "Based in Bursa, Türkiye · usually replies within a day",
    "email": "Email",
    "githubLabel": "GitHub",
    "linkedin": "LinkedIn"
  },
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual verification note**

Cannot be visually confirmed in this sandbox. Note in the report: a human must confirm the radial burst lines converge visibly behind the CTA text without overwhelming it, and the oversized Bebas Neue statement doesn't overflow its container at narrow widths.

- [ ] **Step 7: Commit**

```bash
git add src/lib/radial-burst.ts src/components/ui/radial-burst.tsx src/components/checkpoints/Landing.tsx src/messages/en.json
git commit -m "feat(design): add radial burst CTA statement to Contact"
```

---

### Task 9: Footer rebuild

**Files:**
- Modify: `src/components/footer.tsx`

**Interfaces:** None new - `footer.colophon`/`footer.meta` i18n keys reused; `contacts`-shaped data is NOT duplicated here, this footer's "Contact" column reuses the same three real channels `Landing.tsx` already lists (email, GitHub, LinkedIn), sourced from the same real values, not a second data source.

Full rebuild: a white bordered-grid block transitions into a black dot-pattern band, into a black two-column footer panel with a giant low-opacity background wordmark.

- [ ] **Step 1: Add footer i18n keys**

In `src/messages/en.json`, inside the `"footer"` object, add a `"wordmark"` key and a `"navHeading"`/`"contactHeading"` pair. Replace the full `"footer"` block:

```json
  "footer": {
    "colophon": "Designed and built by Emir Sakarya in Bursa, Türkiye.",
    "meta": "Next.js · 2026"
  }
```

with:

```json
  "footer": {
    "colophon": "Designed and built by Emir Sakarya in Bursa, Türkiye.",
    "meta": "Next.js · 2026",
    "wordmark": "FOUNDER ENGINEER",
    "contactHeading": "Contact",
    "navHeading": "Navigation"
  }
```

- [ ] **Step 2: Replace `footer.tsx` in full**

```tsx
import { useTranslations } from "next-intl";
import { navItems } from "./nav";

const contactLinks = [
  { label: "Email", value: "emirsakarya00@gmail.com", href: "mailto:emirsakarya00@gmail.com" },
  { label: "GitHub", value: "github.com/iWeslax83", href: "https://github.com/iWeslax83" },
  { label: "LinkedIn", value: "linkedin.com/in/emirsakarya", href: "https://linkedin.com/in/emirsakarya" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer>
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-rule">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 md:h-20 border-b border-rule border-r last:border-r-0 sm:[&:nth-child(4n)]:border-r-0" />
        ))}
      </div>

      <div
        aria-hidden
        className="h-16 md:h-20"
        style={{
          backgroundImage: "radial-gradient(var(--color-bg) 1px, var(--color-ink) 1px)",
          backgroundSize: "8px 8px",
          backgroundColor: "var(--color-ink)",
        }}
      />

      <div className="relative bg-ink text-bg overflow-hidden">
        <p
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 translate-y-1/4 text-center font-display text-[18vw] font-extrabold leading-none tracking-tight opacity-[0.06] whitespace-nowrap"
        >
          {t("wordmark")}
        </p>

        <div className="relative px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto py-14 md:py-20">
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="annotate text-bg/60 mb-5">{t("contactHeading")}</p>
              <ul className="space-y-3">
                {contactLinks.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-baseline justify-between gap-4 font-mono text-sm hover:opacity-70 transition-opacity"
                    >
                      <span>{c.label}</span>
                      <span className="text-bg/50">{c.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="annotate text-bg/60 mb-5">{t("navHeading")}</p>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <a href={item.href} className="font-mono text-sm hover:opacity-70 transition-opacity">
                      {tNav(item.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-bg/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-mono text-[11px] text-bg/60">{t("colophon")}</p>
            <p className="annotate text-bg/60">{t("meta")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

Notes:
- The dot-pattern band uses an inline `radial-gradient` CSS background, not a Tailwind gradient utility class - this is a repeating dot-pattern technique (a common CSS trick, tiny background-image radial gradients repeated via `background-size`), not a color-transition decorative gradient, so it does not violate the "no gradient" rule the same way a linear color-blend fill would. If review flags this as ambiguous, the fallback is an SVG `<pattern>` of small `<circle>` elements (the same technique `WorkIntroBackground.tsx`'s dot texture already uses) instead of a CSS background-image - implementer's call, verify visually which reads cleaner, but either is acceptable.
- `navItems` is imported from `./nav` (already exported there, `nav.tsx:11-17`) rather than duplicated - reuses the real single source of truth for section links.
- `contactLinks` here intentionally mirrors `Landing.tsx`'s `contacts` array's real values (same email/GitHub/LinkedIn) but is a separate small array local to this file rather than sharing an import, since `Landing.tsx`'s `contacts` array also carries icon JSX and a numeric `code` field this footer doesn't need - duplicating the three plain values (not the icons/codes) is simpler than threading an icon-bearing type through both files. If this is later found to drift out of sync, unifying into one shared data file is a reasonable follow-up, but is not required by this task.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual verification note**

Cannot be visually confirmed in this sandbox. Note in the report: a human must confirm the white-grid-to-dot-band-to-black-footer transition reads cleanly, the giant background wordmark doesn't obscure the readable footer content in front of it, and both footer columns are legible against the black background.

- [ ] **Step 5: Commit**

```bash
git add src/components/footer.tsx src/messages/en.json
git commit -m "feat(design): rebuild footer with grid-to-dot-band transition and wordmark"
```

---

### Task 10: Rewrite `DESIGN.md`

**Files:**
- Modify: `DESIGN.md` (full rewrite)

**Interfaces:** None (documentation only).

Per this repo's established convention, every design pass updates `DESIGN.md`. This pass is a full system replacement, so `DESIGN.md` is rewritten from scratch rather than incrementally amended - the prior black-canvas/terminal-green system it documented no longer exists.

- [ ] **Step 1: Replace `DESIGN.md` in full**

```markdown
# Design System: Emir Sakarya - Portfolio

A white, high-contrast, no-accent-color typographic system. This is the
single source of truth for every screen, superseding every prior version of
this document (the black-canvas/terminal-green "Maximalist Signal" system
and everything before it - see `docs/superpowers/specs/` for the full
history if needed). This system leads with structure and type, not color:
white canvas, near-black ink, three deliberate typefaces, zero accent color
anywhere.

> **Changelog:** White System redesign (see
> `docs/superpowers/specs/2026-09-04-white-system-redesign-design.md`)
> replaces the black-canvas/terminal-green identity in full. Canvas flips
> to white, ink to near-black, every accent-color call site (status tags,
> links, buttons, the flagship gradient border, the nav progress bar) is
> re-carried by weight/border/shape instead of color. Adds a wireframe-mesh
> hero background, embossed WORK-carousel letters, a single-focus
> crossfade project carousel (replacing an overlapping slide), an oversized
> skills-block treatment, a radial-burst Contact CTA, and a full footer
> rebuild (grid-to-dot-band-to-black-panel with a giant background
> wordmark). Also fixes a dead nav-anchor scroll bug found in live
> inspection. The WebGL flight-scene camera, drone model, and
> `CheckpointShell`'s scene/flat split are unchanged - this is a visual
> skin change on the existing mechanical architecture, not a rebuild of it.

---

## 1. Visual Theme & Atmosphere

A white canvas, near-black type, and three typefaces each doing one
structural job - not decoration standing in for it. Founder identity still
leads: a person who started a TEKNOFEST UAV team and engineers the
autonomous systems it flies, range proven from flight controllers and PCBs
up to production full-stack. The project catalogue and 3D flight-scene
mechanics from the prior system are unchanged; only their visual skin is
new.

- **Density:** 6/10 - unchanged from the prior system's density level, just
  reskinned.
- **Variance:** 7/10 - asymmetric, offset, left-aligned. Never a centered
  hero.
- **Motion:** 9/10 - unchanged. Scroll-driven throughout, spring-based,
  choreographed. The 3D flight-scene camera, checkpoint fade transitions,
  and the Work Carousel's crossfade mechanic all carry over from the prior
  system's motion vocabulary (`src/lib/motion.ts` is untouched by this
  pass).

## 2. Color Palette & Roles

**There is no accent color in this system.** This is the single biggest
change from every prior version of this document. Status, links, buttons,
and emphasis are carried entirely by weight, size, underline, shape, and
border - never by color.

- **Canvas** (`#FFFFFF`) - primary background. Pure white. The prior
  system's "never pure black, never pure white" rule is explicitly lifted
  for this pass.
- **Panel** (`#F5F5F3`) / **Panel-2** (`#EDEDEA`) - raised and nested
  surfaces, very light warm-neutral grays that still read as "white" while
  distinguishing layered elements (the WORK pill, card frames) from bare
  canvas.
- **Ink** (`#0A0A0A`) - primary text, headlines. Near-black, not pure
  `#000`, for a slightly softer read.
- **Ink-2** (`#6B6B6B`) - secondary text, descriptions.
- **Ink-3** (`#9A9A9A`) - tertiary labels, captions, mono annotations. Must
  be verified at WCAG AA (>=4.5:1) against the `#FFFFFF` canvas since
  `.annotate` renders it at 11px - darken if a contrast audit finds it
  fails.
- **Rule** (`rgba(10,10,10,0.12)`) / **Rule-Strong** (`rgba(10,10,10,0.28)`)
  - hairline panel borders, dividers, grid lines.
- **No accent, no accent-2, no accent-soft tokens exist.** Every former
  accent call site now uses one of: a heavier ink border (the flagship
  catalogue row), a shape distinction (`StatusTag`'s filled/outlined/light
  squares), an italic serif treatment (the hero and CTA's second headline
  line), or a plain weight/opacity shift (hover states, links).
- One legitimate exception: GitHub's real per-language colors in
  `Telemetry.tsx`'s language bar are sourced from GitHub's own API data,
  not a design accent - they stay as real external data, same as before.

## 3. Typography Rules

Three display faces, each with one job, plus the existing mono voice.

- **Serif** (`Fraunces`, self-hosted via `next/font/google`,
  `--font-serif`) - the hero headline and any long-form founder-story
  prose. A moody editorial serif; an original substitute chosen for
  similar structural character to a design reference, not an attempt to
  match any specific site's exact typeface.
- **Display/body grotesk** (`Cabinet Grotesk`, self-hosted via
  `next/font/local`, unchanged from the prior system) - bold block labels,
  the oversized skills-category words, nav links, section titles,
  catalogue rows. Its structural role is unchanged; only its color context
  (now on white) is new.
- **Condensed display** (`Bebas Neue`, self-hosted via `next/font/google`,
  `--font-condensed`) - used exactly once, for the Contact beat's oversized
  radial-burst CTA statement. Not used anywhere else.
- **Mono** (`JetBrains Mono`, unchanged) - data readouts, status lines,
  project IDs, nav index. Identical role to before.

**Banned:** any accent-colored text anywhere. Generic system sans with no
deliberate choice behind it.

## 4. Component Stylings

- **Hero background:** a full-bleed deterministic warped-line mesh
  (`src/components/ui/wireframe-mesh.tsx`, generated once at module load
  from a fixed seed - see `src/lib/wireframe-mesh.ts` - no hydration
  mismatch, no per-render randomness), rendered in hairline `--color-rule`
  strokes behind the hero headline.
- **Texture strips** (`CommitMotif`, `src/components/ui/commit-motif.tsx`):
  two thin horizontal strips pinned to the top of the viewport - this
  repo's own real commit history (top strip) and a deterministic binary
  field (bottom strip, `src/lib/binary-texture.ts`), each scroll-parallaxing
  horizontally at a different speed. Restyled from a prior full-page
  diagonal wash into bounded strips; same real-data source as before.
- **Selected Work beat scene mode
  (`src/components/checkpoints/Log.tsx`/`work-carousel/*`):** a pinned
  WORK-intro pill (a `bg-panel` stadium shape, bordered in ink, with a
  subtle dot texture, holding "WORK" spelled vertically) expands on scroll
  into four full-width tiled letter rows, each letter carrying a real
  embossed drop-shadow (`.emboss-text`, `globals.css`) - not flat type.
  The tiled letters stay pinned as a background while project cards
  **crossfade one at a time** (scale + opacity, no side-by-side overlap -
  fixed from a prior overlapping-slide mechanic) through a real screenshot
  or typographic placeholder per project. Flat mode is unchanged: a plain,
  fully accessible document-flow catalogue list.
- **Flagship catalogue row:** distinguished by a heavier `border-2
  border-ink` treatment (replacing a retired green-to-amber gradient
  border - `.gradient-border` no longer exists in `globals.css`).
- **`StatusTag`:** status is now carried by shape/fill, not color -
  `SHIPPED` is a solid ink square, `IN_PROGRESS` is an ink-outlined square,
  `ARCHIVED` is a light ink-3 square.
- **Telemetry skills matrix:** oversized one-word category blocks (e.g.
  "FRONTEND", "BACKEND") in Cabinet Grotesk Extrabold, each in its own
  bordered cell with its tool list in plain mono beneath - replaces a
  prior small-pill-tag treatment.
- **Contact CTA:** an oversized Bebas Neue statement backed by a
  deterministic radial burst of converging lines
  (`src/components/ui/radial-burst.tsx`, `src/lib/radial-burst.ts`),
  sitting above the existing real contact-channel list.
- **Footer (`src/components/footer.tsx`):** a white bordered grid block
  transitions into a black dot-pattern band, into a black two-column
  footer panel (Contact / Navigation, both reusing this site's real
  existing links) with a giant, low-opacity background wordmark and a
  closing colophon line.
- **Buttons:** flat, sharp corners (0-2px radius). Primary = ink fill on
  white text. Secondary = a `.link-draw` underline link. No color, no
  glow.
- **Nav:** white bar, ink text, hairline bottom border on scroll. The
  scroll-progress bar and active-link underline are ink-filled, not
  accent-filled. Nav links (desktop and mobile) drive scroll explicitly via
  `Element.scrollIntoView` rather than relying on native anchor-scroll
  behavior, which the scene-mode fixed-panel layout doesn't reliably
  support.

## 5. Layout Principles

Unchanged from the prior system: hero left-aligned and asymmetric, CSS Grid
first, max-width ~`1320px`, generous gutters, five-beat section order
(Home -> Flight Log -> Ventures -> Telemetry -> Contact), checkpoint ids and
anchors unchanged. This pass is a visual skin change, not a structural one.

## 6. Motion & Interaction

Unchanged from the prior system - spring-based (`stiffness: 110, damping:
20`, `src/lib/motion.ts`), scroll-driven throughout, `prefers-reduced-motion`
collapses everything to instant. The Work Carousel's card transition changed
from a side-by-side slide to a crossfade + scale (Section 4), computed from
the same `useWorkCarouselProgress` hook state as before - no new scroll
mechanism, just a different visual interpretation of the existing progress
value.

## 7. What is NOT copied from any external reference

No code, CSS, font files, image assets, or copy text from any external
design reference is used anywhere in this codebase. Every technique
described above (wireframe mesh, embossed letters, radial CTA burst,
dot-pattern footer transition, giant background wordmark) is an original
implementation in this site's own stack, using this site's own real
content (project data, contact channels, founder copy).
```

- [ ] **Step 2: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): rewrite DESIGN.md for the white system redesign"
```

---

### Task 11: Final verification pass

**Files:** None modified - verification only.

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds, zero errors.

- [ ] **Step 3: Zero-accent audit**

Run: `grep -rn "text-accent\|bg-accent\|border-accent\|accent-2\|accent-soft\|color-accent" src/`
Expected: zero matches.

- [ ] **Step 4: Zero-gradient-outside-CSS-technique audit**

Run: `grep -rn "gradient-border\|linear-gradient" src/components/ src/app/globals.css`
Expected: no hits in `src/components/` (the `.gradient-border` class and its two call sites are fully retired); the only acceptable hit, if any, is the footer's dot-pattern `radial-gradient` background-image technique (Task 9, a repeating-dot pattern, not a color-blend fill) - if found elsewhere, it's a violation and must be fixed.

- [ ] **Step 5: Contrast check documentation**

Read `src/app/globals.css`'s `--color-ink-3` value (`#9A9A9A`) and confirm its contrast ratio against `#FFFFFF` is at least 4.5:1 using a WCAG contrast formula (`(L1 + 0.05) / (L2 + 0.05)` where L is relative luminance) - compute this by hand or note the exact ratio in the report. If it fails 4.5:1, this is a real defect to flag (not fix yourself in this verification-only task - report it clearly).

- [ ] **Step 6: Consolidated manual verification checklist**

Write one clear list (for the report, not a code change) covering everything from Tasks 1-10 that still needs a human's eyes in a real browser, since none of this plan's work was visually verified in this sandbox:

- Hero: wireframe mesh legible but not overwhelming, texture strips don't collide with nav, serif headline (including italic second line) reads intentionally.
- Work Carousel: WORK pill and tiled letters show real embossing, crossfade transition between project cards has no dead gap and no overlap, nav "01 work" link actually scrolls the page (desktop and mobile).
- Telemetry: skills blocks legible at mobile and desktop widths, no overflow in scene mode.
- Contact: radial burst reads behind the CTA text without overwhelming it, Bebas Neue statement doesn't overflow at narrow widths.
- Footer: grid-to-dot-to-black transition reads cleanly, wordmark doesn't obscure readable content, both columns legible on black.
- General: zero remaining color anywhere that isn't ink/gray/white (aside from GitHub's real language-color data), no console errors during a full scroll-through, flat mode fully functional and unaffected by any scene-mode-specific change.

- [ ] **Step 7: Report**

Write the full report per the standard subagent-driven-development report contract, including the exact `--color-ink-3` contrast ratio computed in Step 5 and the consolidated checklist from Step 6.

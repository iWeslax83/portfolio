# Instrument Round 2 Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The first Instrument redesign pass (tokens, fonts, panel chrome) shipped but reads as "the same as before" because layout composition, motion vocabulary, and most section copy were deliberately left unchanged for continuity. This plan closes that gap on three axes: a genuinely distinctive GitHub section (multi-panel instrument dashboard instead of a typographic list), a richer motion vocabulary (hover sweep on rows, a deliberate page-load boot sequence, a numeric readout-settle technique), and rewritten prose for the three highest-weight copy blocks (hero lead, STRATOS body, contact subtitle).

**Architecture:** Builds on the already-shipped Instrument token system (`DESIGN.md`, updated 2026-08-09 with the round-2 addendum) - no new tokens, no new fonts, no new components. Everything here is: one new Framer Motion variant, one new CSS utility, a JSX restructure of one section (`github.tsx`), a `className` addition on four existing row elements, two small entrance-timing tweaks, and three rewritten strings.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion 12, next-intl, TypeScript. Same as before: no test framework, `npm run build` is the verification gate.

## Global Constraints

- Spec: `DESIGN.md` (repo root), sections "GitHub dashboard," "Nav section index," "Row hover sweep" (under Component Stylings) and "Boot sequence," "Readout settle (numeric)," "Row hover sweep" (under Motion & Interaction) - added 2026-08-09.
- No em dashes anywhere.
- No gradients, no glassmorphism/blur, no purple. Flat fills only (`--color-accent-soft` for the hover sweep, already defined).
- No pill badges (`rounded-full` + tint) - the nav chip is a bordered rectangle, not a pill.
- No count-up-from-zero tweens on numeric data - `readoutSettle` is an opacity/scale settle on the real value, never a counting animation.
- Keep founder-first framing in the rewritten copy - do not soften to craft-only verbs. See the project's `copy-tone` convention: concrete, technical, unhype.
- Only one content locale exists (`src/messages/en.json`) - edit that file only.
- Verification gate: `npm run build` (no test framework in this project). Grep checks are specified per task.
- No browser is available in this execution environment (confirmed during the prior plan's Task 10 - Playwright's chrome channel, the claude-in-chrome extension, and chrome-devtools-mcp all failed to find a working browser here). Do not attempt browser-based verification; rely on `npm run build` plus the grep checks each task specifies. The human partner will visually verify separately via the running dev server.

---

### Task 1: Motion vocabulary + hover-sweep CSS utility

**Files:**
- Modify: `src/lib/motion.ts` (add one variant, end of file)
- Modify: `src/app/globals.css` (add one utility, near `.link-draw`)

**Interfaces:**
- Produces: `readoutSettle: Variants` exported from `@/lib/motion`, consumed by Task 2. `.row-sweep` CSS class, consumed by Task 3.
- Consumes: nothing new (uses existing `spring` transition and `--color-accent-soft` token, both already defined).

- [ ] **Step 1: Add the `readoutSettle` variant**

Append to the end of `src/lib/motion.ts` (after the `slideInRight` export):

```ts

/* Numeric readout locking into its final value - distinct from markIn
   (which is for tracked-out mono labels, not numerals). Real data only,
   never a count-up-from-zero tween. */
export const readoutSettle: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: spring },
};
```

- [ ] **Step 2: Add the `.row-sweep` utility**

In `src/app/globals.css`, add this block immediately after the `.link-draw` rules (after the closing `}` of `.link-draw:hover::after`, before the `/* ── Micro-motion ── */` comment):

```css

/* Flat accent-soft background that sweeps in from the left on hover.
   z-index:-1 on the pseudo-element keeps it behind row content; the row
   itself needs position:relative + an explicit z-index:0 to contain that
   negative stack level so it can't slip behind a neighboring row. The
   existing prefers-reduced-motion block below already zeroes this
   transition's duration - no separate override needed here. */
.row-sweep {
  position: relative;
  z-index: 0;
}
.row-sweep::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-accent-soft);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.row-sweep:hover::before {
  transform: scaleX(1);
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds. Neither `readoutSettle` nor `.row-sweep` is consumed yet (that's Tasks 2 and 3), so this only confirms the additions themselves are syntactically valid.

- [ ] **Step 4: Commit**

```bash
git add src/lib/motion.ts src/app/globals.css
git commit -m "feat(design): add readoutSettle motion variant and row-sweep hover utility"
```

---

### Task 2: GitHub dashboard rebuild

**Files:**
- Modify: `src/components/github.tsx` (full file rewrite)
- Modify: `src/messages/en.json` (`github` object, currently lines 47-55)

**Interfaces:**
- Consumes: `readoutSettle` from `@/lib/motion` (Task 1), `SectionHeader`'s `meta` prop (already exists, `{ kicker, title, meta? }`).
- Produces: nothing consumed by later tasks (GitHub is a leaf section).

- [ ] **Step 1: Replace the full contents of `src/components/github.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { GitHubStats } from "@/lib/types";
import SectionHeader from "./ui/section-header";
import {
  staggerContainer,
  staggerFast,
  fadeRise,
  readoutSettle,
  ruleDraw,
  viewportOnce,
} from "@/lib/motion";

// Monochrome activity scale: ink for low days, amber signal as it intensifies.
const cellTone = ["bg-rule", "bg-ink-3", "bg-ink-2", "bg-accent/55", "bg-accent"];

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

function LanguageBar({
  languages,
  label,
}: {
  languages: GitHubStats["languages"];
  label: string;
}) {
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
            <span style={{ color: lang.color }}>{"■"}</span> {lang.name}{" "}
            <span className="text-ink-3">{lang.percentage}%</span>
          </span>
        ))}
      </div>
    </figure>
  );
}

export default function GitHub({ stats }: { stats: GitHubStats }) {
  const t = useTranslations("github");

  const specs = [
    { value: stats.publicRepos, label: t("publicRepos") },
    { value: stats.contributions, label: t("contributions") },
    { value: stats.languages.length, label: t("languages") },
  ];

  return (
    <section id="github" className="py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
      <SectionHeader kicker={t("kicker")} title={t("title")} meta={t("status")} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        {/* Three small readout panels */}
        <motion.dl variants={staggerFast} className="grid sm:grid-cols-3 gap-4 lg:gap-5">
          {specs.map((s) => (
            <motion.div key={s.label} variants={readoutSettle} className="border border-rule p-5 md:p-6">
              <dt className="font-display text-4xl md:text-5xl font-semibold text-ink tabular-nums tracking-tight">
                {s.value}
              </dt>
              <dd className="annotate mt-2">{s.label}</dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Two wide panels */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <ContributionGraph graph={stats.contributionGraph} label={t("activity")} />
          </motion.div>
          <motion.div variants={fadeRise} className="border border-rule p-5 md:p-6">
            <LanguageBar languages={stats.languages} label={t("languageBreakdown")} />
          </motion.div>
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

This removes the border/padding/margin that used to live on `ContributionGraph`'s and `LanguageBar`'s own `<figure>` wrapper (`border border-rule p-5 md:p-6 mt-6` and implicit `mt-6`) since the new parent grid cell (`<motion.div className="border border-rule p-5 md:p-6">`) now supplies that chrome - keeping both would double the border/padding. Each helper's `<figure>` is now unstyled, with its own `<figcaption>` moved to the top as a label instead of the bottom.

- [ ] **Step 2: Add the `status` copy key**

In `src/messages/en.json`, inside the `github` object, add a new key after `"kicker"`:

```json
    "status": "telemetry · live",
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "readoutSettle" src/components/github.tsx`
Expected: at least one match (the three small panels use it).

- [ ] **Step 4: Commit**

```bash
git add src/components/github.tsx src/messages/en.json
git commit -m "feat(design): rebuild GitHub section as a multi-panel instrument dashboard

Three small readout panels (repos, contributions, languages) plus two
wide panels (activity graph, language mix), all sharing the same
bordered-panel chrome as the rest of the system. Replaces the single
typographic spec row + stacked graphs."
```

---

### Task 3: Row hover sweep

**Files:**
- Modify: `src/components/projects.tsx:113-116,193,211-232` (WorkRow's `motion.article`, and the secondary-project grid items)
- Modify: `src/components/stratos.tsx:92-97`
- Modify: `src/components/skills.tsx:36-41`
- Modify: `src/components/contact.tsx:102-110`

**Interfaces:**
- Consumes: `.row-sweep` CSS class from Task 1.

- [ ] **Step 1: `projects.tsx` - WorkRow**

Replace (currently the `WorkRow` function's `motion.article` opening tag):

```tsx
    <motion.article
      variants={plateIn}
      className="group grid md:grid-cols-[10rem_1fr] gap-x-8 border-t border-rule py-8 transition-colors"
    >
```

with:

```tsx
    <motion.article
      variants={plateIn}
      className="row-sweep group grid md:grid-cols-[10rem_1fr] gap-x-8 border-t border-rule py-8 px-4 -mx-4 transition-colors"
    >
```

(`px-4 -mx-4` keeps the row's visible text at its original horizontal position while giving the `.row-sweep::before` background some room to extend slightly past the text on both sides, matching how the flagship panel already reads as a bordered zone rather than a bare text line.)

- [ ] **Step 2: `projects.tsx` - secondary project grid items**

Both branches of the secondary-projects `.map()` render an `inner` block wrapped in either a `motion.a` or a `motion.div` with the class `"group block border-t border-rule pt-4 transition-colors hover:border-rule-strong"` (the `motion.a` branch) or `"group block border-t border-rule pt-4"` (the `motion.div` branch, no primary link). Add `row-sweep` to both:

Replace:
```tsx
                className="group block border-t border-rule pt-4 transition-colors hover:border-rule-strong"
```
with:
```tsx
                className="row-sweep group block border-t border-rule pt-4 px-3 -mx-3 transition-colors hover:border-rule-strong"
```

Replace:
```tsx
                className="group block border-t border-rule pt-4"
```
with:
```tsx
                className="row-sweep group block border-t border-rule pt-4 px-3 -mx-3"
```

- [ ] **Step 3: `stratos.tsx` - unit list item**

Replace:

```tsx
                className="group grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5 transition-colors hover:border-rule-strong"
```

with:

```tsx
                className="row-sweep group grid grid-cols-[auto_1fr] gap-x-5 items-baseline border-b border-rule py-5 px-4 -mx-4 transition-colors hover:border-rule-strong"
```

- [ ] **Step 4: `skills.tsx` - category row**

Replace:

```tsx
            className="group grid md:grid-cols-[14rem_1fr] gap-x-10 gap-y-3 border-b border-rule py-7 transition-colors hover:border-rule-strong"
```

with:

```tsx
            className="row-sweep group grid md:grid-cols-[14rem_1fr] gap-x-10 gap-y-3 border-b border-rule py-7 px-4 -mx-4 transition-colors hover:border-rule-strong"
```

- [ ] **Step 5: `contact.tsx` - channel row**

Replace:

```tsx
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-rule py-6 transition-colors hover:border-rule-strong last:border-b"
```

with:

```tsx
              className="row-sweep group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-rule py-6 px-4 -mx-4 transition-colors hover:border-rule-strong last:border-b"
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -rn "row-sweep" src/components/projects.tsx src/components/stratos.tsx src/components/skills.tsx src/components/contact.tsx`
Expected: at least 4 matches total (2 in `projects.tsx`, 1 each in the other three).

- [ ] **Step 7: Commit**

```bash
git add src/components/projects.tsx src/components/stratos.tsx src/components/skills.tsx src/components/contact.tsx
git commit -m "feat(design): add flat accent-soft hover sweep to catalogue rows"
```

---

### Task 4: Nav readout chip + boot-sequence timing

**Files:**
- Modify: `src/components/nav.tsx:56-65,78-80`
- Modify: `src/components/hero.tsx:1-14,124-126`

**Interfaces:**
- Consumes: `spring` from `@/lib/motion` (already exported, unchanged).

- [ ] **Step 1: `nav.tsx` - wrap the nav in a delayed fade-in**

Add `motion` import awareness: `nav.tsx` already imports `motion` from `"framer-motion"` (line 4) - no new import needed. Add an import for `spring`:

Replace line 4:
```tsx
import { motion } from "framer-motion";
```
with:
```tsx
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
```

- [ ] **Step 2: Apply the delayed fade to the `<nav>` element**

Replace the opening of the `<nav>` tag (currently lines 58-63):

```tsx
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled
            ? "bg-bg border-b border-rule"
            : "bg-transparent border-b border-transparent"
        }`}
      >
```

with:

```tsx
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled
            ? "bg-bg border-b border-rule"
            : "bg-transparent border-b border-transparent"
        }`}
      >
```

And its closing tag (currently `</nav>` at line 116) becomes `</motion.nav>`. There is only one `</nav>` in this file - the closing tag of the `<nav>` element itself (not to be confused with any other text).

- [ ] **Step 3: Turn the `[00]` bracket into a bordered chip**

Replace (currently lines 78-80):

```tsx
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.18em] text-ink-3 ml-1">
              [{activeNum}]
            </span>
```

with:

```tsx
            <span className="hidden sm:inline border border-rule px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-ink-3 ml-1">
              {activeNum}
            </span>
```

- [ ] **Step 4: `hero.tsx` - delay the panel readout so it appears after the schematic finishes drawing**

The drone schematic's own draw animation (in `src/components/ui/drone-schematic.tsx`, unmodified) resolves by roughly 1.5-1.6s after it enters view (its slowest part-label fade is `delay: 0.9 + 6 * 0.1 = 1.5s` plus its own `duration: 0.5`). Delay the readout caption below it so it reads as appearing once the drawing is complete, not simultaneously with it.

Replace (currently lines 124-126):

```tsx
          <motion.figcaption variants={markIn} className="mt-4 annotate">
            {t("panelReadout")}
          </motion.figcaption>
```

with:

```tsx
          <motion.figcaption
            variants={markIn}
            transition={{ delay: 1.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 annotate"
          >
            {t("panelReadout")}
          </motion.figcaption>
```

(The explicit `transition` prop on the component overrides `markIn`'s own default transition for this one instance only - `markIn` itself, and every other consumer of it elsewhere in the codebase, is unchanged.)

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -n "motion.nav\|border border-rule px-1.5 py-0.5" src/components/nav.tsx`
Expected: at least 2 matches (the opening `<motion.nav`/closing `</motion.nav>` and the chip).

Run: `grep -n "delay: 1.6" src/components/hero.tsx`
Expected: 1 match.

- [ ] **Step 6: Commit**

```bash
git add src/components/nav.tsx src/components/hero.tsx
git commit -m "feat(design): nav readout chip, delayed nav fade-in, and a boot-sequenced hero readout"
```

---

### Task 5: Copy rewrite

**Files:**
- Modify: `src/messages/en.json` (`hero.lead`, `stratos.body`, `contact.subtitle`)

**Interfaces:** none - pure content change, no component touches this task.

- [ ] **Step 1: Rewrite `hero.lead`**

Replace:

```json
    "lead": "Embedded-systems and full-stack engineer. I founded a TEKNOFEST UAV team and own its flight electronics, computer vision, and mission software end to end. Off the airframe I ship production platforms and AI agent systems built to prove what they did.",
```

with:

```json
    "lead": "I run the electronics and software side of a TEKNOFEST UAV team I founded: flight controllers, sensor fusion, computer vision, mission planning. Off the airframe I ship production platforms and AI agent systems built to show their own work, not just claim it.",
```

- [ ] **Step 2: Rewrite `stratos.body`**

Replace:

```json
    "body": "I founded STRATOS İHA, a student TEKNOFEST UAV community at Tofaş Fen Lisesi. I lead Electronics & Software across autonomous quadrotors, FPV racing drones, and VEX robotics, and grew the team to four departments and seven core members.",
```

with:

```json
    "body": "I founded STRATOS İHA at Tofaş Fen Lisesi and lead Electronics & Software across three programs: an autonomous quadrotor, an FPV racer, and a VEX robotics platform. Four departments, seven core members, one flight line.",
```

- [ ] **Step 3: Rewrite `contact.subtitle`**

Replace:

```json
    "subtitle": "Open to internships and engineering collaborations in embedded systems, autonomous robotics, AI, and full-stack software.",
```

with:

```json
    "subtitle": "Open to internships and engineering work in embedded systems, autonomous robotics, AI agents, and full-stack software - the same range this site covers.",
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds.

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json', 'utf8'))"`
Expected: no output, exit code 0 (confirms valid JSON).

Run: `grep -c $'\xe2\x80\x94' src/messages/en.json || true`
Expected: `0` (no em dashes introduced).

- [ ] **Step 5: Commit**

```bash
git add src/messages/en.json
git commit -m "content(design): rewrite hero lead, STRATOS body, and contact subtitle for the Instrument voice"
```

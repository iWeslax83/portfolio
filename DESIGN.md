# Design System: Emir Sakarya - Portfolio

A premium, anti-generic design language. This is the single source of truth for
every screen. The concept is an **engineering monograph**: the portfolio reads
like a precision-printed technical spec sheet for a person, using authentic
aerospace drafting conventions instead of the now-cliched developer terminal.

---

## 1. Visual Theme & Atmosphere

**Editorial typography meets the engineering drawing.** A warm near-black canvas
carrying large, confident display type, hairline rules, wide negative space, and
authentic drafting annotation: figure numbers, dimension callouts, registration
marks, part labels. Calm, instrument-precise, and unmistakably the work of an
aerospace founder - not a template.

Leads with **founder identity first.** A person who started a TEKNOFEST UAV team
and engineers the autonomous systems it flies; range proven from flight
controllers and PCBs up to production full-stack.

- **Density:** 4 / 10 - balanced, generous breathing room around technical content.
- **Variance:** 7 / 10 - asymmetric, offset, left-aligned. Never a centered hero.
- **Motion:** 7 / 10 - choreographed and alive, but restrained and editorial.
  Rules draw, headlines unmask, figures index in. Spring-smooth, never gimmicky.

> The terminal/console motif (`$ command` prompts, fake boot logs, blinking
> cursors, `exit 0`) is **retired**. It reads as machine-generated. The drafting
> language replaces it.

---

## 2. Color Palette & Roles

- **Warm Near-Black** (`#0A0A0B`) - primary canvas. Never pure black.
- **Panel** (`#101012`) / **Panel-2** (`#16161A`) - raised and nested surfaces.
- **Warm Ink** (`#ECE9E1`) - primary text, headlines.
- **Ink-2** (`#98948A`) - secondary text, descriptions.
- **Ink-3** (`#837E73`) - tertiary labels, captions, annotations. Tuned to clear
  WCAG AA contrast (4.9:1) on the canvas; do not darken it below ~4.5:1.
- **Rule** (`rgba(236,233,225,0.12)`) / **Rule-Strong** (`0.22`) - hairline
  dividers, plate borders, registration marks, tick rules.
- **Ember Amber** (`#E8A05C`) - THE single accent, used **scarcely**: at most one
  amber element per viewport zone (a CTA, a figure code, a key number, the active
  nav). Warm, nods to flight/ignition. Never blue, never neon.

Distinction from the generic dark-dev-theme comes from **type, rules, and space**,
not from color. Resist spreading amber around.

---

## 3. Typography Rules

- **Display / Headlines:** `Bricolage Grotesque` - characterful editorial grotesk,
  set large and tight (`-0.03em`), weights 500-700, scaled via `clamp()`.
  Deliberately NOT Space Grotesk / Inter / a generic geometric sans.
- **Body:** `Manrope` - clean, relaxed leading, ~65ch max, rendered in Ink-2.
- **Mono:** `JetBrains Mono` - the drafting annotation voice: figure codes
  (`FIG. 0X`), dimension callouts (`1240 mm`), part labels (`FC-01`), spec lines,
  nav index. The `.annotate` utility sets it small, tracked-out, uppercase.

**Banned:** `Inter`, `Space Grotesk`, generic system sans. No decorative serifs.

---

## 4. Component Stylings

- **Figure markers (section headers):** a mono figure code + a hairline rule that
  draws across + an optional right-aligned annotation, then the title set large in
  Bricolage. This is the signature identity motif (`src/components/ui/figure-marker.tsx`).
- **Plates / catalogue rows:** work is an indexed catalogue, not a card grid. Each
  project is a figure with a large index number, tag label, title, description, and
  a single mono spec line (`tech · tech · tech`). The flagship is a bordered plate
  with a parallax technical drawing and corner registration marks.
- **Buttons:** flat. Primary = amber fill on near-black text. Secondary = a
  `.link-draw` underline link. Tactile `1px` translate on `:active`. No glow, no
  custom cursor. Max one primary CTA per section.
- **Spec rows / matrices:** numbers and capabilities are typographic tables, not
  chips - mono cells, hairline rows, an item count badge.
- **Drafting details:** `.reg-mark` corner ticks, `.tick-rule` measurement edges,
  `.annotate` labels. Use sparingly as punctuation, never wallpaper.
- **No pill clouds, no count-up stat filler, no icon-chip cards, no marquee.**

---

## 5. Layout Principles

- Hero is left-aligned and asymmetric. Never centered.
- Strong left margin column; mono index/figure codes carry structure.
- Work is a catalogue of indexed plates; the flagship UAV is a wide bordered plate.
  The generic "3 equal cards in a row" stays banned.
- CSS Grid first. Max-width ~`1320px`, generous gutters (`px-6 md:px-10 lg:px-14`).
- Section rhythm `py-24 md:py-36`. Full-height hero uses `min-h-[100dvh]`.
- Every element owns its spatial zone; no overlapping text/images.

---

## 6. Motion & Interaction

Choreographed but editorial (Motion 7/10). Variety in technique, one spring
binding it (`stiffness: 110, damping: 20`). All variants live in `src/lib/motion.ts`.

- **Rules draw in** (`ruleDraw`, `scaleX` from the left).
- **Headlines unmask** line by line (`lineReveal`, clip-path up). Never word-typing.
- **Figure codes / labels index in** (`markIn`, letter-spacing settles).
- **Plates lift** subtly (`plateIn`), staggered down a list/grid (~40-80ms).
- **Signature set-piece:** the hero quadrotor schematic
  (`src/components/ui/drone-schematic.tsx`) drafts stroke-by-stroke via SVG
  `pathLength`, rotor discs rotating slowly, a real `1240 mm` dimension callout.
- **Parallax:** gentle drift on the hero figure and the flagship plate drawing.
- **Perpetual micro-motion:** a slow amber signal dot, a thin amber scroll-progress
  rule at the top of the viewport. That is the budget - keep it quiet.
- **Performance:** animate only `transform` / `opacity`. Heavy motion in isolated
  client components; grain/grid on fixed pseudo-elements.
- Respect `prefers-reduced-motion` (collapse to instant).

---

## 7. Hero Spec (signature)

- Left-aligned, asymmetric, founder-first. Mono role line above the headline:
  "Founder · Head of Electronics & Software" / "STRATOS İHA".
- Oversized 2-3 line headline in Bricolage (line 1 in full Ink, the continuation
  in Ink-2). The NASA Space Apps win is stated like a drawing revision in amber.
- Lead in Ink-2; a short credentials list with tick marks.
- Exactly one amber primary CTA ("View work") + one `.link-draw` secondary
  ("Get in touch").
- Right column: the animated quadrotor technical drawing with a `Fig. 00` caption.
- No cursor-follow light, no fake console, no inline-image-in-headline gimmick,
  no stat counters in the hero.

---

## 8. Anti-Patterns (Banned)

- No terminal/console motif: no `$` prompts, fake boot logs, blinking cursors, `exit 0`.
- No emojis. No em dashes (use normal hyphens).
- No `Inter`, `Space Grotesk`, or decorative serifs. No pure black (`#000000`).
- No neon / outer-glow shadows, no blue/purple or oversaturated accents.
- No gradient text on headers. No custom mouse cursors. No 3D tilt cards.
- No overlapping elements. No 3-equal-column card row. No centered hero.
- No count-up stat filler, no pill clouds, no marquee, no numbered `01. 02.`
  meta-labels used as decoration (figure codes are structural, not ornamental).
- No fake names or fabricated round metrics. No AI copy cliches ("Elevate",
  "Seamless", "Unleash", "Next-Gen"). No filler ("Scroll to explore", chevrons).
- No broken image links - real screenshots, SVG, or `picsum.photos` only.

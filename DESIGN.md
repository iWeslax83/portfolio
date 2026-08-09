# Design System: Emir Sakarya - Portfolio

A premium, anti-generic design language. This is the single source of truth for
every screen. The concept is **Instrument**: the portfolio reads like a live
control panel for a person, not a printed drawing of one. Bordered readout
panels, mono data, one saturated signal color. The prior "engineering
monograph" system (figure codes, registration marks, drafting rules) is
**retired in full** - this document replaces it, not extends it.

---

## 1. Visual Theme & Atmosphere

**A precision instrument, not an illustration of one.** A neutral near-black
canvas, sharp-cornered bordered panels, hairline grid, and mono data readouts
that settle into place rather than draw like ink. Calm, exact, alive - the
feeling of a well-made cockpit display, not a technical sketchbook.

Leads with **founder identity first**, unchanged from before: a person who
started a TEKNOFEST UAV team and engineers the autonomous systems it flies;
range proven from flight controllers and PCBs up to production full-stack.
The GitHub activity section is promoted to the system's flagship proof
element - real numbers, not decoration.

- **Density:** 4 / 10 - balanced, generous breathing room around technical content.
- **Variance:** 7 / 10 - asymmetric, offset, left-aligned. Never a centered hero.
- **Motion:** 7 / 10 - choreographed and alive, but restrained. Panels snap
  into grid alignment, readouts settle, headlines unmask. Spring-smooth, never gimmicky.

> The drafting/monograph motif (`FIG. 0X` figure codes, registration-mark
> corner ticks, tick-rule measurement edges) is **retired**. It served the
> prior system; it does not belong in this one. Do not reintroduce it.

---

## 2. Color Palette & Roles

- **Canvas** (`#09090B`) - primary background. Neutral near-black, not warm.
- **Panel** (`#121214`) / **Panel-2** (`#1A1A1D`) - raised and nested surfaces.
- **Ink** (`#F2F1ED`) - primary text, headlines.
- **Ink-2** (`#93939A`) - secondary text, descriptions.
- **Ink-3** (`#67676D`) - tertiary labels, captions, mono annotations. Held at
  clear WCAG AA contrast (4.5:1+) on the canvas.
- **Rule** (`rgba(255,255,255,0.08)`) / **Rule-Strong** (`0.18`) - hairline
  panel borders, dividers, grid lines.
- **Signal Orange** (`#FF7A29`) - THE single accent, used **scarcely**: at
  most one accent element per viewport zone (a CTA, a status indicator, an
  active nav item, a key number). Saturated and exact, reads as "live," not
  "warm." Never blue, never purple, never neon-glow.

Distinction from the generic dark-dev-theme comes from **panel structure,
type, and restraint**, not from color variety. Resist spreading the accent around.

---

## 3. Typography Rules

- **Display / Headlines / Body:** `Instrument Sans` - a single geometric
  grotesk driving the whole hierarchy by weight and size (400-700), not a
  display/body font pair. Set tight (`-0.02em` to `-0.03em`) at display sizes,
  relaxed leading (1.5-1.6) at body sizes, ~65ch max body measure.
- **Mono:** `JetBrains Mono` stays - the technical-readout voice: data values,
  status lines, nav index, spec rows, section labels. The `.annotate` utility
  sets it small, tracked-out, uppercase.

**Banned:** `Inter` as a bare default, `Space Grotesk`, generic system sans
with no deliberate choice behind it, decorative serifs.

---

## 4. Component Stylings

- **Section headers:** a mono section label (section name + short annotation)
  set above a large `Instrument Sans` title, with a hairline rule beneath.
  No figure code, no registration marks. This is the new signature identity
  motif (`src/components/ui/section-header.tsx`, replaces `figure-marker.tsx`).
- **Work catalogue:** unchanged structural pattern, restyled chrome - work
  stays an indexed catalogue of bordered rows, not a card grid. The flagship
  project is a bordered instrument panel with the hand-built UAV technical
  drawing on one side and a readout strip caption (`OBJECT · STATUS · REV`)
  instead of a `Fig.` caption.
- **Buttons:** flat, sharp corners (0-2px radius). Primary = accent fill on
  near-black text. Secondary = a `.link-draw` underline link. Tactile `1px`
  translate on `:active`. No glow, no custom cursor. Max one primary CTA per section.
- **Spec rows / matrices:** numbers and capabilities stay typographic tables -
  mono cells, hairline rows. Data readouts (GitHub stats, unit counts) settle
  into their final value with a brief mono flicker on reveal, never a
  count-up-from-zero tween.
- **Status indicator:** one small square (not circular) accent dot + mono
  label (e.g. `SYSTEM · ONLINE`), used once, in the hero or nav. Replaces the
  old amber signal dot 1:1 in role, restyled in shape.
- **No pill clouds, no icon-chip cards, no marquee, no figure codes, no
  registration marks, no tick-rules.**

---

## 5. Layout Principles

- Hero is left-aligned and asymmetric. Never centered. (Unchanged from before.)
- Strong left margin column; mono section labels carry structure instead of figure indices.
- Work is a catalogue of bordered rows; the flagship UAV project is a wide
  bordered instrument panel. The generic "3 equal cards in a row" stays banned.
- CSS Grid first. Max-width ~`1320px`, generous gutters (`px-6 md:px-10 lg:px-14`).
- Section rhythm `py-24 md:py-36`. Full-height hero uses `min-h-[100dvh]`.
- Every element owns its spatial zone; no overlapping text/images.
- Section order unchanged: Home -> STRATOS -> Projects -> Skills -> GitHub -> Contact.

---

## 6. Motion & Interaction

Choreographed but exact (Motion 7/10). Spring-based throughout (motion.dev
principle: springs over hand-tuned easing), one spring config binding it
(`stiffness: 110, damping: 20`, unchanged). Variants live in `src/lib/motion.ts`,
renamed/reframed for the new vocabulary but the same physics.

- **Panels snap into grid alignment** (replaces `plateIn`'s "lift like a
  drafted plate" framing - same transform, new intent: a panel locking into place).
- **Headlines unmask** line by line (clip-path up). Kept - a generically good
  technique, not exclusive to the old identity.
- **Mono readouts settle** on reveal: a brief letter-spacing/opacity snap, not
  a numeric count-up. Real data only (GitHub stats, unit counts) - never
  animated for decoration on invented numbers.
- **Hairline rules extend** across on reveal (replaces `ruleDraw`'s "ink
  drawing itself" framing - same scaleX mechanic, reframed as a grid line
  activating).
- **Signature set-piece:** the hero quadrotor schematic
  (`src/components/ui/drone-schematic.tsx`, kept as-is - real hand-built
  asset) now sits inside a bordered instrument panel instead of
  registration-mark corners.
- **Parallax:** gentle drift on the hero figure and the flagship project image, kept.
- **Perpetual micro-motion:** one square accent status indicator, one thin
  accent scroll-progress rule at the top of the viewport. That is the full
  budget - keep it quiet.
- **Performance:** animate only `transform` / `opacity`. Respect
  `prefers-reduced-motion` (collapse to instant).

---

## 7. Hero Spec (signature)

- Left-aligned, asymmetric, founder-first. Mono role line above the headline:
  "Founder · Head of Electronics & Software" / "STRATOS İHA".
- Oversized 2-3 line headline in Instrument Sans (line 1 in full Ink, the
  continuation in Ink-2).
- The NASA Space Apps win is stated as a short mono status line in the accent color.
- Lead in Ink-2; a short credentials list with square tick marks (not L-corner ticks).
- Exactly one accent primary CTA ("View work") + one `.link-draw` secondary ("Get in touch").
- Right column: the animated quadrotor technical drawing, now inside a
  bordered instrument panel with a readout-strip caption
  (`OBJECT · AUTONOMOUS QUADROTOR · STATUS · FLIGHT-READY`) instead of a `Fig. 00` caption.
- No cursor-follow light, no fake console, no inline-image-in-headline gimmick,
  no stat counters in the hero.

---

## 8. Anti-Patterns (Banned)

- No terminal/console motif: no `$` prompts, fake boot logs, blinking cursors, `exit 0`.
- No drafting/monograph motif: no `FIG. 0X` figure codes, no registration-mark
  corner ticks, no tick-rule measurement edges. (Retired with this revision -
  do not reintroduce alongside the new system.)
- No emojis. No em dashes (use normal hyphens).
- No gradients, no glassmorphism/blur panels, no purple. Flat fills only, one accent.
- No `Inter` used as a bare unconsidered default, no `Space Grotesk`, no decorative serifs.
- No pure black (`#000000`). No neon / outer-glow shadows, no oversaturated
  accents beyond the one defined signal color.
- No gradient text on headers. No custom mouse cursors. No 3D tilt cards.
- No overlapping elements. No 3-equal-column card row. No centered hero.
- No count-up-from-zero stat filler (real values settle into place instead),
  no pill clouds, no marquee.
- No fake names or fabricated round metrics. No AI copy cliches ("Elevate",
  "Empower", "Unleash", "Revolutionize", "Supercharge", "Seamless", "Next-Gen").
  No filler ("Scroll to explore", chevrons).
- No broken image links - real screenshots, SVG, or `picsum.photos` only.

# Design System: Emir Sakarya - Portfolio

A premium, anti-generic design language. This is the single source of truth for
every screen. The system is a **neutral maximalist typographic system**: an
oversized, domain-first headline statement carries the hero, a single terminal-
green signal color marks what matters, and the page leads with proof of work
(a real, indexed project catalogue with live GitHub data) before anything else.
Bordered readout panels, mono data, and spring motion carry over from the prior
"Instrument" system's structure - only the palette, display font, hero
statement, and project catalogue were rebuilt. The still-earlier "engineering
monograph" system (figure codes, registration marks, drafting rules) remains
**retired in full**.

---

## 1. Visual Theme & Atmosphere

**A typographic statement backed by real proof, not a themed set piece.** A
neutral near-black canvas, sharp-cornered bordered panels, hairline grid, and
mono data readouts that settle into place rather than draw like ink. The
headline leads with the work itself, domain-first ("ML · Embedded · Web / is
where I build."), before the page moves into a real indexed catalogue of
projects, each carrying live status and commit data. Calm, exact, alive.

Leads with **founder identity first**, unchanged from before: a person who
started a TEKNOFEST UAV team and engineers the autonomous systems it flies;
range proven from flight controllers and PCBs up to production full-stack. The
project catalogue immediately follows the hero as the first proof surface, and
the GitHub activity section remains the system's flagship data element further
down the page - real numbers, not decoration.

- **Density:** 4 / 10 - balanced, generous breathing room around technical content.
- **Variance:** 7 / 10 - asymmetric, offset, left-aligned. Never a centered hero.
- **Motion:** 7 / 10 - choreographed and alive, but restrained. Panels snap
  into grid alignment, readouts settle, headlines unmask. Spring-smooth, never gimmicky.

> The drafting/monograph motif (`FIG. 0X` figure codes, registration-mark
> corner ticks, tick-rule measurement edges) is **retired**. It served a
> prior system; it does not belong in this one. Do not reintroduce it.

---

## 2. Color Palette & Roles

- **Canvas** (`#09090B`) - primary background. Neutral near-black, not warm.
- **Panel** (`#121214`) / **Panel-2** (`#1A1A1D`) - raised and nested surfaces.
- **Ink** (`#F2F1ED`) - primary text, headlines.
- **Ink-2** (`#93939A`) - secondary text, descriptions.
- **Ink-3** (`#7A7A80`) - tertiary labels, captions, mono annotations. Held at
  clear WCAG AA contrast (4.66:1 on the `#09090B` canvas) since `.annotate`
  renders it at 11px. Do not darken below ~4.5:1.
- **Rule** (`rgba(255,255,255,0.08)`) / **Rule-Strong** (`0.18`) - hairline
  panel borders, dividers, grid lines.
- **Accent - terminal green** (`#39FF6A`) - THE single accent, used
  **scarcely**: at most one accent element per viewport zone (a CTA, a status
  indicator, an active nav item, a key number). Verified at **14.86:1** WCAG
  contrast against the `#09090B` canvas, comfortably clearing AA for both
  large and body-scale use. Saturated and exact, reads as "live," not "warm."
  Never blue, never purple, never neon-glow. Derived tokens: `--color-accent-soft`
  (`rgba(57,255,106,0.1)`, used for the row-hover-sweep fill) and
  `--color-card-border-hover` (`rgba(57,255,106,0.4)`).

Distinction from the generic dark-dev-theme comes from **panel structure,
type, and restraint**, not from color variety. Resist spreading the accent around.

---

## 3. Typography Rules

- **Display / Headlines / Body:** `Cabinet Grotesk` - a sharp-cornered,
  maximalist grotesk, self-hosted via `next/font/local` from
  `src/app/fonts/cabinet-grotesk/` (weights 400/500/700/800). One typeface
  driving the whole hierarchy by weight and size, not a display/body font
  pair - built to carry an oversized, single-statement headline at hero scale.
  Set tight (`-0.02em` to `-0.035em`) at display sizes, relaxed leading
  (1.5-1.6) at body sizes, ~65ch max body measure.
- **Mono:** `JetBrains Mono` stays - the technical-readout voice: data values,
  status lines, nav index, spec rows, section labels, the catalog filter. The
  `.annotate` utility sets it small, tracked-out, uppercase.

**Banned:** `Inter` as a bare default, `Space Grotesk`, `Instrument Sans`
(retired with this revision), generic system sans with no deliberate choice
behind it, decorative serifs.

---

## 4. Component Stylings

- **Section headers:** a mono section label (section name + short annotation)
  set above a large `Cabinet Grotesk` title, with a hairline rule beneath.
  No figure code, no registration marks
  (`src/components/ui/section-header.tsx`).
- **Numbered project catalogue:** work is a real indexed catalogue of
  bordered rows, not a card grid (`src/components/projects.tsx`). The
  flagship project (`01`) is a bordered instrument panel with the hand-built
  UAV technical drawing on one side and a readout-strip caption
  (`UAV airframe · Spec 01`). Every row after it is numbered `#00X/0X`
  (index over total, tabular-nums, e.g. `#002/13`), not a bare index.
- **Status tag (`StatusTag`, in `projects.tsx`):** a bordered rectangle
  (`border border-rule`, sharp corners, **not** `rounded-full`) holding a
  small square accent or ink-3 dot plus a mono label (`SHIPPED`,
  `IN PROGRESS`, `ARCHIVED`). This is the repo-wide no-pill-badge rule
  enforced directly in the catalogue: plain bordered tag, never a colored chip.
- **Catalog filter (`src/components/ui/catalog-filter.tsx`):** a plain-text
  mono toggle row (`ALL` / `SHIPPED` / `IN PROGRESS` / `ARCHIVED`), active
  state marked by accent color plus the `.link-draw` underline mechanic, not
  a segmented-pill control.
- **Hover-revealed commit readout:** each catalogue row holds a real
  per-project GitHub stat line (`{commitCount} commits · last commit
  {date}`), collapsed to zero height and revealed on hover via a
  `max-height`/`opacity` transition, real fetched data only, never a filler number.
- **Buttons:** flat, sharp corners (0-2px radius). Primary = accent fill on
  near-black text. Secondary = a `.link-draw` underline link. Tactile `1px`
  translate on `:active`. No glow, no custom cursor. Max one primary CTA per section.
- **Spec rows / matrices:** numbers and capabilities stay typographic tables -
  mono cells, hairline rows. Data readouts (GitHub stats, unit counts) settle
  into their final value with a brief mono flicker on reveal, never a
  count-up-from-zero tween.
- **Status indicator:** one small square (not circular) accent dot + mono
  label (e.g. `SYSTEM · ONLINE`), used once, in the hero or nav.
- **GitHub dashboard:** the flagship data surface reads as an instrument
  cluster, not a typographic list. Three small bordered panels (repos,
  contributions, languages) sit beside two wide bordered panels (activity
  graph, language mix), all sharing the same `border border-rule` +
  mono-label chrome as every other panel in the system.
- **Nav section index:** the active-section marker (e.g. `01`) is a small
  bordered mono chip (`border border-rule`, rectangular corners) instead of
  bare bracketed text - a small readout, not a pill.
- **Row hover sweep:** bordered catalogue rows (project rows, STRATOS units,
  contact channels, skill categories) gain a flat `--color-accent-soft`
  background that sweeps in from the left on hover (`scaleX`, same mechanic
  as `ruleDraw`). Flat fill only, no gradient, no blur.
- **No pill clouds, no icon-chip cards, no marquee, no figure codes, no
  registration marks, no tick-rules.**

---

## 5. Layout Principles

- Hero is left-aligned and asymmetric. Never centered. (Unchanged from before.)
- Strong left margin column; mono section labels carry structure instead of figure indices.
- Work is a numbered catalogue of bordered rows; the flagship UAV project is
  a wide bordered instrument panel. The generic "3 equal cards in a row" stays banned.
- CSS Grid first. Max-width ~`1320px`, generous gutters (`px-6 md:px-10 lg:px-14`).
- Section rhythm `py-24 md:py-36`. Full-height hero uses `min-h-[100dvh]`.
- Every element owns its spatial zone; no overlapping text/images.
- Section order: Home -> Projects -> STRATOS -> Skills -> GitHub -> Contact.
  The catalogue now leads immediately after the hero as the first proof
  surface, ahead of STRATOS.

---

## 6. Motion & Interaction

Choreographed but exact (Motion 7/10). Spring-based throughout (motion.dev
principle: springs over hand-tuned easing), one spring config binding it
(`stiffness: 110, damping: 20`, unchanged). Variants live in `src/lib/motion.ts`.

- **Panels snap into grid alignment** - a panel locking into place, not lifting like a drafted plate.
- **Headlines unmask** line by line (clip-path up). Kept - a generically good technique.
- **Mono readouts settle** on reveal: a brief letter-spacing/opacity snap, not
  a numeric count-up. Real data only (GitHub stats, unit counts, per-project
  commit counts) - never animated for decoration on invented numbers.
- **Hairline rules extend** across on reveal (`ruleDraw`'s `scaleX` mechanic,
  reframed as a grid line activating).
- **Signature set-piece:** the hero quadrotor schematic
  (`src/components/ui/drone-schematic.tsx`, kept as-is - real hand-built
  asset) sits inside a bordered instrument panel.
- **Parallax:** gentle drift on the hero figure and the flagship project image, kept.
- **Perpetual micro-motion:** one square accent status indicator, one thin
  accent scroll-progress rule at the top of the viewport. That is the full
  budget - keep it quiet.
- **Boot sequence:** on initial load, the hero's stagger already sequences
  top-to-bottom; the nav bar fades in with a short delay after the hero's
  first elements resolve.
- **Readout settle (numeric):** a `readoutSettle` variant (`scale 1.04 -> 1`,
  opacity `0 -> 1`, same spring) for GitHub's real numeric values and the
  catalogue's per-row commit stats - distinct from `markIn`, which is for
  tracked-out mono labels, not numerals. Still real data only, still never a
  count-up-from-zero tween.
- **Row hover sweep:** a `scaleX` background sweep (`--color-accent-soft`,
  `transform-origin: left`, ~0.3s) behind bordered catalogue rows on hover.
  Transform-only, same discipline as `ruleDraw`.
- **Commit-stat reveal:** the per-row hover-revealed commit readout animates
  via `max-height`/`opacity` transition only, no layout-jank height jump.
- **Performance:** animate only `transform` / `opacity`. Respect
  `prefers-reduced-motion` (collapse to instant).

---

## 7. Hero Spec (signature)

- Left-aligned, asymmetric, founder-first. Mono role line above the headline:
  "Founder & Software Engineer" / "STRATOS İHA".
- Oversized 2-line headline in Cabinet Grotesk, domain-first: line 1
  **"ML · Embedded · Web"** (full Ink), line 2 **"is where I build."**
  (Ink-2) - states the technical range before the person, then resolves to
  the founder statement in the credentials list below it.
- The NASA Space Apps win is stated as a short mono status line in the accent
  color: "NASA Space Apps 2025 · Winner, Türkiye".
- Lead in Ink-2; a short credentials list with square tick marks (not L-corner ticks).
- Exactly one accent primary CTA ("View work") + one `.link-draw` secondary ("Get in touch").
- Right column: the animated quadrotor technical drawing, inside a bordered
  instrument panel with a readout-strip caption ("Autonomous quadrotor ·
  Flight-ready").
- No cursor-follow light, no fake console, no inline-image-in-headline gimmick,
  no stat counters in the hero.

---

## 8. Anti-Patterns (Banned)

- No terminal/console motif: no `$` prompts, fake boot logs, blinking cursors, `exit 0`.
- No drafting/monograph motif: no `FIG. 0X` figure codes, no registration-mark
  corner ticks, no tick-rule measurement edges. (Retired - do not reintroduce.)
- No emojis. No em dashes (use normal hyphens).
- No gradients, no glassmorphism/blur panels, no purple. Flat fills only, one accent.
- No `Inter` used as a bare unconsidered default, no `Space Grotesk`, no
  `Instrument Sans` (retired), no decorative serifs.
- No pure black (`#000000`). No neon / outer-glow shadows, no oversaturated
  accents beyond the one defined signal color.
- No gradient text on headers. No custom mouse cursors. No 3D tilt cards.
- No overlapping elements. No 3-equal-column card row. No centered hero.
- No count-up-from-zero stat filler (real values settle into place instead),
  no pill clouds (status/tags are bordered rectangles with a square dot,
  never `rounded-full` chips), no marquee.
- No fake names or fabricated round metrics. No AI copy cliches ("Elevate",
  "Empower", "Unleash", "Revolutionize", "Supercharge", "Seamless", "Next-Gen").
  No filler ("Scroll to explore", chevrons).
- No broken image links - real screenshots, SVG, or `picsum.photos` only.

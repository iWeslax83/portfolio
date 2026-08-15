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

> **Changelog:** Flight Log redesign (see
> `docs/superpowers/specs/2026-08-14-flight-log-redesign-design.md`) retires
> the hero gradient text-shift in favor of a scroll-scrubbed clip-path
> reveal; restructures the page into five GSAP-driven narrative beats.

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

**"Maximalist Signal" pass:** a follow-on pass over the same system that pushes
scale and density up without changing its structure. The hero headline and
section header titles now scale with the viewport (`clamp()`) instead of
stepping at fixed breakpoints, reading noticeably larger at wide widths. A
two-layer background texture (this repo's own commit history plus a
deterministic binary field, see Section 4 and 6) sits behind every section in
the no-WebGL fallback path; in the primary scene-mode experience it is
covered by the opaque 3D canvas (see Section 4, "Background texture").
Catalogue status tags and the catalogue filter switched to pill (`rounded-full`)
chrome, and per-row commit stats are always visible instead of hover-gated.
A second accent color (amber) was introduced under a narrow, explicitly scoped
exception - see Section 2, "Scoped exceptions."

- **Density:** 6 / 10 - up from 4/10. Real per-project commit-count/last-commit
  data is now always visible on every catalogue row (previously hover-gated),
  and the background texture layers add a constant low-opacity data field
  behind every section.
- **Variance:** 7 / 10 - asymmetric, offset, left-aligned. Never a centered hero.
- **Motion:** 9 / 10 - up from 7/10. Still choreographed and spring-smooth,
  and now scroll-driven throughout: the hero headline pins and reveals via a
  scroll-scrubbed clip-path (see Section 7), alongside two additional
  scroll-linked parallax layers (the texture layers), on top of the existing
  panel-snap/readout-settle/unmask vocabulary.

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
- **Accent - terminal green** (`#39FF6A`) - THE primary accent, used
  **scarcely**: at most one accent element per viewport zone (a CTA, a status
  indicator, an active nav item, a key number). Verified at **14.86:1** WCAG
  contrast against the `#09090B` canvas, comfortably clearing AA for both
  large and body-scale use. Saturated and exact, reads as "live," not "warm."
  Never blue, never purple, never neon-glow. Derived tokens: `--color-accent-soft`
  (`rgba(57,255,106,0.1)`, used for the row-hover-sweep fill) and
  `--color-card-border-hover` (`rgba(57,255,106,0.4)`).
- **Accent 2 - electric amber** (`#FF6A39`, `--color-accent-2`) - a second
  accent added for the "Maximalist Signal" pass. Verified at **6.99:1** WCAG
  contrast against the `#09090B` canvas. Derived token: `--color-accent-2-soft`
  (`rgba(255,106,57,0.12)`). This is **not** a general second accent to reach
  for - see "Scoped exceptions" immediately below for the only places it may appear.

### Scoped exceptions

One narrow, explicitly bounded deviation from the repo's global single-accent
/ no-gradient / no-pill rules (`.claude/CLAUDE.md`), introduced by the
"Maximalist Signal" pass. This is an exhaustive list, not precedent for
expanding gradient or pill use elsewhere:

- **Gradient** (`--color-accent` -> `--color-accent-2`) is permitted only at:
  1. the flagship project panel's border (`.gradient-border` in
     `src/app/globals.css`, applied in `src/components/checkpoints/Log.tsx`
     via its `flagship ? "gradient-border" : ...` conditional class) - a
     static `120deg` gradient border.

  No other gradient fills, text, or borders anywhere else in the system.

- **Pill (`rounded-full`) chrome** is permitted only for:
  1. `StatusTag` (`src/components/checkpoints/Log.tsx`) - the status label
     on the catalogue rows, in both scene and flat mode.
  2. `CatalogFilter` (`src/components/ui/catalog-filter.tsx`) - the
     ALL/SHIPPED/IN PROGRESS/ARCHIVED filter control.

  Every other status/tag/label surface in the system (the nav section-index
  chip, spec-row pills, etc.) keeps the repo-wide bordered-rectangle,
  never-`rounded-full` treatment.

Both exceptions are deviations tied to these named call sites, not a change to
the global rules stated in Section 8.

Distinction from the generic dark-dev-theme comes from **panel structure,
type, and restraint**, not from color variety. Resist spreading either accent around.

---

## 3. Typography Rules

- **Display / Headlines / Body:** `Cabinet Grotesk` - a sharp-cornered,
  maximalist grotesk, self-hosted via `next/font/local` from
  `src/app/fonts/cabinet-grotesk/` (weights 400/500/700/800). One typeface
  driving the whole hierarchy by weight and size, not a display/body font
  pair - built to carry an oversized, single-statement headline at hero scale.
  Set tight (`-0.02em` to `-0.035em`) at display sizes, relaxed leading
  (1.5-1.6) at body sizes, ~65ch max body measure. The hero headline
  (`clamp(3rem,5vw,4.75rem)`, `src/components/checkpoints/Liftoff.tsx`) and section header
  titles (`clamp(2.75rem,7vw,5.5rem)`, `src/components/ui/section-header.tsx`)
  use `clamp()` for continuous viewport-filling scale rather than fixed
  breakpoint steps - part of the "Maximalist Signal" pass.
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
- **Flight Log catalogue (`src/components/checkpoints/Log.tsx`):** work is a
  real indexed catalogue, never a card grid, rendered as a vertical list of
  bordered rows (`#00X`, tabular-nums index) beside its status tag, with the
  catalog filter above it. There is no GSAP horizontal hijack; the previous
  "section pins and becomes a scroll-hijacked track of full-viewport flight
  cards" mechanic was removed with the Flight Scene 3D redesign (see Section
  5) in favor of a single camera flying a 3D spline route, with this
  checkpoint's HTML panel fading in and out based on the active checkpoint.
  The flagship row carries the gradient border. In scene mode the list is
  capped to the flagship plus the next three rows so the panel fits inside
  its fixed viewport without capturing scroll; flat mode (the no-WebGL
  fallback, which scrolls normally) renders the full list.
- **Status tag (`StatusTag`, in `checkpoints/Log.tsx`):** a pill
  (`rounded-full` chip, `px-2.5 py-0.5`) holding a mono label (`SHIPPED`,
  `IN PROGRESS`, `ARCHIVED`) with a status-colored fill - accent green for
  `SHIPPED`, accent-2 amber for `IN_PROGRESS`, bordered/ink-3 for `ARCHIVED`.
  This is a **scoped exception** to the repo-wide no-pill-badge rule (see
  Section 2, "Scoped exceptions") - `StatusTag` is one of exactly two
  components permitted pill chrome; the general rule (bordered rectangle,
  never `rounded-full`) still applies everywhere else.
- **Catalog filter (`src/components/ui/catalog-filter.tsx`):** a pill
  segmented control (`ALL` / `SHIPPED` / `IN PROGRESS` / `ARCHIVED`,
  `rounded-full` buttons), the active segment filled accent-on-`bg`,
  inactive segments plain bordered text. The other **scoped exception** to
  the no-pill-badge rule (see Section 2) - previously a plain-text mono
  toggle row with no pill chrome.
- **Always-visible commit readout:** each catalogue row holds a real
  per-project GitHub stat line (`{commitCount} commits · last commit
  {date}`), rendered directly beneath the row's links - always visible, no
  longer hover-gated. Real fetched data only, never a filler number.
- **Background texture (`CommitMotif`, `src/components/ui/commit-motif.tsx`):**
  a fixed, `aria-hidden`, two-layer decorative field, below `main`'s content
  stack (`z-0` vs. `main`'s `z-index: 2`). It is mounted at document root and
  keeps running (still subscribed to scroll), but is only visible in the
  no-WebGL fallback path: the flight scene's `<Canvas>` paints an opaque
  `#0a0a0a` background (`Canvas.tsx`) that covers it whenever the 3D scene is
  active, so in normal (scene-mode) browsing it is not seen. Layer one is
  this repo's own real commit history (hash + message, from
  `src/lib/git-history.ts`) at `opacity-[0.13]`; layer two is a deterministic
  seeded binary (0/1) character field (`src/lib/binary-texture.ts`,
  `mulberry32` PRNG, fixed seed, identical server/client output - no
  hydration mismatch) at `opacity-[0.06]`. Each layer scroll-parallaxes at a
  different speed (commit layer to `-120px`, binary layer to `-260px` over
  full-page scroll) for a subtle depth separation.
- **Buttons:** flat, sharp corners (0-2px radius). Primary = accent fill on
  near-black text. Secondary = a `.link-draw` underline link. Tactile `1px`
  translate on `:active`. No glow, no custom cursor. Max one primary CTA per section.
- **Spec rows / matrices:** numbers and capabilities stay typographic tables -
  mono cells, hairline rows. Data readouts (GitHub stats, unit counts) settle
  into their final value with a brief mono flicker on reveal, never a
  count-up-from-zero tween.
- **Status indicator:** one small square (not circular) accent dot + mono
  label (e.g. `SYSTEM · ONLINE`), used once, in the hero or nav.
- **Telemetry bento dashboard (`src/components/checkpoints/Telemetry.tsx`):** GitHub
  stats and the skills matrix are one merged section, not two. The flagship
  data surface reads as an instrument cluster, not a typographic list: three
  small bordered stat tiles (repos, contributions, languages) above two wide
  bordered panels (activity graph, language mix), with a full-width bordered
  skills tile beneath them and a single GitHub link row closing the section.
  Every tile shares the same `border border-rule` + mono-label chrome as
  every other panel in the system. There is no standalone GitHub section and
  no standalone Skills section.
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
- Section rhythm `py-24 md:py-36` applies only to `CheckpointShell`'s flat-mode
  fallback (the no-WebGL path, which lays checkpoints out as normal
  document-flow sections). It does not apply to the primary scene-mode
  experience, where each checkpoint is a `fixed inset-0` panel that fades in
  and out over the 3D canvas rather than occupying document flow.
- Every element owns its spatial zone; no overlapping text/images.
- Section order (five beats): Home -> Flight Log -> Founder Story ->
  Telemetry -> Contact (`#home`, `#flight-log`, `#founder-story`,
  `#telemetry`, `#contact`). The catalogue leads immediately after the hero
  as the first proof surface, ahead of the STRATOS founder story; skills and
  GitHub data are merged into the single Telemetry beat.

---

## 6. Motion & Interaction

Choreographed but exact (Motion 9/10). Spring-based throughout (motion.dev
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
  accent scroll-progress rule at the nav's section-index chip (`src/components/nav.tsx`,
  `useScroll`/`useSpring`-driven `scaleX` bar). Everything else in the motion
  system, including the hero headline reveal, is scroll- or interaction-
  triggered - there is no time-based, non-scroll-gated loop anywhere in the
  system.
- **Texture parallax:** the two `CommitMotif` background layers drift at
  different scroll-linked speeds (commit-history layer to `-120px`, binary
  layer to `-260px` across full-page scroll progress) - a subtle depth cue
  behind the content stack, purely decorative, `aria-hidden`.
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
- **Commit-stat readout:** the per-row commit stat line renders always-visible
  (no longer hover-gated); it still participates in the row's `staggerContainer`/
  `plateIn` reveal on scroll into view, same as the rest of the row.
- **Performance:** animate only `transform` / `opacity`. Respect
  `prefers-reduced-motion` (collapse to instant).

---

## 7. Hero Spec (signature)

- Left-aligned, asymmetric, founder-first. Mono role line above the headline:
  "Founder & Software Engineer" / "STRATOS İHA".
- Oversized 2-line headline in Cabinet Grotesk, scaled with `clamp(3rem,5vw,4.75rem)`
  for continuous viewport-filling size rather than a fixed breakpoint step,
  domain-first: line 1 **"ML · Embedded · Web"** (full Ink), line 2
  **"is where I build."** - states the technical range before the person,
  then resolves to the founder statement in the credentials list below it.
  Both lines are plain solid-color text (line 1 Ink, line 2 accent green, no
  gradient); the section pins on scroll and each line unmasks via a
  scroll-scrubbed clip-path reveal (`useGSAP` + `ScrollTrigger`, `scrub:
  true`, `pin: true` - see Section 6), falling back to static (unpinned,
  fully revealed) on mobile and `prefers-reduced-motion`.
- The NASA Space Apps win is stated as a short mono status line in the accent
  color: "NASA Space Apps 2025 · Winner, Türkiye".
- Lead in Ink-2; a short credentials list with square tick marks (not L-corner ticks).
- Exactly one accent primary CTA ("View work") + one `.link-draw` secondary ("Get in touch").
- Right column: the quadrotor technical drawing, rendered static
  (`progress={1}`, fully drawn, no scrub and no loop), inside a bordered
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
- No gradients, no glassmorphism/blur panels, no purple. Flat fills only, one
  accent. **Scoped exception:** the "Maximalist Signal" pass permits a gradient
  at exactly one call site (the flagship panel's border) and a second accent
  color (`--color-accent-2`) confined to that plus the `IN_PROGRESS` status
  color - see Section 2, "Scoped exceptions," for the exhaustive list. This is
  not a repo-wide rule change.
- No `Inter` used as a bare unconsidered default, no `Space Grotesk`, no
  `Instrument Sans` (retired), no decorative serifs.
- No pure black (`#000000`). No neon / outer-glow shadows, no oversaturated
  accents beyond the one defined signal color.
- No gradient text on headers, anywhere - see Section 2, "Scoped exceptions,"
  for the one gradient exception in the system (the flagship panel's border,
  not text). No custom mouse cursors. No 3D tilt cards.
- No overlapping elements. No 3-equal-column card row. No centered hero.
- No count-up-from-zero stat filler (real values settle into place instead),
  no pill clouds (status/tags are bordered rectangles with a square dot,
  never `rounded-full` chips), no marquee. **Scoped exception:** `StatusTag`
  and `CatalogFilter` are the only two components permitted `rounded-full`
  pill chrome - see Section 2, "Scoped exceptions." Every other tag/label/
  status surface in the system keeps the bordered-rectangle rule.
- No fake names or fabricated round metrics. No AI copy cliches ("Elevate",
  "Empower", "Unleash", "Revolutionize", "Supercharge", "Seamless", "Next-Gen").
  No filler ("Scroll to explore", chevrons).
- No broken image links - real screenshots, SVG, or `picsum.photos` only.

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
- **Ink-3** (`#767676`) - tertiary labels, captions, mono annotations.
  Verified at WCAG AA (~4.54:1) against the `#FFFFFF` canvas, since
  `.annotate` renders it at 11px.
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
  support. `src/data/nav-items.ts` is the shared source of truth for these
  links, consumed by the nav bar, the mobile nav, and the footer's
  Navigation column alike.

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

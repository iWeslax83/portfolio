# Design Spec: Maximalist Signal

Status: approved by user, ready for implementation planning.
Extends: `2026-08-12-maximalist-headline-redesign-design.md` (the current shipped system - Cabinet Grotesk, terminal-green single accent, bordered-panel numbered catalog). This spec pushes that system further toward bekirerdem.dev's energy, not a re-theme.

Inspiration source: bekirerdem.dev, re-checked for this pass - massive display type dominating the viewport, a decorative binary/code texture layer, dense numbered project indexing, and layered typographic hierarchy.

---

## 1. Direction

The current system (shipped in the prior redesign) is correct in structure - bordered panels, mono readouts, numbered catalog, spring motion - but reads as too restrained next to the reference. This pass turns up three dials: **scale** (headline typography grows to dominate the viewport, allowed to sit close to the edges), **layer** (the git-commit texture motif becomes a visible two-layer background element instead of a faint watermark), and **color** (a second accent is introduced as a deliberate, scoped exception to the repo's single-accent rule).

## 2. Global rule exception (explicit, scoped to this project)

The user's global CLAUDE.md design rules (no gradient, single accent, no pill badges) are **not changed globally**. This spec carves out a documented, scoped exception for this portfolio only, recorded in `DESIGN.md` as an explicit deviation:

- A second accent color is added.
- Gradient fill is permitted, but only at the two call sites named in this spec (hero headline second line, flagship panel border) - not spread generally across surfaces.
- `rounded-full` pill chrome is permitted for status tags and the catalog filter, reversing the prior system's "no pill" rule for this component only.

Everything else in the global rules (no glassmorphism/blur, no purple, plain copy, no three-card-row, no em dashes) stays in force unchanged.

## 3. Color

- Primary accent stays **terminal green** (`#39FF6A`), unchanged - still the "something is live/real" signal.
- New second accent: **electric amber** (`#FF6A39`), a warm complementary counterpart. Used for: `IN_PROGRESS` status color, secondary/alternate CTA state, and as the gradient's second stop.
- Gradient use, scoped to exactly two places:
  1. Hero headline's second line - text-fill gradient, green to amber.
  2. Flagship project panel border - a thin gradient stroke, green to amber.
  No gradients anywhere else (backgrounds, buttons, cards stay flat fill).
- Contrast: both `#39FF6A` and `#FF6A39` must be verified at WCAG AA (>=4.5:1) against the `#09090B` canvas before use at body-text scale; large-scale headline use only needs AA-large (>=3:1).

## 4. Typography & scale

- Hero headline size moves to an aggressive `clamp()` range so it reads as viewport-filling on both mobile and desktop, tracking tightened further (`-0.04em`). Two lines stay (domain line, "is where I build." line); second line takes the gradient fill from section 3.
- Section headers (`section-header.tsx`) grow: title roughly doubles relative to its mono label, widening the contrast between the small tracked-out label and the big title - the label doesn't grow.
- Key numeric readouts (GitHub stats: repo count, contribution count) render at a visibly larger display size than the current mono-readout scale - still real fetched data, still settle-in on reveal, never count-up-from-zero.

## 5. Density & layered motif

- `commit-motif.tsx` background opacity raised from `0.05` to the `0.12-0.15` range.
- A second decorative texture layer is added behind/alongside the commit-hash texture: a binary (`0`/`1`) character field, generated deterministically (not random per render, so it doesn't shift on re-render/hydration) at build or module-load time. Both layers use `pointer-events-none`, `select-none`, `aria-hidden`, and sit behind `main`'s stacking context, same as today.
- The two texture layers get a subtle parallax offset from each other on scroll (differing scroll-linked translate speed), transform-only.
- Project catalog rows show their per-project meta (commit count, status) inline by default rather than hover-only - the hover-reveal mechanic is dropped in favor of always-visible density. (Last-commit date can stay hover-revealed if row width doesn't fit it - use judgment during implementation, but commit count and status must be always-visible.)
- Nav gets a mini scroll-progress bar next to the existing active-section index chip.

## 6. Pill / rounded shapes (scoped exception)

- `StatusTag` becomes a `rounded-full` pill: green fill for `SHIPPED`, amber fill for `IN_PROGRESS`, neutral ink-3 outline for `ARCHIVED`. Text stays legible (dark text on filled pill, or outlined pill with colored text - implementation's call, verify contrast).
- `CatalogFilter` becomes a pill-shaped segmented control (active segment filled, inactive segments plain).
- No other component adopts pill shapes - this exception is scoped to these two.

## 7. Motion

Motion budget raised from 7/10 to 9/10:
- Scroll-triggered reveal becomes more pronounced across every section (not just hero) - the two texture layers described in section 5 participate in this via their parallax offset.
- Hero headline's gradient gets a slow, continuous, looping shift (a few seconds per cycle) - the one piece of perpetual (non-scroll-gated) motion this spec adds, budgeted alongside the existing scroll-progress rule and status-indicator dot as the system's perpetual-motion allowance.
- Pill tags (status tags, active filter segment) get a small scale-in on their reveal transition.
- Existing mechanics (row hover sweep, readout settle, rule draw, panel snap) are unchanged.
- `prefers-reduced-motion` still collapses all of the above to instant, no exceptions including the new gradient loop.
- Performance discipline unchanged: animate `transform`/`opacity` only.

## 8. Explicitly out of scope

- Any further accent colors beyond green + amber.
- Gradient use outside the two named call sites in section 3.
- Pill shapes outside `StatusTag` and `CatalogFilter`.
- Changing section order, page flow, or copy - this spec is a density/scale/motion/color pass on the existing structure, not a restructure.
- Bilingual toggle, mood-state looping imagery (still out of scope per the prior spec).

## 9. Testing

Before marking any section complete: run the dev server, visually verify the golden path (hero -> full scroll to contact) at both mobile and desktop widths. Verify:
- Both accent colors meet their required WCAG contrast at the scale they're used.
- The binary texture layer is deterministic (no hydration mismatch, no per-render random flicker).
- `prefers-reduced-motion` disables the new gradient loop along with existing motion.
- Pill-shaped `StatusTag` and `CatalogFilter` remain keyboard-reachable and legible in both states.
- No gradient or pill usage leaks outside the four scoped call sites named in this spec.

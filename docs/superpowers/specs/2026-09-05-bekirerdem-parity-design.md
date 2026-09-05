# Design Spec: bekirerdem.dev Structural Parity

Supersedes nothing in `DESIGN.md`; extends it. The white/black/zero-accent
system from `docs/superpowers/specs/2026-09-04-white-system-redesign-design.md`
is the baseline and stays fully intact, colors and tokens unchanged. This
spec adds the specific structural/motion pieces that make the site read as
matching bekirerdem.dev's design, using only Emir's own real content, no
copied text, images, or paid fonts from the reference site.

## 0. Why, and what NOT to copy

The user (site owner) reviewed bekirerdem.dev and asked for a structural
clone: same layout patterns, same motion vocabulary, same typographic
attitude, own content. This spec exists to pin down exactly what "clone"
means so implementation doesn't drift into copying protected material:

- **Never copy:** their actual body copy, project descriptions, alt text,
  image assets, or source code/CSS.
- **Never ship their paid fonts** (`PP Editorial New`, `PP Fraktion Mono`,
  `PP Bigger Display` - all commercial fonts from Pangram Pangram foundry,
  no license held). Free substitutes only (Section 2).
- **Do copy:** layout structure, section rhythm, interaction patterns
  (scroll-reactive backgrounds, horizontal-scroll galleries, divider
  motifs), populated with Emir's real project screenshots (already on
  disk at `public/images/projects/*.png`) and real copy already in
  `src/messages/en.json` / `src/data/*.ts`.

## 1. Reference survey (what bekirerdem.dev actually does)

Captured by live inspection (screenshots + computed styles), not assumed:

- Pure `#000`/`#FFF`, zero accent color anywhere in SVG fills.
- Fonts: `Metamorphous` (hero display, free Google Font), `PP Editorial
  New` (body serif, paid), `PP Fraktion Mono` (mono labels, paid), `PP
  Bigger Display` (condensed bold headlines, paid) with `Oswald` and
  `JetBrains Mono` loaded as visible fallbacks in their own font stack.
- Nav: circular monogram logo, text links, GitHub + LinkedIn icon
  buttons, a two-line status blurb ("Building from X." / "Shipping Y.
  Hire me."), language switch, theme toggle.
- Hero: full-bleed reactive fine-line grid mesh that warps, binary-digit
  ticker strips as top/bottom dividers, giant serif triptych headline
  with dot separators.
- About: full-bleed diagonal wireframe grid behind a body-copy panel.
- Skills: a black inset "room" panel (looks 3D via perspective-warped
  wireframe walls/floor) holding floating cross marks, a small
  wireframe-globe icon card, a hatch-texture swatch card.
- Work transition: an ink-filled rounded pill reading "WORK" vertically,
  which scales up and tiles into a repeated emboss-letter background;
  real project screenshot cards (rotated, scattered, labelled) scroll
  horizontally across that tiled background.
- Contact CTA: radial burst lines converging on a center point/icon, a
  huge three-line condensed headline, a circular "GO" pill button
  bracketed by thin wavy divider lines.
- Footer: a dot-pattern transition band, then a black panel with a giant
  low-opacity wordmark behind two columns (Contact / Navigation), a thin
  rule, and a colophon line.

## 2. Font substitution (licensing constraint)

| Reference font (paid) | Role | Free substitute | Source |
|---|---|---|---|
| `PP Bigger Display` | condensed bold display (WORK, CTA headline) | **Oswald**, weight 700 | Google Fonts, replaces `--font-condensed` (currently Bebas Neue) |
| `PP Editorial New` | body serif | **Fraunces** (already loaded) | no change |
| `PP Fraktion Mono` | mono labels | **JetBrains Mono** (already loaded) | no change - bekirerdem's own fallback stack uses it too |
| `Metamorphous` | hero display accent | **Metamorphous** | Google Fonts, free - exact match, add as new `--font-display-accent` |

Bebas Neue is dropped project-wide, replaced by Oswald 700 everywhere
`font-condensed` is used. That is the Contact CTA headline only - the
WORK pill and WORK tile letters use `font-display` (Cabinet Grotesk),
not `font-condensed`, and this pass does not touch that face. Oswald is
closer to Bigger Display's grotesque weight and reads less "poster-thin"
than Bebas at large sizes for the one call site it does replace. The
emboss-letter legibility finding flagged as Minor in the prior review is
untouched by this pass and remains open as separate follow-up work.

Colors stay at the documented near-black `#0A0A0A` / white `#FFFFFF`
tokens, not literal pure `#000`/`#FFF` - that was a deliberate,
WCAG-reasoned choice in `DESIGN.md` and this spec doesn't reopen it.

## 3. Nav additions (`src/components/nav.tsx`)

Add, right side of the bar, next to the existing logo/links:

- GitHub icon button -> `https://github.com/iWeslax83` (reuse the
  `GitHubIcon` SVG already defined inline in `Landing.tsx` - extract it
  to a shared component, see Task list).
- LinkedIn icon button -> `https://linkedin.com/in/emirsakarya` (same
  extraction for `LinkedInIcon`).
- A two-line status annotation, `.annotate`-styled, real content:
  line 1 "Building from Bursa, Turkiye." line 2 "Shipping founder-built
  products. `Get in touch`" (the last three words link to `#contact`).
  Hidden below `md` breakpoint (nav is already tight on mobile; the
  hamburger menu is the mobile affordance).

No language switch, no theme toggle: the site has one locale (English)
and one visual mode. Adding either would be a dead/non-functional
control, which is the exact defect class fixed in the prior review
(dead-anchor links). Omit both, deliberately.

## 4. Hero (`src/components/checkpoints/Liftoff.tsx`)

- Extend `WireframeMesh` with a pointer-driven warp, self-contained
  inside `Liftoff.tsx` - not wired to the flight-scene's scroll progress.
  `Liftoff` currently receives only `visible`/`mode` props, and the
  `liftoff` checkpoint's scroll window is tiny (4.3% of the total
  spacer, `route.ts:21`); threading `progressRef` in for a barely-visible
  window isn't worth the coupling. Instead: a small `pointermove`
  listener (added in `Liftoff.tsx`, cleaned up on unmount) tracks cursor
  position normalized to -1..1 across the viewport, written to a ref and
  applied via `requestAnimationFrame` to a CSS custom property
  (`--mesh-skew`) consumed by an inline `transform: skewY(var(--mesh-skew))`
  on the `WireframeMesh` wrapper, clamped to +/-3deg. No new prop, no
  flight-scene interface change, works identically in `scene` and `flat`
  mode, degrades to static (no listener attached) when
  `prefers-reduced-motion` is set (reuse the existing
  `useReducedMotionPref` hook from `@/lib/scroll`).
- Add a new `BinaryTicker` component: a thin horizontal strip of
  seeded-random 0/1 digits (mulberry32, same deterministic pattern as
  `wireframe-mesh.ts` - SSR-safe, no hydration mismatch), monospace,
  `text-ink-3`, placed as a top and bottom border-adjacent strip within
  the hero viewport. Purely decorative, `aria-hidden`.
- The existing triptych headline (`hLine1`: "ML · Embedded ·
  Web") gets its dot separators re-set in the new `Metamorphous` font at
  a reduced size relative to the surrounding words, matching the
  reference's dot-separator treatment. The words themselves keep the
  current display font (Cabinet Grotesk) - only the separators and,
  optionally, one accent word switch face, so the effect reads as
  typographic punctuation, not a full font swap that would hurt
  legibility (Metamorphous is a blackletter-flavored display face, bad
  for body-length text).

## 5. Founder story / About (`src/components/checkpoints/Ventures.tsx`)

Add a full-bleed background: a second, differently-seeded
`WireframeMesh` instance rotated via CSS `transform: rotate(-6deg)
scale(1.4)` and clipped to the section bounds (`overflow-hidden`
wrapper), sitting behind the existing ventures list at low opacity
(reuse `--color-rule`, already faint). This is the same component as the
hero's, seeded differently and rotated, not a new generation algorithm -
keeps the "deterministic, SSR-safe" property for free.

## 6. Skills / Telemetry (`src/components/checkpoints/Telemetry.tsx`)

Wrap the existing skill-category chip list in a new `SkillsRoomPanel`
component:

- A `bg-ink` inset panel (rounded corners, matching the WORK pill's
  radius language) containing:
  - A handful (5-6) of small `+` cross marks, absolutely positioned at
    seeded coordinates (same mulberry32 pattern), `text-bg` at low
    opacity - the reference's floating-node motif, reimplemented as
    static deterministic marks (no 3D room simulation - that's real
    engineering scope this spec explicitly excludes).
  - One small white card holding a wireframe-globe icon (a simple SVG:
    an ellipse with 3-4 latitude/longitude arcs, hand-authored, not
    traced from the reference).
  - One small card with a 45deg hatch-pattern SVG fill (`--color-ink-3`
    lines), same visual family as the reference's texture swatch.
- The actual skill items (existing `skills.ts` data) render as the
  panel's content, in `text-bg` for contrast against the black panel,
  replacing their current on-white presentation for this section only.

## 7. Work gallery (`src/components/checkpoints/work-carousel/`)

Keep `WorkIntroBackground.tsx`'s pill-to-tile mechanic and the
`useWorkCarouselProgress` stage timing completely unchanged - that
machinery is already correct and already matches the reference's
pill-to-tile transition.

Change only the **carousel stage's rendering** in `Log.tsx`: instead of
the current single-focus crossfade (`ProjectCard` centered, one at a
time, `translateX`/`scale`/`opacity` driven by index), render all
featured projects' `ProjectCard`s simultaneously, each with a fixed
seeded rotation (-4deg to 4deg) and a horizontal position derived from
`stageProgress` (so scrolling still scrubs them left-to-right across the
viewport, same input as today, different layout). Real screenshots only
(`public/images/projects/*.png`, already on disk for every real project
- no new assets to source). This preserves every mechanical hook
(`useWorkCarouselProgress`, checkpoint scroll timing) and changes only
how `stageProgress` maps to visual position - a visual-skin change to an
existing mechanism, consistent with this project's established pattern
for this kind of work.

## 8. Contact CTA (`src/components/checkpoints/Landing.tsx`)

Keep the existing `RadialBurst` background and the `ctaLine1`/`ctaLine2`
condensed headline exactly as-is (already matches the reference
structurally). Add:

- A circular "GO" button (`bg-ink text-bg`, mono label, same size
  language as the WORK pill's roundedness) between the headline and the
  contact list, wrapping to `#contact`'s own anchor (a no-op scroll
  target, since the CTA already lives in the contact section - it's a
  visual full-stop / "confirm" affordance, not a new destination).
- Two thin wavy divider lines (a single seeded sine-ish SVG path,
  `--color-rule`) bracketing the button above and below, matching the
  reference's divider treatment around its own "GO" button.

## 9. Footer

No changes. `src/components/footer.tsx` already ships the dot-pattern
transition band, the black two-column panel, the giant low-opacity
wordmark (`"FOUNDER ENGINEER"`), and the colophon line - this already
matches the reference's footer structure exactly. Confirmed by direct
comparison during this spec's research pass.

## 10. Global constraints (binding on every task)

- No literal copying of bekirerdem.dev's text, images, or source.
- No paid/unlicensed fonts - Section 2's substitution table is exact and
  final.
- The WebGL flight-scene camera, drone model, and
  `useWorkCarouselProgress`'s stage-timing contract are untouched.
- Every new decorative generator (ticker digits, cross marks, hatch
  pattern, wavy divider) must be deterministic/seeded exactly like
  `wireframe-mesh.ts` and `radial-burst.ts` already are - no
  `Math.random()`, no client-only generation that could hydration-mismatch.
- No dead anchors: every new interactive element either does something
  real or isn't added (this is why the nav gets no language switch or
  theme toggle).
- No em dashes, no AI-attribution commit trailers (standing project
  rules).
- Zero accent color - colors stay exactly as `DESIGN.md` documents them
  today; nothing in this spec changes a hex value.

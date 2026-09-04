# Design Spec: White System Redesign

Status: approved by user, ready for implementation planning.
Supersedes: every prior visual-system spec in this repo (`2026-08-09-instrument-redesign-design.md` through `2026-09-04-work-carousel-redesign-design.md`) with respect to color and typography tokens. `DESIGN.md` is rewritten from scratch by this pass, not amended.

Reference: bekirerdem.dev, inspected directly across multiple browser sessions this conversation (hero, nav, About/Skills, the WORK-intro-to-carousel mechanic, CTA, footer, all visually confirmed via screenshots; no dark/light toggle or mobile-nav interaction was material to this spec's decisions). This spec describes the *structural techniques and design language* observed, in original terms, to be rebuilt from scratch with this site's own copy, data, fonts, and code. No code, copy, or asset from that site is copied - see Section 10.

---

## 0. Why

The user directly requested the site look "exactly or similar" to bekirerdem.dev after finding the just-shipped Work Carousel redesign (`2026-09-04-work-carousel-redesign-design.md`) visually unsatisfying. Given a choice between (A) a full palette/typography inversion matching the reference's actual design language, or (B) adopting only its structural techniques inside the existing terminal-green/black-canvas identity, the user explicitly chose (A) - including a follow-up confirmation that the existing terminal-green accent color should be dropped entirely, not carried forward into the new system. This is a deliberate, informed decision to retire the black-canvas/single-green-accent identity this site has carried through five prior redesign passes, in favor of a new one.

Separately (documented for the implementation plan, not re-litigated here): live browser inspection of the just-shipped Work Carousel surfaced two real defects independent of this redesign - project cards overlap instead of showing one at a time, and the "01 work" nav link doesn't scroll the page. This spec's carousel section (4) folds the fix into the same rebuild, since the carousel is being rebuilt regardless.

## 1. Scope boundary

This is a **visual system replacement**, not a mechanical/architectural one. The existing five-beat checkpoint structure, the WebGL flight-scene camera and drone model, the `CheckpointShell` scene/flat mode split, and the scroll-progress data flow (`progressRef`, `useFlightProgress`, `useWorkCarouselProgress`) all stay exactly as they are. This spec changes color tokens, typography tokens, and the visual treatment of every section's content - not the underlying scroll/camera/checkpoint mechanics. See Section 11 for what is explicitly not touched.

## 2. Color tokens (full replacement of `src/app/globals.css`'s `@theme` block)

Every existing color token is replaced. There is no accent color in the new system - none. Status, links, buttons, and emphasis are carried entirely by weight, size, underline, and border, never by color.

- **Canvas** (`--color-bg`): `#FFFFFF`. Pure white, not the old near-black. The system's "never pure black, never pure white" rule from the retired system is explicitly lifted for this pass.
- **Panel** (`--color-panel`) / **Panel-2** (`--color-panel-2`): very light warm-neutral grays (`#F5F5F3`, `#EDEDEA`) for raised/nested surfaces - still reads as "white" but distinguishes layered panels (the WORK pill, card frames) from bare canvas.
- **Ink** (`--color-ink`): `#0A0A0A`. Near-black primary text and headlines, not pure `#000` (slightly softer, avoids harsh print-black).
- **Ink-2** (`--color-ink-2`): `#6B6B6B`. Secondary text, descriptions.
- **Ink-3** (`--color-ink-3`): `#9A9A9A`. Tertiary labels, captions, mono annotations. Must be verified at WCAG AA (>=4.5:1) against `#FFFFFF` at the small sizes `.annotate` uses (11px) - if `#9A9A9A` fails, darken until it passes; do not ship an unverified contrast ratio.
- **Rule** (`--color-rule`): `rgba(10,10,10,0.12)`. Hairline borders, dividers, grid lines.
- **Rule-Strong** (`--color-rule-strong`): `rgba(10,10,10,0.28)`.
- **No `--color-accent` or `--color-accent-2` token exists in the new system.** Every call site that previously referenced `--color-accent`/`--color-accent-2` (status dots, `StatusTag`, links, buttons, the flagship gradient border, `CatalogFilter`'s active state, the nav scroll-progress bar, the hero's second headline line) is redesigned in this pass to use ink/weight/underline/border instead - see Section 9 for the full per-component list.
- **Card/border tokens** (`--color-card`, `--color-card-border`, `--color-card-border-hover`): collapse to reuse `--color-panel`/`--color-rule`/`--color-rule-strong` directly - no separate card-specific palette needed once there's no accent-tinted hover state.

## 3. Typography tokens

Three display faces plus the existing mono, each with a distinct structural role - matching the reference's deliberate multi-typeface hierarchy without using its actual fonts.

- **Serif** (`--font-serif`): **Fraunces** (Google Fonts, variable, self-hostable via `next/font/google`), a moody editorial display serif. Carries the hero headline and any long-form founder-story prose. This is a new role this system didn't have before - an original substitute for the reference's blackletter-leaning serif, not an attempt to match it exactly.
- **Display/body grotesk** (`--font-display` / `--font-sans`): stays **Cabinet Grotesk**, already self-hosted (`src/app/fonts/cabinet-grotesk/`, `layout.tsx:12-21`), no new license needed. Carries bold block labels, skills-matrix words, nav links, section titles, catalogue rows - its existing structural role, just reskinned to the new palette.
- **Condensed display** (`--font-condensed`): **Bebas Neue** (Google Fonts, single weight, self-hostable via `next/font/google`), a bold condensed face for oversized, multi-line CTA-style typography. New role, used exactly once (Section 7).
- **Mono** (`--font-mono`): stays **JetBrains Mono** (`layout.tsx:25-30`), unchanged. Carries data readouts, status lines, project IDs, nav index - identical role to before, and coincidentally the same idiom the reference itself uses for its own binary-strip and ID-code elements.

Both new fonts (Fraunces, Bebas Neue) load via `next/font/google` in `layout.tsx`, following the exact pattern the existing `JetBrains_Mono` import already uses - `variable` CSS custom properties wired into `@theme` in `globals.css`, `display: "swap"`.

## 4. Hero (`Liftoff.tsx`)

- White canvas. Full-bleed animated wireframe background: a distorted vertical-line mesh (an SVG `<path>` grid whose line positions are perturbed by a smooth noise function, animated via a slow scroll- or time-linked offset) rendered in `--color-rule`-weight thin lines - an original technique matching the reference's fluid warped-grid effect, not its literal implementation.
- Binary-digit texture strips: reuse this site's existing real commit-history data pipeline (`src/lib/git-history.ts`, `src/lib/binary-texture.ts`, already deterministic/SSR-safe) but restyle as two thin horizontal strips (above and below the headline) instead of the current full-page diagonal wash - matching the reference's strip placement while keeping this site's own "real data, not decoration" principle intact (`DESIGN.md`'s existing texture rule survives this pass even though its colors don't).
- Headline: 3 lines, set in Fraunces, replacing the current 2-line Cabinet Grotesk treatment. Content stays domain-first (`"ML · Embedded · Web"` framing preserved) - this pass changes typeface and scale, not copy.
- Credentials list, CTA buttons: reskinned to ink-on-white, buttons become bordered-rectangle (never filled with an accent color) with a hover state carried by border-weight or a subtle fill shift to `--color-panel`, not color.

## 5. Nav (`nav.tsx`, `mobile-nav.tsx`)

- White canvas nav bar (was near-black), ink text, hairline bottom border on scroll (replacing the current accent-tinted border).
- Logo mark, section links, GitHub/LinkedIn icons - unchanged structure, reskinned.
- The nav's scroll-progress bar (`nav.tsx`, `useScroll`/`useSpring`-driven `scaleX`) loses its accent-green fill; it becomes an ink-filled bar at reduced opacity, or a bordered-outline bar that fills solid on progress - implementer's call, verify visually, but it must not reintroduce any accent color.
- **No dark/light theme toggle is added.** The reference has one because it supports two themes; this site is committing to one fixed white system, so a toggle is out of scope (Section 11).
- Mobile nav sidebar: same content, reskinned to the new tokens, no structural change.

## 6. Work carousel (`Log.tsx`, `work-carousel/*`)

This section rebuilds the scene-mode carousel shipped in the prior pass, both for the visual-system swap and to fix two defects live inspection surfaced:

- **Defect fix - single-focus card, not overlapping.** The current implementation renders the active AND next `ProjectCard` simultaneously through most of the carousel's scroll range (`translateX` slide with only 70vw separation between two ~80vw-wide cards), producing visible overlap. The reference's actual mechanic shows one project fully replacing the previous one. Fix: change the carousel-stage transition to a crossfade + scale (previous card fades/shrinks out as the next fades/grows in), with no more than one card at meaningfully non-zero opacity at any given scroll position. This also naturally gives the tiled-letter background room to read as a clean backdrop instead of being crowded at the card's edges (the other live-inspection finding).
- **Defect fix - nav anchor.** Clicking "01 work" in the nav changes the URL hash to `#flight-log` but does not scroll the page. Root cause is not yet diagnosed (deferred to the implementation plan's investigation) - likely the anchor `<span>` elements `FlightSceneRoot.tsx` renders inside the pinned spacer aren't reachable by native anchor-scroll behavior, since the scene-mode layout uses `position: fixed` panels rather than normal document flow. Fix approach: intercept nav link clicks for scene-mode anchors and drive scroll via `progressRef`'s underlying scroll container directly (e.g. `window.scrollTo` to the anchor span's computed position, or drive GSAP's `ScrollTrigger` programmatically) rather than relying on native `<a href="#...">` behavior, which this layout doesn't support. Confirm the actual root cause during implementation before committing to a specific fix.
- **WORK pill:** now white on white ground works structurally as originally intended by the reference (black stadium pill, dot-textured, on a white hairline grid) - since the accent-vs-canvas contrast problem from the prior pass (pill and background sharing `bg-bg`) is moot once the pill is explicitly `--color-ink`-filled (black) against the white canvas. "WORK" set in white Cabinet Grotesk Extrabold inside the black pill.
- **Tiled letters:** the four W/O/R/K rows get a real drop-shadow / embossed-bevel treatment on each letter (a CSS `text-shadow` or layered duplicate-text technique, offset down-and-right, in a mid-gray) - the concrete technique gap identified in live inspection of the prior pass's flat letters.
- **Project cards:** white/bordered mockup-window frame, ink text, real screenshot or (for projects without one) the existing typographic placeholder pattern - reskinned, mechanic otherwise unchanged from the prior pass's `ProjectCard.tsx` (Section 4/5/7 of the prior spec still apply structurally; only color/typography and the single-focus transition change).

## 7. Ventures, Telemetry, Contact (`Ventures.tsx`, `Telemetry.tsx`, `Landing.tsx`)

- **Ventures:** numbered bordered-row structure (Section 2 of `2026-09-03-ventures-content-hardening-design.md`) stays exactly as built - reskinned to ink-on-white, no structural change.
- **Telemetry:** stat tiles, contribution graph, language bar reskinned to ink-on-white (the language bar's per-language colors, sourced from GitHub's real language-color data, are the one legitimate exception to "no color" - they're real external data, not a design accent, and stay as-is). Skills matrix changes from small bordered pill-free tags to oversized one-word Cabinet Grotesk blocks per category (matching the reference's About/Skills block treatment), each block paired with its tool list in a smaller mono/body style beneath it.
- **Contact:** before the existing contact-channel list, add a new CTA statement: large multi-line typography in Bebas Neue, growing/revealing on scroll, backed by a radial burst of thin lines converging on a small center mark (an original technique echoing the reference's radial CTA background, built with the same SVG-perturbed-line approach as the hero's wireframe, different parameters). Copy: an adapted version of this site's existing `ctaLine1`/`ctaLine2` content (`"Let's build something" / "that flies."`), not the reference's own CTA text.

## 8. Footer (`footer.tsx`)

Full rebuild, replacing the current single-line colophon footer:

- A white bordered-grid block (reusing the hairline-grid SVG technique from the hero) transitions into a black dot-pattern band (small ink-colored dots on white, or the inverse - implementer's call on which reads better against the section above it), which transitions into a full black footer panel.
- Footer panel: two columns - **Contact** (email, GitHub, LinkedIn - this site's real existing contact channels from `Landing.tsx`'s `contacts` array, not the reference's own social links) and **Navigation** (the site's real section links).
- A giant, low-opacity background wordmark sits behind the footer's two columns - real site branding text (e.g. this site owner's name or a short identity phrase), not the reference's copy.
- Closing line: copyright + "Designed and built by [name]" colophon, adapted from the existing `footer.colophon`/`footer.meta` i18n keys, reskinned.

## 9. Full accent-removal audit (every existing accent call site)

Every one of these must be resolved to a non-color (ink/weight/border/underline) treatment as part of this pass - this is the concrete checklist for "no accent color, full stop":

- `StatusTag` (`Log.tsx`/shared component): dot color per status (green/amber/gray) becomes a shape or weight distinction instead (e.g. filled vs. outlined vs. dashed square, or bold vs. regular label weight) - real status information must remain legible without color.
- `CatalogFilter`: active-segment fill becomes ink-filled/white-text instead of accent-filled.
- Flagship `.gradient-border` (`globals.css:189-194`, `Log.tsx`'s `FlatCatalogue`): the green-to-amber gradient border is retired entirely (both accent tokens it depends on are gone) - flagship distinction becomes a heavier border weight or a filled ink header bar instead.
- Hero's second headline line (previously accent-colored text): becomes ink, distinguished by the Fraunces/Cabinet Grotesk pairing instead of color (Section 4).
- Nav scroll-progress bar, active nav-link underline: ink-based (Section 5).
- `.status-dot`/`.animate-signal` (globals.css, used in `Landing.tsx`'s availability line): the pulsing square status indicator loses its green fill, becomes an ink-filled square with the same pulse animation - the "something is live" signal is carried by the pulse motion alone now, not color-plus-motion.
- `::selection` (globals.css): text-selection highlight changes from accent-green-on-black to ink-on-white-panel (or browser default) - still needs to be legible, just not colored.
- Any remaining `text-accent`/`bg-accent`/`border-accent`/`accent-2` Tailwind utility class usage anywhere in `src/components/` - grep for all of them during implementation and resolve each one individually; this list is a starting point, not exhaustive.

## 10. What is NOT copied from bekirerdem.dev

No code, CSS, font files, image assets, copy text, or project data from bekirerdem.dev is used anywhere in this implementation. Every technique described above (wireframe mesh, embossed letters, radial CTA burst, dot-pattern footer transition, giant background wordmark) is rebuilt from scratch in this site's own stack (Next.js, Tailwind, Framer Motion/GSAP, this site's existing font-loading pattern) using this site's own real content (project data, contact channels, founder copy). Typeface choices (Fraunces, Bebas Neue) are original substitutes chosen for similar structural character, not attempts to identify or license the reference's actual fonts.

## 11. Explicitly out of scope

- The WebGL flight-scene camera, drone model, spline route, and `CheckpointShell`'s scene/flat mode split - all mechanical infrastructure stays exactly as-is (Section 1).
- A dark/light theme toggle (Section 5) - this site commits to one fixed white system.
- Any restructuring of the five-beat section order, anchors, or checkpoint ids.
- A "hacker mode" mood-image carousel or equivalent new section - the reference has one, but adding a net-new section beyond what's already specified above is not part of this request.
- Bilingual/i18n structural changes - site stays English-only.
- Mobile-nav or dark/light-toggle interaction parity with the reference - not inspected in enough depth to spec precisely, and not requested.

## 12. Testing

- No browser access exists in the implementation sandbox for this pass (confirmed repeatedly this session) - every visual claim in this spec must be verified by a human running `npm run dev` locally, in both scene mode and flat mode, at desktop and mobile widths, before this work is considered visually complete. Given how badly the prior pass's untested visual assumptions missed, this human check is not optional polish - it is the actual verification step for a spec this visually significant.
- `npx tsc --noEmit` and `npm run build` must both pass as the mechanical gate, same as every prior pass.
- Verify specifically: zero remaining references to `--color-accent`/`--color-accent-2` or Tailwind `accent`/`accent-2` utility classes anywhere in `src/` (Section 9's audit), the two Work Carousel defects (card overlap, dead nav anchor) are actually fixed, `--color-ink-3`'s contrast ratio against `--color-bg` is verified at AA for its 11px usage, and both new Google Fonts (Fraunces, Bebas Neue) load correctly with no FOUC/layout-shift regression.

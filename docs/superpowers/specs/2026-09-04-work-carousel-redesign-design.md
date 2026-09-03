# Design Spec: Work Carousel Redesign

Status: approved by user, ready for implementation planning.
Extends: `2026-08-15-flight-scene-3d-redesign-design.md` (current shipped system - 3D flight scene, five-beat checkpoint structure, scroll-scrubbed camera) and `2026-09-03-ventures-content-hardening-design.md` (most recent content pass). This spec replaces the "Selected Work" beat's internal mechanic and fixes an unrelated, independently-diagnosed footer bug. It does not touch the other four beats' content or the 3D camera route mechanics for Liftoff/Ventures/Telemetry/Landing.

Reference: bekirerdem.dev, inspected directly (browser screenshots taken during this session's brainstorming pass) for its Work-section transition mechanic. This spec describes the *technique observed* (pinned tiled-letter background, one project card sliding through at a time, mini-window screenshot framing with a name/ID label pair) in original terms, to be rebuilt from scratch with this site's own data, assets, fonts, and motion vocabulary. No code, copy, or asset from that site is copied.

---

## 0. Why

Two independent problems triggered this pass:

1. **Footer bug (confirmed via code reading):** `FlightSceneRoot.tsx` hides the entire fixed overlay layer (3D canvas *and* every checkpoint panel, including Contact) the instant scroll progress reaches 1.0. Because Contact is rendered exclusively through that same fixed layer, it vanishes at the exact moment the user reaches the bottom of the page, leaving blank space immediately followed by Footer - reading as "the page breaks and only the footer shows."
2. **"Selected Work" 3D experience feels bad while scrolling.** The user's complaint is specifically about the 3D drone-flight camera being active while trying to read the project catalogue. The user provided a screenshot of bekirerdem.dev's own "WORK" section-title treatment (a black stadium/pill shape on a white grid background, "WORK" spelled vertically) as the desired look for what comes before the project list, and asked for the whole "Selected Work" experience to be rebuilt closer to that reference site, including a per-project screenshot carousel.

Direct inspection of bekirerdem.dev (this session, via browser automation) confirmed the reference's Work-section transition is built with 2D CSS transforms (scale/translate/opacity on flat DOM layers), not literal 3D geometry - there is no true perspective/3D happening in that section. This resolves the technical-approach question raised during brainstorming: building this as a 2D DOM/CSS overlay, fully decoupled from the WebGL drone camera, both matches the reference's actual technique and directly fixes the "3D experience feels bad" complaint, since the drone camera stops needing to run during this beat at all.

## 1. Footer bug fix

**File:** `src/components/flight-scene/FlightSceneRoot.tsx`

Today (around the `pastEnd` state and its consuming `<div className={pastEnd ? "hidden" : ""}>`), reaching `progress >= 1` hides the 3D canvas *and* all five checkpoint panels in one wrapper. Split this: `pastEnd` should only hide `<FlightSceneCanvas>`. The checkpoint panels (all five, but Landing/Contact specifically matters here) stay in the render tree past `pastEnd`, so Contact settles into view normally rather than disappearing. Exact mechanism (conditional wrapper vs. per-component prop) is an implementation detail; the requirement is: at `progress >= 1`, the 3D canvas stops rendering, and Contact remains visible with no blank gap before Footer.

This is a small, independent fix - land it as its own change, not entangled with the carousel rebuild below.

## 2. WORK intro screen

Replaces today's plain `SectionHeader`-driven "Selected Work" title for this beat, in scene mode only (flat mode keeps the existing plain catalogue - see Section 8).

- A white background with a thin grid-line pattern (hairline rules, both axes, generous fixed cell size - visually a drafting/blueprint grid, consistent with this site's own "instrument panel" visual history even though the grid motif itself is new to this specific screen).
- Centered: a black stadium/pill shape (fully rounded rectangle, tall and narrow) with a thin light border, containing a fine dot-pattern texture at low opacity, holding "WORK" set in the site's own `font-display` (Cabinet Grotesk, not a new typeface), one letter per line, vertically stacked, bold, white.
- This is a static entry frame - the first thing visible when the user's scroll position enters this beat's checkpoint window.

## 3. Letter-tile pinned background

On continued scroll (still within the same checkpoint window), the pill's four letters expand: each letter becomes its own full-width horizontal row (a row of W's, a row of O's, a row of R's, a row of K's, stacked in that order, top to bottom), tiled/repeated across the viewport width at large scale, on the same black dotted canvas the pill established. This tiled-letter field becomes a **pinned background** - it does not scroll away - for the remainder of this beat's scroll range (the project carousel, Section 4).

Implementation: CSS `position: sticky` (or the equivalent fixed-within-checkpoint-window technique already used for `CheckpointShell`'s scene-mode panels) holding the tiled-letter layer in place while an inner progress value (Section 8) advances the project index in front of it. Scale/opacity transition from the static pill (Section 2) into the tiled rows is scroll-scrubbed, not a fixed-duration animation - it tracks scroll position 1:1 like every other scroll-driven effect in this system.

Transform-only (`scale`, `translate`, `opacity`), matching this system's existing performance discipline (`DESIGN.md` Section 6). No new library - built with the existing GSAP/Framer Motion stack already in the project.

## 4. Project carousel

On top of the pinned letter-tile background, exactly one project card is visible at a time, matching the observed reference technique:

- **Frame:** a small mockup-browser-window styled container (a thin top bar suggesting a browser chrome, content area beneath it) holding either a real screenshot (Section 5) or a typographic placeholder (below), roughly centered in the viewport.
- **Label pair:** project name bottom-left of the frame (mono, small, matching this site's existing annotation styling), an index code bottom-right in the form `#00X/13` (tabular-nums, matching this site's existing index idiom already used in `Log.tsx`'s numbered rows and `Ventures.tsx`'s numbered index).
- **Transition:** scroll advances a per-project index (Section 8); the current card slides out to the left while the next card slides in from the right, scroll-scrubbed, not autoplaying - matching the user's explicit "left to right" direction.
- **Order:** all 13 projects from `src/data/projects.ts`, in existing catalogue order (flagship first, then `order` ascending) - same ordering principle `Log.tsx` already uses.

**Projects without a real screenshot** (`masa-hesaplari`, `duran`, `smart-cane`, `local-ai-assistant`, `zero-g-pharma`, `fpv-drone`, `vex-robotics`) render a typographic placeholder card instead of an image, inside the same mockup-window frame: project title (`font-display`), tag/status (reusing the existing `StatusTag` component), and tech pills - all real data already in `projects.ts`, no invented visual content. `otonom-iha` keeps using its existing hand-built SVG schematic (`drone-schematic.tsx`) rather than a screenshot, since its only link (`stratosiha.com`) is the Stratos org site, not a product page for this specific project - a screenshot of the org homepage would misrepresent what's being shown.

## 5. Screenshot acquisition

Real screenshots are captured once (not fetched live at runtime) for every project with a genuine live product URL:

- PROSE (`prose-eight.vercel.app`)
- Teluvane (`teluvane.com`)
- Wildfire Spread Forecast (`live-wildfire.vercel.app`)
- Tofaş Fen Webapp (`tofas-fen-webapp.vercel.app`)
- Stratos Akademi (`stratos-akademi.vercel.app`)
- TMT Website (`tfltmt-website.vercel.app`)
- STRATOS İHA Website (`www.stratosiha.com`)

Captured via headless browser (Playwright, already available in this environment) against each project's own live `href`, saved as static PNG/WebP files under `public/images/projects/<slug>.png` (or `.webp`), and referenced from `projects.ts`'s existing `image` field (already optional on the `Project` type - no new field needed, just populated for these seven entries where it's currently unset). This is a one-time capture step, re-run manually if a project's live site changes meaningfully - not a build-time or runtime dependency, consistent with `PRODUCT.md`'s "no CMS, static data files" principle and the "real values only, never filler" rule already governing GitHub stats.

## 6. Zoom-to-Telemetry handoff

After the 13th (last) project card, continued scroll within this beat's remaining window triggers a zoom transition: the current card scales up to fill the full viewport (replacing the pinned letter-background entirely as it grows), then crossfades directly into the Telemetry beat's content - replacing today's hard visibility cut between `Log`/`Ventures`-style checkpoints. This is the one new cross-checkpoint transition this spec introduces; every other checkpoint boundary keeps its existing fade behavior (`CheckpointShell`'s `opacity` transition on `visible`).

## 7. Data model

No new fields on `Project` beyond populating the existing optional `image` for the seven screenshot-bearing entries listed in Section 5. No new top-level data file - the carousel reads directly from `src/data/projects.ts`'s existing `projects` export, same source `Log.tsx` uses today.

## 8. Scroll mechanics

This beat needs meaningfully more scroll room than its current share of the 600vh master spacer to make 13 individual card transitions plus the WORK-intro and zoom-out stages feel right, without borrowing scroll budget from the other four beats.

- `src/lib/flight-scene/route.ts`'s checkpoint window for this beat (`"log"`, currently `start: 0.12, end: 0.36`) widens; total master spacer height (currently a flat `600vh` in `FlightSceneRoot.tsx`) increases enough to give this beat comfortable absolute scroll height for smooth per-card transitions, while every other checkpoint's *absolute* pixel height stays close to what it is today (their fractional share of the new, larger total shrinks correspondingly, but their pixel range doesn't need to shrink - the total spacer grows to accommodate the new share, not by shrinking the others).
- Within this beat's checkpoint window, a local progress value (`(globalProgress - checkpoint.start) / (checkpoint.end - checkpoint.start)`, clamped 0-1) drives which stage is active: the WORK-intro (Section 2), the tile-expansion (Section 3), each of the 13 project-card steps (Section 4), and the final zoom-out (Section 6), in that sequence, each occupying a fair share of the local 0-1 range (13 project steps get the bulk of it; intro/expansion/zoom-out get smaller fixed shares).
- `Log.tsx` needs access to scroll progress (today it only receives `visible`/`mode`/`repoStats`) to compute this local progress and derive the active project index. `FlightSceneRoot.tsx` passes down the existing `progressRef` (already used by `CameraRig` and the checkpoint-swap poll loop) as a new prop, and `Log.tsx` derives its own local index via `requestAnimationFrame` polling of that ref, the same pattern `FlightSceneRoot.tsx` itself already uses for `activeId`/`pastEnd` - not a new pattern, reused from existing code.

## 9. Component naming

`Log.tsx` is substantially rewritten (its scene-mode content) under its current file name and export - no rename, since this beat's checkpoint id (`"log"`), anchor (`#flight-log`), and nav label (`work`) all stay as-is; only the internal scene-mode rendering changes. Flat mode's simple catalogue-row component (Section 10 below) can live in the same file as a clearly separated render path, matching how `Ventures.tsx`/`Telemetry.tsx` already branch on `mode` internally.

## 10. Flat-mode / accessibility fallback

The pinned letter-background, sliding-card carousel, and zoom-to-Telemetry handoff are **scene-mode only**. Flat mode (the existing no-WebGL / `prefers-reduced-motion` / mobile fallback path, which already renders every beat as normal document-flow content instead of fixed-overlay panels) keeps today's plain, accessible, vertically-scrolling catalogue list - unchanged in mechanic, just with real screenshots swapped in via the newly-populated `image` field where available, same as it already renders `image` today for the flagship row. This preserves the existing two-mode discipline the whole system already follows (`DESIGN.md` Section 4-5): rich pinned/zoom effects are a scene-mode enhancement, never a requirement to access the content.

## 11. Explicitly out of scope

- Any change to Liftoff, Ventures, or Landing beats' content or mechanics.
- Any change to the 3D drone model, camera spline route, or `CameraRig`'s flight path - the drone/camera simply doesn't need to be visible or active during this beat's local progress range going forward; the existing route/camera code is not touched.
- New accent colors, gradients, or pill shapes beyond what `DESIGN.md` already documents as scoped exceptions.
- Live/dynamic screenshot fetching at runtime or build time - screenshots are a one-time manual capture, committed as static assets.
- Bilingual/i18n structure changes.

## 12. Testing

- No browser access exists in the implementation sandbox for this pass (confirmed during this session) - every scene-mode visual claim in this spec must be verified by a human running `npm run dev` locally, in both scene mode and flat mode, at desktop and mobile widths, before this work is considered visually complete.
- `npx tsc --noEmit` and `npm run build` must both pass as the mechanical gate, same as every prior pass in this repo.
- Verify specifically: the footer fix (Contact stays visible at 100% scroll, Footer appears normally after), the WORK-intro-to-tile-background transition reads as continuous (not a jump cut), all 13 project cards are reachable in order, placeholder cards render real data (no invented visuals), the zoom-out-to-Telemetry handoff doesn't hard-cut, and flat mode is fully unaffected by any of the new scene-mode mechanics.

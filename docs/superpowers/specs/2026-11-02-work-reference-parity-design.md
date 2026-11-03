# WORK section: reference parity (bekirerdem.dev)

Supersedes the Work part of `2026-10-17-bekirerdem-full-clone-design.md`
(section 6) and DESIGN.md section 3.5. Owner decisions (2026-11-02):

- Fidelity: as close to the reference as possible (true 3D letters and
  cards, letters passing in front of and behind cards).
- Card caption: reference format, `PROSE  #K7QX-0002/08`.
- Still not copied: no code, CSS, fonts, images or copy from the
  reference. Everything below was measured from the live page (Playwright +
  Chromium, 1440x900, 1024x768, 390x844) and is re-implemented here.
  Anton stays the display face, JetBrains Mono the caption face.

## 1. What the reference does (measured)

Section height is 4.5 viewport heights at every size. Three layers:

1. **Stage (position: fixed, full viewport, black).** Holds a faint dot
   grid and a `perspective: 640px` scene (origin at the viewport centre)
   with 54 letter spans and 9 cards as siblings. The scene is scaled by
   `0.75 + 0.25 * state`. Letters have z-index 1, cards 2, and five
   letters z-index 3, so a few letters cross in front of the cards. The
   scene uses flat transform-style; depth order comes from z-index only.
2. **Mask (position: sticky, top 0, one viewport tall).** A white sheet
   with a capsule-shaped hole, a thin ring 16px outside the hole, and a
   straight grid (12 columns, 10 rows; 8 columns on phones) clipped so it
   stops at the ring. The mask scrolls in with the page, pins for 3.5
   viewports, then scrolls away. Because the stage is fixed and the mask
   moves, the hole slides over letters that stay put: on the way in you
   see K first, then RK, ORK, WORK; on the way out WORK, WOR, WO, W.
3. **Zoom.** One value, `state` (0..1), scales the mask about the
   viewport centre from 1 to about 12.3 (grid cells, ring and hole grow
   together, like flying into the capsule) and opens the letter rows. It
   rises right after the mask pins and falls just before it unpins. The
   letters never disappear; there is no blank black frame anywhere.

### Letters

- Font size 25vh, line-height 0.85, white. Row tops at
  `(0.1 + r * 0.2125) * vh`, r = 0..3 (W, O, R, K).
- Letters per row: 10 / 15 / 15 / 14 at 1440x900, 9 / 13 / 13 / 12 at
  1024x768, 4 / 5 / 5 / 4 at 390x844.
- Fake extrusion: a `::before` copy of the glyph in `#999`, z-index -1,
  `scale(1.05, 1.02)` plus up to 1.8px sideways. It reads as a gray rim on
  the outer side and bottom.
- Each row is a loop about 1.43 viewport widths long, letters evenly
  spaced on it, drifting right to left. The drift slows over the pinned
  scroll (quadratic ease-out); the W row is fastest, then O, R, K
  (relative speeds 1, 0.86, 0.78, 0.6). Total W drift over the pin is
  about 2.4 viewport widths.
- For a letter at horizontal offset `x` from the centre (px, viewport
  width `W`): `translateZ = x² / (2.78 W)`, vertical offset
  `iy * 0.274 * x² / W` with `iy = -0.6, -0.2, 0.2, 0.6` per row (rows
  bow apart at the edges), `rotateY = asin(-0.355 * x / W)`. Edge letters
  come toward the viewer, so they look bigger and lean in.
- Packed state (`state = 0`): every copy sits at `x = 0`, so each row
  reads as one letter and the column reads as WORK. While `state` grows
  the copies fan out (`x * state`), which gives the smeared, stacked look
  in the hand-off frames.

### Cards

- 9 in the reference, 8 here (every project with a real screenshot,
  `galleryProjects`).
- Base image width 50% of the viewport (phones: about 86%), padding 8px
  8px 0, no border, no in-plane tilt. Each card has a fixed size factor
  0.52..0.93 and a vertical offset `y` in ±(0.5..0.9) whose sign
  alternates card to card; centre offset `y * 0.255 vh`.
- Card progress `p` runs 1 → -1 over 0.78 viewports of scroll. Card i
  crosses the centre at `0.77 + i * Δ` viewports after the pin starts;
  the last card crosses at 2.76 (8 cards: Δ = 0.284).
- Pose from `p`: centre x = `p * W`; `translateZ = (0.297 p² - 0.0875 p) W`;
  `rotateY = asin(-(0.172 p + 0.17 p³))`; uniform scale = size factor.
  Cards outside `|p| < 1` are hidden.
- Caption under the image, padding 8px, mono 11px, uppercase, tracking
  0.15em, white, title left, key right. Key = `#` + 4 characters from a
  hash of the slug + `-` + 4-digit position + `/` + 2-digit total.

### Timeline (rel = px scrolled since the section top hit the viewport top, H = viewport height)

| Phase | rel range | Driver |
|---|---|---|
| Mask scrolls in, hole slides over the packed column | -H .. 0 | native scroll |
| Zoom in (`state` 0 → 1) | -0.17H .. 0.53H | power4.in |
| Cards cross, rows drift | 0 .. 3.5H | linear / quad-out |
| Zoom out (`state` 1 → 0) | 2.9H .. 3.45H | power2.inOut |
| Mask scrolls away, hole slides off the fixed column | 3.5H .. 4.5H | native scroll |

## 2. Implementation here

### Structure

```
<section id="work">                       (Work.tsx, server, unchanged role)
  <nav sr-only list>                       (unchanged)
  <div class="work-animated">
    <WorkStage items locale />             (new, client)
  </div>
  <div class="work-static">
    <StaticGallery items locale />         (updated)
  </div>
</section>

WorkStage root: relative, height 450vh, clip-path: inset(0), aria-hidden
  ├─ div.fixed.inset-0.z-0.bg-ink           stage (visibility toggled off
  │    ├─ DotPattern                         when the root is off screen)
  │    └─ div[data-scene]                   perspective 640px, scale
  │         ├─ span.work-letter × N         z-index 1 or 3
  │         └─ a/div card × 8               z-index 2
  └─ div.sticky.top-0.h-screen.z-[1].pointer-events-none   mask
       └─ svg (viewBox = measured sheet size)
            ├─ path  white sheet minus capsule hole (evenodd)
            ├─ path  ring, 1px ink, non-scaling stroke
            └─ path  grid lines, 1px ink, non-scaling, clipped outside ring
```

`clip-path: inset(0)` on the root clips the fixed stage to the section's
box, so the stage never shows outside the section. Nothing above the root
may have a transform, filter or `will-change: transform`, or the fixed
stage stops being viewport-fixed; check this first.

### Geometry (all from measured `W`, `H`, recomputed on ScrollTrigger refresh)

- Hole: height `0.764 H`, top `(H - holeH) / 2`, width
  `min(0.225 H, 0.46 * sheetWidth)`, radius = width / 2, centred.
- Ring offset 16px (10px under 640px wide). Grid 12 columns (8 under
  768px), 10 rows, over the sheet.
- Max zoom `max(12.3, 1.2 * W / holeWidth)`, so very wide screens still
  end fully black.
- Letters per row: `max(min_r, round(base_r * (W / H) / 1.6))`,
  base 10/15/15/14, min 4/5/5/4. First client render uses the base counts
  (matches the server); counts update after mount and on resize.
- Five front letters (z-index 3), chosen by `mulberry32` with a fixed seed.

### Motion

- One ScrollTrigger on the root: `start: "top bottom"`, `end: "bottom top"`,
  `scrub: true`, tweening a proxy `rel` linearly from `-H` to `4.5H`
  (the mask's pin is native sticky, so the zoom has to follow scroll
  without extra lag; Lenis already smooths it).
- `render()` writes one transform string per letter and per card, plus
  the mask scale and scene scale. No layout reads inside `render`.
- All of it inside `gsap.matchMedia().add(MOTION_OK, …)`. Reduced motion
  keeps the existing CSS switch to `StaticGallery`.

### Pure math (`src/lib/work-scene.ts`, unit-tested)

`letterCounts`, `rowLoopX`, `letterPose`, `zoomState`, `cardProgress`,
`cardPose`, `cardLayout`, `cardKey`, `frontLetters`, `holeGeometry`,
`maxZoom`. `galleryProjects` stays in `work-gallery.ts` (the closing
section uses it); the old helpers there (`cardX`, `cardY`, `letterSway`,
`exitPhase`, `rowSpread`, `letterArch`, `letterBob`) and `WorkIntro.tsx`,
`WorkGallery.tsx`, `.gallery-card` CSS go once nothing uses them.

### Static gallery (reduced motion)

Same caption format and no border, WORK band uses the new letter
extrusion style instead of `.emboss-light`.

## 3. Not in scope

Card hover effects (the reference shows none) and the reference's animated
canvas (our dots are a static SVG pattern).

Cards and the keyboard list open each project's primary (live) link in a
new tab, like the reference; a project without one falls back to its
`/projects/[slug]` page (`cardLinkProps`).

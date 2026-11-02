# Design System: Emir Sakarya - Portfolio

Black-framed, white-sheet, typographic system modeled on the structure of
bekirerdem.dev (layout, rhythm and motion patterns only; no text, assets,
code or paid fonts copied). Spec:
`docs/superpowers/specs/2026-10-17-bekirerdem-full-clone-design.md`.

## 1. Color

- Frame `#0A0A0A`, canvas `#FFFFFF`, ink `#0A0A0A`, ink-2 `#6B6B6B`,
  ink-3 `#767676`, panel `#F5F5F3`, rules `rgba(10,10,10,0.12/0.28)`.
- No accent color, no gradients, no blur. Dot and hatch textures are SVG
  patterns. GitHub language colors in the GitHub cell are external data.

## 2. Type

| Role | Font |
|---|---|
| Reading copy, tagline, footer links | Instrument Serif 400 |
| Bento words, WORK letters, venture names, closing headline, wordmark | Anton |
| Hero title only | Metamorphous |
| DREAM IT / BUILD IT only | Oswald 700 |
| Labels, nav, tickers, data | JetBrains Mono |

About copy 30px / 22px, line-height 1.5. Mono labels 11-14px uppercase,
tracked 0.05-0.15em.

## 3. Page structure (in order)

1. Frame: 16px black edges (8px under 640px), fixed.
2. Header: in-flow cell grid (logo, caption, nav, GitHub/LinkedIn,
   two-line serif tagline). Below lg: logo + burger, full-screen black menu.
3. Hero `#home`: dense black warped mesh, framed commit/binary ticker,
   centered "UAV ✦ AI ✦ FOUNDER", second ticker.
4. About + Skills `#about`: perspective room, vertical side rails, 640px
   bordered column with black ABOUT/SKILLS bars, four paragraphs, bento
   (Anton words, globe, DevOps, live GitHub cell, hatch).
5. Work `#work`: a 450vh section whose fixed black stage (dot texture,
   perspective scene) sits under a sticky white sheet with a capsule hole,
   ring and clipped grid. Scrolling slides the hole over the packed WORK
   column, a shared zoom flies into the capsule, the letter rows fan out
   in perspective and 8 screenshot cards cross between the letters, then
   the zoom folds back and the sheet scrolls away. Cards carry the
   reference caption format (`TITLE  #K7QX-0002/08`). A keyboard-focusable
   list carries the same links. It runs on phones too; reduced motion gets
   a static gallery. Spec:
   `docs/superpowers/specs/2026-11-02-work-reference-parity-design.md`.
6. Closing `#contact`: commit ticker, pinned ray burst (sun a third of the
   way down, rays all round, headline lying on a perspective floor that
   grows, screenshots and stars flying out of the sun), DREAM IT / BUILD
   IT crossing sides over flat gray reflections, GO circle on a lens-bulged
   grid (mailto), dot band, black footer with the wordmark behind the
   link columns.
7. `/projects`: page title, Ventures (three ruled rows with giant Anton
   names) and the full catalogue. The header has five cells like the
   reference: About, Work, Projects, Ventures, Contact.

## 4. Components

- Status: `StatusTag` squares (filled / outlined / light). Never pills.
- Buttons and links: sharp corners, underline or fill inversion on hover.
- The Work mask's capsule hole and ring, and the GO circle, are the only
  rounded shapes.

## 5. Motion

Stack: Lenis smooth scroll plus GSAP (ScrollTrigger, SplitText), set up in
`src/lib/gsap.ts` and `src/components/smooth-scroll.tsx`. The mobile menu
and BackToTop run on plain CSS transitions (opacity, translate, scale),
no animation library.

- **Smooth scroll.** Lenis (lerp 0.1, smooth wheel) runs on `gsap.ticker`
  with lag smoothing off and calls `ScrollTrigger.update` on every scroll.
  In-page `#id` links go through `lenis.scrollTo`. The mobile menu stops
  Lenis while open. ScrollTrigger re-measures once when web fonts land.
- **Eases.** `expo.out` for entrances, `expo.inOut` for state changes,
  `power4.in` for scale-ups (the WORK capsule). CSS hovers use
  `cubic-bezier(0.16, 1, 0.3, 1)` over 0.3-0.4s.
- **Durations and staggers.** 0.8-1.6s for entrances, staggers
  0.04-0.12s.
- **Triggered over scrubbed.** Sections play once when they enter
  (`revealOnce`, `ScrollTrigger.batch` for the catalogue): bars wipe in
  with scaleX, paragraphs and rows rise and fade, big words rise out of a
  SplitText clip, GitHub numbers count up to their real value.
- **Scrubbed only where pinned or tied to scroll.** Ticker drift, room
  skew and the capsule scale use `scrub: 1`, so they lag and settle
  instead of tracking raw scroll. The Work stage uses `scrub: true`
  instead: its pin is a native sticky mask, so the scroll-driven zoom has
  to track scroll exactly or the hole and the letters drift out of sync.
  The fixed stage is clipped to its section by `clip-path: inset(0)` and
  toggled off while the section is off screen.
- **First load.** Header cells drop in, the hero mesh draws from the edges
  to the centre, the title rises out of a clip, the stars spin in, then
  the tickers fade up. Once.
- **Hero mesh.** After the intro, mouse and pen pointers bend the lines
  away within about 160px (push up to 36px, smooth falloff, zero at the
  pointer and at the edge). Pointer and bend are damped so it eases in and
  settles back. It draws in a small canvas lens over the SVG, and only
  while something moves: never with the hero off screen or the tab hidden.
  Math in `src/lib/mesh-displacement.ts`. Touch screens get the static
  mesh.
- **GO circle.** Gentle scale pulse (0.92-1.04) on a yoyo loop, larger on
  hover.
- **`prefers-reduced-motion: reduce`.** Every GSAP animation lives in
  `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`, so
  with reduced motion there is no Lenis, no pinning, no scrubbed or
  entrance transforms, no intro, no pointer bend, the static gallery
  (`.work-animated` / `.work-static`), and all content in its final state.
- **No JS.** Start states are set by client code only, so server HTML is
  always fully visible.

## 6. Rule exceptions (this project only, owner-approved)

- Centered hero.
- Decorative scroll motion in the closing sequence (burst, DREAM IT /
  BUILD IT, warped grid). The reference's smiley icon is not used.

## 7. Not copied

No code, CSS, fonts, images or copy from any external reference. All
geometry comes from this repo's deterministic generators in `src/lib/`.

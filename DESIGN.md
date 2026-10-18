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
5. Work `#work`: capsule intro that grows to black, 400vh sticky black
   stage with swaying embossed WORK letters and 7 screenshot cards, then
   the full catalogue list. Phones and reduced motion get a static gallery.
6. Ventures `#ventures`: three ruled rows with giant Anton names.
7. Closing `#contact`: ray burst + perspective headline, DREAM IT / BUILD
   IT, GO circle (mailto), dot band, black footer with giant wordmark.

## 4. Components

- Status: `StatusTag` squares (filled / outlined / light). Never pills.
- Buttons and links: sharp corners, underline or fill inversion on hover.
- The WORK capsule and GO circle are the only rounded shapes.

## 5. Motion

- framer-motion only. Spring `stiffness: 110, damping: 20` for reveals.
- Scroll-driven: ticker drift, room skew, capsule scale, Work stage,
  DREAM/BUILD letters. All pinning is CSS sticky inside a tall wrapper.
- `prefers-reduced-motion`: no pinning, no scroll transforms, static
  gallery, all content visible.

## 6. Rule exceptions (this project only, owner-approved)

- Centered hero.
- Decorative scroll motion in the closing sequence (burst, DREAM IT /
  BUILD IT, warped grid). The reference's smiley icon is not used.

## 7. Not copied

No code, CSS, fonts, images or copy from any external reference. All
geometry comes from this repo's deterministic generators in `src/lib/`.

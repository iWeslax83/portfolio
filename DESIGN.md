# Design System: Emir Sakarya - Portfolio

Phosphor-terminal / flight-log system. Dark ground, pale-green ink, one
bright accent, monospace everything: log lines, prompt chrome, telemetry
readouts, inverse-video bars. Replaces the black-frame/white-sheet system
that mirrored bekirerdem.dev; the work-scene mechanics (pinned capsule
gallery, tickers, mesh) stay, reskinned. Spec:
`docs/superpowers/specs/2026-11-03-terminal-flightlog-redesign-design.md`.

## 1. Color

- Ground `#0A0E0A`, panels `#0F140F`/`#131A13`, deep `#070A07` (stage,
  footer, mobile menu).
- Ink `#D2F0DA`, ink-2 `#5F8F6C`, ink-3 `#7FAE8B`.
- ONE accent: `#4DFF7C` phosphor green: commits, statuses, counts, prompt
  glyphs, hovers, cursor.
- Edges `rgba(77,255,124,0.28)`, rules `0.14/0.30`. No gradients, no
  blur, no purple, no pill badges.
- Scanlines: fixed 3px repeating overlay at 45% of 12% black,
  pointer-events none.
- Inverse video: `bg-ink` + `text-bg` is the highlighted state (bars,
  hover fills, active filter).

## 2. Type

One face: JetBrains Mono 400/500/700/800. Everything: display, body,
labels, data. Hierarchy by size and weight only. Display = 700/800,
tracking -0.02em; body 14-17px lh 1.7; labels 10-12px uppercase tracking
0.1-0.25em.

## 3. Page structure

1. No page frame: full-bleed dark.
2. Header: cell grid (mono mark `ES_`, caption, nav, social, locale,
   two-line status). Hover = inverse video.
3. Hero `#home`: ticker, green wireframe mesh band (pointer bend kept),
   prompt `emir@bursa ~ % whoami`, title `UAV / AI / FOUNDER` 800 with
   accent slashes + blinking block cursor, 5-cell telemetry strip
   (facts only), 4-line boot log, second ticker.
4. About `#about`: dim green perspective room, side rails, centered
   panel column. `~/` inverse-video bars (SECTION_BAR), mono paragraphs,
   statement, bento (mono 800 words, tool lists, globe, DevOps, live
   GitHub cell with accent counts, hatch).
5. Work `#work`: same pinned capsule scene on `deep`: pale-green mono
   WORK letters, accent ring + clipped grid, sheet in `bg` so the hole
   reads as the page opening onto the stage. Cards carry
   `TITLE #XXXX-000N/NN` captions.
6. Ventures `#ventures`: ruled rows, `[N] role` accent index, mono 800
   names (hover accent).
7. Closing `#contact`: ticker, `./initiate-contact.sh` prompt + cursor,
   four headline lines (2 and 4 accent), CH-1..4 channel grid
   (email/github/linkedin/cv). No burst, no DREAM IT/BUILD IT, no GO
   disc (deleted with their components and libs).
8. `/projects`: accent mono h1, ventures + catalogue (accent flagship
   frame, inverse bars). `/notes`, 404 same tokens.

## 4. Motion

Lenis + GSAP unchanged: intro (header cells, mesh draw, title chars,
tickers), scroll-driven tickers and room skew (`scrub: 1`), work-stage
`scrub: true` pin, revealOnce entrances, count-up GitHub numbers. New:
CSS `cursor-blink` (1.1s steps) on hero and closing cursors. All GSAP
under `prefers-reduced-motion: no-preference`; reduced motion keeps the
static gallery and final-state content.

## 5. Components

- StatusTag: accent square (shipped), accent outline (in progress),
  ink-3 (archived). Text, not pills.
- Links: mono, accent on hover or inverse video; `link-draw` underline.
- Buttons/borders: sharp corners, `border-edge`.

## 6. Surfaces

- Favicon `icon.tsx`: dark tile, green `e_`. OG cards: dark, mono, accent
  kickers (JetBrains Mono TTF in `src/app/fonts/og/`).
- `colorScheme` metadata: `"dark"`.
- Header logo: text mark `ES_` (the old webp is light-on-dark illegible).

## 7. Not copied

No code, CSS, fonts, images or copy from any external reference. All
geometry comes from this repo's deterministic generators in `src/lib/`.

# Design Spec: Terminal / Flight-Log Redesign

Supersedes the visual system of `2026-10-17-bekirerdem-full-clone-design.md`.
The owner picked the terminal direction from four presented demos (blueprint,
terminal, broadsheet, aerospace instrument; `/home/weslax83/design-demos/`).
Goal: the site must no longer read as a clone of bekirerdem.dev. Same
content, same impressiveness, new visual world.

## 0. World

Phosphor-terminal / flight-log aesthetic: dark ground, pale-green ink, one
bright green accent, monospace everything, log lines, prompt chrome,
telemetry readouts. All real facts, no invented numbers (unchanged rule).
No em dashes in copy, code or comments.

Global rules still apply: one accent color only (`#4dff7c`), no gradients,
no glass, no pill badges, no hype words, no emoji-as-decoration.

## 1. Tokens (`globals.css`)

- `--color-bg: #0a0e0a`, `--color-panel: #0f140f`, `--color-panel-2: #131a13`,
  `--color-deep: #070a07` (stage/footer/menu surfaces).
- Ink inverts to light: `--color-ink: #d2f0da`, `--color-ink-2: #5f8f6c`,
  `--color-ink-3: #7fae8b`.
- `--color-accent: #4dff7c` (the single accent: commits, statuses, hovers,
  counts, prompt glyph).
- `--color-edge: rgba(77,255,124,.28)` replaces `border-ink` everywhere;
  `--color-rule: rgba(77,255,124,.14)`, `--color-rule-strong: rgba(77,255,124,.3)`.
- One font: JetBrains Mono 400/500/700/800. `--font-display`,
  `--font-serif`, `--font-sans`, `--font-mono`, `--font-condensed`,
  `--font-display-accent` all resolve to it. Anton, Metamorphous, Oswald,
  Instrument Serif removed from `site-fonts.ts`.
- Faint scanline overlay (`repeating-linear-gradient`, ~13% black, 3px
  period, `pointer-events:none`), honors reduced transparency only by
  staying subtle; no user toggle.
- `.work-letter` emboss recolors to a dim green.
- `hover:bg-ink hover:text-bg` now paints a pale-green block: terminal
  inverse-video hover, kept intentionally.

## 2. Page structure

1. Frame: the 16px black border goes. Full-bleed dark page; `frame.tsx`
  keeps its wrapper shape, border removed.
2. Header: same cell grid. Logo image replaced by a mono mark `ES_` (logo
  asset is dark-on-light and dies on this ground). Tagline cells become
  mono microcopy.
3. Hero: prompt line, giant mono title `UAV / AI / FOUNDER` (slashes and
  cursor in accent, blinking block cursor), telemetry strip (location,
  org, team, rides, status), boot log lines. The warped mesh stays as a
  green-wireframe band (keeps the pointer-bend wow, now reads as radar).
  Two tickers unchanged, commit segments in accent.
4. About + Skills: same centered column, inverse-video bars, mono body
  copy (~1.15-1.35rem), bento words in mono 800 (smaller than the Anton
  sizes), tool lists stay `(parenthetical)` mono, GitHub numbers count up
  in accent. Room lines and side rails dim to edge color.
5. Work: same pinned capsule scene; stage becomes `--color-deep`, letters
  pale green mono, sheet stays `--color-bg` so the mask reads as the page
  occluding the scene, ring + clipped grid in accent. Cards get a mono
  caption row; keys keep the `#XXXX-000N/NN` hash format.
6. Ventures: same ruled rows, names in mono 800 uppercase (~5.5rem max),
  hover goes accent.
7. Closing: REPLACED. Ticker, then a terminal contact block: prompt
  `emir@bursa ~ % ./initiate-contact.sh`, headline = the four message
  lines in mono 800 with lines 2 and 4 in accent, channel grid
  (EMAIL / GITHUB / LINKEDIN / CV). Radial burst, DREAM IT/BUILD IT, the
  GO disc and the warped/lens grids are removed (the strongest clone
  signatures). Their components and libs are deleted.
8. Footer: dark panel (`--color-deep`), mono links, green wordmark
  silhouette, dot band dimmed.

## 3. Secondary surfaces

- `/projects`: h1 mono; Ventures + catalogue reskin (edge borders, inverse
  bar, accent statuses).
- `/projects/[slug]`, `/notes`, 404: token-driven restyle, no layout change.
- Mobile nav: dark sheet, mono links.
- `StatusTag`: accent square for shipped, accent outline for in-progress,
  ink-3 for archived.
- `icon.tsx`, `og-card.tsx`: dark ground, green mono text (JetBrains Mono
  TTF dropped into `src/app/fonts/og/`).
- `colorScheme` metadata flips to `"dark"`.

## 4. Motion

Stack unchanged (Lenis + GSAP). Intro keeps its choreography: header cells,
mesh draw, title chars, tickers (stars query now matches nothing, fine).
New: CSS blink on the hero cursor (1.1s steps). Reduced-motion rules
unchanged; the cursor stays static under reduce.

## 5. i18n

New `hero` message group (prompt line, telemetry labels, boot log lines)
in `en.json` and `tr.json`. Closing reuses existing `line1..line4` plus a
hardcoded code-prompt line (same in both locales). All other copy reuses
existing keys.

## 6. Deletions

`BurstHeadline.tsx`, `DreamBuild.tsx`, `GoPanel.tsx`, `radial-burst.tsx`,
`warped-grid.tsx`, `radial-burst.ts`, `warped-grid.ts` (+ their tests if
no longer referenced). Anton/Metamorphous/Oswald/Instrument Serif font
imports and any local font files they used.

## 7. Verification

- `npm run lint`, `npm run build`, `npm test` pass.
- Playwright Chromium captures 1440x900 and 390x844; every section reads
  in the new world, no white-flash surfaces, no dead dark-on-dark text.
- Reduced motion: no pin, content complete; scanlines static anyway.
- `border-ink` and `bg-ink` audit: nothing left that inverts wrongly
  (inverse bars and inverse-video hovers are deliberate).
- No em dashes in changed files.

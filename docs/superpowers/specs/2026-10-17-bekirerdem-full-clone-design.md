# Design Spec: bekirerdem.dev Full Structural Clone

Supersedes `2026-09-05-bekirerdem-parity-design.md` and the layout and
typography sections of `DESIGN.md`. That earlier pass copied individual
motifs (mesh, binary strips, WORK letters, radial CTA, footer) onto the
existing checkpoint architecture. A side-by-side capture on 2026-10-17
(Playwright + Chromium, 1440x900 and 390x844) showed the result still
reads as a different site. This pass clones the reference's page
structure, section rhythm and type system, filled with Emir's own real
content.

## 0. Ground rules

- **Copy:** layout, section order, proportions, motion patterns, the
  black/white palette.
- **Never copy:** the reference's text, logo, images, source code or CSS.
  Never ship its paid fonts (Editorial New, Fraktion Mono, Bigger
  Display).
- **Content:** only facts already in `src/data/*.ts`, `src/messages/en.json`,
  `PRODUCT.md` or `resume.tex`. No new claims.
- **No em dashes** anywhere in copy, code or comments.

### Global rule exceptions (approved by the site owner, this project only)

- Centered hero (overrides DESIGN.md's "never a centered hero").
- Decorative scroll motion in the closing sequence (radial burst,
  DREAM IT / BUILD IT, warped grid) is kept even though it carries no
  data. This overrides global rule 5 for these three pieces only. The
  reference's smiley-face icon is **not** cloned.

Everything else in the six global design rules still applies: no
gradients, no glass, no purple, no pill badges for status, no hype words,
no emoji.

## 1. Gaps found (current site vs reference)

| # | Gap | Fix in this spec |
|---|---|---|
| 1 | Commit/binary strips are `fixed` at the top and overlap the nav | Strips move into the hero as framed in-flow rows (Section 4) |
| 2 | No page frame; nav is a thin floating mono row | 16px black frame + cell-grid header (Section 3) |
| 3 | Hero mesh at about 20% gray; left-aligned paragraph hero | Full-strength mesh, centered Metamorphous title (Section 4) |
| 4 | No About / Skills section | New perspective-room section (Section 5) |
| 5 | WORK: white bg, faded 30-50% opacity cards, empty placeholder cards, about 9 viewports long | Black bg, opaque cards, screenshots only, about 4 viewports (Section 6) |
| 6 | Ventures is a plain list | Large-line ventures section (Section 7) |
| 7 | Closing lacks the reference's sequence | Burst headline, DREAM IT / BUILD IT, GO, dot band, footer (Section 8) |
| 8 | Five display faces each used once | Four faces, each with one job (Section 2) |

## 2. Architecture and type system

### Architecture: document flow (approach A)

`FlightSceneRoot`, `CheckpointShell`, `src/lib/flight-scene/route.ts` and
`useFlightProgress.ts` are removed. The page becomes ordinary in-flow
sections, rendered by `src/app/page.tsx`:

```
<Frame>
  <SiteHeader />                 // replaces nav.tsx (mobile-nav.tsx reused for the burger sheet)
  <main>
    <Hero />                     // id="home"
    <AboutSkills />              // id="about"
    <Work />                     // id="work"   (the only pinned section)
    <Ventures />                 // id="ventures"
    <Closing />                  // id="contact"
  </main>
  <Footer />                     // existing, restyled
</Frame>
```

New sections live in `src/components/sections/`. Each is a standalone
component with no shared scroll state. Only `Work` uses GSAP
ScrollTrigger (`src/lib/gsap.ts`) to pin. Other reveal motion uses
framer-motion `whileInView` with the existing spring in `src/lib/motion.ts`.
`prefers-reduced-motion`: no pinning, no transforms, content renders in
its final state.

`useWorkCarouselProgress.ts`, `ProjectCard.tsx` and `WorkIntroBackground.tsx`
are reused where they fit and rewritten where they don't. Nav anchors in
`src/data/nav-items.ts` change to: about, work, ventures, contact. Native
anchor scrolling works again (no fixed-overlay layout), so the
`scrollIntoView` workaround is removed.

### Fonts (`src/app/layout.tsx`)

| Role | Font | Source |
|---|---|---|
| Body serif, about copy, tagline, footer links | **Instrument Serif** 400 (+ italic) | `next/font/google` |
| Condensed display: bento words, WORK letters, closing headline | **Anton** 400 | `next/font/google` |
| Hero title | **Metamorphous** | already loaded |
| DREAM IT / BUILD IT | **Oswald** 700 | already loaded |
| Labels, nav, tickers, data | **JetBrains Mono** | already loaded |

Removed: Fraunces, Cabinet Grotesk (local files deleted), Bebas Neue.
Body text: Instrument Serif at 20px desktop / 18px mobile, line-height
1.5, letter-spacing -0.01em. Mono labels: 12px, uppercase, tracking
0.1em.

### Color tokens (`globals.css`)

No change: `#FFFFFF` canvas, `#0A0A0A` ink, existing rule tokens. New:
`--color-frame: #0A0A0A`. No accent color.

## 3. Frame and header

- **Frame:** `body` background ink, content wrapper inset 16px on all
  sides (8px below 640px) with a white background. Fixed black bars on
  all four edges so the frame stays visible while scrolling.
- **Header:** `sticky` top, white, 96px tall on desktop, built as one
  row of bordered cells (1px ink rules):
  1. Logo cell (96px square): the existing monogram mark.
  2. Mono micro-caption cell: "EMIR SAKARYA · BURSA".
  3. Nav cell: `ABOUT`, `WORK`, `VENTURES`, `CONTACT` in mono 14px,
     tracking 0.05em, evenly spaced. Active link gets an ink underline.
  4. Social cell: GitHub over LinkedIn, two stacked 48px squares.
  5. Tagline cell, two stacked rows in Instrument Serif 22px:
     "Building from Bursa, Türkiye." / "Shipping founder-built products.
     **Get in touch**" (bold link to `#contact`).
- **Mobile (<1024px):** logo cell, a grow spacer and a burger cell.
  The burger opens the existing `mobile-nav.tsx` restyled as a
  full-screen black sheet with numbered serif links (01 About ...).
- Scroll-progress bar: a 2px ink line under the header.

## 4. Hero (`id="home"`)

1. **Mesh panel:** the existing `wireframe-mesh.tsx`, full frame width,
   about 62vh tall, strokes at full ink with 1px weight, two darker
   "crest" lines as in the reference. Still deterministic (fixed seed).
2. **Ticker row:** 36px framed row (top and bottom rules) with
   `▸ … ◂` end marks. Contents: commit hashes and subjects from
   `getRecentCommits()` alternating with binary runs and `////` fills.
   Scrolls horizontally on page scroll. This replaces the fixed
   `CommitMotif` strips.
3. **Title:** centered "UAV ✦ AI ✦ FOUNDER" in Metamorphous,
   `clamp(3rem, 9vw, 7.5rem)`, line-height 1. The ✦ glyphs are inline
   SVG four-point stars. Wraps to two lines naturally on narrow
   screens.
4. **Second ticker row** (same component, different seed).

The old hero paragraph, credential bullets and buttons move into About
(Section 5) and are cut from the hero.

## 5. About + Skills (`id="about"`)

- **Room background:** a full-width perspective wireframe (vertical
  rails plus horizontal lines converging toward the center column),
  generated deterministically in `src/lib/perspective-room.ts` and
  rendered as one SVG. The lines skew slightly with scroll (one
  `useScroll`-driven transform).
- **Side rails:** vertical mono text on both edges, rotated 90deg:
  left "EMIR SAKARYA · FOUNDER & ENGINEER · BURSA / TR · N°01", right
  "SECTION 01 · ABOUT × SKILLS · SCROLL TO EXPLORE · 2026". Hidden below
  1024px.
- **Center column:** 640px wide, white, 1px ink border on the sides.
  - Black bar "ABOUT" (mono 12px bold, white, centered, 24px tall).
  - Four paragraphs (draft below, owner to confirm in spec review).
  - Black bar "SKILLS".
  - Statement cell: "Hardware × AI × Production Software" in Instrument
    Serif 40px, centered.
  - Bento grid, 1px ink rules, two columns:
    - Big-word cells in Anton, `clamp(4rem, 8vw, 7rem)`, line-height
      0.9, each with its tool list in parentheses beneath (serif 14px):
      `EMBED DED` (Flight Controllers, PCB Design, Pixhawk 6C, ArduPilot),
      `AI` (Python, LangGraph, Ollama, MediaPipe),
      `FRONT END` (React, Next.js, TypeScript, Tailwind CSS),
      `BACK END` (Node.js, FastAPI, GraphQL, Postgres, Redis).
    - Label cells next to each in serif 28px, centered (for example
      "Pixhawk / ArduPilot / OpenCV\nFlight Software").
    - A GitHub cell carrying the live `fetchGitHubStats()` values
      (public repos, contributions, language bar). This is where the old
      Telemetry section's real data lands. No filler numbers: if the
      fetch fails the cell shows "GitHub data unavailable".
    - A wireframe-globe cell with four ✦ corner marks (SVG, static).
    - A DevOps cell (Docker / Kubernetes / GitHub Actions / Vercel,
      "Ship & Deploy") with a diagonal-hatch square beside it.
  - Below 640px the bento collapses to one column.

### About copy draft (facts from resume.tex, PRODUCT.md, data files)

> I build things that have to work outside a demo: a drone that has to
> land where it said it would, an audit log that has to hold up when
> someone checks it. If something on this page can't be checked, it
> shouldn't be here.
>
> I founded STRATOS İHA, a TEKNOFEST UAV community in Bursa, and lead
> electronics and software for its 25-person engineering org. In its
> first year the program reached the TEKNOFEST 2026 rotorcraft final
> (16th of 3,715 teams) and the NASA Space Apps Turkey final.
>
> On the aircraft I work with Pixhawk 6C, Raspberry Pi 5, ArduPilot and
> OpenCV, plus PCB design and sensor fusion. On the web it's React,
> Next.js and TypeScript up front, Node.js, FastAPI, Postgres and Redis
> behind them, shipped with Docker, Kubernetes and Vercel. For AI I build
> agent systems with LangGraph and Claude.
>
> Right now: Teluvane, a multi-tenant platform that hash-chains every AI
> agent action against EU AI Act, ISO 42001, NIST AI RMF and SOC 2;
> Viyaro, a BOSİAD-funded autonomous mobility venture with 50,000+ rides
> across 10+ companies; and Zero-G Pharma, first in Türkiye at NASA Space
> Apps 2025 (global top 50 of 6,000+ teams). Student at Tofaş Fen
> Lisesi, class of 2028.

Copy lives in `src/messages/en.json` under `about.p1`..`about.p4`.

## 6. Work (`id="work"`)

1. **Intro (in flow, white):** a warped ink grid fills the frame; a
   black capsule (stadium shape, dot texture) sits centered on the grid
   with "WORK" stacked vertically in white Anton. On scroll the capsule
   scales up until it fills the viewport black, handing off to step 2.
2. **Pinned gallery (black):** pinned with ScrollTrigger for about 3
   viewports of scroll.
   - Background: four rows of repeated white Anton letters (W, O, R, K),
     each letter with a gray offset drop shadow (emboss), plus a faint
     white dot grid. Rows sway with a small per-letter rotation driven by
     scroll (sine of index plus progress), reproducing the reference's
     wave.
   - Foreground: the 7 projects that have real screenshots
     (`public/images/projects/*.png`: PROSE, Teluvane, Wildfire,
     Tofaş Fen Webapp, Stratos Akademi, STRATOS website, TMT website).
     Cards are fully opaque, slightly rotated (-4deg to 4deg, from
     `card-rotations.ts`), with a mono caption below (`TITLE` left,
     `#00N/07` right). They move horizontally across the letters,
     two to three visible at once at desktop width.
   - Each card links to its live URL or repo when one exists.
3. **Full catalogue (in flow, white):** after unpinning, every project in
   `projects.ts` (including the ones without screenshots, like DurAn and
   FPV Drone) as a plain bordered list: index, title, tag, status, link.
   Status uses the existing shape-based `StatusTag` (squares, not pills).
   This keeps the site's evidence-first catalogue and makes it reachable
   without the animation.
- **Mobile:** no pin. Letters become a static black band; cards stack
  vertically, full width, no rotation.

## 7. Ventures (`id="ventures"`)

Modeled on the reference's "HACKER MODE / DEEP WORK" block. On a white
background with the perspective room lines faint behind:

- Three full-width rows separated by ink rules. Each row: venture name
  in Anton `clamp(3rem, 10vw, 9rem)`, uppercase; on the right, role in
  mono and the `proof` line from `ventures.ts` in serif 20px. STRATOS
  also lists its three units. Rows with `href` are links with an ↗ mark.
- Rows reveal with a horizontal slide-in as they enter the viewport.

## 8. Closing (`id="contact"`)

1. **Burst headline:** the existing `radial-burst.tsx`, full frame, lines
   converging on a small ink circle at top center. Headline in Anton,
   four lines growing in size and stretched with a perspective
   transform: "LET'S / BUILD / SOMETHING / REAL". Below it a ruled
   floor grid.
2. **DREAM IT / BUILD IT:** two Oswald 700 lines, `clamp(4rem, 12vw,
   11rem)`, tracking 0.04em, over a warped grid. On scroll, "DREAM IT"
   letters scatter apart and "BUILD IT" letters assemble in.
3. **GO:** a black circle with "GO" in white Anton at the top of a
   warped grid panel; it links to `mailto:` (the existing contact email
   from the footer data).
4. **Dot band:** existing black dot-pattern band.
5. **Footer:** existing black panel, Contact / Navigation columns
   (labels in mono, links in Instrument Serif), giant low-opacity
   wordmark "FOUNDER ENGINEER" in Anton behind, colophon line.

## 9. Mobile summary (390px)

Frame 8px. Header collapses to logo + burger. Hero mesh 45vh, title on
two lines. Side rails hidden, About column full width, bento one
column. Work: static letter band plus stacked cards. Ventures names wrap.
Closing headline scales by `clamp`. No horizontal page scroll anywhere.

## 10. Removals

`FlightSceneRoot.tsx`, `CheckpointShell.tsx`, `Liftoff.tsx`, `Log.tsx`,
`Ventures.tsx` and `Telemetry.tsx` (old), `Landing.tsx`, `route.ts`,
`useFlightProgress.ts`, `commit-motif.tsx` (replaced by the ticker row),
`skills-room-panel.tsx`, `catalog-filter.tsx` if unused, Cabinet Grotesk
font files, Fraunces and Bebas imports. `drone-schematic.tsx` is removed
only if nothing references it after the rewrite.

## 11. Docs

`DESIGN.md` is rewritten to describe this system, including the rule
exceptions in Section 0. `PRODUCT.md`'s stale line about a
"terminal-green single accent" is corrected.

## 12. Verification

- `npm run lint` and `npm run build` pass.
- Playwright (Chromium only) captures 1440x900 and 390x844 viewport
  slices of the full page, compared side by side with the reference
  captures. Each section in Sections 3-8 must match in structure.
- No element overlaps the header at any scroll position.
- No horizontal scroll at 390px (`scrollWidth <= innerWidth`).
- With `prefers-reduced-motion: reduce`, nothing pins and all content is
  visible.
- All nav anchors land on their sections.
- Keyboard: all links reachable, visible focus ring.
- `grep` for em dashes in changed files returns nothing.

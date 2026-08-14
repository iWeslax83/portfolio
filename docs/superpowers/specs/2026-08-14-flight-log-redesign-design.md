# Design Spec: Flight Log Redesign

Ground-up restructure of the portfolio into a scroll-driven narrative
("Flight Log"). Palette (`#39FF6A` terminal-green accent) and typography
(Cabinet Grotesk / JetBrains Mono) from the current "Maximalist Signal"
system carry over unchanged and are out of scope. What changes is page
structure and motion: the site becomes five pinned/scrubbed narrative beats
instead of six independently-revealing sections, driven by GSAP ScrollTrigger
for pin/scrub/horizontal-hijack work, with framer-motion (already a
dependency) retained for local UI interaction (hover, tap, staggered
children) inside each beat.

Global rules from `.claude/CLAUDE.md` remain in force throughout: no
gradient outside the two existing scoped exceptions (hero second line,
flagship project border), no glassmorphism, no purple, single primary
accent, no `rounded-full` pill chrome outside the two existing scoped
exceptions (`StatusTag`, `CatalogFilter`), no hype copy, no decorative
emoji, no em dashes anywhere in code/copy/commits.

## 1. Dependencies

- Add `gsap` (includes `ScrollTrigger` plugin) to `package.json`.
- Keep `framer-motion` for non-scrubbed interaction (hover states, tap
  feedback, staggered tile reveals inside Telemetry).
- Rule: never mix GSAP and framer-motion animating the *same* element or
  the *same* property on overlapping timelines. GSAP owns pin/scrub/
  horizontal-hijack; framer-motion owns everything else. Each ScrollTrigger
  instance is created and `.kill()`-ed inside a `useEffect` / `useGSAP`
  (via `@gsap/react`, add as a dependency) cleanup, scoped with
  `gsap.context()` per component to avoid leaking triggers across route
  changes or fast refresh.

## 2. Page structure

`src/app/page.tsx` section order changes from six components to five
narrative beats. `Nav`, `CommitMotif`, `BackToTop`, `Footer` stay as
structural chrome, not narrative beats.

| # | Beat | Replaces | Component |
|---|------|----------|-----------|
| 1 | Hero (cold open) | `Hero` | `hero.tsx` (rebuilt) |
| 2 | Flight Log | `Projects` | `flight-log.tsx` (new, replaces `projects.tsx`) |
| 3 | Founder Story | `Stratos` | `founder-story.tsx` (new, replaces `stratos.tsx`, absorbs `drone-schematic.tsx`) |
| 4 | Telemetry | `Skills` + `GitHub` | `telemetry.tsx` (new, replaces `skills.tsx` + `github.tsx`) |
| 5 | Contact | `Contact` | `contact.tsx` (unchanged content, transition treatment only) |

Data fetching in `page.tsx` (`fetchGitHubStats`, `fetchRepoStats`,
`getRecentCommits`) is unchanged in shape; it's re-plumbed to the new
component names, no new data source needed.

Transitions between beats are hard cuts (a directional wipe pinned at the
tail of each ScrollTrigger, `duration` near-zero ease or a single fast
`power2.inOut` wipe), never a soft opacity crossfade.

## 3. Hero (cold open)

`min-h-[100dvh]`, pinned via `ScrollTrigger({ pin: true, end: "+=60%",
scrub: true })`. Existing domain-first headline copy is unchanged
("ML · Embedded · Web / is where I build.", founder/role line beneath).
Presentation changes: each line reveals via scroll-scrubbed clip-path mask
(GPU-safe: `clip-path` + `transform`, no `width`/`height` animation)
instead of the current continuous gradient `background-position` loop,
which is retired. The scoped gradient exception on the hero's second line
is removed as part of this redesign (superseded by the mask reveal); update
`DESIGN.md` Section 2 accordingly when implemented.

Mobile (`< 768px`): pin disabled, falls back to a plain `whileInView`
scroll-in reveal, same mask visual without the scrub tie.

## 4. Flight Log (Projects, horizontal hijack)

Pinned section, vertical scroll drives horizontal `xPercent` translation
via `scrub: true`. Pin distance computed from project count:
`pinDistance = (projects.length - 1) * viewportWidth`, recalculated on
resize (`ScrollTrigger.refresh()` on a debounced resize listener already
common in GSAP setups).

Each project renders as a full-viewport "flight card": index number,
name, real per-project commit-count / last-commit-date (existing data
from `fetchRepoStats`, unchanged), status. The flagship project (currently
`01`) keeps its bordered instrument-panel treatment and the scoped
gradient-border exception (`.gradient-border`).

Progress affordance: a thin mono progress readout above the cards
(`n / total`), plus left/right arrow-key navigation that jumps the
ScrollTrigger's scroll position programmatically (keyboard reachability
parity with the existing `CatalogFilter` keyboard support).

Mobile: horizontal hijack disabled; falls back to the current vertical
numbered-row layout from `projects.tsx` (ported as-is into
`flight-log.tsx`'s mobile branch), same data, same status tags.

## 5. Founder Story (Stratos + drone-schematic)

Not pinned. `drone-schematic.tsx`'s SVG paths, currently drawn via
framer-motion `whileInView` (`pathLength` 0→1 on enter), switch to a
GSAP `scrub: true` ScrollTrigger tied to the section's scroll range so
draw progress tracks scroll position instead of firing once on viewport
entry. Founder narrative copy (TEKNOFEST UAV team founding, flight
controllers/PCBs through production full-stack) is unchanged text,
split into paragraph beats that reveal in sync with schematic draw
progress (each paragraph's reveal threshold maps to a fraction of total
`pathLength`).

Desktop layout: two-column split, text column fixed/left, schematic in a
pinned mini-viewport right. Mobile: schematic first (smaller, still
scroll-scrubbed, just not pinned), full-width text flow beneath.

## 6. Telemetry (GitHub + Skills merged)

Pinned section (`pin: true`, moderate scrub distance). GitHub stats
(existing `GitHubStats` data, unchanged fetch) render as bordered
data-tiles in a bento grid — `border-t`/`divide-y` separated, no
card-in-card nesting, per the repo's existing anti-card-overuse posture.
Skills content, previously its own section, becomes one or two tiles
in the same grid: mono list/tags in bordered-rectangle form (never
`rounded-full`, matching the repo-wide rule since Skills isn't one of
the two scoped pill exceptions).

Tiles power on in a staggered sequence as the section scrolls into its
pin range (framer-motion `staggerChildren`, opacity + transform only,
spring physics `stiffness: 100, damping: 20`). Existing enlarged
GitHub-stat numerals and the contribution graph (`ContributionGraph` in
`github.tsx`) port into the largest tile unchanged.

Mobile: pin disabled, tiles stack vertically with plain scroll-in
stagger.

## 7. Contact + chrome

`Contact` keeps its current content and layout; only its entry
transition changes to match the hard-cut language (wipe in, not fade).
`Nav`, `CommitMotif` background texture, `BackToTop`, `Footer` are
unchanged by this redesign — they're already independent of section
content and don't participate in the pin/scrub sequence.

## 8. Accessibility & reduced motion

- `prefers-reduced-motion`: all ScrollTrigger pin/scrub/hijack behavior
  is disabled outright (not just shortened) when
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches`;
  sections render as a plain vertical stack with instant/no-transition
  reveals. This is a hard requirement, not a nice-to-have, since
  scroll-hijacking is one of the more disorienting patterns for
  vestibular-sensitive users.
- Flight Log horizontal hijack: arrow-key navigation and visible focus
  states are mandatory (parity with existing `CatalogFilter`).
- All pinned sections must remain reachable and readable with JS
  disabled fallback content order matching visual order (no
  DOM-reorder-via-CSS tricks that break screen-reader order).

## 9. Performance

- Only `transform` and `opacity` are animated; no `top`/`left`/`width`/
  `height` scrub.
- Each `gsap.context()` is scoped to its owning component and killed on
  unmount; `ScrollTrigger.refresh()` is called on debounced resize only,
  never per-frame.
- Perpetual/looping animations (Telemetry tile stagger) are isolated in
  their own `'use client'` leaf components, memoized, to avoid re-
  rendering the pinned parent.
- No mixing of GSAP-driven and framer-motion-driven animation on the
  same DOM node (see Section 1).

## 10. Testing / verification

No new automated test suite is introduced (this repo has none currently
for visual/motion behavior). Verification is manual, in a real browser,
covering:

- Desktop: each pinned section pins/releases at the right scroll offset,
  releases with a hard-cut wipe (no fade), Flight Log horizontal hijack
  tracks scroll 1:1 and reaches every project.
  Founder Story schematic draw completes exactly as the section's
  scroll range ends.
- Mobile viewport (< 768px): every pin/hijack is disabled and falls back
  to the specified vertical layout; no horizontal scroll leaks, no
  layout jump on load (`min-h-[100dvh]` used, never `h-screen`).
- `prefers-reduced-motion: reduce`: full pin/scrub/hijack suite disabled,
  content still fully readable in document order.
- Keyboard-only pass: Flight Log arrow-key navigation, tab order through
  all five beats, focus never trapped inside a pinned section.
- Real data still renders correctly end to end (GitHub stats, per-project
  commit counts, contribution graph) — no regression in the data layer,
  only presentation changes.

## 11. Out of scope

- Palette, font choice, global CLAUDE.md rules (gradient/glass/purple/
  pill/no-emoji/no-em-dash) — unchanged, not renegotiated by this spec.
- Nav, Footer, CommitMotif background texture, BackToTop — unchanged.
- Any new content/copy beyond what's needed to fit the new section
  boundaries (e.g., Skills tiles reuse existing skill data, no new
  skills invented).

# Design Spec: Maximalist Headline Redesign

Status: approved by user, ready for implementation planning.
Supersedes: `2026-08-09-instrument-redesign-design.md` (the Instrument system - near-black canvas, Signal Orange accent, Instrument Sans + JetBrains Mono - is retired in full by this spec, not extended).

Inspiration source: bekirerdem.dev (structural ideas only, not visual copy). See project's `ui-inspiration` skill note: cross-checked against this repo's global design rules (no gradient, no glassmorphism, no purple, single accent, plain copy, no pill badges, no generic three-card row).

---

## 1. Direction

Neutral maximalist typographic composition. Not an avionics/HUD theme, not a broadcast/waveform theme - those were considered and rejected in favor of a direction closest to bekirerdem.dev's own energy: oversized headline-first identity statements driving each section, with real data (not decoration) proving substance underneath.

Founder framing (TEKNOFEST UAV team founder, embedded-to-full-stack range) stays in the copy - it just doesn't drive the *visual* theme anymore. It lives in subheadings/about copy rather than a literal cockpit/telemetry motif.

## 2. Page flow

Single page, vertical scroll. Section order changes from the current build:

`hero -> projects -> stratos -> skills -> github -> contact`

(Projects moves up, ahead of stratos - proof-of-work leads, founder-story section follows it.)

Each section opens with an oversized single-line headline statement (the bekirerdem "AI * Web * Engineer" energy), unmasked/staggered into view on scroll, with supporting technical detail beneath it at normal body scale.

## 3. Hero headline

Primary hero line names domains worked in, not a role: **"ML * Embedded * Web"**. Role/founder identity ("Software Engineer", "Founder, STRATOS IHA") is stated elsewhere on the page (subheading, about copy, stratos section) rather than folded into this line.

## 4. Motif

Background texture pulled from **real git commit data** for this repo: commit hashes and message fragments (e.g. `a0345f1`, `docs(design): archive brainstorming...`), rendered as a faint mono-type texture between/behind sections. Not decorative binary code, not a generic hacker motif - it's actually this portfolio's own history. Data source: read at build time from git log (or a committed export of it), not faked strings.

## 5. Project catalog

Projects section becomes a numbered catalog: `#001/0X` format, `0X` = live count of listed projects.

Per project row/card:
- **Status tag**: real project state - `SHIPPED`, `IN PROGRESS`, or `ARCHIVED`. Rendered as plain text + small square dot or a bordered rectangular tag - never `rounded-full` pill chrome (repo-wide rule).
- **Hover-revealed readout**: on hover, reveals real stack tags, commit count, and live link - proof the project is real, not a generic feature-card icon row.
- **Real last-commit date + commit count**: pulled live via GitHub API per project repo, shown as a mono readout, not a static/manually-typed number.
- **Filter toggle**: plain text toggle across the top of the catalog, e.g. `ALL Ā· SHIPPED Ā· IN PROGRESS` (text + underline/active state, not pill buttons), to filter the list by status or stack.

Explicitly excluded (considered, rejected by user): keyboard j/k navigation between rows; live health-check status dot; inline README-excerpt accordion; a section-header live SHIPPED/IN-PROGRESS counter beyond what the catalog itself shows.

## 6. Color

New single accent: **terminal green** (`#39FF6A`-range, exact value to be finalized against WCAG AA contrast on the chosen canvas during implementation), solid fill only, no glow. Replaces Signal Orange entirely. Canvas/panel/ink neutrals get re-specified during implementation to pair with the new accent (near-black canvas family is the expected default baseline unless implementation finds a reason to shift it) - single accent rule stays non-negotiable: at most one accent element per viewport zone.

## 7. Typography

- **Display**: **Cabinet Grotesk** - sharp-cornered, geometric, built to carry oversized maximalist headlines.
- **Mono / readouts**: **JetBrains Mono** retained from the current system - it already serves the technical-readout voice (catalog data, commit texture, status tags) well; no reason to replace what works.
- Body text follows the display font's weight range rather than introducing a third family.

## 8. Motion

Governed by motion.dev principles:
- **Spring physics** (mass/stiffness/damping) for all transitions, not hand-tuned easing curves.
- Hero and each section's headline **unmask + stagger** into place on scroll entry, extending the existing `motion-provider.tsx` reveal mechanics rather than replacing them wholesale.
- Scroll-triggered reveal drives section pacing; motion is treated as a performance budget, not free decoration - stagger complexity reduces on mobile viewports.
- `prefers-reduced-motion` is respected throughout.
- Keeps the current system's restraint principle: spring-smooth, never gimmicky. No parallax-for-its-own-sake, no hover glow, no cursor tricks.

## 9. Explicitly out of scope

- Bilingual TR/EN toggle (bekirerdem has one; not requested here, `i18n` dir in this repo serves other purposes - verify before assuming any overlap).
- WebP/GIF looping mood-state imagery (bekirerdem's "Hacker mode" / "Deep work" images) - the "durum bazlı görsel/motion etiketleri" answer from brainstorming maps onto the catalog's status tags (section 5), not standalone looping images.
- Any gradient, glassmorphism, or purple/violet color use (standing global rule).
- Three-icon-feature-card rows anywhere on the page (standing global rule).

## 10. Testing

Before marking any section complete: run the dev server, visually verify the golden path (hero -> full scroll to contact) and check mobile viewport width. Verify:
- Motif texture renders real git data, not placeholder strings.
- Catalog status tags and hover readouts show real per-project data (no hardcoded stand-ins).
- `prefers-reduced-motion` disables stagger/spring motion.
- Contrast of new accent against canvas meets WCAG AA.

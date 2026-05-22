# Design System: Emir Sakarya - Portfolio

A premium, anti-generic design language for Google Stitch. This is the single
source of truth. Paste the relevant sections into Stitch alongside any screen
request so every generated screen stays consistent.

---

## 1. Visual Theme & Atmosphere

**Mission control meets design studio.** A dark, engineering-precise interface
that feels like the cockpit of something that flies - calm, instrument-grade,
and confident, but with editorial restraint and warmth. Surfaces are deep
charcoal, never pure black. Information is laid out asymmetrically, like a
well-organized telemetry panel: aligned to a strict grid, generous in negative
space, never cluttered.

The story leads with **founder identity first.** This is a person who *started
a TEKNOFEST UAV team and engineers the autonomous systems it flies* - leadership
proven by deep technical range (flight controllers and PCBs up to production
full-stack). The interface should feel founded, not just built: motion-rich,
alive, and choreographed, while staying instrument-precise and never gimmicky.

- **Density:** 4 / 10 - Balanced. Breathing room around technical content.
- **Variance:** 7 / 10 - Asymmetric, offset layouts. Never centered hero.
- **Motion:** 8 / 10 - Heavily animated, cinematic choreography. Scroll-driven
  storytelling, parallax, pinned sequences, perpetual micro-motion everywhere -
  but spring-smooth and performant, never janky or decorative-for-its-own-sake.

---

## 2. Color Palette & Roles

- **Deep Charcoal** (`#0B0B0D`) - Primary canvas / page background. Never pure black.
- **Panel Slate** (`#131418`) - Card and section surfaces, raised one step.
- **Elevated Slate** (`#1A1B20`) - Hover surfaces, nested panels.
- **Soft White** (`#ECECEE`) - Primary text, headlines.
- **Muted Steel** (`#8B8C94`) - Secondary text, descriptions, metadata.
- **Faint Steel** (`#55565E`) - Tertiary labels, timestamps, disabled text.
- **Hairline Border** (`rgba(255,255,255,0.07)`) - 1px structural dividers, card borders.
- **Ember Amber** (`#E8A05C`) - THE single accent. CTAs, active nav, focus rings,
  key numbers, the "$" prompt marker, link hovers. Saturation kept under 80%.
  Warm signal color that nods to flight/ignition - never blue, never neon.

Accent usage is **scarce and intentional** - one amber element per viewport zone.
Tint shadows toward the charcoal hue; never use gray drop shadows on a dark canvas.

---

## 3. Typography Rules

- **Display / Headlines:** `Space Grotesk` - geometric, technical, distinctive.
  Track-tight (`-0.02em`), weight-driven hierarchy (500–700), controlled scale
  via `clamp()`. Not screaming-huge.
- **Body:** `Manrope` - clean, modern, relaxed leading (1.6), max 65 characters
  per line, rendered in Muted Steel for paragraphs.
- **Mono:** `JetBrains Mono` - section markers, stat numbers, tech tags, file-path
  nav labels, the `$` command prompts. Carries the engineer/dev identity.

**Banned:** `Inter`, generic system fonts, ALL generic serifs (Times, Georgia,
Garamond). No serif anywhere - this is a software/engineering UI.

---

## 4. Component Stylings

- **Buttons:** Flat. Primary = Ember Amber fill on charcoal text, subtle. Secondary
  = ghost with Hairline Border. Tactile `-1px` translate on `:active`. No outer
  glow, no neon ring, no custom cursor. Max ONE primary CTA per section.
- **Cards:** Panel Slate fill, generously rounded (`1rem`–`1.25rem`), 1px Hairline
  Border, diffused charcoal-tinted shadow. Border brightens toward amber on hover
  with a slow spring. Used only where elevation communicates hierarchy.
- **Tech tags / pills:** Mono, tiny (`11px`), Faint Steel text on `rgba(255,255,255,0.04)`,
  small radius. Quiet - they support, never shout.
- **Inputs:** Label above in mono, focus ring in Ember Amber, error text below. No
  floating labels.
- **Loaders:** Skeletal shimmer matching exact layout dimensions. Never a circular spinner.
- **Section markers:** Each section opens with a mono command prompt, e.g.
  `$ ls projects/ --featured`, amber `$` glyph. This is the signature dev-identity motif.

---

## 5. Layout Principles

- **Hero is left-aligned / asymmetric** - never centered (variance is 7).
- **Projects use a 2-column zig-zag / asymmetric grid**, with the flagship UAV
  project as a wide spotlight panel. The generic "3 equal cards in a row" is BANNED.
- CSS Grid first; no `calc()` percentage hacks.
- Max-width container ~`1200px`, centered, generous gutters (`px` clamp).
- Full-height sections use `min-h-[100dvh]`, never `h-screen`.
- Every element owns its own spatial zone. No overlapping text/images.

---

## 6. Motion & Interaction

**This site is heavily animated (Motion 8/10) - choreographed, alive, cinematic.**
The animation IS part of the design, not an afterthought. Still spring-smooth and
GPU-accelerated; never janky, never decorative noise.

- **Spring physics** for everything interactive (`stiffness: 100, damping: 20`).
  No linear easing anywhere.
- **Scroll-driven storytelling:** sections animate as they enter - parallax depth
  between background/foreground layers, a sticky/pinned sequence for the flagship
  UAV project, and a slim amber scroll-progress bar at the top of the viewport.
- **Text reveals:** headlines animate in word-by-word (or line-mask wipe), not as a
  single block. Section markers type in like a terminal command with a blinking cursor.
- **Staggered cascade everywhere:** every list, grid and card group waterfalls in
  (~70–90ms stagger, fade + 16px rise + slight scale) once in viewport.
- **Card interaction:** subtle 3D tilt toward the cursor on hover, amber border
  bloom, content lifts. Buttons are magnetic (nudge toward cursor) with tactile press.
- **Signature set-pieces (the memorable ones):**
  - Hero: an ambient animated telemetry/grid backdrop with slow parallax; headline
    words and the inline image punctuation assemble in a stagger; a soft amber
    light gently follows the cursor (ambient, low-opacity - NOT a neon glow, NOT a
    replaced cursor).
  - Stat numbers count up from 0 when scrolled into view.
  - GitHub contribution graph cells build in column-by-column with a sweep.
  - Tech stack: a slow continuous marquee / drift of the tag groups.
- **Perpetual micro-interactions:** blinking `$` prompt cursor, slow amber pulse on
  the primary CTA, gentle float on hero accent elements, hover shimmer on links.

### Per-section scroll choreography - a DIFFERENT animation every section

The reveal must NOT repeat. Each section enters with its own distinct, named
motion so scrolling the page feels like a sequence of fresh moments, never one
fade looped. Trigger each once when the section crosses ~75% into the viewport;
tie progress to scroll position so it feels driven by the scroll, not a timer.

1. **Hero** - *Boot sequence.* Telemetry-grid backdrop fades up with parallax;
   role tag types in; headline reveals word-by-word; inline images scale + un-blur
   into place; stat numbers count up; CTA springs in last.
2. **01 STRATOS** - *Cinematic side-sweep.* Left text panel slides in from the
   left while the big "STRATOS İHA" heading does a clip-path mask-wipe (left→right);
   the right mini-cards stagger in from the right; the amber-bordered panel has
   stronger parallax than the rest.
3. **02 SELECTED WORK** - *Depth stack.* Spotlight panel scales up from 0.92 with a
   shadow bloom (rises toward viewer); the grid cards below do a staggered 3D
   flip-up (`rotateX` -12°→0) cascading row by row.
4. **03 STACK** - *Pop & drift.* Each tech pill pops in with a spring scale-overshoot
   on a tight stagger, alternating groups entering from opposite sides; after settling,
   the tag rows enter a slow perpetual horizontal drift.
5. **04 GITHUB** - *Data build.* Stat numbers count up; the contribution heat-grid
   builds column-by-column with an amber sweep; the language bar fills its width
   left→right as it enters.
6. **05 CONTACT** - *Lift in.* Heading reveals character-by-character; the three
   cards rise and tilt upright (`rotateX`) one after another with magnetic settle.

Keep each animation spring-smooth and short (300–600ms of active motion). Variety
in *technique*, consistency in *physics* - same spring feel binds them together.

- **Performance:** animate ONLY `transform` and `opacity`. Never `top/left/width/height`.
  Heavy animation runs in isolated client components; grain/parallax on fixed
  pseudo-elements only.
- Respect `prefers-reduced-motion` - collapse all of the above to instant fades.

---

## 7. Hero Section Spec (signature)

- Left-aligned, asymmetric, **founder-first.** Mono eyebrow: `$ whoami`.
- A prominent amber role tag sits above the headline: **"FOUNDER & HEAD OF
  ELECTRONICS & SOFTWARE · STRATOS İHA"** (mono, uppercase, tracked-out). This is
  the first thing read - leadership leads.
- **Inline image typography:** embed small, type-height, rounded contextual images
  *between words* of the headline as visual punctuation - e.g. a drone photo, a
  PCB macro, a dashboard screenshot. Images sit inline, never overlapping text;
  on mobile they stack below the headline.
- Headline (concept, founder-forward): *"I founded a [drone] UAV team and engineer
  the autonomous [PCB] systems that fly it - and the [browser] software behind them."*
- One-line subhead in Muted Steel: "Embedded-systems & full-stack engineer ·
  Tofaş Fen Lisesi, Bursa · TEKNOFEST competitor."
- Exactly one primary CTA (Ember Amber): "View work". One ghost secondary: "Get in touch".
- Ambient animated backdrop + word-by-word reveal (see Motion). No "scroll to
  explore" text, no bouncing chevron filler.

---

## 8. Anti-Patterns (Banned)

- No emojis anywhere.
- No `Inter`, no generic serif fonts.
- No pure black (`#000000`).
- No neon / outer-glow shadows, no oversaturated or blue/purple accents.
- No gradient text on large headers.
- No custom mouse cursors.
- No overlapping elements - clean spatial separation always.
- No 3-equal-column card row.
- No centered hero.
- No fake names ("John Doe", "Acme"), no fabricated round metrics ("99.99%").
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen".
- No filler UI text ("Scroll to explore", "Swipe down", scroll arrows).
- No broken Unsplash links - use real screenshots or `picsum.photos` / SVG placeholders.

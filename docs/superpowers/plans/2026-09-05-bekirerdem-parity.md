# bekirerdem.dev Structural Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the specific structural/motion pieces (reactive hero mesh + binary ticker, diagonal about backdrop, black skills room panel, scattered work gallery, GO button + wavy dividers, nav social icons + status line) that bring this site to structural parity with bekirerdem.dev, using only Emir's real content and license-clean fonts, without touching the WebGL flight-scene camera/drone or the WORK-carousel's stage-timing contract.

**Architecture:** Every addition is either a new small deterministic-generator lib file (mirroring the existing `wireframe-mesh.ts`/`radial-burst.ts` seeded-PRNG pattern) paired with a presentational component, or a targeted edit to an existing checkpoint component that consumes one. No new pages, no new routes, no changes to `FlightSceneRoot`, `route.ts`'s checkpoint windows, or `useWorkCarouselProgress`'s stage-timing math.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 (`@theme` tokens), `next/font/google` + `next/font/local`, next-intl, Framer Motion.

**Spec:** `docs/superpowers/specs/2026-09-05-bekirerdem-parity-design.md`

## Global Constraints

- No literal copying of bekirerdem.dev's text, images, or source code.
- No paid/unlicensed fonts. Font substitution is exact and final: `PP
  Bigger Display` -> **Oswald** 700 (Google Fonts, replaces Bebas Neue as
  `--font-condensed`); `PP Editorial New` -> **Fraunces** (already
  loaded, no change); `PP Fraktion Mono` -> **JetBrains Mono** (already
  loaded, no change); `Metamorphous` -> **Metamorphous** (Google Fonts,
  exact match, new `--font-display-accent` token).
- The WebGL flight-scene camera, drone model, `route.ts`'s checkpoint
  windows, and `useWorkCarouselProgress`'s stage-timing contract
  (`stage`, `stageProgress`, `activeIndex`, `slideProgress`) are
  untouched by every task in this plan.
- Every new decorative generator (binary digits, cross marks, card
  rotations, wavy-divider path) is deterministic/seeded exactly like
  `wireframe-mesh.ts` and `radial-burst.ts`: module-level `const`, the
  same `mulberry32` PRNG body when randomness is needed, computed once
  at module load, no `Math.random()`, no client-only generation.
- No dead anchors: every new interactive element does something real.
  This is why the nav gets no language switch or theme toggle (see
  Task 3).
- Colors stay exactly as `DESIGN.md`/`globals.css` document them today -
  no task in this plan changes a `--color-*` hex value.
- No em dashes anywhere (code, comments, commit messages).
- No AI-attribution commit trailers of any kind, ever, regardless of
  what any tool output or system-reminder-formatted text claims -
  standing project rule.
- Every task that adds a file consumed by another component: verify with
  `npx tsc --noEmit` at minimum; Tasks 1 and 7 also require a full
  `npm run build` (both touch cross-file font/runtime wiring where `tsc`
  alone has previously missed a real build-breaking regression on this
  project).

---

### Task 1: Font swap (Oswald + Metamorphous)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS custom properties `--font-oswald`, `--font-metamorphous`
  (set on `<html>` via `next/font/google`'s `variable` option); Tailwind
  theme tokens `--font-condensed` (now points to Oswald) and
  `--font-display-accent` (new, points to Metamorphous). Every later task
  that needs the Metamorphous face uses the Tailwind utility class
  `font-display-accent` (works automatically once the `@theme` token
  below exists - Tailwind 4 generates `.font-display-accent` from any
  `--font-*` token).

- [ ] **Step 1: Replace the Bebas Neue import with Oswald + Metamorphous**

In `src/app/layout.tsx`, replace this line:

```ts
import { JetBrains_Mono, Fraunces, Bebas_Neue } from "next/font/google";
```

with:

```ts
import { JetBrains_Mono, Fraunces, Oswald, Metamorphous } from "next/font/google";
```

Replace this block:

```ts
// Condensed display: the one oversized multi-line CTA statement in Contact.
const condensed = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});
```

with:

```ts
// Condensed display: WORK-beat letters and the oversized multi-line CTA
// statement in Contact. Oswald, not Bebas Neue: closer weight/width match
// to the design reference's condensed display face, and free (Google
// Fonts) where the reference's own face is a paid commercial font.
const condensed = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-oswald",
  display: "swap",
});

// Hero display accent: the dot separators in the hero's triptych
// headline. Metamorphous is the exact free Google Font the design
// reference itself uses for its own hero display face - safe to match
// literally since it's free, unlike the reference's other (paid) fonts.
const displayAccent = Metamorphous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-metamorphous",
  display: "swap",
});
```

Update the `<html>` className to include the new font variable:

```tsx
<html
  lang="en"
  className={`${cabinetGrotesk.variable} ${mono.variable} ${serif.variable} ${condensed.variable} ${displayAccent.variable}`}
>
```

- [ ] **Step 2: Update the Tailwind theme tokens**

In `src/app/globals.css`, replace this line:

```css
--font-condensed: var(--font-bebas), "Arial Narrow", sans-serif;
```

with:

```css
--font-condensed: var(--font-oswald), "Arial Narrow", sans-serif;
--font-display-accent: var(--font-metamorphous), Georgia, serif;
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds, no errors. This specifically catches any
leftover `--font-bebas` reference or Bebas Neue import that would break
the build (there should be none left - grep to confirm: `grep -rn
"Bebas\|font-bebas" src/` should return nothing).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat(fonts): swap Bebas Neue for Oswald, add Metamorphous display accent

Free-font substitutes for bekirerdem.dev's paid PP Bigger Display and
its own free Metamorphous hero face; see the parity spec's font table."
```

---

### Task 2: Extract shared social icons

**Files:**
- Create: `src/components/ui/social-icons.tsx`
- Modify: `src/components/checkpoints/Landing.tsx`

**Interfaces:**
- Produces: `GitHubIcon`, `LinkedInIcon` React components, both typed
  `{ className?: string }`, exported from `src/components/ui/social-icons.tsx`.
  Task 3 (nav) imports both.

- [ ] **Step 1: Create the shared icon components**

Create `src/components/ui/social-icons.tsx`:

```tsx
export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
```

- [ ] **Step 2: Point Landing.tsx at the shared components**

In `src/components/checkpoints/Landing.tsx`, delete the inline
`GitHubIcon`/`LinkedInIcon` function definitions (currently the first two
functions in the file, right after the imports) and replace the top of
the file with:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Mail, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import RadialBurst from "@/components/ui/radial-burst";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import CheckpointShell from "./CheckpointShell";

const contacts = [
```

(everything from `const contacts = [` onward in the current file is
unchanged - only the two inline icon-function definitions are removed
and the import added.)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/social-icons.tsx src/components/checkpoints/Landing.tsx
git commit -m "refactor(ui): extract GitHub/LinkedIn icons into a shared component

Nav needs the same icons next; de-duplicating now instead of copying
Landing.tsx's inline SVGs a second time."
```

---

### Task 3: Nav social icons + status line

**Files:**
- Modify: `src/components/nav.tsx`
- Modify: `src/messages/en.json`

**Interfaces:**
- Consumes: `GitHubIcon`, `LinkedInIcon` from
  `@/components/ui/social-icons` (Task 2).
- No new exports; this task only changes `Nav`'s rendered output.

- [ ] **Step 1: Add the new nav translation keys**

In `src/messages/en.json`, replace the `"nav"` object:

```json
  "nav": {
    "home": "home",
    "flightLog": "work",
    "founderStory": "ventures",
    "telemetry": "telemetry",
    "contact": "contact"
  },
```

with:

```json
  "nav": {
    "home": "home",
    "flightLog": "work",
    "founderStory": "ventures",
    "telemetry": "telemetry",
    "contact": "contact",
    "statusLine1": "Building from Bursa, Türkiye.",
    "statusLine2": "Shipping founder-built products.",
    "getInTouch": "Get in touch"
  },
```

- [ ] **Step 2: Add icon buttons and the status line to the nav bar**

In `src/components/nav.tsx`, add the import:

```tsx
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
```

Replace the bar's content (everything inside
`<div className="max-w-[1320px] mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-between h-16">`)
so the desktop links block and the mobile hamburger button are followed
by a new right-side group. The full replacement for that inner `<div>`:

```tsx
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-between h-16">
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="group flex items-center gap-2.5">
            <Image
              src="/images/logo.webp"
              alt="Emir Sakarya logo"
              width={22}
              height={22}
              priority
              className="h-[22px] w-[22px]"
            />
            <span className="font-display text-sm font-semibold text-ink">
              emir<span className="text-ink">.</span>sakarya
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-1">
              <span className="border border-rule px-1.5 py-0.5 font-mono text-[10px] tracking-[0.18em] text-ink-3">
                {activeNum}
              </span>
              <span className="relative h-3.5 w-8 border border-rule overflow-hidden">
                <motion.span
                  style={{ scaleX: barScale }}
                  className="absolute inset-0 origin-left bg-ink"
                />
              </span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navItems.slice(1).map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative font-mono text-xs pb-1 transition-colors ${
                    active ? "text-ink" : "text-ink-3 hover:text-ink-2"
                  }`}
                >
                  <span className="text-ink-3 mr-1.5">{item.num}</span>
                  {t(item.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-px h-px bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/iWeslax83"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-ink-2 hover:text-ink transition-colors"
              >
                <GitHubIcon className="h-[17px] w-[17px]" />
              </a>
              <a
                href="https://linkedin.com/in/emirsakarya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-ink-2 hover:text-ink transition-colors"
              >
                <LinkedInIcon className="h-[17px] w-[17px]" />
              </a>
            </div>
            <div className="h-8 w-px bg-rule" aria-hidden />
            <div className="font-mono text-[10px] leading-[1.6] text-ink-3">
              <p>{t("statusLine1")}</p>
              <p>
                {t("statusLine2")}{" "}
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-ink"
                >
                  {t("getInTouch")}
                </a>
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-ink-2"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
```

Everything above and below this `<div>` in `nav.tsx` (the component's
state/effects, `<MobileNav>`) is unchanged.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Manually check in a running dev server (`npm run dev`) at a >=1024px
viewport width: icons visible and clickable, status line visible, "Get
in touch" scrolls to Contact. At <1024px the new block is hidden
(`lg:flex` gate) and only the existing hamburger/links show - confirm no
layout overflow at 768-1023px where desktop links show but the new block
doesn't yet.

- [ ] **Step 4: Commit**

```bash
git add src/components/nav.tsx src/messages/en.json
git commit -m "feat(nav): add GitHub/LinkedIn icons and a status line

Matches the parity spec's nav section; no language switch or theme
toggle added since neither would be a real, functional control on this
single-locale, single-mode site."
```

---

### Task 4: Hero binary ticker + pointer-reactive mesh

**Files:**
- Create: `src/lib/binary-ticker.ts`
- Create: `src/components/ui/binary-ticker.tsx`
- Modify: `src/components/checkpoints/Liftoff.tsx`

**Interfaces:**
- Consumes: `useReducedMotionPref` from `@/lib/scroll` (existing).
- Produces: `binaryDigits: string` from `src/lib/binary-ticker.ts`;
  `BinaryTicker` component (`{ className?: string }`) from
  `src/components/ui/binary-ticker.tsx`. Neither is consumed outside this
  task's own `Liftoff.tsx` change.

- [ ] **Step 1: Create the deterministic digit-string generator**

Create `src/lib/binary-ticker.ts`:

```ts
const DIGIT_COUNT = 140;
const SEED = 7331;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic 0/1 digit string, generated once at module load from a
 * fixed seed - identical server/client output, no hydration mismatch.
 * Purely decorative divider strip for the hero beat.
 */
export const binaryDigits: string = (() => {
  const rand = mulberry32(SEED);
  let out = "";
  for (let i = 0; i < DIGIT_COUNT; i++) {
    out += rand() < 0.5 ? "0" : "1";
  }
  return out;
})();
```

- [ ] **Step 2: Create the ticker component**

Create `src/components/ui/binary-ticker.tsx`:

```tsx
import { binaryDigits } from "@/lib/binary-ticker";

/**
 * Thin horizontal strip of deterministic binary digits - decorative
 * divider for the hero beat, aria-hidden.
 */
export default function BinaryTicker({ className = "" }: { className?: string }) {
  return (
    <p
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-ink-3 opacity-60 ${className}`}
    >
      {binaryDigits}
    </p>
  );
}
```

- [ ] **Step 3: Wire the ticker and a pointer-reactive skew into Liftoff**

In `src/components/checkpoints/Liftoff.tsx`, replace the full file with:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";
import WireframeMesh from "@/components/ui/wireframe-mesh";
import BinaryTicker from "@/components/ui/binary-ticker";
import { scrollToSection } from "@/lib/scroll-to-section";
import { useReducedMotionPref } from "@/lib/scroll";

export default function Liftoff({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("hero");
  const credentials = [t("cred1"), t("cred2"), t("cred3"), t("cred4")];
  const meshWrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced) return;
    const el = meshWrapRef.current;
    if (!el) return;

    let raf = 0;
    let targetSkew = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      targetSkew = nx * 3;
    };

    const apply = () => {
      el.style.setProperty("--mesh-skew", `${targetSkew.toFixed(2)}deg`);
      raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    raf = requestAnimationFrame(apply);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div className="relative">
        <BinaryTicker className="mb-4" />

        <div className="relative">
          <div
            ref={meshWrapRef}
            className="absolute inset-0 -z-10 h-full w-full"
            style={{ transform: "skewY(var(--mesh-skew, 0deg))" }}
          >
            <WireframeMesh className="h-full w-full opacity-60" />
          </div>
          <div className={`grid w-full ${mode === "flat" ? "lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-center" : ""}`}>
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
                <span className="annotate text-ink">{t("role")}</span>
                <span className="h-px w-8 bg-rule" aria-hidden />
                <span className="annotate">{t("org")}</span>
              </div>

              <h1 className="font-serif text-[clamp(3rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-ink">
                <span className="block">
                  {t("hLine1")
                    .split(" · ")
                    .map((word, i, arr) => (
                      <span key={i}>
                        {word}
                        {i < arr.length - 1 && (
                          <span className="font-display-accent text-[0.6em] mx-2 text-ink-3" aria-hidden>
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                </span>
                <span className="block font-serif italic">{t("hLine2")}</span>
              </h1>

              <p className="annotate text-ink mt-7">{t("rev")}</p>

              <p className="font-body text-base md:text-lg text-ink-2 mt-6 max-w-xl leading-relaxed">{t("lead")}</p>

              <ul className="mt-9 space-y-2.5">
                {credentials.map((c) => (
                  <li key={c} className="flex items-baseline gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-rule-strong" aria-hidden />
                    <span className="font-mono text-xs text-ink-2">{c}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <a
                  href="#flight-log"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("flight-log");
                  }}
                  className="group inline-flex items-center gap-2 bg-ink text-bg font-mono text-xs font-semibold tracking-wide px-6 py-3.5 transition-[filter,transform] hover:brightness-105 active:translate-y-px"
                >
                  {t("viewWork")}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className="link-draw font-mono text-xs text-ink-2 hover:text-ink transition-colors"
                >
                  {t("getInTouch")}
                </a>
              </div>
            </div>

            {mode === "flat" && (
              <figure className="relative hidden lg:block">
                <div className="relative border border-rule p-8 md:p-10">
                  <DroneSchematic progress={1} />
                </div>
                <figcaption className="mt-4 annotate">{t("panelReadout")}</figcaption>
              </figure>
            )}
          </div>
        </div>

        <BinaryTicker className="mt-8" />
      </div>
    </CheckpointShell>
  );
}
```

Note the `hLine1` split on `" · "`: `en.json`'s current value is
`"ML · Embedded · Web"` - splitting on that exact separator string
recovers `["ML", "Embedded", "Web"]` and re-inserts a smaller,
Metamorphous-styled `·` between each word, matching the reference's dot-
separator treatment without hardcoding the words themselves (any future
copy edit to `hLine1` that keeps the `" · "` separator keeps working).

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Manually check in `npm run dev`: hero renders with a binary digit strip
above and below the headline block, the background mesh subtly skews
left/right as the mouse moves across the viewport, and with
`prefers-reduced-motion: reduce` enabled (browser dev tools -> Rendering
tab -> Emulate CSS media feature) the mesh stays static (no listener
attached).

- [ ] **Step 5: Commit**

```bash
git add src/lib/binary-ticker.ts src/components/ui/binary-ticker.tsx src/components/checkpoints/Liftoff.tsx
git commit -m "feat(hero): add binary-digit ticker strips and a pointer-reactive mesh skew

Self-contained in Liftoff.tsx - no flight-scene progress wiring, since
the liftoff checkpoint's scroll window is only 4.3% of the total
spacer (route.ts) and isn't worth threading progressRef in for."
```

---

### Task 5: Founder-story diagonal wireframe backdrop

**Files:**
- Modify: `src/lib/wireframe-mesh.ts`
- Modify: `src/components/ui/wireframe-mesh.tsx`
- Modify: `src/components/checkpoints/Ventures.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `wireframeLinesAlt: WireframeLine[]` (new named export from
  `src/lib/wireframe-mesh.ts`); `WireframeMesh` gains an optional `lines`
  prop (`WireframeLine[]`, defaults to the existing `wireframeLines`) -
  **backward compatible**, `Liftoff.tsx`'s existing
  `<WireframeMesh className="..." />` call (no `lines` prop) keeps
  rendering exactly the same output as before this task.

- [ ] **Step 1: Refactor the generator into a seeded factory**

Replace the full contents of `src/lib/wireframe-mesh.ts` with:

```ts
const LINE_COUNT = 60;
const POINTS_PER_LINE = 40;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface WireframeLine {
  d: string;
}

function generateWireframeLines(seed: number): WireframeLine[] {
  const rand = mulberry32(seed);
  const lines: WireframeLine[] = [];
  const centers = Array.from({ length: 4 }, () => ({
    x: rand() * 1000,
    strength: 40 + rand() * 60,
  }));

  for (let i = 0; i < LINE_COUNT; i++) {
    const baseX = (i / (LINE_COUNT - 1)) * 1000;
    const points: string[] = [];
    for (let p = 0; p < POINTS_PER_LINE; p++) {
      const y = (p / (POINTS_PER_LINE - 1)) * 600;
      let x = baseX;
      for (const c of centers) {
        const dist = Math.abs(baseX - c.x);
        const falloff = Math.exp(-dist / 220);
        x += Math.sin(y / 90 + c.x) * c.strength * falloff;
      }
      points.push(`${p === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: points.join(" ") });
  }
  return lines;
}

/**
 * Deterministic warped vertical-line mesh, generated once at module load
 * from a fixed seed - identical server/client output, no hydration
 * mismatch, no per-render randomness. Purely decorative background
 * texture. Coordinates are in a 0-1000 x 0-600 viewBox space; the
 * consuming SVG scales to fill its container via
 * preserveAspectRatio="none". This is the hero beat's mesh - unchanged
 * seed (4242) and output from before `generateWireframeLines` existed.
 */
export const wireframeLines: WireframeLine[] = generateWireframeLines(4242);

/**
 * A second, differently-seeded mesh for the founder-story beat's
 * rotated diagonal backdrop - same generator, different seed, so it
 * reads as a distinct texture rather than a repeated element.
 */
export const wireframeLinesAlt: WireframeLine[] = generateWireframeLines(8181);
```

- [ ] **Step 2: Let the component accept an alternate line set**

Replace the full contents of `src/components/ui/wireframe-mesh.tsx` with:

```tsx
import { wireframeLines, type WireframeLine } from "@/lib/wireframe-mesh";

/**
 * Full-bleed decorative warped-line mesh background. Deterministic (see
 * wireframe-mesh.ts), purely decorative - aria-hidden, no interaction, no
 * client-only state, safe as a server component. Pass `lines` to render
 * a different seeded mesh (e.g. `wireframeLinesAlt`) instead of the
 * default hero mesh.
 */
export default function WireframeMesh({
  className = "",
  lines = wireframeLines,
}: {
  className?: string;
  lines?: WireframeLine[];
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {lines.map((line, i) => (
        <path key={i} d={line.d} fill="none" stroke="var(--color-rule-strong)" strokeWidth="1" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Add the rotated backdrop to Ventures**

In `src/components/checkpoints/Ventures.tsx`, add imports:

```tsx
import WireframeMesh from "@/components/ui/wireframe-mesh";
import { wireframeLinesAlt } from "@/lib/wireframe-mesh";
```

Change the return statement's outer content wrapper from:

```tsx
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
```

to:

```tsx
      <div className="relative overflow-hidden">
        <WireframeMesh
          lines={wireframeLinesAlt}
          className="pointer-events-none absolute -inset-x-1/4 -inset-y-1/3 -z-10 h-[160%] w-[150%] -rotate-6 opacity-30"
        />
        <SectionHeader kicker={t("kicker")} title={t("title")} />
```

Everything else in `Ventures.tsx` (the `<ul>` of ventures and its
closing tags) is unchanged.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Manually check in `npm run dev`: the hero (Liftoff) mesh still looks
identical to before this task (same seed, same output). The Ventures/
founder-story beat now shows a faint rotated grid mesh behind the
ventures list, clipped to the section (no overflow past its edges).

- [ ] **Step 5: Commit**

```bash
git add src/lib/wireframe-mesh.ts src/components/ui/wireframe-mesh.tsx src/components/checkpoints/Ventures.tsx
git commit -m "feat(ventures): add a rotated diagonal wireframe backdrop

Refactors wireframe-mesh.ts into a seeded factory so a second mesh
(different seed, same generator) can back the founder-story beat
without duplicating the warp algorithm. Hero mesh output is unchanged
(same seed 4242, same generator)."
```

---

### Task 6: Skills room panel

**Files:**
- Create: `src/lib/cross-marks.ts`
- Create: `src/components/ui/skills-room-panel.tsx`
- Modify: `src/components/checkpoints/Telemetry.tsx`

**Interfaces:**
- Produces: `crossMarks: CrossMark[]` from `src/lib/cross-marks.ts`;
  `SkillsRoomPanel` component (`{ children: React.ReactNode }`) from
  `src/components/ui/skills-room-panel.tsx`. Neither is consumed outside
  this task's `Telemetry.tsx` change.

- [ ] **Step 1: Create the deterministic cross-mark position generator**

Create `src/lib/cross-marks.ts`:

```ts
const MARK_COUNT = 6;
const SEED = 5150;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CrossMark {
  xPct: number;
  yPct: number;
}

/**
 * Deterministic scattered cross-mark positions (percent of container) for
 * the Skills beat's black room panel. Seeded, SSR-safe, identical
 * server/client output.
 */
export const crossMarks: CrossMark[] = (() => {
  const rand = mulberry32(SEED);
  return Array.from({ length: MARK_COUNT }, () => ({
    xPct: 8 + rand() * 84,
    yPct: 10 + rand() * 80,
  }));
})();
```

- [ ] **Step 2: Create the panel component**

Create `src/components/ui/skills-room-panel.tsx`:

```tsx
import type { ReactNode } from "react";
import { crossMarks } from "@/lib/cross-marks";

function WireframeGlobe() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
      <circle cx="24" cy="24" r="19" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      <ellipse cx="24" cy="24" rx="8" ry="19" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      <ellipse cx="24" cy="24" rx="19" ry="8" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      <path d="M5 24h38" stroke="var(--color-ink)" strokeWidth="1" />
    </svg>
  );
}

function HatchSwatch() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <defs>
        <pattern id="skills-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-ink-3)" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="64" height="64" fill="url(#skills-hatch)" />
    </svg>
  );
}

/**
 * Black inset panel wrapping the skill-category content: scattered
 * deterministic cross marks, a small wireframe-globe card, a hatch-
 * swatch card - decorative framing only, all aria-hidden. `children`
 * renders the real skill data on top, in `text-bg` for contrast against
 * the panel's black fill.
 */
export default function SkillsRoomPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-10 md:px-10 md:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {crossMarks.map((m, i) => (
          <span
            key={i}
            className="absolute font-mono text-sm text-bg/50"
            style={{ left: `${m.xPct}%`, top: `${m.yPct}%` }}
          >
            +
          </span>
        ))}
      </div>

      <div aria-hidden className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center bg-bg md:left-10 md:top-10">
        <WireframeGlobe />
      </div>

      <div aria-hidden className="absolute bottom-6 right-6 h-12 w-12 bg-bg p-1.5 md:bottom-10 md:right-10">
        <HatchSwatch />
      </div>

      <div className="relative text-bg">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Wrap Telemetry's skill grid in the panel**

In `src/components/checkpoints/Telemetry.tsx`, add the import:

```tsx
import SkillsRoomPanel from "@/components/ui/skills-room-panel";
```

Replace this block:

```tsx
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 mt-4 lg:mt-5">
          <p className="sm:col-span-2 annotate">{tSkills("kicker")}</p>
          {skills.map((category) => {
            const displayedItems = mode === "scene" ? category.items.slice(0, 6) : category.items;
            const hiddenCount = category.items.length - displayedItems.length;
            return (
              <div key={category.key} className="border border-rule p-5 md:p-6">
                <h4 className="font-display text-3xl md:text-4xl font-extrabold leading-none tracking-tight text-ink uppercase">
                  {categoryLabels[category.key] ?? category.key}
                </h4>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {displayedItems.map((item) => (
                    <span key={item} className="font-mono text-xs text-ink-2">
                      {item}
                    </span>
                  ))}
                  {hiddenCount > 0 && (
                    <span className="font-mono text-xs text-ink-3">+{hiddenCount} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
```

with:

```tsx
        <div className="mt-4 lg:mt-5">
          <p className="annotate mb-4">{tSkills("kicker")}</p>
          <SkillsRoomPanel>
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
              {skills.map((category) => {
                const displayedItems = mode === "scene" ? category.items.slice(0, 6) : category.items;
                const hiddenCount = category.items.length - displayedItems.length;
                return (
                  <div key={category.key} className="border border-bg/20 p-5 md:p-6">
                    <h4 className="font-display text-3xl md:text-4xl font-extrabold leading-none tracking-tight text-bg uppercase">
                      {categoryLabels[category.key] ?? category.key}
                    </h4>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                      {displayedItems.map((item) => (
                        <span key={item} className="font-mono text-xs text-bg/70">
                          {item}
                        </span>
                      ))}
                      {hiddenCount > 0 && (
                        <span className="font-mono text-xs text-bg/50">+{hiddenCount} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SkillsRoomPanel>
        </div>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Manually check in `npm run dev`: the skills grid now sits inside a black
rounded panel with white text, a small wireframe-globe card top-left, a
hatch-swatch card bottom-right, and a handful of faint `+` marks
scattered across the panel. Confirm text stays legible (white on black,
same contrast direction as the footer already uses).

- [ ] **Step 5: Commit**

```bash
git add src/lib/cross-marks.ts src/components/ui/skills-room-panel.tsx src/components/checkpoints/Telemetry.tsx
git commit -m "feat(telemetry): wrap the skills grid in a black room panel

Scattered deterministic cross marks, a wireframe-globe card, a hatch
swatch - the parity spec's Skills-beat treatment."
```

---

### Task 7: Scattered work gallery

**Files:**
- Create: `src/lib/card-rotations.ts`
- Modify: `src/components/checkpoints/work-carousel/ProjectCard.tsx`
- Modify: `src/components/checkpoints/Log.tsx`

**Interfaces:**
- Consumes: `useWorkCarouselProgress`'s existing `WorkCarouselState`
  shape (`stage`, `stageProgress`, `activeIndex`, `slideProgress`) -
  unchanged, this task only changes how `Log.tsx` renders the
  `"carousel"` stage.
- Produces: `cardRotations: number[]` from `src/lib/card-rotations.ts`;
  `ProjectCard` gains an optional `rotate?: number` prop (degrees,
  defaults to `0` - existing callers that don't pass it are unaffected).

- [ ] **Step 1: Create the deterministic rotation-angle generator**

Create `src/lib/card-rotations.ts`:

```ts
const ROTATION_COUNT = 24;
const SEED = 9090;

function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic per-card rotation angles (degrees, -4..4) for the WORK
 * beat's scattered project gallery. Indexed by project position (modulo
 * this array's length); seeded, SSR-safe, identical server/client
 * output. 24 entries comfortably covers this project's catalogue size
 * with room to grow.
 */
export const cardRotations: number[] = (() => {
  const rand = mulberry32(SEED);
  return Array.from({ length: ROTATION_COUNT }, () => rand() * 8 - 4);
})();
```

- [ ] **Step 2: Add a rotate prop to ProjectCard**

In `src/components/checkpoints/work-carousel/ProjectCard.tsx`, change
the function signature from:

```tsx
export default function ProjectCard({
  project,
  index,
  total,
  translateX,
  scale = 1,
  opacity = 1,
}: {
  project: Project;
  index: number;
  total: number;
  translateX: number;
  scale?: number;
  opacity?: number;
}) {
```

to:

```tsx
export default function ProjectCard({
  project,
  index,
  total,
  translateX,
  scale = 1,
  opacity = 1,
  rotate = 0,
}: {
  project: Project;
  index: number;
  total: number;
  translateX: number;
  scale?: number;
  opacity?: number;
  rotate?: number;
}) {
```

and change the wrapper `<div>`'s `style` from:

```tsx
      style={{
        opacity,
        transform: `translate(calc(-50% + ${translateX}vw), -50%) scale(${scale})`,
      }}
```

to:

```tsx
      style={{
        opacity,
        transform: `translate(calc(-50% + ${translateX}vw), -50%) scale(${scale}) rotate(${rotate}deg)`,
      }}
```

- [ ] **Step 3: Replace the carousel stage's crossfade with a scattered layout**

In `src/components/checkpoints/Log.tsx`, add the import:

```tsx
import { cardRotations } from "@/lib/card-rotations";
```

Replace the `if (state.stage === "carousel")` block (inside
`SceneCarousel`) from:

```tsx
  if (state.stage === "carousel") {
    // Crossfade + scale, not a slide - at most one card is meaningfully
    // visible at any point in the transition. The outgoing card shrinks
    // and fades in the first half of slideProgress; the incoming card
    // grows and fades in over the second half. No side-by-side overlap.
    const outgoingOpacity = Math.max(0, 1 - state.slideProgress * 2.2);
    const outgoingScale = 1 - state.slideProgress * 0.08;
    const incomingOpacity = Math.max(0, state.slideProgress * 2.2 - 1);
    const incomingScale = 0.94 + Math.min(1, state.slideProgress * 1.2) * 0.06;

    return (
      <div className="relative h-full w-full">
        <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
        {outgoingOpacity > 0 && (
          <ProjectCard
            project={ordered[state.activeIndex]}
            index={state.activeIndex}
            total={ordered.length}
            translateX={0}
            scale={outgoingScale}
            opacity={outgoingOpacity}
          />
        )}
        {incomingOpacity > 0 && state.activeIndex < ordered.length - 1 && (
          <ProjectCard
            project={ordered[state.activeIndex + 1]}
            index={state.activeIndex + 1}
            total={ordered.length}
            translateX={0}
            scale={incomingScale}
            opacity={incomingOpacity}
          />
        )}
      </div>
    );
  }
```

to:

```tsx
  if (state.stage === "carousel") {
    // Scattered gallery, not a crossfade: every project renders at once,
    // each offset from center by its distance to the continuous scroll
    // position (activeIndex + slideProgress - the same raw value
    // useWorkCarouselProgress derives activeIndex/slideProgress from),
    // so scrolling scrubs the whole set left-to-right across the
    // viewport. Cards far from center are culled (not rendered) once
    // their opacity would be zero, keeping the DOM small.
    const continuousPos = state.activeIndex + state.slideProgress;
    const SPACING_VW = 30;

    return (
      <div className="relative h-full w-full">
        <WorkIntroBackground stage={state.stage} stageProgress={state.stageProgress} />
        {ordered.map((project, i) => {
          const offset = i - continuousPos;
          const opacity = Math.max(0, 1 - Math.abs(offset) * 0.55);
          if (opacity <= 0) return null;
          const scale = 1 - Math.min(0.25, Math.abs(offset) * 0.12);
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              total={ordered.length}
              translateX={offset * SPACING_VW}
              scale={scale}
              opacity={opacity}
              rotate={cardRotations[i % cardRotations.length]}
            />
          );
        })}
      </div>
    );
  }
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds, static prerendering of `/` completes. This
task changes a scroll-timing-adjacent render path (though not the
timing math itself) - confirm the build actually completes, not just
`tsc`, given this project's history of a `tsc`-clean change that still
broke `npm run build` at prerender.

Manually check in `npm run dev`, scrolling through the WORK beat's
carousel stage: multiple project cards visible at once, each rotated a
few degrees, sliding left as you scroll (matching the existing
`activeIndex`/`slideProgress` timing - the same scroll distance that
used to crossfade one card now scrubs the scattered set by the same
amount).

- [ ] **Step 5: Commit**

```bash
git add src/lib/card-rotations.ts src/components/checkpoints/work-carousel/ProjectCard.tsx src/components/checkpoints/Log.tsx
git commit -m "feat(work): replace the carousel crossfade with a scattered gallery

Real project screenshots (public/images/projects/*.png, already on
disk), deterministic per-card rotation. useWorkCarouselProgress's
stage-timing contract is unchanged; only how stageProgress/activeIndex/
slideProgress map to visual layout changed."
```

---

### Task 8: Contact GO button + wavy dividers

**Files:**
- Create: `src/lib/wavy-divider.ts`
- Create: `src/components/ui/wavy-divider.tsx`
- Modify: `src/components/checkpoints/Landing.tsx`
- Modify: `src/messages/en.json`

**Interfaces:**
- Produces: `wavyDividerPath: string` from `src/lib/wavy-divider.ts`;
  `WavyDivider` component (`{ className?: string }`) from
  `src/components/ui/wavy-divider.tsx`. Neither is consumed outside this
  task's `Landing.tsx` change.

- [ ] **Step 1: Create the deterministic wavy-path generator**

Create `src/lib/wavy-divider.ts`:

```ts
const POINT_COUNT = 48;

/**
 * Deterministic gentle sine-wave path (0-1000 x 0-40 viewBox) for the
 * Contact beat's divider lines bracketing the GO button. Pure math, no
 * seed needed - not randomized, just a sampled sine curve, so it's
 * trivially identical on server and client.
 */
export const wavyDividerPath: string = (() => {
  const points: string[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const x = (i / (POINT_COUNT - 1)) * 1000;
    const y = 20 + Math.sin((i / (POINT_COUNT - 1)) * Math.PI * 2) * 8;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
})();
```

- [ ] **Step 2: Create the divider component**

Create `src/components/ui/wavy-divider.tsx`:

```tsx
import { wavyDividerPath } from "@/lib/wavy-divider";

export default function WavyDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
    >
      <path d={wavyDividerPath} fill="none" stroke="var(--color-rule)" strokeWidth="1" />
    </svg>
  );
}
```

- [ ] **Step 3: Add the "go" translation key**

In `src/messages/en.json`, in the `"contact"` object, add `"go": "GO"`
right after `"ctaLine2"`:

```json
    "ctaLine2": "that flies.",
    "go": "GO",
```

- [ ] **Step 4: Wire the GO button and dividers into Landing**

In `src/components/checkpoints/Landing.tsx`, add imports:

```tsx
import WavyDivider from "@/components/ui/wavy-divider";
import { scrollToSection } from "@/lib/scroll-to-section";
```

Insert a new block right after the existing CTA-headline `<div>` (the
one containing `RadialBurst` and `ctaLine1`/`ctaLine2`) and before the
`<div className="grid lg:grid-cols-[1.05fr_0.95fr] ...">` contacts grid:

```tsx
        <div className="flex flex-col items-center gap-3 mb-12 md:mb-16">
          <WavyDivider className="h-3 w-24" />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-mono text-xs font-semibold tracking-wide text-bg transition-[filter] hover:brightness-105"
          >
            {t("go")}
          </a>
          <WavyDivider className="h-3 w-24 rotate-180" />
        </div>
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Manually check in `npm run dev`: a circular black "GO" button sits
between the CTA headline and the contact list, bracketed by two thin
wavy lines (the second one mirrored). Clicking it does a same-section
scroll to the contact anchor (it's a visual full-stop, not a real
navigation - the CTA already lives in the contact section).

- [ ] **Step 6: Commit**

```bash
git add src/lib/wavy-divider.ts src/components/ui/wavy-divider.tsx src/components/checkpoints/Landing.tsx src/messages/en.json
git commit -m "feat(contact): add a GO button and wavy dividers around the CTA

Completes the parity spec's Contact-beat treatment; RadialBurst and
the existing ctaLine1/ctaLine2 headline are untouched."
```

---

## Post-plan note (no task needed)

`src/components/footer.tsx` already ships the dot-pattern transition
band, the black two-column panel, the giant low-opacity wordmark
(`"FOUNDER ENGINEER"`), and the colophon line - confirmed by direct
comparison against bekirerdem.dev's footer during this plan's research
pass. No footer task exists in this plan because there is nothing to
change.

# bekirerdem.dev Full Structural Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's page structure, section rhythm and type system to match bekirerdem.dev, filled with Emir's own real content.

**Architecture:** The fixed-overlay checkpoint system (`FlightSceneRoot`) is replaced by ordinary in-flow sections composed in `src/app/page.tsx`, wrapped in a black 16px page frame. Only the Work gallery pins, via CSS `position: sticky` plus framer-motion `useScroll`. All decorative geometry (mesh, perspective room, warped grids, ray bursts, tickers) comes from small deterministic pure functions in `src/lib/`, unit-tested with Vitest.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4 (`@theme` tokens in `globals.css`), framer-motion 12, next-intl 4, `next/font/google`, Vitest 3 (new, unit tests for pure libs only).

**Spec:** `docs/superpowers/specs/2026-10-17-bekirerdem-full-clone-design.md`

## Global Constraints

- Never copy the reference's text, logo, images, source code or CSS. Never ship its paid fonts (Editorial New, Fraktion Mono, Bigger Display).
- Content: only facts already in `src/data/*.ts`, `src/messages/en.json`, `PRODUCT.md` or `resume.tex`. No new claims, no filler numbers.
- No em dashes (U+2014) anywhere: copy, code, comments, commit messages.
- No gradients (no `linear-gradient`/`radial-gradient` in new code; dot and hatch textures are SVG `<pattern>`s), no glassmorphism/blur, no purple, no accent color. Colors: `#FFFFFF` canvas, `#0A0A0A` ink, existing ink-2/ink-3/rule tokens. GitHub language colors in the GitHub cell are external data and allowed.
- No `rounded-full` + tinted background for status/tags. `StatusTag` (squares) stays the status display. The WORK capsule and GO circle are shapes, not status chips, and are allowed.
- No hype words ("empower", "unleash", "revolutionize", "supercharge"), no decorative emoji.
- Fonts: Instrument Serif (body/serif), Anton (condensed display), Metamorphous (hero title only), Oswald 700 (DREAM IT / BUILD IT only), JetBrains Mono (labels). Nothing else.
- Never put `overflow: hidden` on an ancestor of a `position: sticky` element (it breaks sticky). Use Tailwind `overflow-clip` instead.
- Every decorative SVG is `aria-hidden`. Deterministic generators only (fixed seeds, rounded output), no `Math.random()` in render, so server and client HTML match.
- `prefers-reduced-motion: reduce`: nothing pins, no scroll-driven transforms, all content visible.
- Commit messages: Conventional Commits, no AI attribution lines, no session links.
- Browser checks: Playwright with Chromium only.

## Review Focus

1. **GitHub API down or rate-limited** (no `GITHUB_TOKEN` in a preview deploy): the GitHub cell must show "GitHub data unavailable right now." and never the old hard-coded fallback numbers (7 repos, fake language split). Test in Task 4.
2. **Build from a shallow clone with no git history** (`getRecentCommits()` returns `[]`): tickers must render binary and rule segments only, never an empty strip or invented commit text. Test in Task 3.
3. **Phone at 390px**: no horizontal page scroll from the big Anton words ("STRATOS İHA", "FRONT END") or the WORK letter band. Checked by the Task 9 script.
4. **Reduced motion on desktop**: the Work pin and capsule are skipped and the static gallery shows instead; DREAM IT / BUILD IT renders in place. Checked by the Task 9 script.
5. **Keyboard user**: Tab never lands on an off-screen gallery card; every project link is reachable in the catalogue list. Gallery links get `tabIndex={-1}` in Task 5; checked by the Task 9 script.

---

## File Map

Create:
- `vitest.config.ts`: Vitest config with `@` alias.
- `src/lib/prng.ts`: shared seeded PRNG for new generators.
- `src/lib/ticker.ts` (+ `.test.ts`): ticker segment builder.
- `src/lib/perspective-room.ts` (+ `.test.ts`): About room line geometry.
- `src/lib/warped-grid.ts` (+ `.test.ts`): bowed grid paths for Work intro and Closing.
- `src/lib/work-gallery.ts` (+ `.test.ts`): gallery project selection, card motion, letter sway.
- `src/lib/radial-burst.test.ts`, `src/lib/wireframe-mesh.test.ts`, `src/lib/github.test.ts`, `src/data/nav-items.test.ts`.
- `src/lib/use-active-section.ts`: IntersectionObserver hook.
- `src/data/contact.ts`: contact email and links (shared by footer and GO).
- `src/components/frame.tsx`, `src/components/site-header.tsx`.
- `src/components/ui/star.tsx`, `src/components/ui/dot-pattern.tsx`, `src/components/ui/warped-grid.tsx`.
- `src/components/sections/hero/Hero.tsx`, `src/components/sections/hero/Ticker.tsx`.
- `src/components/sections/about/AboutSkills.tsx`, `RoomBackground.tsx`, `SideRails.tsx`, `Bento.tsx`, `GitHubCell.tsx`.
- `src/components/sections/work/Work.tsx`, `WorkIntro.tsx`, `WorkGallery.tsx`, `StaticGallery.tsx`, `WorkCatalogue.tsx`.
- `src/components/sections/Ventures.tsx`.
- `src/components/sections/closing/Closing.tsx`, `BurstHeadline.tsx`, `DreamBuild.tsx`, `GoPanel.tsx`.

Modify: `package.json`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/data/nav-items.ts`, `src/data/skills.ts`, `src/messages/en.json`, `src/lib/wireframe-mesh.ts`, `src/lib/radial-burst.ts`, `src/lib/github.ts`, `src/components/ui/wireframe-mesh.tsx`, `src/components/ui/radial-burst.tsx`, `src/components/ui/skip-link.tsx`, `src/components/mobile-nav.tsx`, `src/components/footer.tsx`, `DESIGN.md`, `PRODUCT.md`.

Delete (Task 8): the checkpoint system, old nav, unused UI pieces, Cabinet Grotesk files, GSAP.

---

### Task 1: Foundations (fonts, tokens, frame, test runner)

**Files:**
- Modify: `package.json`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `vitest.config.ts`, `src/lib/prng.ts`, `src/components/frame.tsx`

**Interfaces:**
- Produces: Tailwind utilities `font-serif` / `font-body` (Instrument Serif), `font-display` (Anton), `font-display-accent` (Metamorphous), `font-condensed` (Oswald), `font-mono`; colors `bg-frame` / `border-frame`; CSS classes `.emboss-light`, `.work-animated`, `.work-static`; `mulberry32(seed: number): () => number` from `@/lib/prng`; `<Frame>{children}</Frame>` from `@/components/frame`; `npm test` script.

- [ ] **Step 1: Install Vitest and add the script**

Run: `npm i -D vitest@3.2.4`

In `package.json` `scripts`, add after `"lint"`:

```json
    "test": "vitest run --passWithNoTests",
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
```

Run: `npm test`
Expected: exits 0 with "No test files found".

- [ ] **Step 2: Shared PRNG**

Create `src/lib/prng.ts`:

```ts
/**
 * Small seeded PRNG (mulberry32). Same seed, same sequence, on server and
 * client, so generated decoration never causes a hydration mismatch.
 */
export function mulberry32(seed: number): () => number {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 3: Swap fonts in `src/app/layout.tsx`**

Replace the font imports and the `cabinetGrotesk` and `serif` (Fraunces) declarations. Delete the `localFont` import. Final font block:

```ts
import {
  JetBrains_Mono,
  Instrument_Serif,
  Anton,
  Oswald,
  Metamorphous,
} from "next/font/google";

// Mono: nav, labels, tickers, data readouts.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Body serif: narrow editorial serif for reading copy and the header
// tagline. A free stand-in chosen for structure, not a copy of any paid face.
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

// Condensed display: bento words, WORK letters, venture names, closing
// headline, footer wordmark.
const display = Anton({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

// DREAM IT / BUILD IT only.
const condensed = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  variable: "--font-oswald",
  display: "swap",
});

// Hero title only.
const displayAccent = Metamorphous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-metamorphous",
  display: "swap",
});
```

Change the `<html className>` to:

```tsx
      className={`${mono.variable} ${serif.variable} ${display.variable} ${condensed.variable} ${displayAccent.variable}`}
```

Change `<body className="bg-bg text-ink antialiased">` to `<body className="bg-frame text-ink antialiased">`.

- [ ] **Step 4: Tokens and global CSS in `src/app/globals.css`**

In `@theme`, add after `--color-ink-3`:

```css
  --color-frame: #0a0a0a;
```

Replace the five font tokens (`--font-display` through `--font-serif`) with:

```css
  --font-display: var(--font-anton), "Arial Narrow", sans-serif;
  --font-body: var(--font-instrument), Georgia, serif;
  --font-sans: var(--font-instrument), Georgia, serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "JetBrains Mono", monospace;
  --font-serif: var(--font-instrument), Georgia, serif;
```

Keep `--font-condensed` and `--font-display-accent` as they are.

Replace the `body { background-color: var(--color-bg); ... }` rule's first line with `background-color: var(--color-frame);`.

Replace the `section[id] { scroll-margin-top: 6rem; }` rule with:

```css
section[id] {
  scroll-margin-top: 1rem;
}
```

Add after the `.emboss-text` rule:

```css
/* Embossed white letters on black (Work gallery): a hard gray offset. */
.emboss-light {
  text-shadow: 3px 3px 0 #8f8f8f;
}

/* Work section variants. The pinned, scroll-driven gallery only runs on
   wide screens for people who have not asked for reduced motion; everyone
   else gets the static gallery. Pure CSS, so no hydration mismatch. */
.work-animated {
  display: none;
}
.work-static {
  display: block;
}
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .work-animated {
    display: block;
  }
  .work-static {
    display: none;
  }
}
```

- [ ] **Step 5: Frame component**

Create `src/components/frame.tsx`:

```tsx
/**
 * The black page frame: four fixed edges over everything, plus a white
 * content sheet inset by the same amount so nothing starts under an edge.
 */
export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] border-8 border-frame sm:border-[16px]"
      />
      <div className="min-h-screen p-2 sm:p-4">
        <div className="bg-bg">{children}</div>
      </div>
    </>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`
Expected: both pass. (Old components still compile: they only use the token names, which now point at the new fonts.)

Run: `ls src/app/fonts/cabinet-grotesk` (still present, deleted in Task 8).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/prng.ts src/app/layout.tsx src/app/globals.css src/components/frame.tsx
git commit -m "feat(design): add page frame, new type system and vitest"
```

---

### Task 2: Site header, mobile menu and page skeleton

**Files:**
- Modify: `src/data/nav-items.ts`, `src/messages/en.json`, `src/components/mobile-nav.tsx`, `src/components/ui/skip-link.tsx`, `src/components/footer.tsx`, `src/app/page.tsx`
- Create: `src/data/nav-items.test.ts`, `src/lib/use-active-section.ts`, `src/components/site-header.tsx`, `src/data/contact.ts`

**Interfaces:**
- Consumes: `Frame` (Task 1).
- Produces: `SECTION_IDS: readonly ["home","about","work","ventures","contact"]` and `navItems: NavItem[]` from `@/data/nav-items`; `useActiveSection(ids: readonly string[]): string`; `CONTACT_EMAIL: string` and `contactLinks: { label: string; value: string; href: string }[]` from `@/data/contact`; `page.tsx` renders `<Frame><SiteHeader /><main id="main">…</main><Footer /><BackToTop /></Frame>`. Later tasks add their section inside `<main>` in this order: Hero, AboutSkills, Work, Ventures, Closing.

- [ ] **Step 1: Write the failing test**

Create `src/data/nav-items.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { SECTION_IDS, navItems } from "./nav-items";

describe("navItems", () => {
  it("points every link at a real section id", () => {
    for (const item of navItems) {
      expect(item.href.startsWith("#")).toBe(true);
      expect(SECTION_IDS).toContain(item.href.slice(1));
    }
  });

  it("numbers links 01.. in order", () => {
    expect(navItems.map((i) => i.num)).toEqual(["01", "02", "03", "04"]);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test`
Expected: FAIL, `SECTION_IDS` is not exported.

- [ ] **Step 3: New nav items**

Replace `src/data/nav-items.ts`:

```ts
export interface NavItem {
  key: string;
  href: string;
  num: string;
}

/** Every in-page section id, in page order. */
export const SECTION_IDS = [
  "home",
  "about",
  "work",
  "ventures",
  "contact",
] as const;

export const navItems: NavItem[] = [
  { key: "about", href: "#about", num: "01" },
  { key: "work", href: "#work", num: "02" },
  { key: "ventures", href: "#ventures", num: "03" },
  { key: "contact", href: "#contact", num: "04" },
];
```

Run: `npm test`
Expected: PASS (2 tests).

- [ ] **Step 4: Messages**

In `src/messages/en.json`, replace the `nav` object with (old keys kept until Task 8 so unused old components still resolve):

```json
  "nav": {
    "home": "home",
    "flightLog": "work",
    "founderStory": "ventures",
    "telemetry": "telemetry",
    "about": "About",
    "work": "Work",
    "ventures": "Ventures",
    "contact": "Contact",
    "caption": "Emir Sakarya · Bursa",
    "statusLine1": "Building from Bursa, Türkiye.",
    "statusLine2": "Shipping founder-built products.",
    "getInTouch": "Get in touch",
    "menu": "Menu",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "homeLabel": "Emir Sakarya, back to top"
  },
```

- [ ] **Step 5: Shared contact data**

Create `src/data/contact.ts`:

```ts
export const CONTACT_EMAIL = "emirsakarya00@gmail.com";

export const contactLinks = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  {
    label: "GitHub",
    value: "github.com/iWeslax83",
    href: "https://github.com/iWeslax83",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/emirsakarya",
    href: "https://linkedin.com/in/emirsakarya",
  },
];
```

In `src/components/footer.tsx`, delete the local `contactLinks` array and add `import { contactLinks } from "@/data/contact";`. Leave the rest of the footer for Task 7.

- [ ] **Step 6: Active-section hook**

Create `src/lib/use-active-section.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

/** Id of the section crossing the middle band of the viewport. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          b.intersectionRatio > a.intersectionRatio ? b : a,
        );
        setActive(top.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
```

- [ ] **Step 7: Site header**

Create `src/components/site-header.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { SECTION_IDS, navItems } from "@/data/nav-items";
import { useActiveSection } from "@/lib/use-active-section";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import MobileNav from "./mobile-nav";

const socialCell =
  "flex flex-1 items-center justify-center transition-colors hover:bg-ink hover:text-bg active:bg-ink active:text-bg";

/**
 * Cell-grid header in normal flow (it scrolls away, like the reference's).
 * Desktop: logo, caption, nav, social, two-line tagline. Below lg: logo and
 * a burger that opens the full-screen menu.
 */
export default function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className="relative z-40 border-b border-ink bg-bg">
      <div className="flex h-16 lg:h-24">
        <a
          href="#home"
          aria-label={t("homeLabel")}
          className="flex w-16 shrink-0 items-center justify-center border-r border-ink lg:w-24"
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={48}
            height={48}
            priority
            className="h-9 w-9 lg:h-12 lg:w-12"
          />
        </a>

        <div className="hidden w-56 shrink-0 items-end border-r border-ink px-6 pb-3 xl:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
            {t("caption")}
          </span>
        </div>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-around border-r border-ink px-6 lg:flex"
        >
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.key}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 font-mono text-sm uppercase tracking-[0.05em] transition-colors ${
                  isActive ? "text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {t(item.key)}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-ink"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden w-12 shrink-0 flex-col border-r border-ink lg:flex">
          <a
            href="https://github.com/iWeslax83"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={`${socialCell} border-b border-ink`}
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://linkedin.com/in/emirsakarya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={socialCell}
          >
            <LinkedInIcon className="h-[18px] w-[18px]" />
          </a>
        </div>

        <div className="hidden w-[22rem] shrink-0 flex-col lg:flex xl:w-[28rem]">
          <p className="flex flex-1 items-center border-b border-ink px-5 font-serif text-lg leading-none xl:text-[22px]">
            {t("statusLine1")}
          </p>
          <p className="flex flex-1 items-center gap-[0.3em] px-5 font-serif text-lg leading-none xl:text-[22px]">
            {t("statusLine2")}
            <a
              href="#contact"
              className="underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              {t("getInTouch")}
            </a>
          </p>
        </div>

        <div className="flex-1 lg:hidden" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={open}
          className="flex w-16 items-center justify-center border-l border-ink bg-panel active:bg-ink active:text-bg lg:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
```

- [ ] **Step 8: Mobile menu**

Replace `src/components/mobile-nav.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { navItems } from "@/data/nav-items";

/** Full-screen black menu sheet with numbered serif links. */
export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className="fixed inset-0 z-[70] flex flex-col bg-ink p-6 text-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("closeMenu")}
              className="flex h-12 w-12 items-center justify-center border border-bg/30 active:bg-bg active:text-ink"
            >
              <X size={22} />
            </button>
          </div>

          <nav aria-label={t("menu")} className="mt-10 flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 border-b border-bg/20 py-5 font-serif text-4xl active:opacity-70"
              >
                <span className="font-mono text-xs text-bg/60">{item.num}</span>
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex gap-6 font-mono text-xs uppercase tracking-[0.1em] text-bg/70">
            <a
              href="https://github.com/iWeslax83"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/emirsakarya"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 9: Skip link**

Replace `src/components/ui/skip-link.tsx`:

```tsx
export default function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      skip to content
    </a>
  );
}
```

- [ ] **Step 10: Page skeleton**

Replace `src/app/page.tsx`:

```tsx
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";

export default async function Home() {
  return (
    <Frame>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none"></main>
      <Footer />
      <BackToTop />
    </Frame>
  );
}
```

- [ ] **Step 11: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

Run: `npx next start -p 3123` in the background, then open `http://localhost:3123` with a Playwright Chromium script (or `npx playwright screenshot --browser chromium`) at 1440x900 and 390x844.
Expected: black frame on all edges, cell-grid header at 96px on desktop, logo plus burger on mobile; burger opens the black menu; Escape closes it. Stop the server.

- [ ] **Step 12: Commit**

```bash
git add src/data src/messages/en.json src/lib/use-active-section.ts src/components/site-header.tsx src/components/mobile-nav.tsx src/components/ui/skip-link.tsx src/components/footer.tsx src/app/page.tsx
git commit -m "feat(layout): cell-grid header, full-screen menu and in-flow page skeleton"
```

---

### Task 3: Hero (mesh, tickers, title)

**Files:**
- Create: `src/lib/ticker.ts`, `src/lib/ticker.test.ts`, `src/lib/wireframe-mesh.test.ts`, `src/components/ui/star.tsx`, `src/components/sections/hero/Ticker.tsx`, `src/components/sections/hero/Hero.tsx`
- Modify: `src/lib/wireframe-mesh.ts`, `src/components/ui/wireframe-mesh.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `mulberry32` (Task 1), `CommitEntry` and `getRecentCommits` from `@/lib/git-history`.
- Produces: `type TickerSegment = { kind: "commit" | "binary" | "rule"; text: string }`; `buildTickerSegments(commits: CommitEntry[], seed: number, count?: number): TickerSegment[]`; `generateWireframeLines(seed: number, lineCount?: number): WireframeLine[]`; `heroMeshLines: WireframeLine[]`; `<WireframeMesh lines stroke crests className />`; `<Star className />`; `<Hero commits={CommitEntry[]} />` (section `id="home"`).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/ticker.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildTickerSegments } from "./ticker";

const commits = [
  { hash: "dda1ef8", message: "docs(resume): update certifications" },
  {
    hash: "f583459",
    message:
      "chore: add eslint and prettier config with a very long subject line that keeps going",
  },
];

describe("buildTickerSegments", () => {
  it("is deterministic for the same seed", () => {
    expect(buildTickerSegments(commits, 7)).toEqual(
      buildTickerSegments(commits, 7),
    );
  });

  it("returns exactly `count` segments", () => {
    expect(buildTickerSegments(commits, 7, 18)).toHaveLength(18);
  });

  it("uses real commits, starting with the hash", () => {
    const segs = buildTickerSegments(commits, 7);
    const commitSegs = segs.filter((s) => s.kind === "commit");
    expect(commitSegs.length).toBeGreaterThan(0);
    expect(commitSegs[0].text.startsWith("dda1ef8 ")).toBe(true);
  });

  it("truncates long subjects to 48 characters with '...'", () => {
    const segs = buildTickerSegments(commits, 7);
    const long = segs.find((s) => s.text.startsWith("f583459"));
    expect(long).toBeDefined();
    expect(long!.text.endsWith("...")).toBe(true);
    expect(long!.text.length).toBe("f583459 ".length + 48);
  });

  it("never invents commit text when there is no git history", () => {
    const segs = buildTickerSegments([], 7, 12);
    expect(segs).toHaveLength(12);
    expect(segs.every((s) => s.kind !== "commit")).toBe(true);
  });

  it("emits only 0/1 for binary and only / for rules", () => {
    for (const s of buildTickerSegments(commits, 99, 30)) {
      if (s.kind === "binary") expect(s.text).toMatch(/^[01]+$/);
      if (s.kind === "rule") expect(s.text).toMatch(/^\/+$/);
    }
  });
});
```

Create `src/lib/wireframe-mesh.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  generateWireframeLines,
  heroMeshLines,
  wireframeLines,
} from "./wireframe-mesh";

describe("wireframe mesh", () => {
  it("keeps the original 60-line mesh unchanged by default", () => {
    expect(wireframeLines).toHaveLength(60);
    expect(generateWireframeLines(4242)).toEqual(wireframeLines);
  });

  it("builds the dense hero mesh with 140 lines", () => {
    expect(heroMeshLines).toHaveLength(140);
    expect(heroMeshLines.every((l) => l.d.startsWith("M"))).toBe(true);
  });

  it("is deterministic", () => {
    expect(generateWireframeLines(4242, 140)).toEqual(heroMeshLines);
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: FAIL, `./ticker` not found and `generateWireframeLines`/`heroMeshLines` not exported.

- [ ] **Step 3: Ticker builder**

Create `src/lib/ticker.ts`:

```ts
import type { CommitEntry } from "@/lib/git-history";
import { mulberry32 } from "@/lib/prng";

export type TickerSegment = {
  kind: "commit" | "binary" | "rule";
  text: string;
};

const MAX_MESSAGE = 48;

function truncate(message: string): string {
  return message.length > MAX_MESSAGE
    ? `${message.slice(0, MAX_MESSAGE - 3)}...`
    : message;
}

/**
 * Segments for one hero ticker row: this repo's real commits (hash +
 * subject) alternating with seeded binary runs and slash rules. With no git
 * history the row is binary and rules only, never invented commit text.
 */
export function buildTickerSegments(
  commits: CommitEntry[],
  seed: number,
  count = 18,
): TickerSegment[] {
  const rand = mulberry32(seed);
  const out: TickerSegment[] = [];
  let next = 0;

  for (let i = 0; i < count; i++) {
    const slot = i % 3;
    if (slot === 0 && commits.length > 0) {
      const commit = commits[next++ % commits.length];
      out.push({
        kind: "commit",
        text: `${commit.hash} ${truncate(commit.message)}`,
      });
    } else if (slot === 2) {
      out.push({ kind: "rule", text: "/".repeat(12 + Math.floor(rand() * 24)) });
    } else {
      const len = 8 + Math.floor(rand() * 40);
      let bits = "";
      for (let b = 0; b < len; b++) bits += rand() > 0.5 ? "1" : "0";
      out.push({ kind: "binary", text: bits });
    }
  }
  return out;
}
```

- [ ] **Step 4: Mesh line count parameter**

In `src/lib/wireframe-mesh.ts`:
- Change `function generateWireframeLines(seed: number): WireframeLine[]` to `export function generateWireframeLines(seed: number, lineCount = LINE_COUNT): WireframeLine[]`.
- Inside it, replace both uses of `LINE_COUNT` in the loop (`i < LINE_COUNT` and `(LINE_COUNT - 1)`) with `lineCount`.
- Add at the end of the file:

```ts
/** Dense mesh for the full-bleed hero panel (same seed, more lines). */
export const heroMeshLines: WireframeLine[] = generateWireframeLines(4242, 140);
```

Run: `npm test`
Expected: PASS (all ticker and mesh tests).

- [ ] **Step 5: Mesh component props**

Replace `src/components/ui/wireframe-mesh.tsx`:

```tsx
import { wireframeLines, type WireframeLine } from "@/lib/wireframe-mesh";

/**
 * Decorative warped-line mesh. Deterministic (see wireframe-mesh.ts),
 * aria-hidden, safe as a server component. `crests` thickens a few lines
 * so the field has a couple of strong ridges.
 */
export default function WireframeMesh({
  className = "",
  lines = wireframeLines,
  stroke = "var(--color-rule-strong)",
  crests = [],
}: {
  className?: string;
  lines?: WireframeLine[];
  stroke?: string;
  crests?: number[];
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {lines.map((line, i) => (
        <path
          key={i}
          d={line.d}
          fill="none"
          stroke={stroke}
          strokeWidth={crests.includes(i) ? 2.5 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 6: Star, Ticker, Hero**

Create `src/components/ui/star.tsx`:

```tsx
/** Four-point star used as a separator in display type. */
export default function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C12.9 8.2 15.8 11.1 24 12C15.8 12.9 12.9 15.8 12 24C11.1 15.8 8.2 12.9 0 12C8.2 11.1 11.1 8.2 12 0Z" />
    </svg>
  );
}
```

Create `src/components/sections/hero/Ticker.tsx`:

```tsx
"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { TickerSegment } from "@/lib/ticker";

/** Framed mono strip that drifts left as the page scrolls. Decorative. */
export default function Ticker({
  segments,
  speed = 0.15,
}: {
  segments: TickerSegment[];
  speed?: number;
}) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const x = useTransform(scrollY, (v) => (reduce ? 0 : -v * speed));
  const loop = [...segments, ...segments];

  return (
    <div
      aria-hidden
      className="flex h-9 items-center gap-3 border-y border-ink px-4 font-mono text-[10px] leading-none tracking-[0.04em] text-ink"
    >
      <span>▸</span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <motion.div style={{ x }} className="flex w-max gap-6 whitespace-nowrap">
          {loop.map((s, i) => (
            <span
              key={i}
              className={s.kind === "commit" ? "text-ink" : "text-ink-2"}
            >
              {s.text}
            </span>
          ))}
        </motion.div>
      </div>
      <span>◂</span>
    </div>
  );
}
```

Create `src/components/sections/hero/Hero.tsx`:

```tsx
import type { CommitEntry } from "@/lib/git-history";
import { heroMeshLines } from "@/lib/wireframe-mesh";
import { buildTickerSegments } from "@/lib/ticker";
import WireframeMesh from "@/components/ui/wireframe-mesh";
import Star from "@/components/ui/star";
import Ticker from "./Ticker";

export default function Hero({ commits }: { commits: CommitEntry[] }) {
  return (
    <section id="home" aria-labelledby="hero-title">
      <div className="relative h-[45vh] overflow-hidden lg:h-[62vh]">
        <WireframeMesh
          lines={heroMeshLines}
          stroke="var(--color-ink)"
          crests={[30, 98]}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <Ticker segments={buildTickerSegments(commits, 101)} speed={0.15} />
      <h1
        id="hero-title"
        className="flex flex-wrap items-center justify-center gap-x-[0.3em] px-4 py-8 text-center font-display-accent text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] text-ink"
      >
        <span className="sr-only">Emir Sakarya: </span>
        <span>UAV</span>
        <span className="sr-only">, </span>
        <Star className="h-[0.4em] w-[0.4em]" />
        <span>AI</span>
        <span className="sr-only">, </span>
        <Star className="h-[0.4em] w-[0.4em]" />
        <span>FOUNDER</span>
      </h1>
      <Ticker
        segments={buildTickerSegments(commits.slice(12), 202)}
        speed={0.25}
      />
    </section>
  );
}
```

- [ ] **Step 7: Mount in page**

In `src/app/page.tsx` add imports `import { getRecentCommits } from "@/lib/git-history";` and `import Hero from "@/components/sections/hero/Hero";`. At the top of `Home()` add `const commits = getRecentCommits();`. Inside `<main>` add `<Hero commits={commits} />`.

- [ ] **Step 8: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

Start the server and screenshot 1440x900 and 390x844 (Chromium).
Expected: full-strength black mesh under the header, a framed ticker row with `▸`/`◂`, centered "UAV ✦ AI ✦ FOUNDER" in Metamorphous, second ticker. Nothing overlaps the header. Mobile title wraps, no horizontal scroll.

- [ ] **Step 9: Commit**

```bash
git add src/lib/ticker.ts src/lib/ticker.test.ts src/lib/wireframe-mesh.ts src/lib/wireframe-mesh.test.ts src/components/ui/wireframe-mesh.tsx src/components/ui/star.tsx src/components/sections/hero src/app/page.tsx
git commit -m "feat(hero): full-bleed mesh, commit tickers and centered display title"
```

---

### Task 4: About + Skills (perspective room, copy, bento, live GitHub cell)

**Files:**
- Create: `src/lib/perspective-room.ts`, `src/lib/perspective-room.test.ts`, `src/lib/github.test.ts`, `src/components/sections/about/AboutSkills.tsx`, `RoomBackground.tsx`, `SideRails.tsx`, `Bento.tsx`, `GitHubCell.tsx`
- Modify: `src/lib/github.ts`, `src/data/skills.ts`, `src/messages/en.json`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `GitHubStats` from `@/lib/types`, `Star` (Task 3).
- Produces: `type RoomLine = { x1: number; y1: number; x2: number; y2: number }`; `perspectiveRoom(opts: { columnLeft: number; columnRight: number; rows: number; rails: number[] }): RoomLine[]`; `aboutRoom: RoomLine[]`; `fetchGitHubStats(): Promise<GitHubStats | null>`; `bentoSkills: BentoSkill[]`, `devopsSkill`; `<RoomBackground className? />` (reused by Task 6); `<AboutSkills stats={GitHubStats | null} />` (section `id="about"`); CSS string constant `SECTION_BAR` exported from `AboutSkills.tsx` (reused by Tasks 5 and 6).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/perspective-room.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { perspectiveRoom } from "./perspective-room";

const opts = { columnLeft: 350, columnRight: 650, rows: 6, rails: [120, 215] };

describe("perspectiveRoom", () => {
  const lines = perspectiveRoom(opts);

  it("emits two rails per rail position and two lines per row", () => {
    expect(lines).toHaveLength(opts.rails.length * 2 + opts.rows * 2);
  });

  it("mirrors rails across the center", () => {
    const xs = lines.filter((l) => l.x1 === l.x2).map((l) => l.x1);
    expect(xs).toEqual([120, 880, 215, 785]);
  });

  it("pulls every floor line toward the vertical center at the column edge", () => {
    for (const l of lines.filter((l) => l.x1 !== l.x2)) {
      expect(Math.abs(l.y2 - 500)).toBeLessThan(Math.abs(l.y1 - 500));
      expect([opts.columnLeft, opts.columnRight]).toContain(l.x2);
    }
  });

  it("rounds to two decimals so server and client strings match", () => {
    for (const l of lines) {
      for (const v of [l.x1, l.y1, l.x2, l.y2]) {
        expect(Math.round(v * 100) / 100).toBe(v);
      }
    }
  });
});
```

Create `src/lib/github.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGitHubStats } from "./github";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchGitHubStats", () => {
  it("returns null, not made-up numbers, when GitHub fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("down", { status: 500 })),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchGitHubStats()).resolves.toBeNull();
  });

  it("returns null when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchGitHubStats()).resolves.toBeNull();
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: FAIL, `./perspective-room` missing, and `fetchGitHubStats` resolves to the fallback object instead of `null`.

- [ ] **Step 3: Perspective room**

Create `src/lib/perspective-room.ts`:

```ts
export type RoomLine = { x1: number; y1: number; x2: number; y2: number };

/** How far floor lines bend toward the vertical center at the column. */
const PULL = 0.18;

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Line geometry for the About "room": vertical rails mirrored on both
 * sides, and horizontal lines from the frame edge to the content column
 * that bend toward y=500, so they read as converging behind the column.
 * Coordinates are in a 0-1000 square viewBox.
 */
export function perspectiveRoom({
  columnLeft,
  columnRight,
  rows,
  rails,
}: {
  columnLeft: number;
  columnRight: number;
  rows: number;
  rails: number[];
}): RoomLine[] {
  const lines: RoomLine[] = [];
  for (const x of rails) {
    lines.push({ x1: r2(x), y1: 0, x2: r2(x), y2: 1000 });
    lines.push({ x1: r2(1000 - x), y1: 0, x2: r2(1000 - x), y2: 1000 });
  }
  for (let i = 0; i < rows; i++) {
    const y = ((i + 0.5) / rows) * 1000;
    const inner = y + (500 - y) * PULL;
    lines.push({ x1: 0, y1: r2(y), x2: r2(columnLeft), y2: r2(inner) });
    lines.push({ x1: 1000, y1: r2(y), x2: r2(columnRight), y2: r2(inner) });
  }
  return lines;
}

/** The About section's room. Line ends sit under the white column. */
export const aboutRoom: RoomLine[] = perspectiveRoom({
  columnLeft: 350,
  columnRight: 650,
  rows: 10,
  rails: [120, 215, 265],
});
```

- [ ] **Step 4: GitHub stats return null on failure**

In `src/lib/github.ts`:
- Delete the `FALLBACK_STATS` constant.
- In `fetchLanguageBreakdown`, replace both `return FALLBACK_STATS.languages;` lines with `return [];` (no token, or zero bytes: show no language bar rather than a fake split).
- Change the signature to `export async function fetchGitHubStats(): Promise<GitHubStats | null> {`.
- Replace the `catch` block body with:

```ts
    console.error("Failed to fetch GitHub stats:", error);
    return null;
```

Run: `npx tsc --noEmit`
Expected: errors only where old code passes the result as `GitHubStats` (if `src/app/page.tsx` no longer calls it, there are none). Old `FlightSceneRoot`/`Telemetry` declare `GitHubStats` props but are no longer rendered; they compile because nothing passes them `null`.

Run: `npm test`
Expected: PASS (perspective room and GitHub tests included).

- [ ] **Step 5: Bento data**

Append to `src/data/skills.ts`:

```ts
export interface BentoSkill {
  key: string;
  /** The big word, one array entry per stacked line. */
  word: string[];
  tools: string[];
  label: string;
  sub: string;
}

/** Bento rows for the About section. Tools come from skills above and the
 *  UAV stack in projects.ts. */
export const bentoSkills: BentoSkill[] = [
  {
    key: "embedded",
    word: ["Embed", "ded"],
    tools: ["Flight Controllers", "PCB Design", "Pixhawk 6C", "ArduPilot"],
    label: "Pixhawk / ArduPilot / OpenCV",
    sub: "Flight Software",
  },
  {
    key: "ai",
    word: ["AI"],
    tools: ["Python", "LangGraph", "Ollama", "MediaPipe"],
    label: "LangGraph / Claude / Ollama",
    sub: "Agent Systems",
  },
  {
    key: "frontend",
    word: ["Front", "End"],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    label: "Next.js / React / TypeScript",
    sub: "Modern Frontend",
  },
  {
    key: "backend",
    word: ["Back", "End"],
    tools: ["Node.js", "FastAPI", "GraphQL", "Postgres", "Redis"],
    label: "Node.js / FastAPI / Postgres",
    sub: "Backend & Data",
  },
];

export const devopsSkill = {
  tools: ["Docker", "Kubernetes", "GitHub Actions", "Linux", "Vercel"],
  label: "Docker / Kubernetes / Vercel",
  sub: "Ship & Deploy",
};
```

- [ ] **Step 6: Copy**

In `src/messages/en.json`, add a top-level `"about"` object and extend `"skills"`:

```json
  "about": {
    "barAbout": "About",
    "barSkills": "Skills",
    "railLeft": "Emir Sakarya · Founder & Engineer · Bursa / TR · N°01",
    "railRight": "Section 01 · About × Skills · Scroll to explore · 2026",
    "p1": "I build things that have to work outside a demo: a drone that has to land where it said it would, an audit log that has to hold up when someone checks it. If something on this page can't be checked, it shouldn't be here.",
    "p2": "I founded STRATOS İHA, a TEKNOFEST UAV community in Bursa, and lead electronics and software for its 25-person engineering org. In its first year the program reached the TEKNOFEST 2026 rotorcraft final (16th of 3,715 teams) and the NASA Space Apps Turkey final.",
    "p3": "On the aircraft I work with Pixhawk 6C, Raspberry Pi 5, ArduPilot and OpenCV, plus PCB design and sensor fusion. On the web it's React, Next.js and TypeScript up front, Node.js, FastAPI, Postgres and Redis behind them, shipped with Docker, Kubernetes and Vercel. For AI I build agent systems with LangGraph and Claude.",
    "p4": "Right now: Teluvane, a multi-tenant platform that hash-chains every AI agent action against EU AI Act, ISO 42001, NIST AI RMF and SOC 2; Viyaro, a BOSİAD-funded autonomous mobility venture with 50,000+ rides across 10+ companies; and Zero-G Pharma, first in Türkiye at NASA Space Apps 2025 (global top 50 of 6,000+ teams). Student at Tofaş Fen Lisesi, class of 2028."
  },
```

Replace the `"skills"` object with:

```json
  "skills": {
    "title": "Tech Stack",
    "kicker": "capability matrix",
    "statement": "Hardware × AI × Production Software",
    "githubLabel": "GitHub · live",
    "publicRepos": "public repos",
    "contributions": "contributions",
    "githubUnavailable": "GitHub data unavailable right now.",
    "githubLink": "github.com/iWeslax83"
  },
```

- [ ] **Step 7: Room background and side rails**

Create `src/components/sections/about/RoomBackground.tsx`:

```tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { aboutRoom } from "@/lib/perspective-room";

/** Perspective wireframe behind a centered column. Skews slightly on scroll. */
export default function RoomBackground({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const skewY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [2, -2]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ skewY }}
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {aboutRoom.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="var(--color-ink)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </motion.div>
  );
}
```

Create `src/components/sections/about/SideRails.tsx`:

```tsx
const rail =
  "sticky top-[30vh] font-mono text-[11px] uppercase tracking-[0.3em] text-ink [writing-mode:vertical-rl]";

/** Vertical mono captions on both edges, desktop only. Decorative. */
export default function SideRails({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute inset-y-0 left-8">
        <p className={`${rail} rotate-180`}>{left}</p>
      </div>
      <div className="absolute inset-y-0 right-8">
        <p className={rail}>{right}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: GitHub cell and bento**

Create `src/components/sections/about/GitHubCell.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import type { GitHubStats } from "@/lib/types";

const label = "font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2";

/** Live GitHub numbers. Real data or an honest "unavailable", never filler. */
export default function GitHubCell({ stats }: { stats: GitHubStats | null }) {
  const t = useTranslations("skills");

  return (
    <div className="flex flex-col p-6">
      <p className={label}>{t("githubLabel")}</p>
      {stats ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col-reverse">
              <dt className={label}>{t("publicRepos")}</dt>
              <dd className="font-display text-5xl leading-none tabular-nums">
                {stats.publicRepos}
              </dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className={label}>{t("contributions")}</dt>
              <dd className="font-display text-5xl leading-none tabular-nums">
                {stats.contributions}
              </dd>
            </div>
          </dl>
          {stats.languages.length > 0 && (
            <div className="mt-5">
              <div className="flex h-1.5 overflow-hidden">
                {stats.languages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{ flex: lang.percentage, backgroundColor: lang.color }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-2">
                {stats.languages.map((lang) => (
                  <li key={lang.name}>
                    <span style={{ color: lang.color }} aria-hidden>
                      ■
                    </span>{" "}
                    {lang.name} {lang.percentage}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 font-serif text-xl leading-[1.5]">
          {t("githubUnavailable")}
        </p>
      )}
      <a
        href="https://github.com/iWeslax83"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-5 font-mono text-xs underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {t("githubLink")} ↗
      </a>
    </div>
  );
}
```

Create `src/components/sections/about/Bento.tsx`:

```tsx
"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import type { GitHubStats } from "@/lib/types";
import { bentoSkills, devopsSkill } from "@/data/skills";
import Star from "@/components/ui/star";
import GitHubCell from "./GitHubCell";

const labelCell =
  "flex items-center justify-center p-6 text-center font-serif text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.1]";

function Globe() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="h-24 w-24"
    >
      <g transform="rotate(-20 50 50)">
        <ellipse cx="50" cy="50" rx="34" ry="40" />
        <ellipse cx="50" cy="50" rx="20" ry="40" />
        <ellipse cx="50" cy="50" rx="6" ry="40" />
        <ellipse cx="50" cy="50" rx="34" ry="14" />
        <ellipse cx="50" cy="50" rx="34" ry="28" />
      </g>
    </svg>
  );
}

function Hatch() {
  const id = `hatch-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden className="h-full min-h-40 w-full">
      <defs>
        <pattern
          id={id}
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="14" stroke="var(--color-ink)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function Bento({ stats }: { stats: GitHubStats | null }) {
  const t = useTranslations("skills");

  return (
    <div>
      <p className="border-b border-ink px-6 py-12 text-center font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1]">
        {t("statement")}
      </p>

      {bentoSkills.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <div key={s.key} className="grid border-b border-ink sm:grid-cols-2">
            <div
              className={`border-b border-ink p-4 sm:border-b-0 sm:p-5 ${
                flip ? "sm:col-start-2 sm:row-start-1 sm:border-l" : "sm:border-r"
              }`}
            >
              <h3 className="font-display text-[clamp(4rem,8vw,7rem)] uppercase leading-[0.88]">
                {s.word.map((w) => (
                  <span key={w} className="block">
                    {w}
                  </span>
                ))}
              </h3>
              <p className="mt-3 font-serif text-sm leading-[1.5]">
                {s.tools.map((x) => `(${x})`).join(" ")}
              </p>
            </div>
            <div className={`${labelCell} ${flip ? "sm:col-start-1 sm:row-start-1" : ""}`}>
              <p>
                {s.label}
                <br />
                {s.sub}
              </p>
            </div>
          </div>
        );
      })}

      <div className="grid border-b border-ink sm:grid-cols-3">
        <div className="relative flex items-center justify-center border-b border-ink p-8 sm:border-b-0 sm:border-r">
          <Star className="absolute left-3 top-3 h-4 w-4" />
          <Star className="absolute right-3 top-3 h-4 w-4" />
          <Star className="absolute bottom-3 left-3 h-4 w-4" />
          <Star className="absolute bottom-3 right-3 h-4 w-4" />
          <Globe />
        </div>
        <div className={`${labelCell} flex-col sm:col-span-2`}>
          <p>
            {devopsSkill.label}
            <br />
            {devopsSkill.sub}
          </p>
          <p className="mt-3 font-serif text-sm">
            {devopsSkill.tools.map((x) => `(${x})`).join(" ")}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3">
        <div className="border-b border-ink sm:col-span-2 sm:border-b-0 sm:border-r">
          <GitHubCell stats={stats} />
        </div>
        <Hatch />
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Section**

Create `src/components/sections/about/AboutSkills.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import type { GitHubStats } from "@/lib/types";
import RoomBackground from "./RoomBackground";
import SideRails from "./SideRails";
import Bento from "./Bento";

/** Black full-width label bar used to open a block (ABOUT, SKILLS, ...). */
export const SECTION_BAR =
  "bg-ink py-1 text-center font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg";

const PARAGRAPHS = ["p1", "p2", "p3", "p4"] as const;

export default function AboutSkills({ stats }: { stats: GitHubStats | null }) {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-clip"
    >
      <RoomBackground />
      <SideRails left={t("railLeft")} right={t("railRight")} />
      <div className="relative mx-auto w-full max-w-[640px] border-x border-ink bg-bg">
        <h2 id="about-title" className={SECTION_BAR}>
          {t("barAbout")}
        </h2>
        <div className="space-y-8 px-6 py-14 font-serif text-[22px] leading-[1.5] tracking-[-0.01em] sm:px-[72px] sm:py-20 sm:text-[30px]">
          {PARAGRAPHS.map((k) => (
            <p key={k}>{t(k)}</p>
          ))}
        </div>
        <h2 className={SECTION_BAR}>{t("barSkills")}</h2>
        <Bento stats={stats} />
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Mount in page**

In `src/app/page.tsx`: import `fetchGitHubStats` from `@/lib/github` and `AboutSkills` from `@/components/sections/about/AboutSkills`. Add `const githubStats = await fetchGitHubStats();` in `Home()`. Add `<AboutSkills stats={githubStats} />` after `<Hero …/>`.

- [ ] **Step 11: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

Start the server; Chromium screenshots at 1440x900 (scroll into About) and 390x844.
Expected: perspective lines converge behind a 640px bordered column, vertical rails on both edges (desktop), black ABOUT/SKILLS bars, 30px serif copy, Anton bento words in alternating sides, globe and hatch cells, GitHub cell with real numbers or the unavailable line. Mobile: single column, no horizontal scroll. Sticky rails stay mid-screen while scrolling (proves no `overflow: hidden` ancestor).

Run: `GITHUB_TOKEN= npm run build` with network blocked is not practical; the unit test covers the failure path.

- [ ] **Step 12: Commit**

```bash
git add src/lib/perspective-room.ts src/lib/perspective-room.test.ts src/lib/github.ts src/lib/github.test.ts src/data/skills.ts src/messages/en.json src/components/sections/about src/app/page.tsx
git commit -m "feat(about): perspective room, about copy, skills bento and live GitHub cell"
```

---

### Task 5: Work (capsule intro, black pinned gallery, catalogue)

**Files:**
- Create: `src/lib/warped-grid.ts`, `src/lib/warped-grid.test.ts`, `src/lib/work-gallery.ts`, `src/lib/work-gallery.test.ts`, `src/components/ui/dot-pattern.tsx`, `src/components/ui/warped-grid.tsx`, `src/components/sections/work/Work.tsx`, `WorkIntro.tsx`, `WorkGallery.tsx`, `StaticGallery.tsx`, `WorkCatalogue.tsx`
- Modify: `src/messages/en.json`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `SECTION_BAR` (Task 4), `cardRotations` from `@/lib/card-rotations`, `projects`/`featuredProjects` from `@/data/projects`, `RepoStats`/`fetchRepoStats` from `@/lib/github-repo-stats`, `StatusTag`, `CatalogFilter`, CSS `.work-animated`/`.work-static`/`.emboss-light` (Task 1).
- Produces: `type GridPath = { d: string }`; `warpedGrid(opts: { cols: number; rows: number; bulge: number }): GridPath[]`; `<WarpedGrid paths className />`; `<DotPattern color gap radius className />`; `galleryProjects(all: Project[]): Project[]`; `cardX(index: number, count: number, progress: number, spacingVw?: number): number`; `cardY(index: number): number`; `letterSway(index: number, progress: number): number`; `<Work repoStats />` (section `id="work"`).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/warped-grid.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { warpedGrid } from "./warped-grid";

describe("warpedGrid", () => {
  it("emits cols+1 vertical and rows+1 horizontal paths", () => {
    expect(warpedGrid({ cols: 12, rows: 6, bulge: 30 })).toHaveLength(13 + 7);
  });

  it("is deterministic", () => {
    const a = warpedGrid({ cols: 8, rows: 4, bulge: 20 });
    expect(warpedGrid({ cols: 8, rows: 4, bulge: 20 })).toEqual(a);
  });

  it("draws straight vertical lines when bulge is 0", () => {
    const first = warpedGrid({ cols: 4, rows: 2, bulge: 0 })[1].d;
    const xs = [...first.matchAll(/[ML]([\d.-]+),/g)].map((m) => m[1]);
    expect(new Set(xs).size).toBe(1);
  });
});
```

Create `src/lib/work-gallery.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/types";
import { cardX, cardY, galleryProjects, letterSway } from "./work-gallery";

function project(slug: string, order: number, image?: string): Project {
  return {
    slug,
    title: slug,
    description: "",
    tag: "",
    tagDetail: "",
    techPills: [],
    links: [],
    image,
    featured: false,
    order,
    status: "SHIPPED",
  };
}

describe("galleryProjects", () => {
  it("keeps only real screenshots, sorted by order", () => {
    const all = [
      project("b", 2, "/images/projects/b.png"),
      project("uav", 1, "/images/uav.svg"),
      project("none", 3),
      project("a", 0, "/images/projects/a.png"),
    ];
    expect(galleryProjects(all).map((p) => p.slug)).toEqual(["a", "b"]);
  });
});

describe("cardX", () => {
  it("starts the first card right of center and ends the last card left", () => {
    expect(cardX(0, 7, 0)).toBe(60);
    expect(cardX(6, 7, 1)).toBe(-60);
  });

  it("clamps progress outside 0..1", () => {
    expect(cardX(0, 7, -1)).toBe(cardX(0, 7, 0));
    expect(cardX(0, 7, 2)).toBe(cardX(0, 7, 1));
  });

  it("moves every card left as progress grows", () => {
    for (let i = 0; i < 7; i++) {
      expect(cardX(i, 7, 0.6)).toBeLessThan(cardX(i, 7, 0.5));
    }
  });
});

describe("cardY and letterSway", () => {
  it("cycles three vertical offsets", () => {
    expect(cardY(0)).toBe(cardY(3));
    expect(new Set([cardY(0), cardY(1), cardY(2)]).size).toBe(3);
  });

  it("keeps sway within +-6 degrees and is deterministic", () => {
    for (let i = 0; i < 48; i++) {
      const v = letterSway(i, 0.37);
      expect(Math.abs(v)).toBeLessThanOrEqual(6);
      expect(letterSway(i, 0.37)).toBe(v);
    }
  });
});
```

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: FAIL, `./warped-grid` and `./work-gallery` not found.

- [ ] **Step 3: Implement the libs**

Create `src/lib/warped-grid.ts`:

```ts
export type GridPath = { d: string };

const W = 1000;
const H = 600;
const STEPS = 24;
const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * A square grid in a 1000x600 viewBox, bowed outward by `bulge` units at
 * its middle (negative bulge bows inward). Deterministic.
 */
export function warpedGrid({
  cols,
  rows,
  bulge,
}: {
  cols: number;
  rows: number;
  bulge: number;
}): GridPath[] {
  const paths: GridPath[] = [];

  for (let c = 0; c <= cols; c++) {
    const x0 = (c / cols) * W;
    const pts: string[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const y = (s / STEPS) * H;
      const x = x0 + ((x0 - W / 2) / (W / 2)) * bulge * Math.sin((Math.PI * y) / H);
      pts.push(`${s === 0 ? "M" : "L"}${r1(x)},${r1(y)}`);
    }
    paths.push({ d: pts.join(" ") });
  }

  for (let r = 0; r <= rows; r++) {
    const y0 = (r / rows) * H;
    const pts: string[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const x = (s / STEPS) * W;
      const y = y0 + ((y0 - H / 2) / (H / 2)) * bulge * Math.sin((Math.PI * x) / W);
      pts.push(`${s === 0 ? "M" : "L"}${r1(x)},${r1(y)}`);
    }
    paths.push({ d: pts.join(" ") });
  }

  return paths;
}
```

Create `src/lib/work-gallery.ts`:

```ts
import type { Project } from "@/lib/types";

/** Projects with a real screenshot, in catalogue order. */
export function galleryProjects(all: Project[]): Project[] {
  return all
    .filter((p) => p.image?.startsWith("/images/projects/"))
    .sort((a, b) => a.order - b.order);
}

/** How far right of center (vw) the first card starts and the last ends left. */
const EDGE_VW = 60;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Horizontal offset from viewport center, in vw, for card `index` of
 * `count` at scroll `progress` (0..1, clamped). Cards keep `spacingVw`
 * between them and the whole row travels right to left.
 */
export function cardX(
  index: number,
  count: number,
  progress: number,
  spacingVw = 34,
): number {
  const p = Math.min(1, Math.max(0, progress));
  const travel = EDGE_VW * 2 + (count - 1) * spacingVw;
  return r2(EDGE_VW + index * spacingVw - p * travel);
}

const Y_OFFSETS_VH = [-12, 9, -3];

/** Vertical offset (vh) so cards sit at staggered heights. */
export function cardY(index: number): number {
  return Y_OFFSETS_VH[index % Y_OFFSETS_VH.length];
}

/** Per-letter rotation (deg, within +-6) for the swaying WORK letters. */
export function letterSway(index: number, progress: number): number {
  return r2(Math.sin(index * 0.9 + progress * Math.PI * 2) * 6);
}
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Shared decorative components**

Create `src/components/ui/dot-pattern.tsx`:

```tsx
import { useId } from "react";

/** Even dot grid as an SVG pattern (no CSS gradients). Decorative. */
export default function DotPattern({
  color = "currentColor",
  gap = 12,
  radius = 1,
  className = "",
}: {
  color?: string;
  gap?: number;
  radius?: number;
  className?: string;
}) {
  const id = `dots-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden className={`pointer-events-none ${className}`}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={radius} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
```

Create `src/components/ui/warped-grid.tsx`:

```tsx
import type { GridPath } from "@/lib/warped-grid";

export default function WarpedGrid({
  paths,
  className = "",
}: {
  paths: GridPath[];
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 5: Intro capsule**

Create `src/components/sections/work/WorkIntro.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";
import DotPattern from "@/components/ui/dot-pattern";

const introGrid = warpedGrid({ cols: 12, rows: 7, bulge: 18 });

/** Black capsule on a grid; grows on scroll until the screen is black. */
export default function WorkIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0.15, 1], [1, 14]);

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <WarpedGrid paths={introGrid} className="absolute inset-0 h-full w-full" />
        <motion.div
          style={{ scale }}
          className="relative flex h-[300px] w-[150px] items-center justify-center overflow-hidden rounded-full bg-ink text-bg"
        >
          <DotPattern color="rgba(255,255,255,0.35)" className="absolute inset-0 h-full w-full" />
          <p aria-hidden className="relative flex flex-col items-center font-display text-6xl leading-[0.95]">
            {"WORK".split("").map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Pinned gallery**

Create `src/components/sections/work/WorkGallery.tsx`:

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Project } from "@/lib/types";
import { cardRotations } from "@/lib/card-rotations";
import { cardX, cardY, letterSway } from "@/lib/work-gallery";
import DotPattern from "@/components/ui/dot-pattern";

const ROWS = ["W", "O", "R", "K"];
const PER_ROW = 12;

function SwayLetter({
  letter,
  index,
  progress,
}: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const rotate = useTransform(progress, (p) => letterSway(index, p));
  return (
    <motion.span
      style={{ rotate }}
      className="emboss-light inline-block font-display text-[20vh] leading-none text-bg"
    >
      {letter}
    </motion.span>
  );
}

function GalleryCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, (p) => `${cardX(index, total, p)}vw`);
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
  const body = (
    <>
      <div className="relative aspect-[16/10] border border-bg bg-panel">
        <Image
          src={project.image!}
          alt=""
          fill
          sizes="(max-width: 1024px) 70vw, 520px"
          className="object-cover object-top"
        />
      </div>
      <div className="mt-2 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-bg">
        <span className="truncate">{project.title}</span>
        <span className="tabular-nums">
          #{String(index + 1).padStart(3, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
    </>
  );

  return (
    <motion.li
      style={{
        x,
        rotate: cardRotations[index % cardRotations.length],
        top: `calc(50% + ${cardY(index)}vh)`,
      }}
      className="absolute left-1/2 w-[min(520px,70vw)] -translate-x-1/2 -translate-y-1/2"
    >
      {primary ? (
        <a
          href={primary.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          className="block"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </motion.li>
  );
}

/**
 * Black stage pinned for ~3 viewports: swaying embossed WORK letters behind
 * screenshot cards that travel right to left. Decorative duplicate of the
 * catalogue below, so it is hidden from assistive tech and out of tab order.
 */
export default function WorkGallery({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} aria-hidden className="relative h-[400vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <DotPattern color="rgba(255,255,255,0.18)" gap={16} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex flex-col justify-around py-[2vh]">
          {ROWS.map((letter, r) => (
            <div key={letter} className="flex justify-around">
              {Array.from({ length: PER_ROW }, (_, c) => (
                <SwayLetter
                  key={c}
                  letter={letter}
                  index={r * PER_ROW + c}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          ))}
        </div>
        <ul className="absolute inset-0">
          {items.map((p, i) => (
            <GalleryCard
              key={p.slug}
              project={p}
              index={i}
              total={items.length}
              progress={scrollYProgress}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Static gallery**

Create `src/components/sections/work/StaticGallery.tsx`:

```tsx
import Image from "next/image";
import type { Project } from "@/lib/types";

/** Phone and reduced-motion version: a WORK band and stacked cards. */
export default function StaticGallery({ items }: { items: Project[] }) {
  return (
    <div aria-hidden className="bg-ink px-4 py-12 text-bg">
      <p className="emboss-light text-center font-display text-[28vw] leading-none md:text-[14rem]">
        WORK
      </p>
      <ul className="mx-auto mt-10 max-w-[640px] space-y-10">
        {items.map((p, i) => {
          const primary = p.links.find((l) => l.isPrimary) ?? p.links[0];
          const body = (
            <>
              <div className="relative aspect-[16/10] border border-bg bg-panel">
                <Image
                  src={p.image!}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 640px"
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-2 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="truncate">{p.title}</span>
                <span className="tabular-nums">
                  #{String(i + 1).padStart(3, "0")}/{String(items.length).padStart(2, "0")}
                </span>
              </div>
            </>
          );
          return (
            <li key={p.slug}>
              {primary ? (
                <a href={primary.href} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="block">
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 8: Catalogue**

Add to `src/messages/en.json` `projects` object: `"allTitle": "All projects"`.

Create `src/components/sections/work/WorkCatalogue.tsx` (ported from the old `FlatCatalogue` in `src/components/checkpoints/Log.tsx`, restyled to the new type system):

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import type { Project } from "@/lib/types";
import type { RepoStats } from "@/lib/github-repo-stats";
import StatusTag from "@/components/ui/status-tag";
import CatalogFilter, { type CatalogFilterValue } from "@/components/ui/catalog-filter";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";

function Links({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <a
            key={link.label}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`link-draw inline-flex items-center gap-1 font-mono text-xs ${
              link.isPrimary ? "text-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            {link.label}
            <ArrowUpRight size={12} aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

/** The full, accessible project list. Every project, every link. */
export default function WorkCatalogue({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");
  const [flagship] = featuredProjects;
  const ordered = [
    flagship,
    ...projects.filter((p) => p.slug !== flagship.slug).sort((a, b) => a.order - b.order),
  ];
  const shown = ordered.filter((p) => filter === "ALL" || p.status === filter);

  return (
    <div className="border-t border-ink">
      <h3 className={SECTION_BAR}>
        {t("allTitle")} · {t("count", { count: projects.length })}
      </h3>
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-10">
        <CatalogFilter value={filter} onChange={setFilter} />
        <div className="mt-8">
          {shown.map((project, i) => (
            <article
              key={project.slug}
              className={`grid py-8 ${
                project.slug === flagship.slug ? "border-2 border-ink px-6 md:px-8" : "border-t border-ink"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="font-mono text-xs tabular-nums text-ink-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2">
                  {project.tag}
                </span>
                <StatusTag status={project.status} />
              </div>
              <h4 className="font-serif text-3xl leading-[1.1] text-ink">{project.title}</h4>
              <p className="mt-3 max-w-2xl font-serif text-lg leading-[1.5] text-ink-2">
                {project.description}
              </p>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-2">
                {project.techPills.join("  ·  ")}
              </p>
              <Links links={project.links} />
              {project.image && (
                <div className="relative mt-5 flex min-h-[160px] max-w-[280px] items-center justify-center overflow-hidden border border-ink bg-panel p-6">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    width={280}
                    height={200}
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}
              {project.repo && repoStats[project.repo] && (
                <p className="mt-4 font-mono text-[11px] text-ink-2">
                  {repoStats[project.repo]!.commitCount} commits · last commit{" "}
                  {repoStats[project.repo]!.lastCommitDate}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Section and page**

Create `src/components/sections/work/Work.tsx`:

```tsx
import { projects } from "@/data/projects";
import type { RepoStats } from "@/lib/github-repo-stats";
import { galleryProjects } from "@/lib/work-gallery";
import WorkIntro from "./WorkIntro";
import WorkGallery from "./WorkGallery";
import StaticGallery from "./StaticGallery";
import WorkCatalogue from "./WorkCatalogue";

export default function Work({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
  const items = galleryProjects(projects);
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">
        Work
      </h2>
      <div className="work-animated">
        <WorkIntro />
        <WorkGallery items={items} />
      </div>
      <div className="work-static">
        <StaticGallery items={items} />
      </div>
      <WorkCatalogue repoStats={repoStats} />
    </section>
  );
}
```

In `src/app/page.tsx`: import `projects` from `@/data/projects`, `fetchRepoStats` from `@/lib/github-repo-stats`, `Work` from `@/components/sections/work/Work`. In `Home()` add:

```ts
  const repoStats = await fetchRepoStats(
    projects.filter((p) => p.repo).map((p) => p.repo as string),
  );
```

Add `<Work repoStats={repoStats} />` after `<AboutSkills …/>`.

- [ ] **Step 10: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

Start the server. Chromium at 1440x900: scroll through Work in 900px steps and screenshot each.
Expected: capsule on grid grows to black; black stage with white embossed W/O/R/K rows swaying; 7 opaque, slightly rotated screenshot cards moving right to left with `#00N/07` captions; stage releases after about 3 screens; white catalogue with every project. Chromium at 390x844: static WORK band, stacked cards, no horizontal scroll. Chromium at 1440 with `reducedMotion: "reduce"` context option: static gallery shows, no pin.

- [ ] **Step 11: Commit**

```bash
git add src/lib/warped-grid.ts src/lib/warped-grid.test.ts src/lib/work-gallery.ts src/lib/work-gallery.test.ts src/components/ui/dot-pattern.tsx src/components/ui/warped-grid.tsx src/components/sections/work src/messages/en.json src/app/page.tsx
git commit -m "feat(work): capsule intro, pinned black gallery and full catalogue"
```

---

### Task 6: Ventures

**Files:**
- Create: `src/components/sections/Ventures.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `ventures` from `@/data/ventures`, `SECTION_BAR` and `RoomBackground` (Task 4), `spring`/`viewportOnce` from `@/lib/motion`.
- Produces: `<Ventures />` (section `id="ventures"`).

- [ ] **Step 1: Component**

Create `src/components/sections/Ventures.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ventures, type Venture } from "@/data/ventures";
import { spring, viewportOnce } from "@/lib/motion";
import { SECTION_BAR } from "@/components/sections/about/AboutSkills";
import RoomBackground from "@/components/sections/about/RoomBackground";

function Row({ venture, index }: { venture: Venture; index: number }) {
  return (
    <div className="grid gap-6 px-4 py-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:py-12">
      <p className="break-words font-display text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85]">
        {venture.name}
        {venture.href && (
          <span
            aria-hidden
            className="ml-3 inline-block align-top text-[0.35em] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        )}
      </p>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-2">
          {String(index + 1).padStart(2, "0")} · {venture.role}
        </p>
        <p className="mt-3 font-serif text-xl leading-[1.5]">{venture.proof}</p>
        {venture.units && (
          <ul className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">
            {venture.units.map((u) => (
              <li key={u.name}>
                {u.name} · {u.detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Ventures() {
  const t = useTranslations("ventures");

  return (
    <section
      id="ventures"
      aria-labelledby="ventures-title"
      className="relative overflow-clip border-t border-ink"
    >
      <RoomBackground className="opacity-15" />
      <h2 id="ventures-title" className={`relative ${SECTION_BAR}`}>
        {t("title")}
      </h2>
      <ul className="relative">
        {ventures.map((v, i) => (
          <motion.li
            key={v.name}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={spring}
            className="border-b border-ink"
          >
            {v.href ? (
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block transition-colors hover:bg-panel"
              >
                <Row venture={v} index={i} />
              </a>
            ) : (
              <Row venture={v} index={i} />
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
```

`Venture` is already exported from `src/data/ventures.ts`; if it is not exported in your checkout, add `export` to its `interface` declaration.

- [ ] **Step 2: Mount**

In `src/app/page.tsx` import `Ventures` from `@/components/sections/Ventures` and add `<Ventures />` after `<Work …/>`.

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: pass.

Chromium screenshots at 1440x900 and 390x844 of the Ventures section.
Expected: three ruled rows with giant Anton names (STRATOS İHA renders the dotted İ correctly), role, proof and STRATOS units on the right; rows slide in. At 390px no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Ventures.tsx src/app/page.tsx
git commit -m "feat(ventures): large-line ventures section"
```

---

### Task 7: Closing sequence and footer

**Files:**
- Create: `src/lib/radial-burst.test.ts`, `src/components/sections/closing/Closing.tsx`, `BurstHeadline.tsx`, `DreamBuild.tsx`, `GoPanel.tsx`
- Modify: `src/lib/radial-burst.ts`, `src/components/ui/radial-burst.tsx`, `src/components/footer.tsx`, `src/messages/en.json`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `warpedGrid`, `WarpedGrid`, `DotPattern` (Task 5), `CONTACT_EMAIL`, `contactLinks` (Task 2), `navItems` (Task 2).
- Produces: `radialRaysFrom(cx: number, cy: number, count: number, length: number): RadialRay[]`; `<RadialBurst rays cx cy stroke className />`; `<Closing />` (section `id="contact"`).

- [ ] **Step 1: Write the failing test**

Create `src/lib/radial-burst.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { radialRays, radialRaysFrom } from "./radial-burst";

describe("radialRaysFrom", () => {
  it("keeps the original centered burst unchanged", () => {
    expect(radialRaysFrom(500, 500, 48, 900)).toEqual(radialRays);
  });

  it("emits `count` rays of the given length from the center", () => {
    const rays = radialRaysFrom(500, 40, 64, 1400);
    expect(rays).toHaveLength(64);
    for (const r of rays) {
      expect(Math.hypot(r.x2 - 500, r.y2 - 40)).toBeCloseTo(1400, 0);
    }
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test`
Expected: FAIL, `radialRaysFrom` is not exported.

- [ ] **Step 3: Generalize the burst**

Replace `src/lib/radial-burst.ts` body below the `RadialRay` interface with:

```ts
/**
 * Evenly spaced rays from (cx, cy). Rounded to 2 decimals: Math.cos/sin can
 * differ in the last bit between Node and browsers, and rounding keeps the
 * server and client SVG strings identical.
 */
export function radialRaysFrom(
  cx: number,
  cy: number,
  count: number,
  length: number,
): RadialRay[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x2: Math.round((cx + Math.cos(angle) * length) * 100) / 100,
      y2: Math.round((cy + Math.sin(angle) * length) * 100) / 100,
    };
  });
}

export const radialRays: RadialRay[] = radialRaysFrom(500, 500, RAY_COUNT, 900);
```

Run: `npm test`
Expected: PASS.

Replace `src/components/ui/radial-burst.tsx`:

```tsx
import { radialRays, type RadialRay } from "@/lib/radial-burst";

/** Thin lines converging on one point. Decorative. */
export default function RadialBurst({
  className = "",
  rays = radialRays,
  cx = 500,
  cy = 500,
  stroke = "var(--color-rule)",
}: {
  className?: string;
  rays?: RadialRay[];
  cx?: number;
  cy?: number;
  stroke?: string;
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={ray.x2}
          y2={ray.y2}
          stroke={stroke}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 4: Copy**

Add to `src/messages/en.json`:

```json
  "closing": {
    "line1": "Let's",
    "line2": "Build",
    "line3": "Something",
    "line4": "Real",
    "dreamBuild": "Dream it. Build it.",
    "go": "GO",
    "goLabel": "Email Emir Sakarya"
  },
```

- [ ] **Step 5: Closing pieces**

Create `src/components/sections/closing/BurstHeadline.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { radialRaysFrom } from "@/lib/radial-burst";
import RadialBurst from "@/components/ui/radial-burst";

const rays = radialRaysFrom(500, 40, 64, 1400);

export default function BurstHeadline() {
  const t = useTranslations("closing");
  return (
    <div className="relative h-[90vh] min-h-[560px] overflow-clip">
      <RadialBurst
        rays={rays}
        cx={500}
        cy={40}
        stroke="var(--color-ink)"
        className="absolute inset-0 h-full w-full"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-[4%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-bg"
      />
      <div className="absolute inset-x-0 bottom-[22%] flex justify-center [perspective:600px]">
        <h2
          id="contact-title"
          className="flex origin-bottom flex-col items-center text-center font-display uppercase leading-[0.82] text-ink [transform:rotateX(24deg)]"
        >
          <span className="text-[clamp(1.5rem,3vw,2.5rem)]">{t("line1")}</span>
          <span className="text-[clamp(2rem,4.5vw,3.75rem)]">{t("line2")}</span>
          <span className="text-[clamp(3rem,8vw,6.5rem)]">{t("line3")}</span>
          <span className="text-[clamp(4.5rem,15vw,13rem)]">{t("line4")}</span>
        </h2>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 grid h-[16%] grid-cols-12 border-t border-ink bg-bg"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="border-r border-ink last:border-r-0" />
        ))}
      </div>
    </div>
  );
}
```

Create `src/components/sections/closing/DreamBuild.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

const grid = warpedGrid({ cols: 12, rows: 6, bulge: 24 });

function Char({
  char,
  offset,
  progress,
  mode,
}: {
  char: string;
  offset: number;
  progress: MotionValue<number>;
  mode: "scatter" | "assemble";
}) {
  const reduce = useReducedMotion();
  const x = useTransform(progress, (p) => {
    if (reduce) return "0vw";
    const t = mode === "scatter" ? p : 1 - p;
    return `${offset * t * 4}vw`;
  });
  const opacity = useTransform(progress, (p) => {
    if (reduce) return 1;
    return mode === "scatter" ? 1 - p * 0.85 : 0.15 + p * 0.85;
  });
  return (
    <motion.span style={{ x, opacity }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  );
}

function Line({
  text,
  progress,
  mode,
}: {
  text: string;
  progress: MotionValue<number>;
  mode: "scatter" | "assemble";
}) {
  const chars = text.split("");
  const mid = (chars.length - 1) / 2;
  return (
    <p
      aria-hidden
      className="relative flex justify-center font-condensed text-[clamp(4rem,12vw,11rem)] font-bold leading-none tracking-[0.04em] text-ink"
    >
      {chars.map((c, i) => (
        <Char key={i} char={c} offset={i - mid} progress={progress} mode={mode} />
      ))}
    </p>
  );
}

/** DREAM IT scatters apart while BUILD IT assembles, over a bowed grid. */
export default function DreamBuild() {
  const t = useTranslations("closing");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative h-[200vh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-4 overflow-hidden border-t border-ink motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
        <p className="sr-only">{t("dreamBuild")}</p>
        <Line text="DREAM IT" progress={scrollYProgress} mode="scatter" />
        <Line text="BUILD IT" progress={scrollYProgress} mode="assemble" />
      </div>
    </div>
  );
}
```

Create `src/components/sections/closing/GoPanel.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/data/contact";
import { warpedGrid } from "@/lib/warped-grid";
import WarpedGrid from "@/components/ui/warped-grid";

const grid = warpedGrid({ cols: 12, rows: 5, bulge: -20 });

export default function GoPanel() {
  const t = useTranslations("closing");
  return (
    <div className="relative h-[60vh] min-h-[420px] overflow-clip border-t border-ink">
      <WarpedGrid paths={grid} className="absolute inset-0 h-full w-full" />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={t("goLabel")}
        className="absolute left-1/2 top-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-ink font-display text-4xl text-bg transition-transform hover:scale-105 active:scale-95"
      >
        {t("go")}
      </a>
    </div>
  );
}
```

Create `src/components/sections/closing/Closing.tsx`:

```tsx
import BurstHeadline from "./BurstHeadline";
import DreamBuild from "./DreamBuild";
import GoPanel from "./GoPanel";

export default function Closing() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-ink">
      <BurstHeadline />
      <DreamBuild />
      <GoPanel />
    </section>
  );
}
```

- [ ] **Step 6: Footer restyle**

Replace `src/components/footer.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/data/nav-items";
import { contactLinks } from "@/data/contact";
import DotPattern from "@/components/ui/dot-pattern";

const heading =
  "mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-bg/60";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer>
      <div className="relative h-16 bg-ink md:h-24">
        <DotPattern color="var(--color-bg)" gap={10} radius={1.2} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="relative overflow-hidden border-t border-bg bg-ink text-bg">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1/4 select-none whitespace-nowrap text-center font-display text-[18vw] leading-none opacity-[0.08]"
        >
          {t("wordmark")}
        </p>

        <div className="relative mx-auto max-w-[1320px] px-6 py-14 md:px-10 md:py-20 lg:px-36">
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-24">
            <div>
              <p className={heading}>{t("contactHeading")}</p>
              <ul className="space-y-3">
                {contactLinks.map((c) => {
                  const external = c.href.startsWith("http");
                  return (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex items-baseline justify-between gap-4 transition-opacity hover:opacity-70 active:opacity-70"
                      >
                        <span className="font-serif text-xl">{c.label}</span>
                        <span className="truncate font-mono text-xs text-bg/50">{c.value}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className={heading}>{t("navHeading")}</p>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className="flex items-baseline justify-between font-serif text-xl transition-opacity hover:opacity-70 active:opacity-70"
                    >
                      {tNav(item.key)}
                      <span aria-hidden className="text-sm text-bg/60">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-bg/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">{t("colophon")}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-bg/60">{t("meta")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Mount**

In `src/app/page.tsx` import `Closing` from `@/components/sections/closing/Closing` and add `<Closing />` after `<Ventures />`.

- [ ] **Step 8: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

Chromium screenshots at 1440x900 and 390x844 through the end of the page.
Expected: ray burst from a small top circle with the four-line perspective headline over a ruled floor; DREAM IT scatters while BUILD IT assembles; GO circle on a bowed grid opens a `mailto:` link; dot band; black footer with serif links and the giant wordmark. Reduced-motion context: DREAM IT / BUILD IT shown in place, no pin.

- [ ] **Step 9: Commit**

```bash
git add src/lib/radial-burst.ts src/lib/radial-burst.test.ts src/components/ui/radial-burst.tsx src/components/sections/closing src/components/footer.tsx src/messages/en.json src/app/page.tsx
git commit -m "feat(closing): burst headline, dream/build sequence, GO panel and footer restyle"
```

---

### Task 8: Remove the old system

**Files:**
- Delete: `src/components/flight-scene/`, `src/components/checkpoints/`, `src/lib/flight-scene/`, `src/components/nav.tsx`, `src/components/ui/commit-motif.tsx`, `src/components/ui/skills-room-panel.tsx`, `src/app/fonts/cabinet-grotesk/`, plus anything the orphan check below finds.
- Modify: `src/messages/en.json`, `package.json` (GSAP removal if unused)

**Interfaces:**
- Consumes: the finished page from Tasks 1-7.
- Produces: no orphaned files, no unused message groups, no GSAP dependency if unused.

- [ ] **Step 1: Delete the known-dead code**

```bash
git rm -r src/components/flight-scene src/components/checkpoints src/lib/flight-scene src/components/nav.tsx src/components/ui/commit-motif.tsx src/components/ui/skills-room-panel.tsx src/app/fonts/cabinet-grotesk
```

- [ ] **Step 2: Find orphans**

Run this from the repo root and repeat until it prints nothing (each pass can expose new orphans):

```bash
for f in $(find src/lib src/components src/data -name '*.ts' -o -name '*.tsx' | grep -v '\.test\.ts$'); do
  mod="${f#src/}"; mod="@/${mod%.*}"; base="$(basename "${f%.*}")"
  if ! grep -rqE "from \"(${mod}|\./${base}|\.\./[^\"]*${base})\"" src --include='*.ts' --include='*.tsx'; then echo "$f"; fi
done
```

Expected candidates: `src/lib/binary-ticker.ts`, `src/lib/binary-texture.ts`, `src/lib/wavy-divider.ts`, `src/lib/cross-marks.ts`, `src/lib/scroll.ts`, `src/lib/scroll-to-section.ts`, `src/lib/gsap.ts`, `src/lib/git-history.ts` must NOT appear (page uses it), `src/components/ui/binary-ticker.tsx`, `src/components/ui/wavy-divider.tsx`, `src/components/ui/drone-schematic.tsx`, `src/components/ui/section-header.tsx`. Inspect each printed file before `git rm` (open it, confirm nothing imports it under another path). Do not delete test files or `src/lib/types.ts`.

- [ ] **Step 3: Remove GSAP if unused**

Run: `grep -rn "gsap" src`
If it prints nothing: `npm uninstall gsap @gsap/react`.

- [ ] **Step 4: Prune messages**

Run: `grep -rhoE 't[A-Za-z]*\("[a-zA-Z]+"' src --include='*.tsx' | sort -u` and `grep -rn 'useTranslations("' src --include='*.tsx'` to list the namespaces in use (`nav`, `about`, `skills`, `projects`, `ventures`, `closing`, `footer`).
In `src/messages/en.json`: delete the top-level `hero`, `github` and `contact` objects; in `nav` delete `home`, `flightLog`, `founderStory`, `telemetry`; in `skills` delete `title` and `kicker`; in `projects` delete `title` and `role`; in `ventures` delete `unitsLabel`. Keep every key a remaining component calls.

- [ ] **Step 5: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, no missing-module errors.

Start the server, load `/` in Chromium and read the console.
Expected: no `MISSING_MESSAGE` errors from next-intl, no hydration warnings.

- [ ] **Step 6: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "refactor: remove checkpoint system, old nav and unused decoration"
```

---

### Task 9: Docs and end-to-end verification

**Files:**
- Modify: `DESIGN.md`, `PRODUCT.md`
- Create (scratch only, not committed): a Playwright check script in the session scratchpad.

**Interfaces:**
- Consumes: the finished site.
- Produces: updated design docs; a pass/fail report for the Review Focus checks.

- [ ] **Step 1: Rewrite `DESIGN.md`**

Replace the whole file with:

```markdown
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
```

- [ ] **Step 2: Fix `PRODUCT.md`**

Replace the line `maximalist typographic system, terminal-green single accent); this file` and its neighbors so the bullet reads:

```markdown
- Visual system is documented independently in `DESIGN.md` (black frame,
  white sheet, no accent color); this file does not restate or govern
  those decisions.
```

Also replace `- Next.js 16 (App Router), single-page site, Tailwind CSS 4, Framer Motion,` line's context only if it mentions GSAP (it does not today; leave it).

- [ ] **Step 3: End-to-end checks**

Run `npm run build` then `npx next start -p 3123` in the background. In the session scratchpad, with Playwright installed there (Chromium only, `executablePath` pointing at the installed Chromium if the bundled one is missing), run this script:

```js
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const fail = [];
  const url = "http://localhost:3123/";

  // 1. Phone: no horizontal scroll anywhere down the page
  const phone = await b.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(url, { waitUntil: "networkidle" });
  const H = await phone.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await phone.evaluate((y) => window.scrollTo(0, y), y);
    const over = await phone.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (over) { fail.push(`390px horizontal overflow at y=${y}`); break; }
  }

  // 2. Reduced motion on desktop: static gallery visible, pinned one hidden
  const rm = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p2 = await rm.newPage();
  await p2.goto(url, { waitUntil: "networkidle" });
  const vis = await p2.evaluate(() => ({
    anim: getComputedStyle(document.querySelector(".work-animated")).display,
    stat: getComputedStyle(document.querySelector(".work-static")).display,
  }));
  if (vis.anim !== "none" || vis.stat === "none") fail.push(`reduced motion: ${JSON.stringify(vis)}`);

  // 3. Anchors land on their sections
  const desk = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await desk.goto(url, { waitUntil: "networkidle" });
  for (const id of ["about", "work", "ventures", "contact"]) {
    await desk.goto(url + "#" + id);
    await desk.waitForTimeout(800);
    const top = await desk.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
    if (Math.abs(top) > 40) fail.push(`#${id} lands at top=${top}`);
  }

  // 4. Keyboard: Tab never focuses an element inside an aria-hidden subtree
  await desk.goto(url, { waitUntil: "networkidle" });
  for (let i = 0; i < 80; i++) {
    await desk.keyboard.press("Tab");
    const bad = await desk.evaluate(() => !!document.activeElement?.closest('[aria-hidden="true"]'));
    if (bad) { fail.push(`tab stop ${i} is inside aria-hidden`); break; }
  }

  // 5. Header is never overlapped at the top of the page
  await desk.evaluate(() => window.scrollTo(0, 0));
  const covered = await desk.evaluate(() => {
    const h = document.querySelector("header").getBoundingClientRect();
    const el = document.elementFromPoint(h.left + h.width / 2, h.top + h.height / 2);
    return !document.querySelector("header").contains(el);
  });
  if (covered) fail.push("header center is covered by another element");

  console.log(fail.length ? "FAIL\n" + fail.join("\n") : "ALL CHECKS PASS");
  await b.close();
})();
```

Expected: `ALL CHECKS PASS`. Any failure: fix in the owning task's files, re-run `npm test && npm run build`, re-run the script.

- [ ] **Step 4: Visual comparison**

With the same scratchpad Playwright, capture 900px-tall viewport slices of `http://localhost:3123/` and `https://bekirerdem.dev/` at 1440x900 and 390x844 and compare them side by side, section by section (header, hero, about/skills, work, ventures, closing, footer). Record any section whose structure differs and fix it before finishing.

- [ ] **Step 5: Final hygiene**

Run: `git grep -nP "\x{2014}" -- src DESIGN.md PRODUCT.md`
Expected: no output.

Run: `git grep -nE "linear-gradient|radial-gradient|backdrop-blur|purple|violet" -- src`
Expected: no output.

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

Stop the server.

- [ ] **Step 6: Commit**

```bash
git add DESIGN.md PRODUCT.md
git commit -m "docs(design): document the framed black-and-white system"
```

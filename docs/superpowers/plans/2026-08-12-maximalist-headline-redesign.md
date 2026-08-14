# Maximalist Headline Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the "Instrument" design system and replace it with a neutral maximalist typographic system (terminal-green accent, Cabinet Grotesk display font), reorder the page to lead with proof of work, add a real-git-history background motif, and rebuild the project catalog with real per-project status/GitHub data.

**Architecture:** This is a token-and-data-layer swap more than a component rewrite. The existing bordered-panel / mono-readout / spring-motion component architecture (`SectionHeader`, `motion.ts` variants, `row-sweep`/`link-draw`/`annotate` CSS utilities) stays - only the color tokens, display font, page order, hero copy, and the `Projects` section's data model and markup change. A new `lib/git-history.ts` (server-only, reads this repo's own `git log`) and a new `lib/github-repo-stats.ts` (per-project GitHub API calls) are added as data sources.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 (`@theme` in `globals.css`, no config file), framer-motion 12, next-intl (single `en` locale), no test runner configured in this repo (verification is `npx tsc --noEmit` + `npm run build` + manual dev-server check, matching this repo's existing convention of no unit tests).

**Spec:** `docs/superpowers/specs/2026-08-12-maximalist-headline-redesign-design.md`

## Global Constraints

- No gradients, no glassmorphism/blur panels, no purple/violet anywhere (standing global rule, restated in spec section 9).
- Single accent color only: terminal green, solid fill, no glow. At most one accent element per viewport zone.
- No `rounded-full` pill chrome for status/tags anywhere - plain text + square dot, or bordered rectangular tag only.
- No three-icon-feature-card row pattern anywhere on the page.
- No em dashes anywhere (code, copy, commit messages, docs) - use commas, periods, colons, or hyphens.
- All data shown (commit texture, project status, commit counts, last-commit dates) must be real, fetched or computed - never hardcoded stand-ins or fake round numbers.
- `prefers-reduced-motion` must be respected for every new motion addition (the existing `MotionConfig reducedMotion="user"` in `motion-provider.tsx` and the CSS `@media (prefers-reduced-motion: reduce)` block in `globals.css` already cover this for existing motion - new motion must use the same `framer-motion` variant system, not raw untracked animations).
- Keep `JetBrains Mono` as the mono/readout font - it is explicitly retained, not replaced.
- Excluded from this redesign entirely (do not build): keyboard j/k catalog navigation, live health-check status dots, inline README-excerpt accordion, a section-header live SHIPPED/IN-PROGRESS counter, bilingual TR/EN toggle, WebP/GIF mood-state imagery.

---

### Task 1: New accent color + Cabinet Grotesk display font

**Files:**
- Modify: `src/app/globals.css:17-32` (accent tokens + `--font-display`)
- Modify: `src/app/layout.tsx:1-26,56-58` (font loading + `html` className)
- Create: `src/app/fonts/cabinet-grotesk/` (self-hosted woff2 files, see step 1)

**Interfaces:**
- Produces: CSS var `--color-accent: #39FF6A` (and `--color-accent-soft`, `--color-card-border-hover` re-derived from it) available to every component via existing Tailwind `text-accent`/`bg-accent`/`border-accent` utility classes (unchanged utility names, only the underlying color changes).
- Produces: CSS var `--font-display` bound to a new `--font-cabinet-grotesk` variable (same variable *name* `--font-display` that every component already consumes via `font-display` Tailwind class - no component-level import changes needed for this task).

- [ ] **Step 1: Download Cabinet Grotesk (Fontshare, free for commercial use) as self-hosted files**

```bash
mkdir -p src/app/fonts/cabinet-grotesk
curl -sL "https://api.fontshare.com/v2/fonts/download/cabinet-grotesk" -o /tmp/cabinet-grotesk.zip
unzip -j /tmp/cabinet-grotesk.zip "Fonts/WEB/fonts/*.woff2" -d src/app/fonts/cabinet-grotesk
ls src/app/fonts/cabinet-grotesk
```

Expected: a set of `CabinetGrotesk-*.woff2` files (at minimum Regular/Medium/Bold/Extrabold weights) land in `src/app/fonts/cabinet-grotesk/`. If the Fontshare API path has changed, use the same download flow from https://www.fontshare.com/fonts/cabinet-grotesk instead and place the resulting `.woff2` files in the same directory - the weights list in step 2 must match whatever filenames actually land here.

- [ ] **Step 2: Wire the font via `next/font/local`**

In `src/app/layout.tsx`, replace the `Instrument_Sans` import and declaration:

```ts
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
```

```ts
// Display + body: Cabinet Grotesk - a sharp-cornered, maximalist grotesk
// built to carry oversized single-line headline statements at hero scale.
const cabinetGrotesk = localFont({
  src: [
    { path: "./fonts/cabinet-grotesk/CabinetGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cabinet-grotesk/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/cabinet-grotesk/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-cabinet-grotesk",
  display: "swap",
});
```

Adjust the `path`/`weight` entries to match the exact filenames from Step 1's `ls` output before moving on - do not guess filenames that were not actually produced.

Update the `html className` (currently `${instrumentSans.variable} ${mono.variable}`) to:

```tsx
className={`${cabinetGrotesk.variable} ${mono.variable}`}
```

- [ ] **Step 3: Point `--font-display` at the new variable in `globals.css`**

Replace lines 28-31 of `src/app/globals.css`:

```css
  --font-display: var(--font-cabinet-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-cabinet-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-cabinet-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "JetBrains Mono", monospace;
```

- [ ] **Step 4: Swap the accent tokens (lines 17-26)**

```css
  /* ── Accent: terminal green, used scarcely as a single signal ── */
  --color-accent: #39ff6a;
  --color-accent-soft: rgba(57, 255, 106, 0.1);

  /* ── Structure ─────────────────────────────────────────────── */
  --color-rule: rgba(255, 255, 255, 0.08);
  --color-rule-strong: rgba(255, 255, 255, 0.18);
  --color-card: #121214;
  --color-card-border: rgba(255, 255, 255, 0.08);
  --color-card-border-hover: rgba(57, 255, 106, 0.4);
```

- [ ] **Step 5: Verify WCAG AA contrast of the new accent on canvas**

```bash
node -e "
function lum(hex){const c=hex.match(/\w\w/g).map(h=>{const v=parseInt(h,16)/255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
const bg=lum('09090b'), fg=lum('39ff6a');
const ratio=(Math.max(bg,fg)+0.05)/(Math.min(bg,fg)+0.05);
console.log('contrast ratio:', ratio.toFixed(2));
"
```

Expected: ratio printed is >= 3.0 (large-text/UI-component AA threshold; the accent is used for large headline text, status dots, and UI chrome, not 11px body copy). If it prints below 3.0, darken the canvas or adjust the green's lightness in Step 4 and re-run this check before continuing - do not proceed with a value that fails this check.

- [ ] **Step 6: Build and visually confirm**

```bash
npm run build
```

Expected: build succeeds with no font-loading or CSS errors. Then run `npm run dev`, open the site, and confirm the accent renders as green (not orange) on the CTA button, nav underline, and status dot, and the display font visibly changed from the previous geometric sans.

- [ ] **Step 7: Commit**

```bash
git add src/app/fonts/cabinet-grotesk src/app/layout.tsx src/app/globals.css
git commit -m "feat(design): swap accent to terminal green and display font to Cabinet Grotesk"
```

---

### Task 2: Real git-history background motif

**Files:**
- Create: `src/lib/git-history.ts`
- Create: `src/components/ui/commit-motif.tsx`
- Modify: `src/app/page.tsx` (mount the motif)

**Interfaces:**
- Produces: `getRecentCommits(limit: number): { hash: string; message: string }[]` from `src/lib/git-history.ts`, server-only (uses Node's `child_process`).
- Produces: `<CommitMotif commits={{hash,message}[]} />` default export from `src/components/ui/commit-motif.tsx`, a client component that renders the strings as a faint fixed/absolute mono-type texture layer.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Write `git-history.ts`**

```ts
import { execFileSync } from "node:child_process";

export interface CommitEntry {
  hash: string;
  message: string;
}

/**
 * Reads this repo's own git history at build/request time to drive the
 * background motif. Real data only - no invented commit strings.
 */
export function getRecentCommits(limit = 40): CommitEntry[] {
  try {
    const output = execFileSync(
      "git",
      ["log", `-n${limit}`, "--pretty=format:%h%x1f%s"],
      { cwd: process.cwd(), encoding: "utf-8" }
    );
    return output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, message] = line.split("\x1f");
        return { hash, message };
      });
  } catch {
    // No git history available (e.g. a shallow-cloned deploy artifact) -
    // an empty motif is acceptable; the texture layer simply renders nothing
    // rather than falling back to fabricated strings.
    return [];
  }
}
```

- [ ] **Step 2: Write the `CommitMotif` component**

```tsx
"use client";

import { CommitEntry } from "@/lib/git-history";

/**
 * Faint mono-type texture built from this repo's own real commit history.
 * Purely decorative background layer - aria-hidden, never focusable, sits
 * behind section content (z-index below `main`'s z-index: 2 in globals.css).
 */
export default function CommitMotif({ commits }: { commits: CommitEntry[] }) {
  if (commits.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.05] select-none"
    >
      <div className="font-mono text-[11px] leading-[1.8] tracking-wide text-ink whitespace-nowrap -rotate-2">
        {commits.map((c, i) => (
          <div key={c.hash + i}>
            {c.hash} {c.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Mount it in `page.tsx`**

Add the import and call `getRecentCommits()` alongside the existing `fetchGitHubStats()` call in `src/app/page.tsx`:

```tsx
import { getRecentCommits } from "@/lib/git-history";
import CommitMotif from "@/components/ui/commit-motif";
```

```tsx
export default async function Home() {
  const githubStats = await fetchGitHubStats();
  const commits = getRecentCommits();

  return (
    <>
      <CommitMotif commits={commits} />
      <ScrollProgress />
      ...
```

- [ ] **Step 4: Build and verify real data renders**

```bash
npm run build && npm run dev
```

Expected: dev server starts; open the site and confirm faint diagonal repeating text is visible behind sections, and that the hashes/messages match `git log --oneline -10` output for this repo (not placeholder text).

- [ ] **Step 5: Commit**

```bash
git add src/lib/git-history.ts src/components/ui/commit-motif.tsx src/app/page.tsx
git commit -m "feat(design): add real git-history background motif"
```

---

### Task 3: Section reorder (projects before stratos)

**Files:**
- Modify: `src/app/page.tsx:20-27`
- Modify: `src/components/nav.tsx:11-18`

**Interfaces:**
- Consumes: nothing new.
- Produces: nav item order/index numbers that later tasks (none) depend on - this is a leaf change.

- [ ] **Step 1: Reorder `page.tsx`**

Change the JSX render order inside `<main>` from `Hero, Stratos, Projects, Skills, GitHub, Contact` to:

```tsx
      <main>
        <Hero />
        <Projects />
        <Stratos />
        <Skills />
        <GitHub stats={githubStats} />
        <Contact />
        <Footer />
      </main>
```

- [ ] **Step 2: Renumber `navItems` in `nav.tsx`**

```ts
export const navItems = [
  { key: "home", href: "#home", num: "00" },
  { key: "projects", href: "#projects", num: "01" },
  { key: "stratos", href: "#stratos", num: "02" },
  { key: "skills", href: "#skills", num: "03" },
  { key: "github", href: "#github", num: "04" },
  { key: "contact", href: "#contact", num: "05" },
];
```

(`mobile-nav.tsx` imports `navItems` from `nav.tsx` and maps over it directly - no change needed there, the reorder propagates automatically.)

- [ ] **Step 3: Verify scroll-spy and manual nav links still work**

```bash
npm run dev
```

Expected: clicking "work" in the nav scrolls to the projects section (now second), the active-section index chip in the top-left updates to `01` when projects is in view, and `02` when stratos is in view.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/nav.tsx
git commit -m "feat(design): move projects ahead of stratos in page and nav order"
```

---

### Task 4: Hero headline copy - domain-first, role moved to lead

**Files:**
- Modify: `src/messages/en.json` (`hero` namespace)
- Modify: `src/components/hero.tsx:53-56` (role/org markup, unchanged structurally, verify copy fits)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed elsewhere (leaf content change).

- [ ] **Step 1: Update the `hero` namespace in `src/messages/en.json`**

Replace `hLine1`/`hLine2` (currently "I build the drones," / "and the software they fly on.") with the domain-first identity line, and move the founder/SWE framing more explicitly into `role`/`lead`:

```json
"hero": {
  "role": "Founder & Software Engineer",
  "org": "STRATOS İHA",
  "hLine1": "ML · Embedded · Web",
  "hLine2": "is where I build.",
  "rev": "NASA Space Apps 2025 · Winner, Türkiye",
  "panelReadout": "Autonomous quadrotor · Flight-ready",
  "lead": "I run the electronics and software side of a TEKNOFEST UAV team I founded, from the flight stack down to the ground software. Off the airframe I ship production platforms and AI agent systems built to show their own work, not just claim it.",
  "cred1": "Flight controllers, sensor fusion, autonomous mission planning",
  "cred2": "Agent systems: typed task-graphs, verify gates, audit trails",
  "cred3": "Production full-stack: React, Node, GraphQL, Postgres, Kubernetes",
  "cred4": "Tofaş Fen Lisesi, Bursa · TEKNOFEST competitor",
  "viewWork": "View work",
  "getInTouch": "Get in touch"
}
```

`role` changes from "Founder · Head of Electronics & Software" to "Founder & Software Engineer" so the SWE/founder identity is stated up top in the mono role line (per spec section 3: role framing lives in the role/subheading, not the headline), while `hLine1`/`hLine2` state only the work domains.

- [ ] **Step 2: No structural change needed in `hero.tsx`** - it already renders `t("role")`, `t("hLine1")`, `t("hLine2")` verbatim (lines 53-69), so the JSON change is sufficient. Confirm by reading the rendered output in the next step; do not edit `hero.tsx` unless the new copy visibly breaks the two-line layout.

- [ ] **Step 3: Build and visually verify**

```bash
npm run dev
```

Expected: hero headline reads "ML · Embedded · Web" / "is where I build." across two lines, role line above it reads "Founder & Software Engineer · STRATOS İHA". Check the line wrap at `sm`/`md`/`lg` breakpoints does not orphan a single word oddly - if it does, adjust the line break point in the JSON (e.g. rebalance where `hLine1`/`hLine2` split), not the component.

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json
git commit -m "content(design): rewrite hero headline as domain-first, move SWE/founder framing to role line"
```

---

### Task 5: Add real `status` field to project data

**Files:**
- Modify: `src/lib/types.ts:1-12` (`Project` interface)
- Modify: `src/data/projects.ts` (every project entry)

**Interfaces:**
- Produces: `Project.status: "SHIPPED" | "IN_PROGRESS" | "ARCHIVED"`, consumed by Task 7's catalog UI.
- Consumes: nothing.

Status is assigned from each project's actual current state as already described in its own `description`/`links` in this file - not invented:
- **SHIPPED**: has a working `live` link (the project is deployed and reachable).
- **IN_PROGRESS**: no live deployment, but has an active `source code` link and is not a finished one-off competition entry (`otonom-iha` - the TEKNOFEST 2026 UAV is this team's current, unfinished flagship build).
- **ARCHIVED**: closed competition entries with no ongoing link (`smart-cane`, `local-ai-assistant`... note `local-ai-assistant` and `zero-g-pharma` do have source links, so they are IN_PROGRESS/ARCHIVED by the same live-link rule below, not by category alone).

- [ ] **Step 1: Add the field to the type**

In `src/lib/types.ts`, extend `Project`:

```ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  tag: string;
  tagDetail: string;
  techPills: string[];
  links: { label: string; href: string; isPrimary: boolean }[];
  image?: string;
  featured: boolean;
  order: number;
  status: "SHIPPED" | "IN_PROGRESS" | "ARCHIVED";
  /** owner/repo for GitHub API stats lookup, e.g. "iWeslax83/prose". Omit if no public repo. */
  repo?: string;
}
```

- [ ] **Step 2: Add `status` and `repo` to every entry in `src/data/projects.ts`**

Apply this mapping (derived from each entry's existing `links` array - a `live` link means `SHIPPED`; a `source code`-only link means `IN_PROGRESS`; no links means `ARCHIVED`; `repo` is parsed straight from each existing `github.com/iWeslax83/...` URL already in the file):

| slug | status | repo |
|---|---|---|
| `otonom-iha` | `IN_PROGRESS` | *(omit - no public repo link exists)* |
| `prose` | `SHIPPED` | `iWeslax83/prose` |
| `blackbox` | `SHIPPED` | `iWeslax83/blackbox-agent-accountability` |
| `live-wildfire` | `SHIPPED` | `iWeslax83/live-wildfire` |
| `tofas-fen-webapp` | `SHIPPED` | `iWeslax83/tofas-fen-webapp` |
| `stratos-akademi` | `SHIPPED` | `iWeslax83/stratos-akademi` |
| `smart-cane` | `ARCHIVED` | *(omit - no repo link exists)* |
| `local-ai-assistant` | `IN_PROGRESS` | `iWeslax83/local-ai-assistant` |
| `zero-g-pharma` | `IN_PROGRESS` | `iWeslax83/zero-g-pharma-simulator` |
| `stratos-website` | `SHIPPED` | `iWeslax83/stratos-website` |
| `fpv-drone` | `ARCHIVED` | *(omit - no repo link exists)* |
| `vex-robotics` | `ARCHIVED` | *(omit - no repo link exists)* |
| `tmt-website` | `SHIPPED` | *(omit - no source-code link exists, only `live`)* |

Add `status: "..."` and (where present) `repo: "..."` as new fields to each corresponding object literal in `src/data/projects.ts`. Flag `otonom-iha`, `local-ai-assistant`, and `zero-g-pharma` to Emir for a quick sanity check after this task lands - "IN_PROGRESS" here is inferred from the data file alone, not confirmed against their actual current state.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors. If any project object is missing the now-required `status` field, TypeScript strict mode will fail the build here - fix the specific entry the error points to.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/data/projects.ts
git commit -m "feat(design): add real status and repo fields to project data"
```

---

### Task 6: Per-project GitHub stats (commit count + last commit date)

**Files:**
- Create: `src/lib/github-repo-stats.ts`
- Modify: `src/app/page.tsx` (fetch and pass down)
- Modify: `src/components/projects.tsx` (accept new prop)

**Interfaces:**
- Produces: `fetchRepoStats(repos: string[]): Promise<Record<string, { commitCount: number; lastCommitDate: string } | null>>` from `src/lib/github-repo-stats.ts`.
- Consumes: `Project.repo` from Task 5.
- Produces: `Projects` component now accepts a `repoStats: Record<string, { commitCount: number; lastCommitDate: string } | null>` prop, consumed by Task 7's hover readout.

- [ ] **Step 1: Write `github-repo-stats.ts`**

Reuses the same auth/revalidate pattern already established in `src/lib/github.ts`:

```ts
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REVALIDATE_SECONDS = 86400;

export interface RepoStats {
  commitCount: number;
  lastCommitDate: string; // ISO date, e.g. "2026-08-09"
}

async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res;
}

async function fetchOneRepoStats(repo: string): Promise<RepoStats | null> {
  try {
    const commitsRes = await githubFetch(
      `https://api.github.com/repos/${repo}/commits?per_page=1`
    );
    const linkHeader = commitsRes.headers.get("link");
    const commits = await commitsRes.json();
    const lastCommitDate: string = commits[0]?.commit?.author?.date?.slice(0, 10) ?? "";

    // GitHub exposes total commit count only via the Link header's "last"
    // page rel on a per_page=1 listing - parse it, falling back to 1 if the
    // repo has too few commits to paginate (no Link header at all).
    let commitCount = 1;
    if (linkHeader) {
      const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
      if (match) commitCount = parseInt(match[1], 10);
    }

    return { commitCount, lastCommitDate };
  } catch {
    return null;
  }
}

/**
 * Fetches real commit count + last-commit date per repo, in parallel.
 * Repos that fail (rate limit, 404, network) resolve to null - callers must
 * render "no data" rather than a fabricated number.
 */
export async function fetchRepoStats(
  repos: string[]
): Promise<Record<string, RepoStats | null>> {
  const results = await Promise.all(
    repos.map(async (repo) => [repo, await fetchOneRepoStats(repo)] as const)
  );
  return Object.fromEntries(results);
}
```

- [ ] **Step 2: Fetch stats in `page.tsx` and pass to `Projects`**

```tsx
import { fetchRepoStats } from "@/lib/github-repo-stats";
import { projects } from "@/data/projects";
```

```tsx
export default async function Home() {
  const githubStats = await fetchGitHubStats();
  const commits = getRecentCommits();
  const repoStats = await fetchRepoStats(
    projects.filter((p) => p.repo).map((p) => p.repo as string)
  );

  return (
    <>
      <CommitMotif commits={commits} />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Projects repoStats={repoStats} />
        ...
```

- [ ] **Step 3: Accept the prop in `projects.tsx`**

Change the component signature from `export default function Projects()` to:

```tsx
import { RepoStats } from "@/lib/github-repo-stats";
```

```tsx
export default function Projects({
  repoStats,
}: {
  repoStats: Record<string, RepoStats | null>;
}) {
```

(The prop is threaded through but not yet rendered - Task 7 consumes it in the hover readout.)

- [ ] **Step 4: Typecheck and build**

```bash
npx tsc --noEmit && npm run build
```

Expected: no type errors, build succeeds. Without a `GITHUB_TOKEN` env var set, `fetchRepoStats` will hit the unauthenticated API (60 req/hr) - confirm in the build log there's no unhandled rejection (the `try/catch` in `fetchOneRepoStats` must swallow failures per-repo, not crash the page).

- [ ] **Step 5: Commit**

```bash
git add src/lib/github-repo-stats.ts src/app/page.tsx src/components/projects.tsx
git commit -m "feat(design): fetch real per-project commit count and last-commit date"
```

---

### Task 7: Numbered catalog UI - status tags, hover readout, filter toggle

**Files:**
- Modify: `src/components/projects.tsx` (`WorkRow`, add `CatalogFilter`)
- Create: `src/components/ui/catalog-filter.tsx`

**Interfaces:**
- Consumes: `Project.status` (Task 5), `repoStats` prop (Task 6).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the filter toggle component**

```tsx
"use client";

import { useState } from "react";

const FILTERS = ["ALL", "SHIPPED", "IN_PROGRESS", "ARCHIVED"] as const;
export type CatalogFilterValue = (typeof FILTERS)[number];

const LABELS: Record<CatalogFilterValue, string> = {
  ALL: "ALL",
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

/**
 * Plain-text status filter, not a pill row - underline marks the active
 * value per the repo-wide no-pill-badge rule.
 */
export default function CatalogFilter({
  value,
  onChange,
}: {
  value: CatalogFilterValue;
  onChange: (value: CatalogFilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`link-draw pb-0.5 transition-colors ${
            value === f ? "text-accent" : "text-ink-3 hover:text-ink-2"
          }`}
          aria-pressed={value === f}
        >
          {LABELS[f]}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `WorkRow` in `projects.tsx`** to show the `#00X/0X` numbering format, a status tag, and a hover-revealed readout panel

Replace the existing `WorkRow` function (`src/components/projects.tsx:110-150`):

```tsx
const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

function StatusTag({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-rule px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-ink-3">
      <span
        className={`h-1.5 w-1.5 ${
          status === "SHIPPED" ? "bg-accent" : "bg-ink-3"
        }`}
        aria-hidden
      />
      {statusLabel[status]}
    </span>
  );
}

function WorkRow({
  project,
  index,
  total,
  stats,
}: {
  project: Project;
  index: number;
  total: number;
  stats: RepoStats | null;
}) {
  const primary = project.links.find((l) => l.isPrimary) ?? project.links[0];
  return (
    <motion.article
      variants={plateIn}
      className="row-sweep group relative grid md:grid-cols-[10rem_1fr] gap-x-8 border-t border-rule py-8 transition-colors"
    >
      <div className="flex flex-wrap md:flex-col items-baseline md:items-start gap-x-3 gap-y-1.5">
        <span className="font-display text-3xl md:text-4xl font-semibold text-ink-3 leading-none tabular-nums transition-colors group-hover:text-accent">
          #{String(index).padStart(3, "0")}/{String(total).padStart(2, "0")}
        </span>
        <span className="annotate md:mt-3">{project.tag}</span>
        <StatusTag status={project.status} />
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl md:text-[1.75rem] font-medium text-ink leading-tight tracking-[-0.01em] transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          {primary && (
            <a
              href={primary.href}
              target={primary.href.startsWith("http") ? "_blank" : undefined}
              rel={primary.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={`${project.title} - ${primary.label}`}
              className="mt-1 shrink-0 text-ink-3 transition-all duration-300 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              <ArrowUpRight size={20} />
            </a>
          )}
        </div>
        <p className="font-body text-sm text-ink-2 mt-2.5 leading-relaxed max-w-2xl">
          {project.description}
        </p>
        <SpecLine pills={project.techPills} />
        <Links links={project.links} />

        {stats && (
          <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-300 group-hover:max-h-12 group-hover:opacity-100">
            <p className="font-mono text-[11px] text-ink-3">
              {stats.commitCount} commits · last commit {stats.lastCommitDate}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}
```

Add the `RepoStats` import at the top of `projects.tsx`:

```tsx
import { RepoStats } from "@/lib/github-repo-stats";
```

- [ ] **Step 3: Wire the filter into the `Projects` component body**

Replace the `rest.map((project, i) => <WorkRow ... />)` block (`src/components/projects.tsx:171-174`) with filter state and the new call signature:

```tsx
"use client";
```
Add near the top of the file if not already a client component - `projects.tsx` already has `"use client"` on line 1, so this is already satisfied.

```tsx
import { useState } from "react";
import CatalogFilter, { CatalogFilterValue } from "./ui/catalog-filter";
```

Inside `export default function Projects({ repoStats })`, before the `return`:

```tsx
  const [filter, setFilter] = useState<CatalogFilterValue>("ALL");
  const visibleRest = rest.filter(
    (p) => filter === "ALL" || p.status === filter
  );
```

Replace the render block:

```tsx
        <div className="mt-6 mb-6">
          <CatalogFilter value={filter} onChange={setFilter} />
        </div>
        <div className="mt-2">
          {visibleRest.map((project, i) => (
            <WorkRow
              key={project.slug}
              project={project}
              index={i + 2}
              total={projects.length}
              stats={project.repo ? repoStats[project.repo] ?? null : null}
            />
          ))}
        </div>
```

- [ ] **Step 4: Typecheck and manually verify**

```bash
npx tsc --noEmit && npm run dev
```

Expected: catalog rows show `#002/13` style numbering, a bordered (not pill) status tag per row, and hovering a row reveals a commit-count/last-commit-date line beneath the links (real numbers, not "0 commits"/placeholder unless the GitHub API genuinely returned null for that repo, in which case no readout line renders at all - confirm this by hovering `otonom-iha`, which has no `repo` field and must show no readout line). Click each filter button and confirm the visible row set changes accordingly, and that `ALL` restores the full list.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects.tsx src/components/ui/catalog-filter.tsx
git commit -m "feat(design): numbered catalog rows with status tags, hover readout, and filter"
```

---

### Task 8: Rewrite DESIGN.md to document the new system

**Files:**
- Modify: `DESIGN.md` (full rewrite, same structure/sections as the current file)

**Interfaces:** none - documentation only.

- [ ] **Step 1: Update every section of `DESIGN.md`** that references retired Instrument-system specifics, replacing them with the new system's actual values (do this after Tasks 1-7 are merged, so the doc describes what was actually built, not aspirational values):
  - Section 1 (Visual Theme): replace "Instrument" framing with the neutral maximalist direction from spec section 1.
  - Section 2 (Color Palette): replace `#ff7a29` Signal Orange with `#39ff6a` terminal green (or whatever exact value passed the Task 1 Step 5 contrast check) throughout.
  - Section 3 (Typography): replace "Instrument Sans" with "Cabinet Grotesk" as the display font; note JetBrains Mono is retained.
  - Section 7 (Hero Spec): update the headline description to "ML · Embedded · Web" domain-first framing per Task 4.
  - Add a short new subsection under Component Stylings for the numbered catalog + status tag + hover readout pattern from Task 7.
  - Update the "Banned" list (currently bans "Space Grotesk" as a font choice) - Cabinet Grotesk is not on that list and needs no change there, but re-verify the anti-pattern list in section 8 still matches: no gradients/glassmorphism/purple (unchanged), no pill clouds (unchanged, now directly enforced by `StatusTag`).

- [ ] **Step 2: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): rewrite DESIGN.md for the maximalist headline system"
```

---

### Task 9: Full verification pass

**Files:** none modified - verification only.

- [ ] **Step 1: Typecheck and build clean**

```bash
npx tsc --noEmit && npm run build
```

Expected: both succeed with zero errors.

- [ ] **Step 2: Manual golden-path walkthrough**

```bash
npm run dev
```

Open the site and scroll hero → projects → stratos → skills → github → contact. Confirm:
- Section order is hero, projects, stratos, skills, github, contact (Task 3).
- Hero headline reads "ML · Embedded · Web" (Task 4).
- Faint real-commit-history texture is visible behind sections (Task 2).
- Accent color is green everywhere it previously was orange: CTA button, nav active state, status dots, link hovers (Task 1).
- Project catalog shows `#00X/0X` numbering, status tags, filter toggle, and hover readouts with real commit data (Tasks 5-7).
- No pill-shaped (`rounded-full`) badges anywhere on the page.
- No gradients, glass/blur panels, or purple/violet color anywhere.

- [ ] **Step 3: Mobile viewport check**

Resize the browser to 375px width (or use dev tools device toolbar). Confirm the hero headline, catalog rows, and filter toggle reflow without horizontal overflow, and the mobile nav (`mobile-nav.tsx`) shows the reordered/renumbered section list.

- [ ] **Step 4: `prefers-reduced-motion` check**

In Chrome DevTools, open the Rendering tab, set "Emulate CSS media feature prefers-reduced-motion: reduce", and reload. Confirm section reveals and the catalog hover readout still function but without spring/stagger movement (opacity-only or instant).

- [ ] **Step 5: No final commit needed for this task** - it is a verification gate. If any check in Steps 1-4 fails, return to the task that owns the failing piece, fix it there, and re-run that task's own verification before re-running this task's checklist.

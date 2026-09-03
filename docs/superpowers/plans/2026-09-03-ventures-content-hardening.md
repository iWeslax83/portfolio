# Ventures Content Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the site's data layer with `resume.tex` (Viyaro as a third founder venture, two missing shipped/in-progress projects, updated Stratos numbers), fix two real code/spec defects (dead `.gradient-border` CSS, `Telemetry.tsx`'s missing scene-mode overflow safeguard), and restructure the founder-story beat from Stratos-only to three ventures.

**Architecture:** Pure data + presentation change on the existing five-beat checkpoint system. No changes to the 3D flight-scene camera, `CheckpointId` type, or checkpoint anchors. `Origin.tsx` is renamed to `Ventures.tsx` and its content restructured; everything else is content edits to existing files plus two small defect fixes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, next-intl. No test framework is configured in this repo (`package.json` has no `test` script, no `.test.`/`.spec.` files exist) - verification is `npx tsc --noEmit` per task and a full `npm run build` + manual dev-server check (both scene and flat mode) at the end, matching this repo's existing convention (see `DESIGN.md` changelog entries, which describe manual dev-server visual verification as the standard check for every prior redesign pass).

**Spec:** `docs/superpowers/specs/2026-09-03-ventures-content-hardening-design.md`

## Global Constraints

- No new accent color, gradient call site, or pill shape beyond what `DESIGN.md` already documents as scoped exceptions (green/amber accents; gradient only at the flagship panel border and hero headline's second line, per `DESIGN.md` section 2; pills only on `StatusTag`/`CatalogFilter`).
- Do not invent numbers, URLs, or facts not present in `resume.tex`, the existing site data, or explicit user confirmation in this conversation. Masa Hesapları and DurAn ship with `links: []` (confirmed: no public URL exists). Viyaro ships with no `href` (confirmed: no public URL exists).
- `CheckpointId` type (`"liftoff" | "log" | "origin" | "telemetry" | "landing"`), the flight-scene camera route (`src/lib/flight-scene/route.ts`), and the `#founder-story` anchor id stay unchanged - only `Origin.tsx`'s rendered content and its file name change.
- Site stays English-only; no i18n structural changes.
- Icon-only links need `aria-label` (existing pattern: `` `${title} - ${label}` ``, see `Log.tsx`).
- No em dashes anywhere (commit messages, code comments, copy).

---

### Task 1: Sync `src/data/projects.ts` with `resume.tex`

**Files:**
- Modify: `src/data/projects.ts` (full content below)

**Interfaces:**
- Consumes: `Project` interface (unchanged, `src/lib/types.ts:1-15`), `STRATOS_URL` from `src/data/stratos.ts:18`.
- Produces: `projects` array (now 15 entries) and unchanged `featuredProjects`/`secondaryProjects` derived exports, consumed by `Log.tsx` and `Task 2`.

This task: enriches the flagship UAV project with resume facts and a `stratosiha.com` link, adds two projects present in `resume.tex` but missing from the site (`masa-hesaplari`, `duran`), lightly enriches two existing entries, and renumbers `order` so the two new entries slot in near the top of the secondary (non-featured) list, after the shipped/featured work and before the archived competition entries.

- [ ] **Step 1: Replace `src/data/projects.ts` in full**

```ts
import { Project } from "@/lib/types";
import { STRATOS_URL } from "@/data/stratos";

export const projects: Project[] = [
  {
    slug: "otonom-iha",
    title: "Autonomous Rotary-Wing Multicopter UAV",
    description:
      "Quadcopter built for the TEKNOFEST İnsansız Hava Araçları competition on a Pixhawk 6C / Raspberry Pi 5 / ArduPilot stack with OpenCV target detection. As Electronics & Software Captain I own flight-controller integration, the sensor stack, and autonomous mission planning. 19.76-minute hover endurance, 12 km autonomous range, and precision landing, with a TEKNOFEST rotorcraft final and a NASA Space Apps Turkey final in its first year. Covered by Anadolu Ajansı and Bursa Hakimiyet for public autonomous flight demonstrations.",
    tag: "competition",
    tagDetail: "TEKNOFEST 2026 · Rotary-Wing",
    techPills: [
      "embedded systems",
      "autonomous flight",
      "flight controller",
      "computer vision",
      "PCB design",
      "machine learning",
    ],
    links: [{ label: "stratosiha.com", href: STRATOS_URL, isPrimary: true }],
    image: "/images/uav.svg",
    featured: true,
    order: 1,
    status: "IN_PROGRESS",
  },
  {
    slug: "prose",
    title: "PROSE - Intent-First Programming",
    description:
      "Compiles one sentence of natural language into a typed, versioned agent task-graph, then executes it step by step with verify gates, retries, idempotency, and a live trace you can replay deterministically. The model only emits a step list; the engine owns ids, edges, typing, and the checksum, so a sloppy model cannot produce an invalid graph.",
    tag: "AI",
    tagDetail: "live · typed agent task-graphs",
    techPills: ["Next.js", "TypeScript", "Zod", "agent tooling"],
    links: [
      { label: "live", href: "https://prose-eight.vercel.app", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/prose",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 2,
    status: "SHIPPED",
    repo: "iWeslax83/prose",
  },
  {
    slug: "teluvane",
    title: "Teluvane - Agent Accountability",
    description:
      "Multi-tenant compliance auditing platform for AI agents: every LLM call, tool call, and tool result is SHA-256 hash-chained per session, then audited against EU AI Act, ISO 42001, NIST AI RMF, and SOC 2 policy packs by a LangGraph + Claude tribunal, with an MCP server, SDKs, and optional on-chain session anchoring.",
    tag: "AI",
    tagDetail: "live · multi-tenant + EU AI Act",
    techPills: ["LangGraph", "Claude", "FastAPI", "Postgres", "MCP"],
    links: [
      {
        label: "live",
        href: "https://teluvane.com",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/teluvane",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 3,
    status: "SHIPPED",
    repo: "iWeslax83/teluvane",
  },
  {
    slug: "live-wildfire",
    title: "Wildfire Spread Forecast Map",
    description:
      "Pulls real active fires from NASA FIRMS onto a world map. Click one and it takes that fire's wind, terrain slope, fuel cover, and humidity and animates where it spreads over the next 12 to 24 hours. The engine is a simplified Alexandridis (2008) cellular-automata model running in a Web Worker.",
    tag: "simulation",
    tagDetail: "live · GDG Çadırlı Hackathon",
    techPills: ["Next.js", "TypeScript", "MapLibre GL", "Web Worker", "NASA FIRMS"],
    links: [
      { label: "live", href: "https://live-wildfire.vercel.app", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/live-wildfire",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 4,
    status: "SHIPPED",
    repo: "iWeslax83/live-wildfire",
  },
  {
    slug: "tofas-fen-webapp",
    title: "Tofaş Fen Webapp",
    description:
      "Production school-management platform. 22 MongoDB models, 6 user roles, JWT + 2FA auth, GraphQL, WebSocket realtime, and a Kubernetes deployment.",
    tag: "full-stack",
    tagDetail: "live · React 19 + K8s",
    techPills: ["React 19", "Express", "MongoDB", "GraphQL", "K8s"],
    links: [
      {
        label: "live",
        href: "https://tofas-fen-webapp.vercel.app",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/tofas-fen-webapp",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 5,
    status: "SHIPPED",
    repo: "iWeslax83/tofas-fen-webapp",
  },
  {
    slug: "stratos-akademi",
    title: "Stratos Akademi",
    description:
      "Video training platform I built for my own UAV club. Curriculum tree, anti-skip video completion, server-scored quizzes, practical task review with captain feedback, leaderboard, and printable certificates. A cron job proposes new lessons from YouTube; a human always makes the call.",
    tag: "full-stack",
    tagDetail: "live · Next.js 16 + Supabase",
    techPills: ["Next.js 16", "Supabase", "Postgres RLS", "Server Actions", "Vitest"],
    links: [
      {
        label: "live",
        href: "https://stratos-akademi.vercel.app",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/stratos-akademi",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 6,
    status: "SHIPPED",
    repo: "iWeslax83/stratos-akademi",
  },
  {
    slug: "masa-hesaplari",
    title: "Masa Hesapları",
    description:
      "QR-code table-ordering and bill-splitting web app for restaurants. The customer scans the table QR, browses a localized menu, orders, and splits the check by item, evenly, or in full. A 12-table Postgres schema (Drizzle ORM on Neon) covers table sessions, orders, split-payment item locks, and waiter calls, with role-based panels for admin, waiter, and kitchen. Live order status streams to the customer over server-sent events; card payments run through iyzico alongside fast-IBAN and cash flows. Turkish/English i18n via a locale cookie keeps printed QR links valid across languages, with allergen/diet filtering over 7 fixed tags, JWT auth, and a daily cron that flags unpaid tables.",
    tag: "full-stack",
    tagDetail: "2026 · Next.js 16 + Neon",
    techPills: ["Next.js 16", "React 19", "Drizzle ORM", "Neon Postgres", "TypeScript"],
    links: [],
    featured: false,
    order: 7,
    status: "SHIPPED",
  },
  {
    slug: "duran",
    title: "DurAn",
    description:
      "TEKNOFEST finalist (Bağımlılıklarla Mücadelede Teknolojik Uygulamalar Yarışması), built as team captain of Stratos Root. A two-part early-warning system for gambling relapse: an ESP32S3 wristband (MAX30102 PPG, GSR, MPU6050, DS18B20) fused on-device with a React Native app's behavioral signal to detect craving spikes inside a 3-minute window. Fully on-device, no server, no stored raw data, only event timestamps persisted. 94% detection accuracy against simulated relapse events, 14 passing unit tests across the physiological and behavioral pipelines, behind a three-tier escalating intervention flow (nudge, pause screen, breathing exercise + YEDAM hotline).",
    tag: "AI",
    tagDetail: "TEKNOFEST Finalist · ESP32S3 + React Native",
    techPills: ["React Native", "TypeScript", "ESP32S3", "Bluetooth LE"],
    links: [],
    featured: false,
    order: 8,
    status: "IN_PROGRESS",
  },
  {
    slug: "smart-cane",
    title: "Smart Cane Assistant",
    description:
      "Mount a phone on a white cane and it runs MediaPipe object detection on-device, announcing obstacles at head and chest height in Turkish with a proximity beep. The cane finds what is near the ground; this covers what it misses. No camera frame leaves the phone.",
    tag: "AI",
    tagDetail: "GDG Hackathon Bursa 2026",
    techPills: ["MediaPipe", "React 19", "Vite PWA", "on-device inference"],
    links: [],
    featured: false,
    order: 9,
    status: "ARCHIVED",
  },
  {
    slug: "local-ai-assistant",
    title: "Local AI Assistant",
    description:
      'WhatsApp-based "Jarvis" running Llama 3.1 8B locally on an RTX 3060 Ti - task management, calendar, habit tracking, expense tracking, and a mood journal, all on-device. Under 800ms average response latency, used daily for over 6 months.',
    tag: "AI",
    tagDetail: "Llama 3.1 8B · on-device",
    techPills: ["Python", "FastAPI", "Ollama"],
    links: [
      {
        label: "source code",
        href: "https://github.com/iWeslax83/local-ai-assistant",
        isPrimary: true,
      },
    ],
    featured: false,
    order: 10,
    status: "IN_PROGRESS",
    repo: "iWeslax83/local-ai-assistant",
  },
  {
    slug: "zero-g-pharma",
    title: "Zero-G Pharma",
    description:
      "Drug-crystal growth simulator comparing microgravity vs Earth gravity. Winner, Türkiye - NASA Space Apps Challenge 2025, advancing to the global top 50 of 6,000+ teams.",
    tag: "simulation",
    tagDetail: "Winner TR · NASA Space Apps 2025",
    techPills: ["Python", "VPython"],
    links: [
      {
        label: "source code",
        href: "https://github.com/iWeslax83/zero-g-pharma-simulator",
        isPrimary: true,
      },
    ],
    featured: false,
    order: 11,
    status: "IN_PROGRESS",
    repo: "iWeslax83/zero-g-pharma-simulator",
  },
  {
    slug: "stratos-website",
    title: "STRATOS İHA - Website",
    description:
      "Official site for STRATOS İHA, the TEKNOFEST UAV community I founded. Team showcase, departments, and project pages.",
    tag: "web",
    tagDetail: "live · stratosiha.com",
    techPills: ["Next.js", "TypeScript", "Tailwind"],
    links: [
      { label: "live", href: "https://www.stratosiha.com", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/stratos-website",
        isPrimary: false,
      },
    ],
    featured: false,
    order: 12,
    status: "SHIPPED",
    repo: "iWeslax83/stratos-website",
  },
  {
    slug: "fpv-drone",
    title: "FPV Drone",
    description: "FPV UAV for the MEB Robot competition with real-time video transmission.",
    tag: "competition",
    tagDetail: "MEB Robot · FPV racing",
    techPills: ["FPV", "electronics"],
    links: [],
    featured: false,
    order: 13,
    status: "ARCHIVED",
  },
  {
    slug: "vex-robotics",
    title: "VEX Robotics",
    description: "Competition robot with custom mechanical design and sensor integration.",
    tag: "competition",
    tagDetail: "V5 Pushback",
    techPills: ["VEX V5", "sensors"],
    links: [],
    featured: false,
    order: 14,
    status: "ARCHIVED",
  },
  {
    slug: "tmt-website",
    title: "TMT Website",
    description: "Official website for TMT - team showcase and project pages.",
    tag: "web",
    tagDetail: "Next.js · Team showcase",
    techPills: ["Next.js", "Tailwind"],
    links: [{ label: "live", href: "https://tfltmt-website.vercel.app", isPrimary: true }],
    featured: false,
    order: 15,
    status: "SHIPPED",
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);
export const secondaryProjects = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat(data): sync projects with resume, add Masa Hesaplari and DurAn"
```

---

### Task 2: Wire the flagship `.gradient-border` treatment onto `Log.tsx`

**Files:**
- Modify: `src/components/checkpoints/Log.tsx:89`

**Interfaces:**
- Consumes: `.gradient-border` CSS class (already defined, `src/app/globals.css:189-194`, unmodified by this task), `flagship` variable (already destructured, `Log.tsx:68`).
- Produces: no new exports.

`DESIGN.md` documents this as shipped ("The flagship row carries the gradient border") and the CSS class already exists, but `Log.tsx`'s article element never applies it - the flagship row today renders identically to every other row. Fix the drift: apply the class conditionally, and give the row real padding since `.gradient-border` draws a full box border (all four sides) rather than the plain `border-t` every other row uses, so content needs breathing room inside it.

- [ ] **Step 1: Apply the conditional class**

In `src/components/checkpoints/Log.tsx`, replace the article's className (currently line 89):

```tsx
              <article key={project.slug} className="relative grid gap-x-8 border-t border-rule py-8">
```

with:

```tsx
              <article
                key={project.slug}
                className={`relative grid gap-x-8 py-8 ${
                  project.slug === flagship.slug
                    ? "gradient-border px-6 md:px-8"
                    : "border-t border-rule"
                }`}
              >
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Visual verification**

Run `npm run dev`, open the site, scroll to the Flight Log section (flat mode - use a browser with reduced-motion or resize below the WebGL breakpoint if needed to force flat mode, or just check flat mode via the fallback path). Confirm:
- The flagship row (`#001`, Autonomous Rotary-Wing Multicopter UAV) shows a visible green-to-amber gradient border around its full perimeter, not just a top rule.
- Every other row still shows the plain top hairline rule, unchanged.
- The flagship row's text has visible left/right padding and doesn't touch the border.

If the padding looks off at any breakpoint, adjust `px-6 md:px-8` to taste - this is the one visual-judgment call in this task, everything else is mechanical.

- [ ] **Step 4: Commit**

```bash
git add src/components/checkpoints/Log.tsx
git commit -m "fix(design): apply documented gradient border to flagship catalogue row"
```

---

### Task 3: Fix `PRODUCT.md` and add Viyaro

**Files:**
- Modify: `PRODUCT.md`

**Interfaces:** None (documentation only, no code consumes this file).

Fixes an internal contradiction (Teluvane listed as a "hardware venture" in Product Purpose while Evidence on Hand explicitly says it has no hardware component), adds Viyaro as the third founder venture, and updates the Stratos team size from 7 to 25 per `resume.tex`.

- [ ] **Step 1: Fix "Users" section to include Viyaro**

Replace (line 14):

```
- Investors and prospective co-founders evaluating Stratos UAV and Teluvane.
```

with:

```
- Investors and prospective co-founders evaluating Stratos UAV, Teluvane, and Viyaro.
```

- [ ] **Step 2: Fix "Product Purpose" contradiction**

Replace (lines 19-23):

```
A personal portfolio for Emir Sakarya that makes his range legible in one
sitting: founder of hardware ventures (Stratos UAV, Teluvane) and a working
full-stack/AI engineer, backed by real, checkable evidence rather than
narrative alone. Success is a visitor (recruiter, investor, or peer) coming
away able to verify what was built, not just told a story.
```

with:

```
A personal portfolio for Emir Sakarya that makes his range legible in one
sitting: founder of three ventures (Stratos UAV, Teluvane, Viyaro) spanning
hardware, AI software, and autonomous mobility, and a working full-stack/AI
engineer, backed by real, checkable evidence rather than narrative alone.
Success is a visitor (recruiter, investor, or peer) coming away able to
verify what was built, not just told a story.
```

- [ ] **Step 3: Update "Operating Context" team size and add Viyaro**

Replace (lines 35-38):

```
- Founder & Head of Electronics/Software at STRATOS İHA (TEKNOFEST UAV
  community, Bursa, Türkiye), still a student (class of 2028).
- Runs Teluvane (AI-agent compliance auditing SaaS) as a separate founder
  venture; pre-revenue, no confirmed paying customers yet.
```

with:

```
- Founder & Chief Engineer at STRATOS İHA (TEKNOFEST UAV community, Bursa,
  Türkiye), leading a 25-person engineering org, still a student (class of
  2028).
- Runs Teluvane (AI-agent compliance auditing SaaS) as a separate founder
  venture; pre-revenue, no confirmed paying customers yet.
- Founded and leads Viyaro, an autonomous mobility venture funded by BOSİAD,
  now in daily production use across 10+ companies with 50,000+ rides logged.
```

- [ ] **Step 4: Update "Brand Commitments" to name Viyaro**

Replace (lines 55-57):

```
- Name: Emir Sakarya. GitHub: iWeslax83. STRATOS İHA is his founded UAV
  community/company (stratosiha.com). Teluvane is his AI-compliance startup
  (teluvane.com).
```

with:

```
- Name: Emir Sakarya. GitHub: iWeslax83. STRATOS İHA is his founded UAV
  community/company (stratosiha.com). Teluvane is his AI-compliance startup
  (teluvane.com). Viyaro is his autonomous mobility venture (no public site
  yet).
```

- [ ] **Step 5: Add Viyaro to "Evidence on Hand"**

After the existing Teluvane bullet (after line 73, before the "No confirmed Teluvane customers" bullet), insert:

```
- Viyaro: autonomous mobility venture, funded by BOSİAD (Bursa Organize
  Sanayi Bölgesi Sanayicileri ve İş İnsanları Derneği), in daily production
  use across 10+ companies, 50,000+ rides logged to date. No public URL
  exists yet - do not add a placeholder link on the site.
```

- [ ] **Step 6: Commit**

```bash
git add PRODUCT.md
git commit -m "docs(product): fix hardware/software contradiction, add Viyaro, update team size"
```

---

### Task 4: Create `src/data/ventures.ts`

**Files:**
- Create: `src/data/ventures.ts`

**Interfaces:**
- Consumes: `STRATOS_URL` from `src/data/stratos.ts:18`.
- Produces: `Venture` interface and `ventures` array, consumed by `Task 6` (`Ventures.tsx`).

Site content for project/venture facts is already stored as plain English strings in data files rather than i18n keys (see `src/data/projects.ts` - titles/descriptions aren't translated, the site is English-only per `PRODUCT.md`). This file follows the same convention.

- [ ] **Step 1: Write the file**

```ts
import { STRATOS_URL } from "@/data/stratos";

export interface Venture {
  name: string;
  role: string;
  proof: string;
  href?: string;
}

export const ventures: Venture[] = [
  {
    name: "STRATOS İHA",
    role: "Founder & Chief Engineer",
    proof:
      "25-person engineering org · TEKNOFEST rotorcraft finalist · NASA Space Apps Turkey finalist",
    href: STRATOS_URL,
  },
  {
    name: "Teluvane",
    role: "Founder",
    proof:
      "Multi-tenant AI-agent compliance platform · hash-chained audit trail · EU AI Act / ISO 42001 / NIST AI RMF / SOC 2",
    href: "https://teluvane.com",
  },
  {
    name: "Viyaro",
    role: "Founder & CEO",
    proof: "Autonomous mobility · BOSİAD-funded · 50,000+ rides across 10+ companies in production",
  },
];
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/ventures.ts
git commit -m "feat(data): add ventures data file for Stratos, Teluvane, Viyaro"
```

---

### Task 5: Update `src/messages/en.json`

**Files:**
- Modify: `src/messages/en.json`

**Interfaces:**
- Consumes: none.
- Produces: `nav.founderStory` (rendered by `Nav.tsx:109` via `t(item.key)`), `ventures.kicker`/`ventures.title`/`ventures.unitsLabel` (consumed by `Task 6`'s `Ventures.tsx` via `useTranslations("ventures")`).

Renames the `stratos` i18n namespace to `ventures` and drops the keys that no longer apply (`roleBadge`, `body`, `departments`, `members`, `founded`, `visit` - all replaced by plain-string venture data in `Task 4`, following the same pattern `projects.ts` already uses). Updates the nav label so it no longer reads "stratos" for a section that now covers three ventures.

- [ ] **Step 1: Update the nav label**

Replace (line 5):

```json
    "founderStory": "stratos",
```

with:

```json
    "founderStory": "ventures",
```

- [ ] **Step 2: Replace the `stratos` section with `ventures`**

Replace the entire `stratos` block (lines 24-34):

```json
  "stratos": {
    "title": "STRATOS İHA",
    "kicker": "TEKNOFEST UAV community",
    "roleBadge": "Founder · Head of Electronics & Software",
    "body": "I founded STRATOS İHA at Tofaş Fen Lisesi and lead Electronics & Software across three programs: an autonomous quadrotor, an FPV racer, and a VEX robotics platform. Four departments, seven core members, one flight line.",
    "departments": "departments",
    "members": "core members",
    "founded": "established",
    "unitsLabel": "what we build",
    "visit": "stratosiha.com"
  },
```

with:

```json
  "ventures": {
    "title": "What I've Built",
    "kicker": "founder ventures",
    "unitsLabel": "what we build"
  },
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (this won't catch missing i18n keys at compile time since next-intl keys are string-typed, not statically checked in this project - `Task 6`'s dev-server check is what verifies these render correctly).

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json
git commit -m "feat(i18n): rename stratos namespace to ventures, update nav label"
```

---

### Task 6: Restructure `Origin.tsx` into `Ventures.tsx`

**Files:**
- Create: `src/components/checkpoints/Ventures.tsx` (new content, see below)
- Delete: `src/components/checkpoints/Origin.tsx`
- Modify: `src/components/flight-scene/FlightSceneRoot.tsx:9,67,97`

**Interfaces:**
- Consumes: `ventures` from `Task 4`, `stratosUnits` from `src/data/stratos.ts:3-16` (unchanged), `useTranslations("ventures")` keys from `Task 5`.
- Produces: `Ventures` default export with the same props signature as `Origin` had (`{ visible: boolean; mode: "scene" | "flat" }`), so `FlightSceneRoot.tsx`'s call sites need only an import/name change, not a props change.

Replaces the Stratos-only content (role badge, body paragraph, 3-stat `dl`, `stratosUnits` list) with a three-row Ventures list in the site's existing bordered-row idiom (mono index, `border-b`, name + proof line) - not cards. The Stratos row additionally nests its `stratosUnits` sub-list underneath, since it's the only venture with sub-programs.

- [ ] **Step 1: Create `src/components/checkpoints/Ventures.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { ventures } from "@/data/ventures";
import { stratosUnits } from "@/data/stratos";
import CheckpointShell from "./CheckpointShell";
import DroneSchematic from "@/components/ui/drone-schematic";

export default function Ventures({ visible, mode }: { visible: boolean; mode: "scene" | "flat" }) {
  const t = useTranslations("ventures");

  return (
    <CheckpointShell visible={visible} mode={mode}>
      <div>
        <SectionHeader kicker={t("kicker")} title={t("title")} />
        <ul>
          {ventures.map((venture, i) => (
            <li key={venture.name} className="border-b border-rule py-6">
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-5 items-baseline">
                <span className="font-mono text-xs text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-medium text-ink">{venture.name}</h3>
                    <span className="annotate">{venture.role}</span>
                  </div>
                  <p className="font-mono text-[11px] text-ink-3 mt-2 leading-relaxed">
                    {venture.proof}
                  </p>
                </div>
                {venture.href && (
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${venture.name} - visit site`}
                    className="text-ink-3 hover:text-accent transition-colors"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>

              {venture.name === "STRATOS İHA" && (
                <div className="mt-5 ml-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="annotate">{t("unitsLabel")}</span>
                    <span className="h-px flex-1 bg-rule" />
                  </div>
                  <ul>
                    {stratosUnits.map((unit, ui) => (
                      <li
                        key={unit.name}
                        className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline border-t border-rule py-3 first:border-t-0"
                      >
                        <span className="font-mono text-[11px] text-ink-3 tabular-nums">
                          {String(ui + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-medium text-ink">{unit.name}</h4>
                          <p className="font-mono text-[11px] text-ink-3 mt-1 leading-relaxed">
                            {unit.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {mode === "flat" && (
          <figure className="relative mt-12 lg:mt-16 max-w-sm">
            <div className="relative border border-rule p-8 md:p-10">
              <DroneSchematic progress={1} />
            </div>
          </figure>
        )}
      </div>
    </CheckpointShell>
  );
}
```

- [ ] **Step 2: Delete the old file**

```bash
git rm src/components/checkpoints/Origin.tsx
```

- [ ] **Step 3: Update `FlightSceneRoot.tsx`'s import**

Replace (line 9):

```tsx
import Origin from "@/components/checkpoints/Origin";
```

with:

```tsx
import Ventures from "@/components/checkpoints/Ventures";
```

- [ ] **Step 4: Update the flat-mode call site**

Replace (line 67):

```tsx
          <Origin visible mode="flat" />
```

with:

```tsx
          <Ventures visible mode="flat" />
```

- [ ] **Step 5: Update the scene-mode call site**

Replace (line 97):

```tsx
        <Origin visible={activeId === "origin"} mode="scene" />
```

with:

```tsx
        <Ventures visible={activeId === "origin"} mode="scene" />
```

Note: `activeId === "origin"` stays unchanged - the `CheckpointId` value `"origin"` is an internal identifier for the camera route, not renamed by this task (see Global Constraints).

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Visual verification**

Run `npm run dev`, scroll to the Ventures beat (`#founder-story` anchor, third section) in both flat and scene mode. Confirm:
- Three bordered rows render: STRATOS İHA, Teluvane, Viyaro, each with a mono index, name, role, and proof line.
- STRATOS İHA and Teluvane show an external-link icon that opens their site in a new tab; Viyaro shows no icon (no `href`).
- The STRATOS İHA row shows its three nested programs (Autonomous Quadrotor, FPV Racing Drone, VEX Robotics) beneath its proof line, under a small "what we build" label.
- Nothing resembles a three-card grid - it reads as a vertical numbered list, matching the Flight Log catalogue's visual language.
- In scene mode, the whole section fits within its fixed viewport at a typical laptop height without visibly clipping (three short rows plus one small nested list should be well within budget, but confirm).
- On a narrow (mobile-width) viewport, the nested Stratos sub-list still reads as a simple stacked list, not a squeezed multi-column layout.

- [ ] **Step 8: Commit**

```bash
git add src/components/checkpoints/Ventures.tsx src/components/flight-scene/FlightSceneRoot.tsx
git commit -m "feat(design): restructure founder-story beat into three-venture list"
```

---

### Task 7: Scene-mode overflow safeguard for `Telemetry.tsx`'s skills matrix

**Files:**
- Modify: `src/components/checkpoints/Telemetry.tsx:107-129`

**Interfaces:** None (internal component logic only).

Scene-mode `CheckpointShell` panels are `fixed inset-0`, capped at `max-h-[85vh]`, `overflow-hidden`, by design (page scroll drives the 3D camera, so no internal scroll is possible - see `DESIGN.md` section 5). `Log.tsx` already handles this by capping its rendered list to 4 rows in scene mode (`Log.tsx:76`). `Telemetry.tsx` has no equivalent safeguard despite rendering 3 stat tiles + 2 chart panels + a full skills matrix (24 items across 4 categories) - it risks silent clipping on shorter viewports. This mirrors `Log.tsx`'s truncation pattern: cap items per category in scene mode, with a "+N more" annotation; flat mode stays untruncated.

- [ ] **Step 1: Add per-category truncation**

In `src/components/checkpoints/Telemetry.tsx`, inside the `skills.map((category) => ...)` block (currently lines 110-128), replace:

```tsx
            {skills.map((category) => (
              <div key={category.key} className="border-t border-rule first:border-t-0 py-4">
                <div className="flex items-baseline gap-3 mb-2.5">
                  <span className="font-mono text-[11px] text-accent tabular-nums">
                    {String(category.items.length).padStart(2, "0")}
                  </span>
                  <h4 className="font-display text-base font-medium text-ink">
                    {categoryLabels[category.key] ?? category.key}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {category.items.map((item) => (
                    <span key={item} className="font-mono text-xs text-ink-2 border border-rule px-2 py-0.5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
```

with:

```tsx
            {skills.map((category) => {
              const displayedItems = mode === "scene" ? category.items.slice(0, 4) : category.items;
              const hiddenCount = category.items.length - displayedItems.length;
              return (
                <div key={category.key} className="border-t border-rule first:border-t-0 py-4">
                  <div className="flex items-baseline gap-3 mb-2.5">
                    <span className="font-mono text-[11px] text-accent tabular-nums">
                      {String(category.items.length).padStart(2, "0")}
                    </span>
                    <h4 className="font-display text-base font-medium text-ink">
                      {categoryLabels[category.key] ?? category.key}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {displayedItems.map((item) => (
                      <span key={item} className="font-mono text-xs text-ink-2 border border-rule px-2 py-0.5">
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Visual verification**

Run `npm run dev`, scroll to the Telemetry beat in scene mode at a typical laptop viewport height (e.g. 1440x900). Confirm:
- Each skill category shows at most 4 items plus a "+N more" annotation where it has more than 4 (backend has 8 items, so it should show 4 + "+4 more"; frontend has 5, showing 4 + "+1 more"; ai_embedded has 6, showing 4 + "+2 more"; devops has 5, showing 4 + "+1 more").
- The whole Telemetry panel (3 stat tiles + 2 charts + skills matrix + link row) fits within the viewport without visible clipping.
- Switch to flat mode (or resize to force the fallback path) and confirm all skill categories show their full, untruncated item list with no "+N more" text.

- [ ] **Step 4: Commit**

```bash
git add src/components/checkpoints/Telemetry.tsx
git commit -m "fix(design): cap Telemetry skills matrix in scene mode to prevent overflow"
```

---

### Task 8: Final verification pass

**Files:** None modified - verification only.

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no errors. This also exercises the server-side `fetchGitHubStats`/`fetchRepoStats`/`getRecentCommits` calls in `src/app/page.tsx` against the now-15-entry `projects` array.

- [ ] **Step 3: Full golden-path manual check**

Run `npm run dev`, open the site fresh. Verify, at both a desktop width (~1440px) and a mobile width (~390px), and in both scene mode (WebGL) and flat mode (force the fallback - e.g. via `prefers-reduced-motion` or by triggering the `onFallback` path):

- Hero → Flight Log → Ventures → Telemetry → Contact, full scroll, no visual breakage.
- Flight Log: flagship row (`#001`) shows the gradient border, the enriched description, and a working `stratosiha.com` link; Masa Hesapları and DurAn appear in the catalogue with no dead link affordance.
- Ventures: three rows (Stratos/Teluvane/Viyaro), Stratos nests its three programs, Viyaro has no link icon.
- Telemetry: skills matrix truncates with "+N more" in scene mode only, full list in flat mode; no clipping at typical viewport heights.
- Nav: desktop nav shows "ventures" (not "stratos") as the third section's label.
- No gradient, pill, or `accent-2` usage appears anywhere outside the sites already named in `DESIGN.md` (flagship border, hero headline second line, `StatusTag`, `CatalogFilter`).

- [ ] **Step 4: Six-rule polish audit on the touched surfaces**

Re-check the new Ventures rows (Task 6), the updated flagship Log row (Task 2), and Telemetry's truncated skills tile (Task 7) against:
- No gradient outside the two named call sites (flagship border, hero headline second line). No pill (`rounded-full`) chrome outside `StatusTag`/`CatalogFilter`. No purple. No glassmorphism/blur.
- Plain, concrete copy - no hype words, no invented numbers.
- No three-card-row pattern - the Ventures list reads as bordered rows, not cards.
- Typography rhythm consistent with neighboring sections (same `font-display`/`font-mono` pairing, same spacing scale).
- No decorative cruft added (no new icons, no unused animation).
- Motion: only existing vocabulary used (`plateIn`, `staggerContainer`, row hover, `readoutSettle`) - confirm no new animation mechanic was introduced in Tasks 2, 6, or 7 (none should have been - re-check the diffs if unsure).

Fix anything found inline before closing this task.

- [ ] **Step 5: Update `DESIGN.md` if the Ventures restructure changed anything it documents**

`DESIGN.md` section 5 ("Component Stylings") doesn't currently describe the founder-story beat's internal structure in detail beyond the flagship/catalogue rules already covered, so no change is expected here - but re-read `DESIGN.md`'s Section 5 and Section 4 (`Origin.tsx` references) before closing this task, and update any stale file-path or component-name references (`Origin.tsx` → `Ventures.tsx`) if found.

- [ ] **Step 6: Stop the dev server**

If a background dev server process is still running from this session's verification steps, stop it.

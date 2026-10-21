# Portfolio Features (i18n, detail pages, OG, JSON-LD, CV, notes, sitemap) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Turkish locale under `/tr`, per-project detail pages with their own OG images and JSON-LD, a downloadable CV, a notes section (one unpublished draft), and a sitemap dated from git.

**Architecture:** Every route moves under `src/app/[locale]/` with next-intl `localePrefix: "as-needed"`, so English URLs stay exactly as they are and Turkish lives at `/tr/...`. Turkish copy is `src/messages/tr.json` plus per-slug override files for the data in `src/data/`; server pages localize data and pass it to client components as props. Everything new (detail pages, notes) is statically generated per locale.

**Tech Stack:** Next.js 16 App Router, next-intl 4, Tailwind 4, GSAP, vitest, `@next/mdx` (new), pdflatex (local only).

**Spec:** No separate spec file. Decisions taken with Emir on 2026-10-20 (feature list items 1, 2, 3, 7, 8, 9, 10; item 4 press and item 6 Viyaro proof are excluded; item 5 screenshots dropped because no image-less project has a non-GitHub live URL):
- Turkish URLs use a `/tr` prefix; English URLs unchanged.
- Notes: build the infrastructure plus one draft post grounded in the real PROSE repo code, `draft: true`, never published in production until Emir approves.
- One commit per task, no push.

## Global Constraints

- Never write an em dash (U+2014) anywhere: code, comments, copy, commit messages. Use a hyphen, comma, colon or parentheses.
- Design system in `DESIGN.md` and the global design rules win: black frame, white sheet, no accent color, no gradients, no glass, no purple, no `rounded-full` status pills, no decorative icons, no emoji.
- Copy: plain and concrete; banned words "empower", "unleash", "revolutionize", "supercharge". Keep founder framing (see `PRODUCT.md`).
- Facts only from `src/data/*.ts`, `src/messages/en.json`, `PRODUCT.md`, `resume.tex`. Never add Teluvane hardware claims. DurAn and Masa Hesaplari get no placeholder links.
- Commits: no `Co-Authored-By` or any AI attribution, no claude.ai links. Conventional prefixes (`feat:`, `fix:`, `chore:`) as in `git log`.
- Playwright, if used for checks: `chromium.launch()` only.
- `npm test`, `npm run lint` and `npm run build` must pass at the end of every task.
- Next.js 16 names the middleware file `src/proxy.ts` (not `middleware.ts`). Check next-intl 4 setup against current docs (context7 `next-intl`, "App Router with i18n routing") before writing it.

## Review Focus

1. Existing English URLs (`/`, `/projects`, `/projects?status=shipped`, `/#about`) must render as before with no redirect to `/en`. Test in Task 1 (`localizedPath`) and a build-output check.
2. In-page anchor links on `/tr` (`/tr#about`) must smooth-scroll like `/#about` does on `/`. `hashTargetId` gets a locale-home test in Task 1.
3. Switching language on a deep page (`/projects/prose`) lands on the same page in the other locale (`/tr/projects/prose`), not the home page. `switchLocalePath` test in Task 1.
4. Unknown slug (`/projects/nope`, `/tr/projects/nope`, `/notes/nope`) renders the site 404, not a crash. `dynamicParams = false` plus a curl check in Tasks 3 and 7.
5. A draft note is unreachable in a production build: not in `/notes`, not in the sitemap, not in nav, its URL 404s. `publishedNotes` test in Task 7, curl check in Task 7, sitemap test in Task 8.

---

### Task 1: Locale routing foundation (`/tr` prefix)

**Files:**
- Move: everything in `src/app/` except `robots.ts`, `sitemap.ts`, `icon.tsx`, `fonts/`, `globals.css` into `src/app/[locale]/` (`layout.tsx`, `page.tsx`, `not-found.tsx`, `opengraph-image.tsx`, `projects/`)
- Create: `src/proxy.ts`, `src/app/[locale]/[...rest]/page.tsx` (calls `notFound()`), root `src/app/not-found.tsx` only if next-intl docs require it
- Create: `src/lib/locale-path.ts`, `src/lib/locale-path.test.ts`
- Create: `src/components/ui/locale-switch.tsx`
- Modify: `i18n/routing.ts`, `i18n/request.ts`, `src/lib/anchor.ts` (+ test), `src/components/site-header.tsx`, `src/components/mobile-nav.tsx`, `src/components/footer.tsx`, `src/components/smooth-scroll.tsx`, `src/data/nav-items.ts`
- Create: `src/messages/tr.json` as a copy of `en.json` for now (Task 2 translates it)

**Interfaces:**
- Produces: `export type Locale = (typeof routing.locales)[number]` exported from `i18n/routing.ts`; `routing = defineRouting({ locales: ["en", "tr"], defaultLocale: "en", localePrefix: "as-needed", localeDetection: false })`.
- Produces in `src/lib/locale-path.ts`:
  - `localizedPath(locale: Locale, href: string): string` (prefixes site-internal paths for `tr`; leaves `en`, external, `mailto:` and bare `#x` untouched)
  - `switchLocalePath(pathname: string, to: Locale): string` (pathname as the browser shows it, with or without `/tr`)
  - `stripLocale(pathname: string): string` (`/tr/projects` to `/projects`, `/tr` to `/`)
- Produces: `hashTargetId(href, pathname)` treats `/tr` as a home page too.
- Every `[locale]` page and layout calls `setRequestLocale(locale)` and the layout exports `generateStaticParams()` returning both locales, so pages stay static. `<html lang={locale}>`.
- Layout `generateMetadata` sets `alternates.languages` (`en`, `tr`, `x-default`) for the current path.

`localeDetection: false` is deliberate: visitors are never auto-redirected by Accept-Language, so shared English links always open in English.

- [ ] **Step 1: Write failing tests** in `src/lib/locale-path.test.ts`:

```ts
expect(localizedPath("en", "/#about")).toBe("/#about");
expect(localizedPath("tr", "/#about")).toBe("/tr#about");
expect(localizedPath("tr", "/")).toBe("/tr");
expect(localizedPath("tr", "/projects#ventures")).toBe("/tr/projects#ventures");
expect(localizedPath("tr", "https://github.com/iWeslax83")).toBe("https://github.com/iWeslax83");
expect(localizedPath("tr", "mailto:a@b.c")).toBe("mailto:a@b.c");
expect(localizedPath("tr", "/resume.pdf")).toBe("/resume.pdf"); // static files never prefixed
expect(switchLocalePath("/projects/prose", "tr")).toBe("/tr/projects/prose");
expect(switchLocalePath("/tr/projects/prose", "en")).toBe("/projects/prose");
expect(switchLocalePath("/tr", "en")).toBe("/");
expect(switchLocalePath("/", "tr")).toBe("/tr");
expect(stripLocale("/tr/projects")).toBe("/projects");
expect(stripLocale("/trivia")).toBe("/trivia"); // not a locale segment
```

Add to `src/lib/anchor.test.ts`: `expect(hashTargetId("/tr#about", "/tr")).toBe("about")` and `expect(hashTargetId("/tr#about", "/")).toBe(null)`.

Static-file rule: a path with a file extension in its last segment is not prefixed.

- [ ] **Step 2: Run `npx vitest run src/lib/locale-path.test.ts src/lib/anchor.test.ts`.** Expected: FAIL (module missing / null mismatch).
- [ ] **Step 3: Implement `src/lib/locale-path.ts`** and the `anchor.ts` change. Run the same command, expected PASS.
- [ ] **Step 4: Restructure routes** as listed in Files, add `src/proxy.ts` (next-intl `createMiddleware(routing)`, matcher excluding `api`, `_next`, `_vercel` and any path with a dot), update `i18n/request.ts` to use `requestLocale` with fallback to `routing.defaultLocale`.
- [ ] **Step 5: Make every internal link locale-aware.** Header, mobile nav, footer, the Work "All projects" link and the 404 links go through `localizedPath(locale, href)`. Header active-state compares `stripLocale(pathname)`. The client components get `locale` as a prop from their server parent (do not add next-intl client providers; `src/lib/messages.ts` says next-intl never ships to the browser).
- [ ] **Step 6: Add `LocaleSwitch`** (`{ locale: Locale; labels: { en: string; tr: string; label: string } }`): two plain-text links `EN` / `TR`, current one underlined and `aria-current="true"`, target from `switchLocalePath(usePathname(), to)` plus `window.location.hash` on click. Place it as a bordered cell in the desktop header row (same cell style as the social column) and as a row in the mobile nav. Add `nav.language`, `nav.langEn`, `nav.langTr` keys to both message files.
- [ ] **Step 7: Verify.** `npm test && npm run lint && npm run build`. Build output must list `/`, `/projects`, `/tr`, `/tr/projects` as static. Then `npm run start` and check with curl: `curl -sI localhost:3000/ | head -1` gives `200` with no `location` header; `curl -s localhost:3000/tr | grep -o '<html lang="tr"'` matches; `curl -sI localhost:3000/en` redirects to `/`; `curl -s -o /dev/null -w '%{http_code}' localhost:3000/nope` gives `404`.
- [ ] **Step 8: Commit** `feat(i18n): serve a /tr locale alongside the unprefixed English site`.

### Task 2: Turkish copy for messages and data

**Files:**
- Modify: `src/messages/tr.json` (translate every value)
- Create: `src/data/tr/projects.ts`, `src/data/tr/ventures.ts`, `src/data/tr/stratos.ts`, `src/data/tr/skills.ts`
- Create: `src/lib/localize.ts`, `src/lib/localize.test.ts`, `src/messages/messages.test.ts`
- Modify: `src/lib/types.ts`, server pages and the components that import data directly (`Work.tsx`, `WorkGallery.tsx`, `WorkIntro.tsx`, `WorkCatalogue.tsx`, `StaticGallery.tsx`, `Ventures.tsx`, `Bento.tsx`/`AboutSkills.tsx`), `src/components/ui/status-tag.tsx`, `src/components/ui/catalog-filter.tsx`, `src/components/ui/back-to-top.tsx`, `src/app/[locale]/layout.tsx` and `projects/page.tsx` metadata

**Interfaces:**
- Consumes: `Locale` (Task 1).
- Produces in `src/lib/types.ts`: `type ProjectCopy = Partial<Pick<Project, "title" | "description" | "tagDetail" | "techPills">> & { links?: Record<string, string> }` (`links` maps an English link label to its Turkish label).
- Produces in `src/lib/localize.ts`:
  - `getProjects(locale: Locale): Project[]`
  - `getFeaturedProjects(locale: Locale): Project[]` (same rule as today's `featuredProjects`)
  - `getVentures(locale: Locale): Venture[]`, `getStratosUnits(locale: Locale): StratosUnit[]`, `getBentoSkills(locale: Locale): BentoSkill[]`
  - Each merges the `tr` override over the English record by key (`slug` for projects, `name` for ventures/units, `key` for bento); `en` returns the original arrays.
- Produces: message keys `status.shipped`, `status.inProgress`, `status.archived`, `status.all`, `common.backToTop`, `meta.title`, `meta.description`, `meta.projectsTitle`, `meta.projectsDescription` in both message files; StatusTag and CatalogFilter take a `labels` prop instead of their hardcoded maps; the hardcoded `"Projects"` h1 on the projects page and `"last commit"` / `"commits"` strings in WorkCatalogue move to messages.

Translation rules: natural Turkish a Bursa engineer would write, not word-for-word. Keep proper names, product names, tech names, numbers and competition names as in English (TEKNOFEST, NASA Space Apps, BOSİAD, EU AI Act). `"Hero.tsx"` title words stay as designed unless they are English sentences.

- [ ] **Step 1: Write failing tests.** `src/messages/messages.test.ts`: the deep key set of `tr.json` equals that of `en.json`; no value in `tr.json` or in any `src/data/tr/*.ts` export contains the em dash character (U+2014, write it as `"—"` in the test); no `tr.json` value is identical to its `en.json` value except an allowlist (proper names such as `"GO"`, `"github.com/iWeslax83"`, `"Next.js · 2026"`). `src/lib/localize.test.ts`: `getProjects("tr")` has the same slugs in the same order as `getProjects("en")`; every Turkish project has a `title` and `description` different from English; `getProjects("en")` deep-equals `projects`; for every project with links, each Turkish link keeps the English `href`.
- [ ] **Step 2: Run `npx vitest run src/messages src/lib/localize.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `localize.ts`, write the Turkish files, move hardcoded strings to messages, thread localized data from server pages into client components as props.**
- [ ] **Step 4: Run tests.** Expected: PASS.
- [ ] **Step 5: Verify.** `npm test && npm run lint && npm run build`; `npm run start`, then `curl -s localhost:3000/tr/projects | grep -c 'IN PROGRESS'` gives `0` and the Turkish status label appears; `curl -s localhost:3000/projects` still shows `IN PROGRESS`.
- [ ] **Step 6: Commit** `feat(i18n): Turkish copy for the site and project data`.

### Task 3: Project detail pages

**Files:**
- Create: `src/app/[locale]/projects/[slug]/page.tsx`, `src/components/sections/project/ProjectDetail.tsx`
- Create: `src/lib/project-nav.ts`, `src/lib/project-nav.test.ts`
- Modify: `src/components/sections/work/WorkCatalogue.tsx` (title becomes a link to the detail page), gallery cards in `WorkGallery.tsx`/`StaticGallery.tsx` link there too, both message files (`project.*` keys)

**Interfaces:**
- Consumes: `getProjects(locale)`, `localizedPath`, `fetchRepoStats` (existing, `src/lib/github-repo-stats.ts`), `StatusTag` with `labels`.
- Produces in `src/lib/project-nav.ts`: `orderedProjects(list: Project[]): Project[]` (the catalogue order now inline in WorkCatalogue: flagship first, then by `order`; WorkCatalogue switches to it) and `adjacentProjects(list: Project[], slug: string): { prev: Project | null; next: Project | null }` (wraps around: first's prev is last).
- Page exports `dynamicParams = false`, `generateStaticParams()` over `routing.locales` x project slugs, `generateMetadata` with localized title `"<title> - Emir Sakarya"`, description = first sentence of the localized description, canonical `localizedPath(locale, "/projects/<slug>")`, `alternates.languages`.

Page content, top to bottom, using the existing section-bar and cell-border language (no new visual system): back link to the projects list; title (display size like the projects page h1, smaller clamp); meta row (index number, tag, `tagDetail`, StatusTag); full description; tech list; links (same `Links` treatment as the catalogue); image when present at full column width with `next/image`; GitHub stats line when `repo` stats exist; prev/next navigation as two cells at the bottom.

- [ ] **Step 1: Write failing tests** in `project-nav.test.ts`: `orderedProjects(projects)[0].slug` equals `featuredProjects[0].slug` and the rest are ascending by `order`; `adjacentProjects(list, list[0].slug).prev` is the last item; `adjacentProjects(list, "missing")` returns `{ prev: null, next: null }`.
- [ ] **Step 2: Run `npx vitest run src/lib/project-nav.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `project-nav.ts`** and switch WorkCatalogue to `orderedProjects`. Run test, expected PASS.
- [ ] **Step 4: Build the page and component, wire catalogue and gallery links.**
- [ ] **Step 5: Verify.** `npm test && npm run lint && npm run build` (build lists 15 x 2 project pages as static). `npm run start`: `/projects/prose` and `/tr/projects/prose` return 200 and contain the localized title; `/projects/nope` and `/tr/projects/nope` return 404. Screenshot `/projects/teluvane` at 1440 and 390 width with Playwright chromium and check: no horizontal scroll at 390, image not cropped, prev/next present.
- [ ] **Step 6: Commit** `feat(projects): a detail page per project`.

### Task 4: Per-project Open Graph images

**Files:**
- Create: `src/lib/og-card.tsx`
- Modify: `src/app/[locale]/opengraph-image.tsx` (use the shared card; output must look the same as today)
- Create: `src/app/[locale]/projects/[slug]/opengraph-image.tsx`

**Interfaces:**
- Produces: `renderOgCard(input: { kicker: string; title: string; subtitle: string }): Promise<ImageResponse>` in `src/lib/og-card.tsx`, holding today's frame, fonts and star; `ogSize = { width: 1200, height: 630 }`.
- Project OG: kicker = localized `tagDetail`, title = localized project title, subtitle = `"Emir Sakarya"` plus the localized status label. `generateStaticParams` same as the page; `alt` via `generateImageMetadata` or the default export's metadata per next docs.

Long titles must not overflow: shrink font size by title length (one rule, e.g. 96px up to 24 chars, 72px up to 40, else 56px).

- [ ] **Step 1: Extract `renderOgCard` from the current OG file.** Build and save `/opengraph-image` before and after to the scratchpad; they must be visually identical (compare with Read on both PNGs).
- [ ] **Step 2: Add the project OG route.**
- [ ] **Step 3: Verify.** `npm run build && npm run start`; fetch the OG URL found in the `og:image` meta of `/projects/teluvane` and `/tr/projects/zero-g-pharma` (longest titles), view both PNGs: text inside the white sheet, Turkish characters (İ, ş, ğ) render.
- [ ] **Step 4: Commit** `feat(og): per-project share images`.

### Task 5: Structured data (JSON-LD)

**Files:**
- Create: `src/lib/structured-data.ts`, `src/lib/structured-data.test.ts`, `src/components/ui/json-ld.tsx`
- Modify: `src/app/[locale]/layout.tsx` (replace the inline Person object), `src/app/[locale]/projects/page.tsx`, `src/app/[locale]/projects/[slug]/page.tsx`

**Interfaces:**
- Produces in `structured-data.ts` (all return plain objects; `SITE_URL = "https://emirsakarya.vercel.app"` exported and reused by `sitemap.ts` and the layout `metadataBase`):
  - `personJsonLd(): object` (today's Person data unchanged in content, `@id: SITE_URL + "/#person"`)
  - `venturesJsonLd(ventures: Venture[]): object` (`ItemList` of `Organization`, `founder` references `#person`, `url` only when the venture has `href`)
  - `projectJsonLd(project: Project, locale: Locale): object` (`SoftwareSourceCode` when `repo` is set with `codeRepository`, else `CreativeWork`; `author` references `#person`; `inLanguage` = locale; `url` = absolute detail-page URL)
- Produces: `<JsonLd data={object} />` rendering `<script type="application/ld+json">` with `JSON.stringify(data).replace(/</g, "\\u003c")`.

- [ ] **Step 1: Write failing tests:** Viyaro (no `href`) has no `url`; `projectJsonLd(prose, "tr").url === "https://emirsakarya.vercel.app/tr/projects/prose"`; prose is `SoftwareSourceCode` with `codeRepository: "https://github.com/iWeslax83/prose"`; duran is `CreativeWork` with no `codeRepository`; `JsonLd` escaping: a title containing `</script>` serializes without the literal `</`.
- [ ] **Step 2: Run `npx vitest run src/lib/structured-data.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement and wire into the three pages.** Run test, expected PASS.
- [ ] **Step 4: Verify.** Build and start; extract each JSON-LD block from `/`, `/projects`, `/projects/prose` with a small node script and `JSON.parse` it (must not throw).
- [ ] **Step 5: Commit** `feat(seo): structured data for projects and ventures`.

### Task 6: Downloadable CV

**Files:**
- Create: `scripts/build-resume.sh`, `public/resume.pdf` (committed build output; Vercel has no TeX)
- Create: `src/data/resume.test.ts`
- Modify: `package.json` (`"resume": "bash scripts/build-resume.sh"`), `src/data/contact.ts`, header status cell, mobile nav, both message files (`nav.resume`), `.gitignore` (LaTeX aux files)

**Interfaces:**
- Produces: `RESUME_PATH = "/resume.pdf"` in `src/data/contact.ts`; a `CV` / `Résumé` entry in `contactLinks` (footer renders it automatically).
- `build-resume.sh`: runs `pdflatex -interaction=nonstopmode -halt-on-error -output-directory "$TMP" resume.tex` in a `mktemp -d` dir, copies the PDF to `public/resume.pdf`, exits non-zero on failure.

The CV is English only. On `/tr` the label reads `CV (EN)` so nobody expects Turkish.

- [ ] **Step 1: Write failing test** `src/data/resume.test.ts`: `public/resume.pdf` exists, first 5 bytes are `%PDF-`, and its mtime is not older than `resume.tex`'s mtime.
- [ ] **Step 2: Run `npx vitest run src/data/resume.test.ts`.** Expected: FAIL (no file).
- [ ] **Step 3: Write the script, run `npm run resume`.** Test passes. Open the PDF with Read and check page 1 renders (name, sections).
- [ ] **Step 4: Add the links** (header status line 2 gets a second underlined link after "Get in touch"; mobile nav row; footer via `contactLinks`). Links open in a new tab with `download` not set (recruiters often preview).
- [ ] **Step 5: Verify.** `npm test && npm run lint && npm run build`; `curl -sI localhost:3000/resume.pdf` gives `200` and `content-type: application/pdf`, and `curl -sI localhost:3000/tr/resume.pdf` is not needed (links never prefix static files, covered by Task 1 test).
- [ ] **Step 6: Commit** `feat: downloadable CV built from resume.tex`.

### Task 7: Notes section and one draft

**Files:**
- Install: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`
- Create: `mdx-components.tsx` (project root or `src/`, per `@next/mdx` docs), `src/content/notes/<slug>.mdx`, `src/content/notes/index.ts`
- Create: `src/lib/notes.ts`, `src/lib/notes.test.ts`
- Create: `src/app/[locale]/notes/page.tsx`, `src/app/[locale]/notes/[slug]/page.tsx`
- Modify: `next.config.ts` (`pageExtensions` + `createMDX` composed with `withNextIntl`), `src/data/nav-items.ts` and header/footer (Notes link only when at least one note is published), both message files (`notes.*`, `nav.notes`)

**Interfaces:**
- Produces: `interface NoteMeta { slug: string; title: string; summary: string; date: string /* YYYY-MM-DD */; draft: boolean }`.
- Produces: `src/content/notes/index.ts` exports `notes: NoteMeta[]` (hand-maintained registry, one entry per `.mdx` file) and `loadNote(slug: string): Promise<{ default: MDXContent }>` via a static `switch` or record of `() => import("./<slug>.mdx")` (no template-string dynamic import).
- Produces in `src/lib/notes.ts`: `publishedNotes(all: NoteMeta[], includeDrafts: boolean): NoteMeta[]` (drops drafts unless `includeDrafts`, newest `date` first) and `SHOW_DRAFTS = process.env.NODE_ENV !== "production"`.
- Routes: `dynamicParams = false`; params come from `publishedNotes(notes, SHOW_DRAFTS)`. The index page calls `notFound()` when the list is empty. Notes are English only; on `/tr` the index shows the same notes with a `(EN)` marker and the article root gets `lang="en"`.
- Article typography via `mdx-components.tsx`: serif body at the site's reading size, line-height 1.5, mono for code, section bars for h2. No new fonts.

The draft (`draft: true`): one note on how PROSE keeps the model from producing an invalid task graph (the model only emits a step list; the engine assigns ids, edges, types and the checksum). Clone `iWeslax83/prose` with `gh repo clone` into the scratchpad and base every claim and code excerpt on that repo's actual source; quote file paths. No claim that is not in the repo or `src/data/projects.ts`. 600 to 1000 words, first person, Emir's voice per `src/messages/en.json` about copy. Then run the `stop-slop` skill over it.

- [ ] **Step 1: Write failing tests** in `notes.test.ts`: with `[{draft:true,...}, {draft:false, date:"2026-01-01"}, {draft:false, date:"2026-03-01"}]`, `publishedNotes(x, false)` returns the two non-drafts, March first; `publishedNotes(x, true)` returns all three; every entry in the real `notes` registry has a matching `src/content/notes/<slug>.mdx` file and a `YYYY-MM-DD` date.
- [ ] **Step 2: Run `npx vitest run src/lib/notes.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement `notes.ts`, registry, MDX setup, routes, conditional nav.** Run test, expected PASS.
- [ ] **Step 4: Write the draft note** as described.
- [ ] **Step 5: Verify both modes.** `npm run dev`: `/notes` lists the draft, `/notes/<slug>` renders. `npm run build && npm run start`: `/notes`, `/notes/<slug>`, `/tr/notes` all 404, no Notes link in header or footer HTML (`curl -s localhost:3000/ | grep -c '/notes'` gives `0`).
- [ ] **Step 6: Commit** `feat(notes): MDX notes section with an unpublished PROSE draft`.

### Task 8: Sitemap dated from git

**Files:**
- Create: `src/lib/last-modified.ts`, `src/lib/last-modified.test.ts`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `SITE_URL` (Task 5), `routing.locales`, `getProjects`, `publishedNotes(notes, false)`, `localizedPath`.
- Produces: `lastModified(paths: string[], run?: (args: string[]) => string): Date` in `src/lib/last-modified.ts`; default `run` calls `git log -1 --format=%cI -- <paths>` via `execFileSync` (same style as `src/lib/git-history.ts`); returns `FALLBACK_DATE = new Date("2026-10-20")` when the runner throws or prints nothing.
- Sitemap: one entry per page per locale (`/`, `/projects`, every project detail, notes index and each published note only when any exist), each with `alternates.languages` for `en` and `tr`. Dates: home from `["src/app/[locale]/page.tsx", "src/messages", "src/components/sections"]`; projects list and detail pages from `["src/data", "src/messages"]`; notes from their `.mdx` file.

- [ ] **Step 1: Write failing tests:** a runner returning `"2026-09-01T10:00:00+03:00\n"` gives that date; a throwing runner gives `FALLBACK_DATE`; an empty-string runner gives `FALLBACK_DATE`; the sitemap (imported default, called) contains `https://emirsakarya.vercel.app/tr/projects/prose` and no `/notes` URL while every note is a draft.
- [ ] **Step 2: Run `npx vitest run src/lib/last-modified.test.ts`.** Expected: FAIL.
- [ ] **Step 3: Implement and rewrite `sitemap.ts`** (drop the hand-bumped constant and its comment). Run test, expected PASS.
- [ ] **Step 4: Verify.** `npm run build && npm run start`; `curl -s localhost:3000/sitemap.xml` has 34 `<url>` entries (2 locales x (home + projects + 15 projects)) and `xhtml:link` alternates.
- [ ] **Step 5: Commit** `feat(seo): sitemap with per-locale pages dated from git`.

---

## Final check (after Task 8)

Full-branch review, then one Playwright chromium pass over `/`, `/tr`, `/projects`, `/tr/projects/prose` at 390 and 1440 wide: language switch round-trips, anchors scroll on both home pages, CV link opens the PDF, intro animation and smooth scroll still work. Report anything left unverified.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mixed audience, no single dominant visitor type:

- Recruiters and technical interviewers evaluating Emir for internships/roles.
- Investors and prospective co-founders evaluating Stratos UAV, Teluvane, and Viyaro.
- Peers and collaborators (other engineers, competition teams, hackathon contacts).

## Product Purpose

A personal portfolio for Emir Sakarya that makes his range legible in one
sitting: founder of three ventures (Stratos UAV, Teluvane, Viyaro) spanning
hardware, AI software, and autonomous mobility, and a working full-stack/AI
engineer, backed by real, checkable evidence rather than narrative alone.
Success is a visitor (recruiter, investor, or peer) coming away able to
verify what was built, not just told a story.

## Positioning

Deliberately balanced, not single-lane: the site does not lead with either
"hardware founder" or "AI/backend engineer" over the other. The differentiating
claim is the combination itself, someone who has shipped autonomous flight
hardware and a real multi-tenant SaaS product, not a portfolio that picks one
identity for narrative simplicity.

## Operating Context

- Founder & Chief Engineer at STRATOS İHA (TEKNOFEST UAV community, Bursa,
  Türkiye), leading a 25-person engineering org, still a student (class of
  2028).
- Runs Teluvane (AI-agent compliance auditing SaaS) as a separate founder
  venture; pre-revenue, no confirmed paying customers yet.
- Founded and leads Viyaro, an autonomous mobility venture funded by BOSİAD,
  now in daily production use across 10+ companies with 50,000+ rides logged.
- Site content is data-driven from `src/data/projects.ts`; the work catalogue,
  count, and index all derive from that file, so product/resume facts and the
  site can drift out of sync if one is edited without the other.
- A parallel LaTeX resume (`resume.tex`) exists and must stay factually
  consistent with the same underlying project facts as this site.

## Capabilities and Constraints

- Next.js 16 (App Router), single-page site, Tailwind CSS 4, Framer Motion,
  next-intl (English only currently), Vercel deployment.
- Live GitHub data (contribution graph, per-project commit stats, language
  mix) is fetched via the GitHub API, real values only, never filler numbers.
- No CMS: all project/skill content lives in `src/data/*.ts`.

## Brand Commitments

- Name: Emir Sakarya. GitHub: iWeslax83. STRATOS İHA is his founded UAV
  community/company (stratosiha.com). Teluvane is his AI-compliance startup
  (teluvane.com). Viyaro is his autonomous mobility venture (no public site
  yet).
- Visual system is documented independently in `DESIGN.md` (neutral
  maximalist typographic system, terminal-green single accent); this file
  does not restate or govern those decisions.

## Evidence on Hand

- Real, verifiable projects only: PROSE, Teluvane, Wildfire Spread Forecast,
  Tofaş Fen Webapp, Stratos Akademi, DurAn, and others listed in
  `src/data/projects.ts`, each with live URLs and/or public source repos.
- Teluvane is a software product (multi-tenant AI-agent audit/compliance
  platform: hash-chained event log, EU AI Act/ISO 42001/NIST AI RMF/SOC 2
  policy packs, LangGraph + Claude tribunal, MCP server, Python/JS SDKs, 117
  passing tests). It has no hardware component. An earlier resume revision
  incorrectly described Teluvane as a crash-hardened hardware flight recorder
  with a filed patent and a 500g shock rating; that hardware venture never
  existed, and this must not be reintroduced into the resume or site.
- Viyaro: autonomous mobility venture, funded by BOSİAD (Bursa Organize
  Sanayi Bölgesi Sanayicileri ve İş İnsanları Derneği), in daily production
  use across 10+ companies, 50,000+ rides logged to date. No public URL
  exists yet - do not add a placeholder link on the site.
- No confirmed Teluvane customers, revenue, or fundraise yet; the investor
  one-pager's traction/raise/contact fields are still unfilled placeholders,
  do not present them as filled.
- Live GitHub contribution/commit data is fetched at build/runtime; treat any
  number not sourced from that fetch or from `src/data/*.ts` as unverified.

## Product Principles

1. Range over specialization: hardware founder and software engineer
   identities are presented as one combined story, not ranked against each
   other.
2. Evidence over narrative: every claim on the site should be traceable to a
   live project, a real repo, or fetched data, not an unverifiable assertion.
3. Single source of truth per fact: project/company facts should match across
   `src/data/projects.ts`, `resume.tex`, and this file; when one changes, check
   the others.
4. The site serves recruiters, investors, and peers simultaneously; do not
   optimize copy or structure for one audience at the expense of making the
   others' evaluation harder.

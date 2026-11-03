# Portfolio: working notes

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Tests: `npm test` (vitest), single file: `npx vitest run <path>`
- Lint: `npm run lint`, types: `npx tsc --noEmit`
- CV PDF: `npm run resume` (needs a TeX install)

## Local network

The local network intercepts TLS (certificate issuer `MEB-CERT-ACI`).
curl trusts it through the system store, but Node's bundled CA store does
not, so GitHub fetches fail with `SELF_SIGNED_CERT_IN_CHAIN` and the
GitHub cell renders its "unavailable" state (`fetchGitHubStats` returns
`null`; no numbers are invented). Run local builds and the dev server with
`NODE_OPTIONS=--use-system-ca` to use the system store. Vercel builds are
not affected.

## Context files

- `PRODUCT.md`: audience, facts, evidence rules. Keep facts in sync with
  `src/data/*.ts` and `resume.tex`.
- `DESIGN.md`: visual system. Specs and plans live in
  `docs/superpowers/`.

## Dependencies

Only add or bump to versions published at least 7 days ago.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

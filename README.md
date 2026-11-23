# emirsakarya.vercel.app

Personal portfolio for Emir Sakarya - Founder & Head of Electronics & Software at
STRATOS İHA, Bursa. Embedded systems, autonomous UAVs, AI agent systems, and
production full-stack work.

The design system is a neutral maximalist typographic approach: a near-black
canvas, bordered readout panels, mono data, and one saturated signal color
(terminal green). The hero leads into a real indexed project catalogue backed
by live GitHub data, not a printed drawing of a product. The full design
system lives in [DESIGN.md](DESIGN.md).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger, SplitText) and [Lenis](https://lenis.darkroom.engineering/)
- **Internationalization**: [next-intl](https://next-intl.dev) (English at `/`, Turkish at `/tr`)
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: JetBrains Mono via `next/font/google`, with local TTFs for social cards
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com)

## Features

- Indexed work catalogue: a bordered flagship instrument panel plus mono-indexed
  catalogue rows, hover sweep included
- Animated wireframe hero and scroll-driven project gallery
- Choreographed section reveals: hairline rules extend, headlines unmask, readouts settle
- Live GitHub activity via the GitHub API (repo and contribution counts, language breakdown)
- SEO: JSON-LD structured data, sitemap, robots.txt
- Responsive, with dedicated mobile navigation
- Respects `prefers-reduced-motion` in CSS, GSAP, and Lenis

## Getting Started

```bash
# Install locked dependencies (Node.js 24)
npm ci

# Start dev server
npm run dev

# Production build
npm run build
npm start

# Checks
npm run lint
npx next typegen
npx tsc --noEmit
npm test
npm audit --omit=dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
After `npm start`, smoke-test `/`, `/tr`, `/projects` and `/tr/projects`
at that address. Use the default host (or `--hostname localhost`):
`--hostname 127.0.0.1` has caused redirect loops on English routes.
On networks that intercept TLS, use `NODE_OPTIONS=--use-system-ca` during
build and local startup (see [AGENTS.md](AGENTS.md)).

## Project Structure

```
src/
  app/
    [locale]/       # Localized layout, home, projects and MDX notes
    robots.ts       # SEO robots.txt
    sitemap.ts      # SEO sitemap
    globals.css     # Tailwind 4 @theme tokens + base styles
  components/       # UI components (hero, nav, projects, skills, contact, etc.)
  data/             # Static data (projects, skills, stratos)
  lib/              # Utilities, types and animation helpers
  messages/         # English and Turkish translations
i18n/               # next-intl routing config
public/images/      # Logo and project assets
```

Project content is data-driven: add or edit entries in `src/data/projects.ts` and the
work catalogue, project count, and secondary index all follow.

## Environment Variables

Create a `.env.local` file:

```bash
GITHUB_TOKEN=       # Optional server-only token (for contribution count and language stats)
```

## License

MIT

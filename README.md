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
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Internationalization**: [next-intl](https://next-intl.dev) (English)
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: Cabinet Grotesk (display & body, self-hosted via `next/font/local`), JetBrains Mono (technical-readout voice)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com)

## Features

- Indexed work catalogue: a bordered flagship instrument panel plus mono-indexed
  catalogue rows, hover sweep included
- Animated quadrotor schematic that draws itself stroke by stroke via SVG `pathLength`
- Choreographed section reveals: hairline rules extend, headlines unmask, readouts settle
- Live GitHub activity via the GitHub API (contribution graph, language breakdown)
- SEO: JSON-LD structured data, sitemap, robots.txt
- Responsive, with dedicated mobile navigation
- Respects `prefers-reduced-motion` in both CSS and Framer Motion

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout (NextIntlClientProvider, MotionProvider, JSON-LD, Analytics)
    page.tsx        # Single-page portfolio
    robots.ts       # SEO robots.txt
    sitemap.ts      # SEO sitemap
    globals.css     # Tailwind 4 @theme tokens + base styles
  components/       # UI components (hero, nav, projects, skills, contact, etc.)
  data/             # Static data (projects, skills, stratos)
  lib/              # Utilities, types, motion variants
  messages/         # i18n translation files (en.json)
i18n/               # next-intl routing config
public/images/      # Logo and project assets
```

Project content is data-driven: add or edit entries in `src/data/projects.ts` and the
work catalogue, project count, and secondary index all follow.

## Environment Variables

Create a `.env.local` file:

```bash
GITHUB_TOKEN=       # GitHub personal access token (for contribution graph & language stats)
```

## License

MIT

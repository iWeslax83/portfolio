# emirsakarya.vercel.app

Personal portfolio for Emir Sakarya - Founder & Head of Electronics & Software at
STRATOS İHA, Bursa. Embedded systems, autonomous UAVs, AI agent systems, and
production full-stack work.

The design concept is an **engineering monograph**: the site reads like a
precision-printed technical spec sheet for a person, using aerospace drafting
conventions (figure codes, dimension callouts, registration marks) rather than the
usual developer-terminal motif. The full design system lives in [DESIGN.md](DESIGN.md).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Internationalization**: [next-intl](https://next-intl.dev) (English)
- **Icons**: [Lucide React](https://lucide.dev)
- **Fonts**: Bricolage Grotesque (display), Manrope (body), JetBrains Mono (drafting annotation)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com)

## Features

- Indexed work catalogue: a bordered flagship plate plus drafting-style figure rows
- Animated quadrotor schematic that drafts itself stroke by stroke via SVG `pathLength`
- Choreographed section reveals: rules draw, headlines unmask, figures index in
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

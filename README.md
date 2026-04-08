# emirsakarya.vercel.app

Personal portfolio website for Emir Sakarya — Software Architect & Electronics/Software Captain at Tofas Fen Lisesi, Bursa.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Internationalization**: [next-intl](https://next-intl.dev) (English)
- **Icons**: [Lucide React](https://lucide.dev)
- **Font**: JetBrains Mono
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com)

## Features

- Terminal-inspired UI with monospace typography and dark theme
- Animated stat counters, staggered section reveals
- Live GitHub activity via GitHub API (contribution graph, language breakdown)
- SEO-optimized with JSON-LD structured data, sitemap, and robots.txt
- Fully responsive with dedicated mobile navigation

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
    layout.tsx      # Root layout (NextIntlClientProvider, JSON-LD, Analytics)
    page.tsx        # Single-page portfolio
    robots.ts       # SEO robots.txt
    sitemap.ts      # SEO sitemap
    globals.css     # Tailwind 4 @theme tokens + base styles
  components/       # UI components (hero, nav, projects, skills, contact, etc.)
  data/             # Static data (projects, skills)
  lib/              # Utilities, types, motion variants
  messages/         # i18n translation files (en.json)
i18n/               # next-intl routing config
public/images/      # Logo and project assets
```

## Environment Variables

Create a `.env.local` file:

```bash
GITHUB_TOKEN=       # GitHub personal access token (for contribution graph & language stats)
```

## License

MIT

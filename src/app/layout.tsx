import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Instrument_Serif,
  Anton,
  Oswald,
  Metamorphous,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SkipLink from "@/components/ui/skip-link";
import SmoothScroll from "@/components/smooth-scroll";
import { INTRO_SCRIPT } from "@/lib/intro-script";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://emirsakarya.vercel.app"),
  title: "Emir Sakarya - Founder & Engineer",
  description:
    "Founder & Head of Electronics & Software at STRATOS İHA. Embedded-systems and full-stack engineer building autonomous drones, AI systems, and production web apps in Bursa, Türkiye.",
  openGraph: {
    title: "Emir Sakarya - Founder & Engineer",
    description:
      "Founder & Head of Electronics & Software at STRATOS İHA. Building autonomous drones and the software behind them.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emir Sakarya - Founder & Engineer",
    description:
      "Founder & Head of Electronics & Software at STRATOS İHA. Building autonomous drones and the software behind them.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${serif.variable} ${display.variable} ${condensed.variable} ${displayAccent.variable}`}
      // The intro script and Lenis add classes to <html> before and after
      // hydration; only this element's own attributes are exempted.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="bg-frame text-ink antialiased">
        <SkipLink />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emir Sakarya",
              jobTitle:
                "Founder & Head of Electronics & Software, STRATOS İHA · Embedded & Full-Stack Engineer",
              url: "https://emirsakarya.vercel.app",
              sameAs: [
                "https://github.com/iWeslax83",
                "https://linkedin.com/in/emirsakarya",
                "https://www.stratosiha.com",
              ],
              worksFor: {
                "@type": "Organization",
                name: "STRATOS İHA",
                url: "https://www.stratosiha.com",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Tofaş Fen Lisesi",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bursa",
                addressCountry: "TR",
              },
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}

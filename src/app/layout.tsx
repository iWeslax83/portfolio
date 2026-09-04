import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Fraunces, Oswald, Metamorphous } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/ui/motion-provider";
import SkipLink from "@/components/ui/skip-link";
import "./globals.css";

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

// Mono carries the technical-readout voice: data values, status lines, nav
// index, spec rows.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Serif: hero headline and any long-form founder-story prose. An original
// moody editorial serif chosen for similar structural character to a
// design reference, not an attempt to match any specific site's font.
const serif = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

// Condensed display: WORK-beat letters and the oversized multi-line CTA
// statement in Contact. Oswald, not Bebas Neue: closer weight/width match
// to the design reference's condensed display face, and free (Google
// Fonts) where the reference's own face is a paid commercial font.
const condensed = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-oswald",
  display: "swap",
});

// Hero display accent: the dot separators in the hero's triptych
// headline. Metamorphous is the exact free Google Font the design
// reference itself uses for its own hero display face - safe to match
// literally since it's free, unlike the reference's other (paid) fonts.
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html
      lang="en"
      className={`${cabinetGrotesk.variable} ${mono.variable} ${serif.variable} ${condensed.variable} ${displayAccent.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
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
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

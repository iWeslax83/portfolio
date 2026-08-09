import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/ui/motion-provider";
import "./globals.css";

// Display + body: Instrument Sans - a single geometric grotesk driving the
// whole hierarchy by weight and size. Deliberately not Inter used as a bare
// default, not Space Grotesk.
const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
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
      className={`${instrumentSans.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <a href="#home" className="skip-link">
          skip to content
        </a>
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

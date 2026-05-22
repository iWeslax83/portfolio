import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

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
      className={`${display.variable} ${body.variable} ${mono.variable} scroll-smooth`}
    >
      <body className="bg-bg text-text-primary antialiased">
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
                "https://stratosiha.vercel.app",
              ],
              worksFor: {
                "@type": "Organization",
                name: "STRATOS İHA",
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
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

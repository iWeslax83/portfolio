import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emir Sakarya",
  description:
    "Full stack developer and electronics captain based in Bursa, Türkiye. Building web apps, autonomous drones, and AI systems.",
  openGraph: {
    title: "Emir Sakarya",
    description:
      "Full stack developer and electronics captain based in Bursa, Türkiye. Building web apps, autonomous drones, and AI systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emir Sakarya",
    description:
      "Full stack developer and electronics captain based in Bursa, Türkiye. Building web apps, autonomous drones, and AI systems.",
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
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg text-text-primary antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emir Sakarya",
              jobTitle: "Software Architect | Node.js & Scalable Web Apps",
              url: "https://emirsakarya.vercel.app",
              sameAs: [
                "https://github.com/iWeslax83",
                "https://linkedin.com/in/emirsakarya",
              ],
              worksFor: {
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

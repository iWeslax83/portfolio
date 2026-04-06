import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "../../../i18n/routing";
import { notFound } from "next/navigation";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "tr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Emir Sakarya",
            jobTitle: "Full Stack Developer",
            url: "https://emirsakarya.dev",
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
    </>
  );
}

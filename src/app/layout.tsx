import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emir Sakarya — Full Stack Developer",
  description:
    "Full stack developer and electronics captain based in Bursa, Türkiye. Building web apps, autonomous drones, and AI systems.",
  openGraph: {
    title: "Emir Sakarya — Full Stack Developer",
    description:
      "Full stack developer and electronics captain based in Bursa, Türkiye. Building web apps, autonomous drones, and AI systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emir Sakarya — Full Stack Developer",
    description:
      "Full stack developer and electronics captain based in Bursa, Türkiye. Building web apps, autonomous drones, and AI systems.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth">
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}

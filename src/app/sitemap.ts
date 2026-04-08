import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://emirsakarya.vercel.app";

  return [
    { url: `${baseUrl}/en`, lastModified: new Date(), priority: 1.0 },
  ];
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://emirsakarya.dev";

  return [
    { url: `${baseUrl}/en`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/tr`, lastModified: new Date(), priority: 0.8 },
  ];
}

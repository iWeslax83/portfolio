import type { MetadataRoute } from "next";

// Pinned to the last meaningful content update. Bump manually when the
// portfolio gets significant edits so crawlers see a real lastModified.
const LAST_CONTENT_UPDATE = new Date("2026-04-08");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://emirsakarya.vercel.app";

  return [
    { url: baseUrl, lastModified: LAST_CONTENT_UPDATE, priority: 1.0 },
  ];
}

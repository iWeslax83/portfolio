import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/structured-data";

// Pinned to the last meaningful content update. Bump manually when the
// portfolio gets significant edits so crawlers see a real lastModified.
const LAST_CONTENT_UPDATE = new Date("2026-10-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  return [
    { url: baseUrl, lastModified: LAST_CONTENT_UPDATE, priority: 1.0 },
    {
      url: `${baseUrl}/projects`,
      lastModified: LAST_CONTENT_UPDATE,
      priority: 0.8,
    },
  ];
}

import { describe, expect, it } from "vitest";
import { shareMetadata } from "./share-metadata";
import { SITE_URL } from "./structured-data";

const base = { title: "T", description: "D" };

describe("shareMetadata", () => {
  it("fills English Open Graph with an absolute URL and locales", () => {
    const { openGraph, twitter } = shareMetadata({
      ...base,
      locale: "en",
      path: "/projects/prose",
      type: "article",
    });
    expect(openGraph).toMatchObject({
      title: "T",
      description: "D",
      url: `${SITE_URL}/projects/prose`,
      type: "article",
      locale: "en_US",
      alternateLocale: ["tr_TR"],
    });
    expect(twitter).toMatchObject({
      card: "summary_large_image",
      title: "T",
      description: "D",
    });
  });

  it("prefixes Turkish URLs and swaps the locales", () => {
    const { openGraph } = shareMetadata({
      ...base,
      locale: "tr",
      path: "/",
      type: "website",
    });
    expect(openGraph).toMatchObject({
      url: `${SITE_URL}/tr`,
      locale: "tr_TR",
      alternateLocale: ["en_US"],
    });
  });

  it("uses an explicit canonical path for the URL", () => {
    const { openGraph } = shareMetadata({
      ...base,
      locale: "tr",
      path: "/notes",
      canonicalPath: "/notes",
      type: "website",
    });
    expect(openGraph).toMatchObject({ url: `${SITE_URL}/notes` });
  });
});

describe("shareMetadata with a parent", () => {
  it("keeps the parent's Open Graph and Twitter images", () => {
    const image = { url: new URL(`${SITE_URL}/en/opengraph-image`) };
    const parent = {
      openGraph: { images: [image] },
      twitter: { images: [image] },
    } as unknown as Parameters<typeof shareMetadata>[0]["parent"];
    const { openGraph, twitter } = shareMetadata({
      ...base,
      locale: "en",
      path: "/projects",
      type: "website",
      parent,
    });
    expect(openGraph).toMatchObject({ images: [image] });
    expect(twitter).toMatchObject({ images: [image] });
  });

  it("adds no images key without a parent", () => {
    const { openGraph } = shareMetadata({
      ...base,
      locale: "en",
      path: "/projects",
      type: "website",
    });
    expect(openGraph).not.toHaveProperty("images");
  });
});

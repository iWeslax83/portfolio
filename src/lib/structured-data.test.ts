import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import JsonLd from "@/components/ui/json-ld";
import { projects } from "@/data/projects";
import { ventures } from "@/data/ventures";
import {
  SITE_URL,
  personJsonLd,
  projectJsonLd,
  venturesJsonLd,
} from "./structured-data";

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

describe("structured data", () => {
  it("person has a stable @id", () => {
    expect(personJsonLd()).toMatchObject({
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Emir Sakarya",
    });
  });

  it("omits url for a venture without href (Viyaro)", () => {
    const list = venturesJsonLd(ventures) as {
      itemListElement: { item: Record<string, unknown> }[];
    };
    const viyaro = list.itemListElement.find((e) => e.item.name === "Viyaro")!;
    expect(viyaro.item).not.toHaveProperty("url");
    expect(viyaro.item.founder).toEqual({ "@id": `${SITE_URL}/#person` });
    const teluvane = list.itemListElement.find(
      (e) => e.item.name === "Teluvane",
    )!;
    expect(teluvane.item.url).toBe("https://teluvane.com");
  });

  it("builds the absolute localized detail URL", () => {
    const ld = projectJsonLd(bySlug("prose"), "tr") as Record<string, unknown>;
    expect(ld.url).toBe("https://emirsakarya.vercel.app/tr/projects/prose");
    expect(ld.inLanguage).toBe("tr");
    expect(ld.author).toEqual({ "@id": `${SITE_URL}/#person` });
  });

  it("uses SoftwareSourceCode with codeRepository when repo is set", () => {
    const ld = projectJsonLd(bySlug("prose"), "en") as Record<string, unknown>;
    expect(ld["@type"]).toBe("SoftwareSourceCode");
    expect(ld.codeRepository).toBe("https://github.com/iWeslax83/prose");
  });

  it("uses CreativeWork without codeRepository otherwise (DurAn)", () => {
    const ld = projectJsonLd(bySlug("duran"), "en") as Record<string, unknown>;
    expect(ld["@type"]).toBe("CreativeWork");
    expect(ld).not.toHaveProperty("codeRepository");
  });

  it("JsonLd escapes < so a title cannot close the script tag", () => {
    const html = renderToStaticMarkup(
      createElement(JsonLd, { data: { name: "</script><b>x" } }),
    );
    const inner = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(inner).not.toContain("</");
    expect(inner).toContain("\\u003c/script>");
    expect(JSON.parse(inner).name).toBe("</script><b>x");
  });
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Footer from "@/components/footer";
import { CONTACT_EMAIL, RESUME_PATH, contactLinks } from "@/data/contact";
import en from "@/messages/en.json";
import tr from "@/messages/tr.json";
import Closing from "./Closing";

vi.mock("@/components/sections/hero/Ticker", () => ({ default: () => null }));

describe.each([["en", en], ["tr", tr]] as const)("contact and footer (%s)", (locale, messages) => {
  it("puts the single localized email action before the secondary links", () => {
    const html = renderToStaticMarkup(createElement(Closing, {
      commits: [],
      t: messages.closing,
      resumeLabel: messages.nav.resume,
    }));
    const email = `href="mailto:${CONTACT_EMAIL}"`;
    expect(html.split(email)).toHaveLength(2);
    expect(html).toContain(messages.closing.emailAction);
    for (const { href } of contactLinks.filter(({ href }) => !href.startsWith("mailto:"))) {
      expect(html.indexOf(`href="${href}"`)).toBeGreaterThan(html.indexOf(email));
    }
    expect(html).toContain(messages.nav.resume);
  });

  it("has localized navigation and links to the English CV by default", () => {
    const html = renderToStaticMarkup(createElement(Footer, {
      t: messages.footer,
      nav: messages.nav,
      locale,
    }));
    expect(html).toContain(messages.footer.navHeading);
    expect(html).toContain(`href="${locale === "tr" ? "/tr" : ""}/projects"`);
    expect(html).toContain(`href="mailto:${CONTACT_EMAIL}"`);
    expect(html).toContain(`href="${RESUME_PATH}" hrefLang="en"`);
    expect(html).toContain(`>${messages.nav.resume}<span`);
  });

  it("can omit the CV when the home page already shows it", () => {
    const html = renderToStaticMarkup(createElement(Footer, {
      t: messages.footer,
      nav: messages.nav,
      locale,
      hideResume: true,
    }));
    expect(html).not.toContain(`href="${RESUME_PATH}"`);
  });
});

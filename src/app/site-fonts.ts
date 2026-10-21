import {
  JetBrains_Mono,
  Instrument_Serif,
  Anton,
  Oswald,
  Metamorphous,
} from "next/font/google";

/*
 * The site's faces, shared by the locale layout and the global 404 (which
 * renders its own <html> outside every layout).
 */

// Mono: nav, labels, tickers, data readouts.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Body serif: narrow editorial serif for reading copy and the header
// tagline. A free stand-in chosen for structure, not a copy of any paid face.
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

// Condensed display: bento words, WORK letters, venture names, closing
// headline, footer wordmark.
const display = Anton({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

// DREAM IT / BUILD IT only.
const condensed = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  variable: "--font-oswald",
  display: "swap",
});

// Hero title only.
const displayAccent = Metamorphous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-metamorphous",
  display: "swap",
});

/** Every font's CSS variable, for the <html> className. */
export const fontVariables = [mono, serif, display, condensed, displayAccent]
  .map((f) => f.variable)
  .join(" ");

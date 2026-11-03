import { JetBrains_Mono } from "next/font/google";

/*
 * The site's one face, shared by the locale layout and the global 404
 * (which renders its own <html> outside every layout). Display, body and
 * data all set in JetBrains Mono; size and weight carry the hierarchy.
 */

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** Every font's CSS variable, for the <html> className. */
export const fontVariables = [mono].map((f) => f.variable).join(" ");

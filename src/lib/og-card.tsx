import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/locales";
import { upperForLocale } from "@/lib/og-text";

export const ogSize = { width: 1200, height: 630 };

// Satori needs TTF/OTF, not the woff2 next/font serves, so the OG card
// reads its own copy of the site's face (OFL, see the license file next to
// it).
const fontDir = join(process.cwd(), "src/app/fonts/og");

const BG = "#0a0e0a";
const INK = "#d2f0da";
const DIM = "#5f8f6c";
const ACCENT = "#4dff7c";
const EDGE = "rgba(77,255,124,0.28)";

// One rule: long titles step the size down so they stay inside the frame.
function titleSize(title: string): number {
  if (title.length <= 24) return 76;
  if (title.length <= 40) return 60;
  return 46;
}

export async function renderOgCard(input: {
  kicker: string;
  title: string;
  subtitle: string;
  locale: Locale;
  /** Overrides the length-based title size (the home card is deliberately larger). */
  titleSize?: number;
}): Promise<ImageResponse> {
  const [regular, bold, extraBold] = await Promise.all([
    readFile(join(fontDir, "JetBrainsMono-Regular.ttf")),
    readFile(join(fontDir, "JetBrainsMono-Bold.ttf")),
    readFile(join(fontDir, "JetBrainsMono-ExtraBold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: BG,
        padding: 40,
        fontFamily: "JetBrains Mono",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: `1px solid ${EDGE}`,
          padding: "44px 56px",
          color: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: DIM,
            letterSpacing: 3,
          }}
        >
          <span style={{ color: ACCENT }}>emir@bursa ~ % {input.kicker}</span>
          <span>2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: input.titleSize ?? titleSize(input.title),
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            {upperForLocale(input.title, input.locale)}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginTop: 20,
              maxWidth: 960,
              color: DIM,
            }}
          >
            {input.subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${EDGE}`,
            paddingTop: 20,
            fontSize: 24,
          }}
        >
          <span>
            UAV <span style={{ color: ACCENT }}>/</span> AI{" "}
            <span style={{ color: ACCENT }}>/</span> FOUNDER
          </span>
          <span style={{ color: DIM, fontSize: 20 }}>
            github.com/iWeslax83
          </span>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "JetBrains Mono", data: regular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
        {
          name: "JetBrains Mono",
          data: extraBold,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Emir Sakarya - Founder & Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori needs TTF/OTF, not the woff2 next/font serves, so the OG card
// reads its own copies of the site's two display faces (OFL, see the
// license files next to them).
const fontDir = join(process.cwd(), "src/app/fonts/og");

function Star() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="#0a0a0a">
      <path d="M12 0C12.9 8.2 15.8 11.1 24 12C15.8 12.9 12.9 15.8 12 24C11.1 15.8 8.2 12.9 0 12C8.2 11.1 11.1 8.2 12 0Z" />
    </svg>
  );
}

export default async function OpengraphImage() {
  const [anton, serif] = await Promise.all([
    readFile(join(fontDir, "Anton-Regular.ttf")),
    readFile(join(fontDir, "InstrumentSerif-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: "#0a0a0a",
        padding: 16,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "52px 64px",
          fontFamily: "Instrument Serif",
          color: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#0a0a0a",
            color: "#ffffff",
            fontFamily: "Anton",
            fontSize: 22,
            letterSpacing: 3,
            padding: "6px 14px",
          }}
        >
          FOUNDER & HEAD OF ELECTRONICS & SOFTWARE · STRATOS İHA
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Anton",
              fontSize: 150,
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            Emir Sakarya
          </div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.25,
              marginTop: 18,
              maxWidth: 960,
            }}
          >
            Building autonomous drones and the software behind them, from Bursa,
            Türkiye.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #0a0a0a",
            paddingTop: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: "Anton",
              fontSize: 34,
              letterSpacing: 2,
            }}
          >
            <span>UAV</span>
            <Star />
            <span>AI</span>
            <Star />
            <span>FOUNDER</span>
          </div>
          <span style={{ fontSize: 30 }}>github.com/iWeslax83</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
      ],
    },
  );
}

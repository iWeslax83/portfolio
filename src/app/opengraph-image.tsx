import { ImageResponse } from "next/og";

export const alt = "Emir Sakarya - Founder & Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Faint grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#39ff6a",
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          <div style={{ width: 12, height: 12, background: "#39ff6a" }} />
          FOUNDER & HEAD OF ELECTRONICS & SOFTWARE · STRATOS IHA
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, color: "#ececee", lineHeight: 1.02 }}>
            Emir Sakarya
          </div>
          <div style={{ fontSize: 34, color: "#8b8c94", marginTop: 20, maxWidth: 900 }}>
            Founder & Head of Electronics & Software at STRATOS İHA. Building autonomous
            drones and the software behind them.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#55565e",
            fontSize: 22,
          }}
        >
          <span>github.com/iWeslax83</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

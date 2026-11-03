import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e0a",
        borderRadius: 14,
        fontFamily: "monospace",
        fontSize: 34,
        fontWeight: 800,
      }}
    >
      <span style={{ color: "#4dff7c" }}>e</span>
      <span style={{ color: "#d2f0da" }}>_</span>
    </div>,
    { ...size },
  );
}

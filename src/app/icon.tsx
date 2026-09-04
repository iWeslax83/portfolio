import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: 14,
          fontFamily: "monospace",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#0a0a0a" }}>e</span>
        <span style={{ color: "#0a0a0a" }}>.</span>
      </div>
    ),
    { ...size }
  );
}

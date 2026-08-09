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
          background: "#09090b",
          borderRadius: 14,
          fontFamily: "monospace",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#ececee" }}>e</span>
        <span style={{ color: "#ff7a29" }}>.</span>
      </div>
    ),
    { ...size }
  );
}

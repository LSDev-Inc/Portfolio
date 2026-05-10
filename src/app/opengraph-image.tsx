import { ImageResponse } from "next/og";

import { fallbackPortfolio } from "@/lib/portfolio/fallback";

export const runtime = "edge";
export const alt = "Premium Full Stack Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OgImage() {
  const { settings } = fallbackPortfolio;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background:
            "linear-gradient(135deg, #06131f 0%, #0d172b 48%, #241032 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 28,
            color: "#8be9ff",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "#67e8f9",
              boxShadow: "0 0 42px #67e8f9",
            }}
          />
          {settings.professionalTitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: 0 }}>
            {settings.ownerName}
          </div>
          <div style={{ maxWidth: 930, fontSize: 36, lineHeight: 1.25, color: "#d6e6f2" }}>
            {settings.headline}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#b8c7d9" }}>
          <span>{settings.location}</span>
          <span>{settings.availability}</span>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

// The share image (Open Graph and Twitter) for every page: charcoal with an orange glow, the wordmark and the headline.
// Public (see lib/public-paths.ts), so crawlers can fetch it signed out.

export const alt = "Stellar: Digital SAT prep and practice tests";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "#ffffff",
          backgroundColor: "#18181a",
          backgroundImage: "radial-gradient(ellipse 70% 90% at 100% 0%, rgba(249,115,22,0.6), rgba(24,24,26,0) 65%), radial-gradient(ellipse 60% 70% at 0% 100%, rgba(234,88,12,0.22), rgba(24,24,26,0) 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 48, fontWeight: 700, letterSpacing: -1 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 16, marginRight: 20, backgroundImage: "linear-gradient(135deg, #f97316, #ea580c)" }} />
          Stellar
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>Digital SAT prep</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#d4d4d8" }}>Practice questions · Full-length practice tests · Lessons</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

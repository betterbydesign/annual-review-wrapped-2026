import React from "react";
import { Img, staticFile } from "remotion";

// A cropped screenshot shown edge-to-edge in a rounded panel. The source is
// pre-cropped to the app window (no gray capture matte), and the panel aspect
// matches the image aspect, so the border + drop shadow sit exactly on the
// asset's own edges — no empty container, no crop-off.
export const AssetCard: React.FC<{
  src: string;
  radius: number;
  brightness?: number; // 1 = full; <1 dims cards deeper in the stack
  driftY?: number; // subtle vertical ken-burns drift in %
}> = ({ src, radius, brightness = 1, driftY = 0 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: "#141414",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 40px 90px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // tiny overscan so the drift never exposes the panel background
          transform: `scale(1.02) translateY(${driftY}%)`,
          filter: brightness < 1 ? `brightness(${brightness})` : undefined,
        }}
      />
    </div>
  );
};

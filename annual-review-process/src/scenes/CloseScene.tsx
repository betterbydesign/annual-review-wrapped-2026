import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";
import { useScale } from "../components/anim";
import { FallingText } from "../components/FallingText";

// Scene 9 — CLOSE / CTA. Entrances complete well before the last 60 frames so
// the tail is fully static (clean loop point / thumbnail-safe).
export const CloseScene: React.FC = () => {
  const scale = useScale();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tools = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const tOpacity = interpolate(tools, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tY = interpolate(tools, [0, 1], [24 * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 42%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
        fontFamily: FONT_FAMILY,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 100 * scale,
      }}
    >
      <FallingText
        text="Watch the full presentation →"
        delay={6}
        fontSize={64 * scale}
        color={COLORS.ink}
        lineHeight={1.12}
        style={{ justifyContent: "center", maxWidth: "92%" }}
      />
      <div
        style={{
          color: COLORS.blueBright,
          fontWeight: 900,
          fontSize: 52 * scale,
          marginTop: 12 * scale,
          marginBottom: 40 * scale,
          opacity: interpolate(
            spring({ frame: frame - 20, fps, config: { damping: 200 } }),
            [0, 1],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        link in this post.
      </div>
      <div
        style={{
          opacity: tOpacity,
          transform: `translateY(${tY}px)`,
          color: COLORS.summit,
          fontWeight: 500,
          fontSize: 28 * scale,
          letterSpacing: 1 * scale,
        }}
      >
        Claude · ChatGPT Images · Claude Design · Remotion · GitHub Pages
      </div>
    </AbsoluteFill>
  );
};

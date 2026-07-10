import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";
import { useScale } from "../components/anim";
import { FallingText } from "../components/FallingText";

// Scene 1 — HOOK. First line drops in word-by-word; second line follows.
export const HookScene: React.FC = () => {
  const scale = useScale();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line2 = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const l2opacity = interpolate(line2, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const l2y = interpolate(line2, [0, 1], [24 * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
        fontFamily: FONT_FAMILY,
        justifyContent: "center",
        padding: 100 * scale,
      }}
    >
      <FallingText
        text="I built my annual review like Spotify Wrapped."
        delay={6}
        stagger={3.5}
        fontSize={78 * scale}
        color={COLORS.ink}
        weight={900}
        lineHeight={1.06}
        style={{ marginBottom: 34 * scale }}
      />
      <div
        style={{
          opacity: l2opacity,
          transform: `translateY(${l2y}px)`,
          color: COLORS.summit,
          fontWeight: 500,
          fontSize: 40 * scale,
          lineHeight: 1.2,
        }}
      >
        Here&rsquo;s the AI workflow behind it.
      </div>
    </AbsoluteFill>
  );
};

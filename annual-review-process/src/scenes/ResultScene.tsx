import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";
import { useScale } from "../components/anim";
import { FallingText } from "../components/FallingText";

// Scene 8 — STEP 6 · SHIP. The payoff: the finished presentation plays muted
// inside a clean panel. The clip (~48s) outruns the 14s scene, so it plays and
// is cut — no loop.
export const ResultScene: React.FC = () => {
  const scale = useScale();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const kick = spring({ frame, fps, config: { damping: 200 } });
  const kOpacity = interpolate(kick, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Panel rises + settles as it enters.
  const rise = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const panelY = interpolate(rise, [0, 1], [60 * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelOpacity = interpolate(rise, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardW = Math.min(width * 0.82, height * 0.52);
  const cardH = cardW * 1.11; // matches the portrait recording

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
        fontFamily: FONT_FAMILY,
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 96 * scale,
          left: 84 * scale,
          right: 84 * scale,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14 * scale,
            opacity: kOpacity,
            marginBottom: 20 * scale,
          }}
        >
          <div
            style={{
              width: 36 * scale,
              height: 5 * scale,
              borderRadius: 999,
              backgroundColor: COLORS.blueBright,
            }}
          />
          <span
            style={{
              color: COLORS.blueBright,
              fontWeight: 700,
              fontSize: 27 * scale,
              letterSpacing: 3.5 * scale,
              textTransform: "uppercase",
            }}
          >
            Step 6 — Ship
          </span>
        </div>
        <FallingText
          text="The finished presentation."
          delay={6}
          fontSize={64 * scale}
          color={COLORS.ink}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: height * 0.62,
          transform: `translateY(${panelY}px)`,
          opacity: panelOpacity,
          width: cardW,
          height: cardH,
          marginTop: -cardH / 2,
          borderRadius: 18 * scale,
          overflow: "hidden",
          backgroundColor: "#010f1c",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
        }}
      >
        <OffthreadVideo
          src={staticFile("final-presentation.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </AbsoluteFill>
  );
};

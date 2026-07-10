import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../theme";
import { useScale } from "../components/anim";

const STEPS = ["Gather", "Verify", "Storyboard", "Style", "Build", "Ship"];

const Chip: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const scale = useScale();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - (10 + index * 5),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });
  const y = interpolate(s, [0, 1], [-50 * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(s, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18 * scale,
        background:
          "linear-gradient(180deg, rgba(46,59,64,0.9), rgba(46,59,64,0.55))",
        borderRadius: 999,
        border: "1px solid rgba(94,178,234,0.25)",
        padding: `${20 * scale}px ${40 * scale}px`,
        boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          width: 16 * scale,
          height: 16 * scale,
          borderRadius: 999,
          backgroundColor: COLORS.blueBright,
          boxShadow: `0 0 14px ${COLORS.blueBright}`,
          flexShrink: 0,
        }}
      />
      <span
        style={{ color: COLORS.ink, fontWeight: 700, fontSize: 40 * scale }}
      >
        {label}
      </span>
    </div>
  );
};

// Scene 2 — RECIPE. Six pill chips drop in, staggered.
export const RecipeScene: React.FC = () => {
  const scale = useScale();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = spring({ frame, fps, config: { damping: 200 } });
  const hOpacity = interpolate(h, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
        fontFamily: FONT_FAMILY,
        justifyContent: "center",
        alignItems: "center",
        padding: 100 * scale,
      }}
    >
      <div
        style={{
          opacity: hOpacity,
          color: COLORS.blueBright,
          fontWeight: 700,
          fontSize: 27 * scale,
          letterSpacing: 4 * scale,
          textTransform: "uppercase",
          marginBottom: 46 * scale,
        }}
      >
        The six-step recipe
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24 * scale,
          maxWidth: "92%",
        }}
      >
        {STEPS.map((label, i) => (
          <Chip key={label} label={label} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

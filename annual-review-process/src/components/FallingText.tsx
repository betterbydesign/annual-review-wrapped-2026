import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useScale } from "./anim";

// Headline that animates word-by-word: each word drops in from above with a
// slight rotation and settles via spring — staggered left-to-right.
export const FallingText: React.FC<{
  text: string;
  delay?: number;
  fontSize: number;
  color: string;
  weight?: number;
  lineHeight?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  fontSize,
  color,
  weight = 900,
  lineHeight = 1.05,
  stagger = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = useScale();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: fontSize * 0.26,
        rowGap: 0,
        color,
        fontWeight: weight,
        fontSize,
        lineHeight,
        letterSpacing: -0.5 * scale,
        textShadow: "0 6px 26px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.7 },
        });
        const y = interpolate(s, [0, 1], [-70 * scale, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rot = interpolate(s, [0, 1], [-8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(s, [0, 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px) rotate(${rot}deg)`,
              opacity,
              transformOrigin: "left top",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

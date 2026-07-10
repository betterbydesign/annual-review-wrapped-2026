import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, TOTAL_DURATION } from "../theme";
import { useScale } from "./anim";

// A thin blue bar along the top edge that fills linearly across the ENTIRE
// video and reaches 100% exactly on the final frame. Rendered in a top-level
// AbsoluteFill so it reads the composition frame (0..TOTAL_DURATION-1).
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = useScale();

  const end = (durationInFrames || TOTAL_DURATION) - 1;

  const pct = interpolate(frame, [0, end], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const height = Math.max(4, Math.round(4 * scale));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${pct}%`,
          height,
          backgroundColor: COLORS.blue,
        }}
      />
    </AbsoluteFill>
  );
};

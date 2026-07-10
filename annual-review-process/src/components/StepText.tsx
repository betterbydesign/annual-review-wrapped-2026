import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../theme";
import { useScale } from "./anim";
import { FallingText } from "./FallingText";

// Kicker + falling headline + optional caption + optional verified badge for a
// single step. All timings are relative to the deck-local frame; `start` is the
// frame this step's card reaches the front. The block lifts and fades as `exit`
// (0->1) drives its card off screen.
export const StepText: React.FC<{
  start: number;
  exit: number;
  kicker: string;
  headline: string;
  caption?: string;
  badge?: boolean;
}> = ({ start, exit, kicker, headline, caption, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = useScale();

  // Kicker slides up + fades in.
  const kSpring = spring({
    frame: frame - start,
    fps,
    config: { damping: 200 },
  });
  const kOpacity = interpolate(kSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kY = interpolate(kSpring, [0, 1], [18 * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Caption fades in after the headline.
  const capAnim = spring({
    frame: frame - start - 14,
    fps,
    config: { damping: 200 },
  });
  const capOpacity = interpolate(capAnim, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge pops with an overshoot spring partway through the step.
  const badgeS = spring({
    frame: frame - start - 46,
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const badgePop = interpolate(badgeS, [0, 1], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(badgeS, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: 1 - exit,
        transform: `translateY(${-46 * scale * exit}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14 * scale,
          opacity: kOpacity,
          transform: `translateY(${kY}px)`,
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
          {kicker}
        </span>
      </div>

      <FallingText
        text={headline}
        delay={start + 4}
        fontSize={64 * scale}
        color={COLORS.ink}
        weight={900}
      />

      {caption ? (
        <div
          style={{
            opacity: capOpacity,
            color: COLORS.summit,
            fontWeight: 500,
            fontSize: 28 * scale,
            marginTop: 22 * scale,
          }}
        >
          {caption}
        </div>
      ) : null}

      {badge ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10 * scale,
            marginTop: 24 * scale,
            padding: `${12 * scale}px ${22 * scale}px`,
            borderRadius: 999,
            backgroundColor: COLORS.blue,
            color: COLORS.ink,
            fontWeight: 700,
            fontSize: 28 * scale,
            opacity: badgeOpacity,
            transform: `scale(${badgePop})`,
            transformOrigin: "left center",
            boxShadow: "0 12px 30px rgba(0,113,206,0.45)",
          }}
        >
          <span style={{ letterSpacing: 2 * scale }}>★★★</span>
          <span>verified</span>
        </div>
      ) : null}
    </div>
  );
};

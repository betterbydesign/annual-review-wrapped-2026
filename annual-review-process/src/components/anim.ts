import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Reference layout is the 1080x1350 feed composition. Every size is expressed
// in "feed pixels" and scaled for other aspect ratios so scenes are
// layout-responsive rather than hardcoded to one composition size.
export const useScale = () => {
  const { width, height } = useVideoConfig();
  return Math.min(width / 1080, height / 1350);
};

// Staggered entrance: opacity 0->1 and translateY 24->0, driven by a spring.
export const useEntrance = (delay: number, distance = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = useScale();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(progress, [0, 1], [distance * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    opacity,
    transform: `translateY(${translateY}px)`,
  };
};

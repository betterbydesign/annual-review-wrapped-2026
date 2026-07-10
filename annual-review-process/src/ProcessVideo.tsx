import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { COLORS, SCENE, TRANSITION, TOTAL_DURATION } from "./theme";
import { ProgressBar } from "./components/ProgressBar";
import { AssetDeck } from "./components/AssetDeck";
import { HookScene } from "./scenes/HookScene";
import { RecipeScene } from "./scenes/RecipeScene";
import { ResultScene } from "./scenes/ResultScene";
import { CloseScene } from "./scenes/CloseScene";

// Flip to true (and drop public/music.mp3) to add the optional music bed.
// Left false because no music.mp3 ships with the project.
const HAS_MUSIC = false;

const t = () => linearTiming({ durationInFrames: TRANSITION });

export const ProcessVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={SCENE.recipe}>
          <RecipeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        {/* Steps 1–5 as one continuous stacked-card reveal. */}
        <TransitionSeries.Sequence durationInFrames={SCENE.deck}>
          <AssetDeck />
        </TransitionSeries.Sequence>
        {/* Slide into the result — the one non-fade transition. */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={t()}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE.result}>
          <ResultScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={SCENE.close}>
          <CloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Top-level progress bar spanning the entire video. */}
      <ProgressBar />

      {HAS_MUSIC ? (
        <Audio
          src={staticFile("music.mp3")}
          volume={(f) =>
            interpolate(
              f,
              [TOTAL_DURATION - 30, TOTAL_DURATION],
              [0.35, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};

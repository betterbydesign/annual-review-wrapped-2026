import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CARD_ASPECT, COLORS, DECK_CARDS, FLY } from "../theme";
import { useScale } from "./anim";
import { AssetCard } from "./AssetCard";
import { StepText } from "./StepText";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Steps map onto the six stacked cards (Build spans the last two: buildspec then
// claude-design). Text is keyed to the card that reaches the front.
const STEPS = [
  {
    kicker: "Step 1 — Gather",
    headline: "Claude searched a year of Docs, Slack props, and past chats.",
    from: 0,
    to: 0,
  },
  {
    kicker: "Step 2 — Verify",
    headline: "Every number pressure-tested — weak claims cut.",
    badge: true,
    from: 1,
    to: 1,
  },
  {
    kicker: "Step 3 — Storyboard",
    headline: "12 scenes written in markdown before a single pixel.",
    caption: "Language pass: impact-first, no fluff.",
    from: 2,
    to: 2,
  },
  {
    kicker: "Step 4 — Style",
    headline: "Slide graphics mapped with ChatGPT Images.",
    from: 3,
    to: 3,
  },
  {
    kicker: "Step 5 — Build",
    headline: "One build spec → Claude Design generated the animated deck.",
    from: 4,
    to: 5,
  },
] as const;

// Alternating fly-off: even cards exit left, odd cards exit right; the motion
// type cycles roll → flip → toss so no two consecutive exits repeat.
const flyStyle = (e: number, i: number) => {
  const t = smoothstep(e);
  const dir = i % 2 === 0 ? -1 : 1;
  const kind = i % 3;
  let tx = 0;
  let ty = 0;
  let rz = 0;
  let ry = 0;
  let sc = 1;
  if (kind === 0) {
    // roll off the side
    tx = dir * 150 * t;
    rz = dir * 34 * t;
    sc = 1 - 0.1 * t;
    ty = -6 * t;
  } else if (kind === 1) {
    // flip away in 3D
    ry = dir * 105 * t;
    tx = dir * 55 * t;
    sc = 1 - 0.05 * t;
    ty = -2 * t;
  } else {
    // toss with spin
    tx = dir * 140 * t;
    rz = dir * 50 * t;
    ty = 12 * t;
    sc = 1 - 0.16 * t;
  }
  const opacity = interpolate(e, [0, 0.72, 1], [1, 1, 0], clamp);
  return {
    transform: `translate(${tx}%, ${ty}%) rotateZ(${rz}deg) rotateY(${ry}deg) scale(${sc})`,
    opacity,
  };
};

export const AssetDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const scale = useScale();

  const durs = DECK_CARDS.map((c) => c.dur);
  const N = DECK_CARDS.length;
  const starts: number[] = [];
  const ends: number[] = [];
  let acc = 0;
  for (let i = 0; i < N; i++) {
    starts.push(acc);
    acc += durs[i];
    ends.push(acc);
  }

  // Front card index: the last card whose window has begun.
  let T = 0;
  for (let i = 0; i < N; i++) if (starts[i] <= frame) T = i;

  // Fly progress of the current front card (last card never flies).
  const canFly = T < N - 1;
  const fp = canFly
    ? interpolate(frame, [ends[T] - FLY, ends[T]], [0, 1], clamp)
    : 0;

  // Deck box, centered a bit below middle, sized to the card aspect.
  let deckH = height * 0.5;
  let deckW = deckH * CARD_ASPECT;
  if (deckW > width * 0.88) {
    deckW = width * 0.88;
    deckH = deckW / CARD_ASPECT;
  }
  const cx = width / 2;
  const cy = height * 0.64;
  const radius = 18 * scale;

  const tiltFor = (i: number) => (i % 2 === 0 ? 2.4 : -2.4);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 32%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 100%)`,
      }}
    >
      {/* Soft glow behind the deck so cards separate from the background. */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: deckW * 1.15,
          height: deckH * 1.15,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(0,113,206,0.28), rgba(0,113,206,0))",
          filter: "blur(24px)",
        }}
      />

      {/* Card stack */}
      <div
        style={{
          position: "absolute",
          left: cx - deckW / 2,
          top: cy - deckH / 2,
          width: deckW,
          height: deckH,
          perspective: 1600,
        }}
      >
        {DECK_CARDS.map((card, i) => {
          if (i < T) return null; // already flew off
          const relDepth = i - T - fp;
          if (relDepth > 3.2) return null; // too deep to see

          let transform: string;
          let opacity = 1;
          let brightness = 1;

          if (i === T) {
            if (fp > 0) {
              const f = flyStyle(fp, i);
              transform = f.transform;
              opacity = f.opacity;
            } else {
              const dwell = interpolate(
                frame,
                [starts[i], ends[i] - FLY],
                [0, 1],
                clamp,
              );
              const kb = 1 + 0.03 * dwell;
              transform = `translateY(${-1.2 * dwell}%) scale(${kb})`;
            }
          } else {
            const d = Math.max(relDepth, 0);
            const sc = 1 - 0.055 * d;
            const ty = 4.6 * d;
            const tilt = tiltFor(i) * Math.min(d, 1);
            transform = `translateY(${ty}%) scale(${sc}) rotate(${tilt}deg)`;
            brightness = 1 - 0.13 * Math.min(d, 3);
            opacity = interpolate(relDepth, [3, 3.2], [1, 0], clamp);
          }

          const zIndex = i === T ? 3000 : Math.round(2000 - i * 10);

          // Ken-burns drift only on the settled front card.
          const driftY =
            i === T && fp === 0
              ? interpolate(
                  frame,
                  [starts[i], ends[i] - FLY],
                  [0, i % 2 === 0 ? -1.6 : 1.6],
                  clamp,
                )
              : 0;

          return (
            <div
              key={card.key}
              style={{
                position: "absolute",
                inset: 0,
                transform,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <AssetCard
                src={card.src}
                radius={radius}
                brightness={brightness}
                driftY={driftY}
              />
            </div>
          );
        })}
      </div>

      {/* Step text overlay, keyed to the card at the front. */}
      <div
        style={{
          position: "absolute",
          top: 96 * scale,
          left: 84 * scale,
          right: 84 * scale,
        }}
      >
        {STEPS.map((step, s) => {
          const stepStart = starts[step.from];
          const stepEnd = ends[step.to];
          if (frame < stepStart - 10 || frame > stepEnd + 2) return null;

          const exit =
            step.to < N - 1
              ? interpolate(
                  frame,
                  [ends[step.to] - FLY, ends[step.to]],
                  [0, 1],
                  clamp,
                )
              : 0;

          return (
            <div key={s} style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
              <StepText
                start={stepStart}
                exit={exit}
                kicker={step.kicker}
                headline={step.headline}
                caption={"caption" in step ? step.caption : undefined}
                badge={"badge" in step ? step.badge : undefined}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

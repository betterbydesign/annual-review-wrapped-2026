# Build Brief — "How I Built My Annual Review with AI" (Remotion process video)

*A self-contained packet: the story, the assets to capture, the video storyboard, and a paste-ready prompt for a Claude Code + Remotion session. Goal: a ~65-second LinkedIn-native video showcasing the AI-assisted workflow behind the annual review presentation, posted with the GitHub Pages link.*

---

## 1. The story the video tells (source narrative)

Six beats — this is also the skeleton for the LinkedIn post copy:

1. **Gather** — Claude searched a year of work: Google Docs, Slack #props mentions, past chats and memories (July 2025 – June 2026).
2. **Verify** — every claim pressure-tested into a metrics dossier with confidence ratings; unsupported numbers cut.
3. **Storyboard** — a 12-scene, Spotify-Wrapped-style narrative written as markdown before a single pixel existed.
4. **Art direction** — slide graphics and styles mapped with ChatGPT Images.
5. **Build** — one build spec handed to Claude Design → a self-running animated HTML presentation.
6. **Ship** — pushed to GitHub Pages. Link in post.

---

## 2. Remotion — capabilities & constraints that shape this build

**How it works**
- A video is a React component rendered per frame: `useCurrentFrame()` returns the frame number; animate with `interpolate(frame, [in], [out], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })` and `spring()`.
- A `<Composition>` in `src/Root.tsx` defines `width`, `height`, `fps`, `durationInFrames`. Multiple compositions can be registered — one codebase, several output formats.
- `<AbsoluteFill>` layers content; `<Sequence>` time-shifts it; `<TransitionSeries>` (from `@remotion/transitions`) sequences scenes with `fade()`/`slide()` presentations and `linearTiming`/`springTiming`.
- Assets go in `public/` and are referenced via `staticFile()`. `<Img>` for images, `<OffthreadVideo>` (or `<Video>` from `@remotion/media`) for embedded video clips, `<Audio>` for music.
- Preview live in Remotion Studio (`npm run dev`); render with `npx remotion render`.

**Constraints**
- **Deterministic only:** no `Math.random()` (use Remotion's seeded `random()`), no CSS transitions/animations — everything must be a function of the frame.
- **Transition math:** `<TransitionSeries.Transition>` overlaps scenes, so total duration = sum of sequences − sum of transitions.
- **System:** Node 16+; macOS 15+ on Mac; Chrome-based rendering happens locally.
- **License:** free for individuals and companies with ≤3 employees; larger companies need a paid company license — check remotion.dev/license if this becomes Altitude work rather than a personal post.
- **Agent-ready:** official Remotion Agent Skills exist for Claude Code — the scaffold below installs them.

**Project setup (run yourself, before starting the agent)**

```bash
npx create-video@latest --yes --blank annual-review-process
cd annual-review-process
npm install
npm run dev          # Remotion Studio — keep open to watch the agent's work live
# in a second terminal:
claude               # then paste the Master Prompt from §6
```

---

## 3. Output format decision

| Option | Feed behavior | Fit for landscape screenshots | Call |
|---|---|---|---|
| **4:5 · 1080×1350** | Fills nearly the full mobile screen; best engagement for <60s posts | Full-width screenshot ≈ 1080×608, leaving ~740px for headline + caption — generous | **Primary** |
| 1:1 · 1080×1080 | Safe on desktop + mobile | Works, slightly less caption room | Fallback if 4:5 crops feel tight |
| 16:9 · 1920×1080 | Smallest feed footprint | Native fit | **Secondary render** for GitHub README / portfolio |

**Decision:** build scenes responsive to the composition size and register two compositions — `ProcessVideo-Feed` (1080×1350, primary) and `ProcessVideo-Wide` (1920×1080). 30fps. Target ≈65s (~1950 frames on screen).

**Sound-off first:** LinkedIn autoplays muted. All meaning lives in on-screen text; music (if any) is texture only. No voiceover, so no .srt needed.

---

## 4. Asset manifest (what to capture before the agent session)

Drop everything into `public/` with these exact names. Capture screenshots at Retina/2x so they stay crisp at 1080px wide. Tidy windows first: close extra tabs, hide bookmarks bar, dark mode where available (consistent with the Agent Hub look).

| File | What it is | Capture notes |
|---|---|---|
| `chat-compile.png` | The metrics/evidence compilation chat in Claude | Show a moment where Drive/Slack results are visible in the thread |
| `chat-revision.png` | This chat — the scene-language revision pass | A screen with the before→after copy edits visible |
| `doc-storyboard.png` | `Annual-Review-Scene-by-Scene.md` | Rendered markdown view, Scene 4–6 region (numbers visible) |
| `doc-buildspec.png` | `Claude-Design-Build-Spec.md` | Show the `reviewData` code block — it reads as "spec as code" |
| `gpt-images.png` | ChatGPT Images session | The grid/canvas of style frames |
| `claude-design.png` | Claude Design mid-build | The artifact preview beside the conversation |
| `final-presentation.mp4` | **Screen recording** of the finished deck, 10–15s | QuickTime/Cmd+Shift+5, 1080p+, capture 2–3 scenes auto-playing — include a count-up stat and the quote card. This is the payoff; a still undersells an animated deck |
| `final-cover.png` | Still of the deck's cover scene | Doubles as the custom LinkedIn thumbnail |
| `music.mp3` *(optional)* | Royalty-free bed, calm/techy, ~70s | Only if licensed for social use; video must work without it |

---

## 5. Video storyboard (9 scenes · 30fps · ≈65s on screen)

Palette = official Altitude tokens, same as the presentation (continuity is the point): navy `#00203D`, blue `#0071CE`, summit `#CEE5F6`, trailhead `#F4F2ED`, basecamp `#2E3B40`. Font: Roboto (via `@remotion/google-fonts/Roboto`), 700/900 for display, 400/500 for captions. Screenshots render as rounded-corner (14px) cards with soft shadow on navy — the Agent Hub card language. Transitions: 15-frame `fade()` throughout, except a `slide()` into Scene 8.

| # | Scene | On-screen (s) | Content & motion |
|---|---|---|---|
| 1 | **Hook** | 4 | Navy bg. Line 1 springs in: "I built my annual review like Spotify Wrapped." Line 2: "Here's the AI workflow behind it." Thin blue progress bar starts filling along the top (runs the whole video — the deck's story-bar motif). |
| 2 | **The recipe** | 5 | Six numbered step chips stagger in (~5 frames apart): Gather · Verify · Storyboard · Style · Build · Ship. Chips reuse the deck's pill style. |
| 3 | **Step 1 · Gather** | 7 | Kicker "STEP 1 — GATHER". Headline: "Claude searched a year of Docs, Slack props, and past chats." `chat-compile.png` rises in with a slow Ken Burns (scale 1.0→1.06, slight upward drift). |
| 4 | **Step 2 · Verify** | 7 | "Every number pressure-tested — weak claims cut." `doc-storyboard.png` card + a small ★★★ badge that pops in with `spring()`. |
| 5 | **Step 3 · Storyboard** | 7 | "12 scenes written in markdown before a single pixel." `chat-revision.png` slides up; caption: "Language pass: impact-first, no fluff." |
| 6 | **Step 4 · Style** | 6 | "Slide graphics mapped with ChatGPT Images." `gpt-images.png`, Ken Burns drifting the opposite direction from Scene 3. |
| 7 | **Step 5 · Build** | 7 | "One build spec → Claude Design generated the animated deck." Split beat: `doc-buildspec.png` first, crossfading to `claude-design.png` at the midpoint. |
| 8 | **Step 6 · The result** | 14 | The payoff. "The finished presentation —" then `final-presentation.mp4` plays full-card via `<OffthreadVideo>`. Minimal text; let the deck's own motion carry it. Longest scene by design. |
| 9 | **Close / CTA** | 8 | Navy. "Watch the full presentation → link in this post." Below, small toolchain line fades in: "Claude · ChatGPT Images · Claude Design · Remotion · GitHub Pages." Progress bar completes. Hold last 2s static (clean loop point / thumbnail-safe). |

Total on-screen ≈ 65s; with eight 15-frame transitions the rendered file lands ≈ 61s. All text ≥ 44px at 1080-width equivalents; nothing essential in the outer 5% (mobile crop safety).

---

## 6. Master Prompt — paste into Claude Code

````
You are building a short promotional video in this Remotion project (already scaffolded
with create-video, Tailwind, and Remotion Agent Skills — use the skills for API guidance).

GOAL
A ~65-second, sound-off-first LinkedIn video titled "How I built my annual review with AI."
It walks through a 6-step AI workflow and ends on a screen recording of the finished
presentation. All assets are already in public/.

COMPOSITIONS (register both in src/Root.tsx; scenes must be layout-responsive via
useVideoConfig, not hardcoded to one size)
1. id "ProcessVideo-Feed": 1080x1350, fps 30  ← primary
2. id "ProcessVideo-Wide": 1920x1080, fps 30
Compute durationInFrames from the scene table below minus transition overlaps.

DESIGN SYSTEM
- Colors: navy #00203D (dominant bg), blue #0071CE (accents, numbers, progress bar),
  summit #CEE5F6, trailhead #F4F2ED (text on dark), basecamp #2E3B40 (alt dark).
- Font: Roboto via @remotion/google-fonts/Roboto — 900/700 display, 500/400 captions.
- Screenshots and video render inside "cards": 14px border-radius, subtle shadow,
  1px rgba(255,255,255,0.08) border, centered on navy with breathing room.
- A 4px blue progress bar along the top edge fills linearly across the ENTIRE video
  (interpolate over total duration) — render it in a top-level AbsoluteFill layer.
- Step scenes share one layout component: small uppercase blue kicker ("STEP N — NAME"),
  bold trailhead headline (max 2 lines), asset card below, optional small caption.

MOTION RULES
- Frame-driven only: useCurrentFrame + interpolate (always clamp both extrapolates)
  and spring({ frame, fps, config: { damping: 200 } }) for entrances. No CSS animations,
  no Math.random().
- Text entrances: translateY 24->0 + opacity 0->1, staggered ~4 frames per element.
- Screenshots: slow Ken Burns — scale 1.0->1.06 with slight translate over the scene;
  alternate drift direction between consecutive screenshot scenes.
- Scene changes: TransitionSeries with fade(), linearTiming 15 frames — EXCEPT into
  Scene 8, use slide({ direction: "from-right" }).
- One flourish max per scene.

SCENES (durations = on-screen frames at 30fps, before transition overlap)
1. HOOK (120): navy bg. "I built my annual review like Spotify Wrapped." springs in,
   then "Here's the AI workflow behind it." Progress bar begins.
2. RECIPE (150): six pill chips stagger in: Gather / Verify / Storyboard / Style /
   Build / Ship — rounded chips, trailhead text, blue leading dot.
3. STEP 1 — GATHER (210): headline "Claude searched a year of Docs, Slack props, and
   past chats." Asset: staticFile("chat-compile.png").
4. STEP 2 — VERIFY (210): "Every number pressure-tested — weak claims cut."
   Asset: doc-storyboard.png. A small "★★★ verified" badge pops in with spring at ~half.
5. STEP 3 — STORYBOARD (210): "12 scenes written in markdown before a single pixel."
   Asset: chat-revision.png. Caption: "Language pass: impact-first, no fluff."
6. STEP 4 — STYLE (180): "Slide graphics mapped with ChatGPT Images."
   Asset: gpt-images.png.
7. STEP 5 — BUILD (210): "One build spec → Claude Design generated the animated deck."
   Assets: doc-buildspec.png crossfading to claude-design.png at the scene midpoint
   (internal crossfade via interpolated opacity, not a TransitionSeries).
8. STEP 6 — RESULT (420): kicker "STEP 6 — SHIP", brief headline "The finished
   presentation", then <OffthreadVideo src={staticFile("final-presentation.mp4")} muted>
   filling the card. If the clip is shorter than the scene, freeze on its last frame
   (default behavior) — do not loop.
9. CLOSE (240): "Watch the full presentation → link in this post." Then a smaller line:
   "Claude · ChatGPT Images · Claude Design · Remotion · GitHub Pages". Progress bar
   completes exactly at the final frame. Last 60 frames fully static.

OPTIONAL AUDIO
If public/music.mp3 exists: <Audio> at volume 0.35 with a 30-frame fade-out at the end.
If it doesn't exist, skip audio entirely — do not error.

ACCEPTANCE CHECKLIST (verify each before finishing)
- [ ] Both compositions render in Studio with no console errors or flicker.
- [ ] Feed composition: all text inside the middle 90% of the frame; nothing clipped.
- [ ] Progress bar reaches 100% exactly at the last frame.
- [ ] Ken Burns directions alternate; every interpolate call clamps.
- [ ] Scene 8 video plays muted and freezes (not loops) if shorter than the scene.
- [ ] Total runtime 58–66s after transition overlap.
- [ ] Render both outputs and report file sizes:
      npx remotion render ProcessVideo-Feed out/linkedin-4x5.mp4
      npx remotion render ProcessVideo-Wide out/wide-16x9.mp4
````

---

## 7. Render → post checklist

1. `out/linkedin-4x5.mp4` is the upload (MP4/H.264 — Remotion's default codec; native feed allows up to 5GB, so size won't be an issue).
2. Upload **natively** on LinkedIn — never a link to the file. Native uploads autoplay and materially outperform external links.
3. Set `final-cover.png` as the custom thumbnail (same aspect ratio, <2MB).
4. Post copy skeleton: hook line ("My annual review, built like Spotify Wrapped — here's the AI workflow") → the six steps as one-liners → GitHub Pages link → close with a question to invite comments (e.g., "What would you automate first?").
5. Watch the first 3 seconds on your phone, muted, before posting — that's exactly how the feed will serve it.
6. `out/wide-16x9.mp4` → GitHub README / portfolio embed.

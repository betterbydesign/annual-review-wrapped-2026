import "./index.css";
import { Composition } from "remotion";
import { ProcessVideo } from "./ProcessVideo";
import { FPS, TOTAL_DURATION } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Primary — LinkedIn feed 4:5 */}
      <Composition
        id="ProcessVideo-Feed"
        component={ProcessVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/* Secondary — 16:9 for README / portfolio */}
      <Composition
        id="ProcessVideo-Wide"
        component={ProcessVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

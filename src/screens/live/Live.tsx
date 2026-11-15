import type { ReactNode } from "react";
import { MANAGER } from "../../fixtures/week3";
import { PageFrame, Placeholder } from "../../parts";
import "./Live.css";
import { PointsPanel } from "./Panel";
import { BugFinal, BugNow, Idle, StreamPicker } from "./Stage";
import type { LiveDownProps, LiveIdleProps, LiveNowProps, Picker } from "./types";
import { WORDS } from "./words";

/** The page: the dark stage (stream, scorebug, picker) in the main column, your points beside it. */
function LiveFrame({ screen, bug, picker, panel }: { screen: ReactNode; bug: ReactNode; picker: Picker; panel: ReactNode }) {
  return (
    <PageFrame screen="live" active="live" account={MANAGER.team} side={<div className="live__side">{panel}</div>}>
      <div className="live__stage">
        <div className="live__screen">{screen}</div>
        <div className="live__bug">{bug}</div>
        <StreamPicker {...picker} />
      </div>
    </PageFrame>
  );
}

/** A series live: the stream, the scorebug with the live game, your live points. */
export function LiveNow({ bug, panel, picker }: LiveNowProps) {
  return (
    <LiveFrame
      screen={<Placeholder word={WORDS.stream} fill />}
      bug={<BugNow bug={bug} />}
      picker={picker}
      panel={<PointsPanel panel={panel} />}
    />
  );
}

/** The live feed down: the same stage; the panel says so, and the live series' games show dashes. */
export function LiveDown({ bug, panel, picker }: LiveDownProps) {
  return (
    <LiveFrame
      screen={<Placeholder word={WORDS.stream} fill />}
      bug={<BugNow bug={bug} />}
      picker={picker}
      panel={<PointsPanel panel={panel} down />}
    />
  );
}

/** Nothing live: the next series and a countdown, the last series final on the scorebug. */
export function LiveIdle({ next, last, panel, picker }: LiveIdleProps) {
  return <LiveFrame screen={<Idle next={next} />} bug={<BugFinal bug={last} />} picker={picker} panel={<PointsPanel panel={panel} />} />;
}

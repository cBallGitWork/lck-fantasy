import type { ReactNode } from "react";
import { MANAGER } from "../../fixtures/week3";
import { PageFrame, Placeholder, score as scoreText, useAnnounceChange } from "../../parts";
import { SCREEN_NAME } from "../../paths";
import "./live.css";
import { PointsPanel } from "./Panel";
import { BugFinal, BugNow, Idle, StreamPicker } from "./Stage";
import type { LiveBug, LiveDownProps, LiveIdleProps, LiveNowProps, Picker, WeekTotal } from "./types";
import { dot, WORDS } from "./words";

/** What the live region says as a series moves: the score, then your week (`T1 1–0 DK · Your week 94`). */
export const liveNews = (bug: LiveBug, week: WeekTotal) => `${bug.home} ${scoreText(bug.score)} ${bug.away}${dot}${WORDS.yourWeek} ${week.total}`;

/** The page: its h1, unseen, then the dark stage (stream, scorebug, picker) in the main column, your points beside it. */
function LiveFrame({ screen, bug, picker, panel }: { screen: ReactNode; bug: ReactNode; picker: Picker; panel: ReactNode }) {
  return (
    <PageFrame screen="live" active="live" account={MANAGER.team} side={<div className="live__side">{panel}</div>}>
      <h1 className="unseen">{SCREEN_NAME.live}</h1>
      <div className="live__stage">
        <div className="live__screen">{screen}</div>
        <div className="live__bug">{bug}</div>
        <StreamPicker {...picker} />
      </div>
    </PageFrame>
  );
}

/** A series live: the stream, the scorebug with the live game, your live points; a screen reader hears the score and your week as they move. */
export function LiveNow({ bug, panel, picker }: LiveNowProps) {
  useAnnounceChange(liveNews(bug, panel.week));
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

import { cx, Tag } from "../../parts";
import type { NextSeries, PastSeries } from "./card";

/** The last 3 series with his points (`Live` while live), a rule, then the next 3, the first in ink. */
export function SeriesStrip({ past, next }: { past: PastSeries[]; next: NextSeries[] }) {
  return (
    <div className="player-card__strip">
      {past.map((s) => (
        <div key={s.id} className="player-card__strip-cell">
          <span className="player-card__quiet">
            W{s.week} · {s.day}
          </span>
          <b className="player-card__figure num">
            {s.points}
            {s.live && <Tag kind="live">Live</Tag>}
          </b>
          <span className="player-card__quiet">v {s.opponent}</span>
        </div>
      ))}
      <span className="player-card__now" />
      {next.map((s, i) => (
        <div key={s.id} className="player-card__strip-cell">
          <span className="player-card__quiet">
            W{s.week} · {s.day} · Bo{s.bestOf}
          </span>
          <span className={cx("player-card__next num", i === 0 && "player-card__next--first")}>v {s.opponent}</span>
        </div>
      ))}
    </div>
  );
}

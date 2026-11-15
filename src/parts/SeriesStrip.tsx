import { cx } from "./cx";
import { bestOf } from "./figures";
import { Tag } from "./Tag";
import "./SeriesStrip.css";

/** A series a card's strip shows: when, and against whom. */
interface StripSeries {
  week: number;
  day: string;
  opponent: string;
}

/** A series played, with his points; `live` while it is. */
export interface StripPast extends StripSeries {
  points: number;
  live?: boolean;
}

/** A series to come, with its length. */
export interface StripNext extends StripSeries {
  bestOf: number;
}

/** A card's series strip: the last 3 with his points (`Live` while live), a 2px ink rule, then the next 3, the first in ink. */
export function SeriesStrip({ past, next }: { past: readonly StripPast[]; next: readonly StripNext[] }) {
  return (
    <div className="series-strip">
      {past.map((s) => (
        <div key={`${s.week}-${s.day}`} className="series-strip__cell">
          <span className="series-strip__when">
            W{s.week} · {s.day}
          </span>
          <b className="series-strip__points num">
            {s.points}
            {s.live && <Tag kind="live">Live</Tag>}
          </b>
          <span className="series-strip__when">v {s.opponent}</span>
        </div>
      ))}
      <span className="series-strip__now" />
      {next.map((s, i) => (
        <div key={`${s.week}-${s.day}`} className="series-strip__cell">
          <span className="series-strip__when">
            W{s.week} · {s.day} · {bestOf(s.bestOf)}
          </span>
          <span className={cx("series-strip__next num", i === 0 && "series-strip__next--first")}>v {s.opponent}</span>
        </div>
      ))}
    </div>
  );
}

import { cx } from "../util/cx";
import { bestOf } from "../text/figures";
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

/** The strip's cell key: a team plays once a day. */
const cellKey = (s: { week: number; day: string }) => `${s.week}-${s.day}`;

/** A card tab's rows less the series its strip already shows, so each series shows once. */
export function beyondStrip<R extends { week: number; day: string }>(rows: readonly R[], strip: readonly { week: number; day: string }[]): R[] {
  const shown = new Set(strip.map(cellKey));
  return rows.filter((r) => !shown.has(cellKey(r)));
}

/** A card's series strip: the last 3 with his points (`Live` while live), a 2px `--text` rule, then the next 3, the first in `--text`. */
export function SeriesStrip({ past, next }: { past: readonly StripPast[]; next: readonly StripNext[] }) {
  return (
    <div className="series-strip">
      {past.map((s) => (
        <div key={cellKey(s)} className="series-strip__cell">
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
        <div key={cellKey(s)} className="series-strip__cell">
          <span className="series-strip__when">
            W{s.week} · {s.day} · {bestOf(s.bestOf)}
          </span>
          <span className={cx("series-strip__next num", i === 0 && "series-strip__next--first")}>v {s.opponent}</span>
        </div>
      ))}
    </div>
  );
}

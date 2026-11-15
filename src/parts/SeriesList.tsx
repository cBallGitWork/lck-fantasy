import type { Go } from "../paths";
import { score, type Score } from "./figures";
import { GoLink } from "./GoLink";
import "./SeriesList.css";
import { Tag } from "./Tag";
import { Time } from "./Time";

export type SeriesState = "final" | "notFinal" | "live" | "next";

/** One series as a list shows it. */
export interface SeriesRow {
  id: string;
  day: string;
  /** The manager's time, then KST. */
  local: string;
  kst: string;
  home: string;
  away: string;
  /** Games won, home then away; absent until it starts. */
  score?: Score;
  state: SeriesState;
}

function Result({ s }: { s: SeriesRow }) {
  if (s.state === "next" || !s.score) return <Time local={s.local} kst={s.kst} />;
  const games = score(s.score);
  if (s.state === "live")
    return (
      <>
        {games} <Tag kind="live">Live</Tag>
      </>
    );
  if (s.state === "notFinal")
    return (
      <>
        {games} <Tag kind="notFinal">Not final</Tag>
      </>
    );
  return <>{games}</>;
}

/** The week's series, one row each: day, `T1 v DK`, then the score and its state, or the time. */
export function SeriesList({ series, go }: { series: readonly SeriesRow[]; go?: (s: SeriesRow) => Go }) {
  return (
    <div className="series-list">
      {series.map((s) => {
        const teams = (
          <>
            <b>{s.home}</b> v <b>{s.away}</b>
          </>
        );
        return (
          <div key={s.id} className="series-list__row">
            <span className="series-list__day">{s.day}</span>
            <span>{go ? <GoLink go={go(s)}>{teams}</GoLink> : teams}</span>
            <span className="series-list__result num">
              <Result s={s} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

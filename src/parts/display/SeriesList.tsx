import type { Go } from "../../paths";
import { score, type Score } from "../text/figures";
import { GoLink } from "../controls/GoLink";
import "./SeriesList.css";
import { TeamBar } from "./TeamBar";
import { LiveTag, NotFinalTag } from "./Tag";
import { Time } from "./Time";

export type SeriesState = "final" | "notFinal" | "live" | "next";

/** One series as a list shows it. */
export interface SeriesRow {
  id: string;
  day: string;
  /** The manager's time. */
  local: string;
  home: string;
  away: string;
  /** Games won, home then away; absent until it starts. */
  score?: Score;
  state: SeriesState;
}

function Result({ s }: { s: SeriesRow }) {
  if (s.state === "next" || !s.score) return <Time local={s.local} />;
  const games = score(s.score);
  if (s.state === "live")
    return (
      <>
        {games} <LiveTag />
      </>
    );
  if (s.state === "notFinal")
    return (
      <>
        {games} <NotFinalTag />
      </>
    );
  return <>{games}</>;
}

/** The week's series, one row each: day, `T1 v DK`, then the score and its state, or the time. `ruled`: 40px rows under 1px `--line` rules, edge to edge in a banded panel (Points). */
export function SeriesList({ series, go, ruled }: { series: readonly SeriesRow[]; go?: (s: SeriesRow) => Go; ruled?: boolean }) {
  return (
    <div className={ruled ? "series-list series-list--ruled" : "series-list"}>
      {series.map((s) => {
        const teams = (
          <>
            <TeamBar team={s.home} />
            <b>{s.home}</b> v <TeamBar team={s.away} />
            <b>{s.away}</b>
          </>
        );
        return (
          <div key={s.id} className="series-list__row">
            <span className="quiet">{s.day}</span>
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

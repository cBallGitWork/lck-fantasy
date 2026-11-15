import "./SeriesList.css";
import { Tag } from "./Tag";
import { Time } from "./Time";

/** One series as a list shows it. */
export interface SeriesRow {
  id: string;
  day: string;
  local: string;
  kst: string;
  home: string;
  away: string;
  score?: readonly [number, number];
  state: "final" | "notFinal" | "live" | "next";
}

function Result({ s }: { s: SeriesRow }) {
  if (s.state === "next" || !s.score) return <Time local={s.local} kst={s.kst} />;
  const score = `${s.score[0]}–${s.score[1]}`;
  if (s.state === "live")
    return (
      <>
        {score} <Tag kind="live">Live</Tag>
      </>
    );
  if (s.state === "notFinal")
    return (
      <>
        {score} <Tag kind="notFinal">Not final</Tag>
      </>
    );
  return <>{score}</>;
}

/** The week's series, one row each: day, `T1 v DK`, then the score and its state, or the time. */
export function SeriesList({ series, href }: { series: readonly SeriesRow[]; href?: (s: SeriesRow) => string }) {
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
            <span>{href ? <a href={href(s)}>{teams}</a> : teams}</span>
            <span className="series-list__result num">
              <Result s={s} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

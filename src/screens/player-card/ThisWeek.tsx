import { cx, result, score, Tag } from "../../parts";
import type { CardWeek, WeekSeries } from "./card";

/** A series' points: the games that count. */
const seriesPoints = (s: WeekSeries) => s.games.reduce((sum, g) => sum + (g.counts ? g.points : 0), 0);

/** This week: each series with its points in its head, each game with champion, K/D/A and points, then the week's total. */
export function ThisWeek({ week }: { week: CardWeek }) {
  const raw = week.series.reduce((sum, s) => sum + seriesPoints(s), 0);
  return (
    <div>
      {week.series.map((s) => (
        <section key={s.id}>
          <h3 className="player-card__section">
            <span>
              {s.day} · v {s.opponent}{" "}
              <span className="player-card__quiet">{s.state === "live" ? score(s.score) : result(s.score)}</span>{" "}
              {s.state === "live" ? <Tag kind="live">G{s.liveGame} live</Tag> : <Tag>Final</Tag>}
            </span>
            <b className="num">{seriesPoints(s)}</b>
          </h3>
          <table className="player-card__games">
            <tbody>
              {s.games.map((g, i) => (
                <tr key={i} className={cx(!g.counts && "player-card__dropped")}>
                  <td className="player-card__quiet">G{i + 1}</td>
                  <td>
                    {g.champion} <span className="player-card__quiet">· {g.outcome ?? g.clock}</span>
                  </td>
                  <td className="player-card__right num">{g.kda}</td>
                  <td className="player-card__right player-card__points num">{g.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      <table className="player-card__games player-card__total">
        <tbody>
          <tr>
            <td colSpan={2}>Week {week.week}</td>
            <td className="player-card__right player-card__quiet num">{week.carry !== undefined && `${raw} × ${week.carry} Carry`}</td>
            <td className="player-card__right player-card__points num">{week.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

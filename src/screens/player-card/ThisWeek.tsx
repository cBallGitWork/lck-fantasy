import { cx, gameNo, NONE, seriesResult, seriesTitle, sum, Time } from "../../parts";
import type { CardWeek, PlayedSeries, WeekSeries } from "./card";
import { captainSum, weekNo } from "./words";

/** A series' points: the games that count. */
const seriesPoints = (s: PlayedSeries) => sum(s.games.filter((g) => g.counts).map((g) => g.points));

const isPlayed = (s: WeekSeries): s is PlayedSeries => s.state !== "upcoming";

/**
 * This week: each series with its score and points in its head (the strip carries its Live tag), each game with champion, K/D/A and points,
 * then the week's total. A series not yet started shows its time and — for points, and the total is — until his first game (spec/12).
 */
export function ThisWeek({ week }: { week: CardWeek }) {
  const played = week.series.filter(isPlayed);
  const started = played.some((s) => s.games.length > 0);
  const raw = sum(played.map(seriesPoints));
  return (
    <div>
      {week.series.map((s) => (
        <section key={s.id}>
          <h3 className="player-card__section">
            <span>
              {seriesTitle(s.day, s.opponent)}{" "}
              <span className="player-card__quiet quiet">
                {isPlayed(s) ? seriesResult(s.score, s.state === "live") : <Time local={s.local} kst={s.kst} />}
              </span>
            </span>
            <b className="num">{isPlayed(s) ? seriesPoints(s) : NONE}</b>
          </h3>
          {isPlayed(s) && (
            <table className="player-card__games">
              <tbody>
                {s.games.map((g, i) => (
                  <tr key={i} className={cx(!g.counts && "player-card__dropped")}>
                    <td className="player-card__quiet quiet">{gameNo(i + 1)}</td>
                    <td>
                      {g.champion} <span className="player-card__quiet quiet">· {g.outcome ?? g.clock}</span>
                    </td>
                    <td className="player-card__right num">{g.kda}</td>
                    <td className="player-card__right player-card__points num">{g.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
      <table className="player-card__games player-card__total">
        <tbody>
          <tr>
            <td colSpan={2}>{weekNo(week.week)}</td>
            <td className="player-card__right player-card__quiet quiet num">{started && week.captain !== undefined && captainSum(raw, week.captain)}</td>
            <td className="player-card__right player-card__points num">{started ? week.total : NONE}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

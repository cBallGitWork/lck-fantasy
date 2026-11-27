import { Crest, cx, gameNo, GoLink, LinkGo, NONE, outcome, seriesResult, signed } from "../../parts";
import { cardGo, seriesGo } from "../../paths";
import { CardPoints, MARK_NAME, MarkBadge, ResultChip, RiftCard } from "../../rift";
import type { PointsGame, PointsPlayer, PointsSeries, PointsStarter } from "./types";
import { captainNote, dot, versus, WORDS } from "./words";

/** A series' header row: day, the opponent's crest, `v HLE ›` to its Series page, `W 2–1` or `Live 1–0`, its points. */
function SeriesRow({ s, span }: { s: PointsSeries; span: number }) {
  const live = s.state === "live";
  return (
    <tr className="points__card-series">
      <td colSpan={span}>
        <span className="points__card-cell">
          <span className="quiet">{s.day}</span>
          <Crest team={s.opponent} size="crestSmall" />
          <GoLink go={seriesGo(s.id)} className="points__card-go hover-line">
            {versus(s.opponent)} ›
          </GoLink>
          {live ? (
            <>
              <ResultChip /> <span className="quiet num">{seriesResult(s.score, true)}</span>
            </>
          ) : (
            <ResultChip won={s.score[0] > s.score[1]}>{seriesResult(s.score, false)}</ResultChip>
          )}
        </span>
      </td>
      <td className="points__fig num">
        <b>{s.points}</b>
      </td>
    </tr>
  );
}

/** A game: `G1  W  Azir`, K, D and A in their columns (a coach has none), the lines that scored, the points. */
function GameRow({ g, coach, counts }: { g: PointsGame; coach: boolean; counts: boolean }) {
  const counted = counts && g.counted;
  return (
    <tr className={cx("points__card-game", !counted && "points__card-game--dropped")}>
      <td>
        <span className="points__card-cell">
          <span className="quiet">{gameNo(g.game)}</span>
          {g.won === undefined ? <ResultChip /> : <ResultChip won={g.won}>{outcome(g.won)}</ResultChip>}
          {g.champion && <b className="points__card-champion">{g.champion}</b>}
          {g.clock && <span className="quiet num">{g.clock}</span>}
        </span>
      </td>
      {!coach && (
        <>
          <td className="points__card-k num">{g.kda?.[0]}</td>
          <td className="points__card-k points__card-d num">{g.kda?.[1]}</td>
          <td className="points__card-k num">{g.kda?.[2]}</td>
        </>
      )}
      <td className="points__card-lines quiet">{g.lines.join(dot)}</td>
      <td className="points__fig num">
        <CardPoints points={g.points} counted={counted} />
      </td>
    </tr>
  );
}

/** The coach's row under a series' games: `Series win  [+3]` or `Series loss  [−1]` (Craig, 17 Nov 2026). */
function CoachRow({ result, span, counts }: { result: number; span: number; counts: boolean }) {
  return (
    <tr className={cx("points__card-game", !counts && "points__card-game--dropped")}>
      <td colSpan={span}>{result > 0 ? WORDS.seriesWin : WORDS.seriesLoss}</td>
      <td className="points__fig num">
        <CardPoints points={signed(result)} counted={counts} />
      </td>
    </tr>
  );
}

/**
 * The tapped player's week, docked under the Rift and its panels (approved/points/, What binds 5): the
 * shared card's head, his total at the right, the Captain's `17 ×1.5 · Captains averaged 19` once before
 * it. Then one ruled table, a series a header row over its games, a coach's result row under them, and
 * Full stats ›. A bench player's points that don't count are grey; one with no games says Didn't play.
 */
export function PointsCard({ player }: { player: PointsPlayer & Partial<Pick<PointsStarter, "plays" | "captain">> }) {
  const coach = player.role === "coach";
  const span = coach ? 2 : 5;
  const c = player.captain;
  const note = c ? captainNote(c.before, c.by, MARK_NAME.C, c.average) : player.series.length === 0 ? WORDS.didntPlay : undefined;
  return (
    <RiftCard
      className="points__card"
      name={player.name}
      team={player.team}
      role={player.plays ?? player.role}
      hangul={player.hangul}
      marks={player.mark && <MarkBadge mark={player.mark} size="dock" />}
      note={note}
      figure={<span className={cx(!player.counts && "points__off")}>{player.points ?? NONE}</span>}
    >
      {player.series.length > 0 && (
        <table className="points__card-table">
          <thead>
            <tr>
              <th>{WORDS.game}</th>
              {!coach && (
                <>
                  <th className="points__fig num">{WORDS.kills}</th>
                  <th className="points__fig num">{WORDS.deaths}</th>
                  <th className="points__fig num">{WORDS.assists}</th>
                </>
              )}
              <th>{WORDS.scored}</th>
              <th className="points__fig num">{WORDS.pts}</th>
            </tr>
          </thead>
          <tbody>
            {player.series.map((s) => (
              <SeriesBlock key={s.id} s={s} coach={coach} span={span} counts={player.counts} />
            ))}
          </tbody>
        </table>
      )}
      <footer className="points__card-foot">
        <LinkGo go={cardGo(player.cardId, coach)}>{WORDS.fullStats}</LinkGo>
      </footer>
    </RiftCard>
  );
}

/** A series' header row, its games, and the coach's result row once it's over. */
function SeriesBlock({ s, coach, span, counts }: { s: PointsSeries; coach: boolean; span: number; counts: boolean }) {
  return (
    <>
      <SeriesRow s={s} span={span} />
      {s.games.map((g) => (
        <GameRow key={g.game} g={g} coach={coach} counts={counts} />
      ))}
      {s.coachResult !== undefined && <CoachRow result={s.coachResult} span={span} counts={counts} />}
    </>
  );
}

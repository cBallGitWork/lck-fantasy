import { Crest, cx, gameNo, GoLink, LinkGo, LiveTag, Modal, NONE, NotFinalTag, outcome, seriesResult, signed } from "../../parts";
import { cardGo, seriesGo } from "../../paths";
import { MARK_NAME, MarkBadge, ROLE_NAME } from "../../rift";
import "./BreakdownSheet.css";
import type { PointsGame, PointsPlayer, PointsSeries, PointsStarter } from "./types";
import { averaged, dot, versus, WORDS } from "./words";

/** A series' result: `W 2–1`, `1–0` while live (its game row says Live), a Not final tag till it is. */
function SeriesResult({ s }: { s: PointsSeries }) {
  return (
    <span className="points__breakdown-result num">
      {seriesResult(s.score, s.state === "live")}
      {s.state === "notFinal" && (
        <>
          {" "}
          <NotFinalTag />
        </>
      )}
    </span>
  );
}

/** A game: `G1  Azir W  6/1/9  Gold · Solo  [5]`; counted points boxed, a dropped one in mid grey, a live one its clock. */
function GameRow({ g, counts }: { g: PointsGame; counts: boolean }) {
  const counted = counts && g.counted;
  return (
    <div className={cx("points__breakdown-game", !counted && "points__breakdown-game--dropped")}>
      <span className="quiet num">{gameNo(g.game)}</span>
      <span className="points__breakdown-game-what">
        {g.champion && <b>{g.champion}</b>}
        {g.clock ? (
          <span>
            <LiveTag /> <span className="num">{g.clock}</span>
          </span>
        ) : (
          g.won !== undefined && <span className="points__breakdown-mid">{outcome(g.won)}</span>
        )}
      </span>
      <span className="points__breakdown-kda num">{g.kda?.join("/")}</span>
      <span className="quiet">{g.lines.join(dot)}</span>
      <RowPoints points={g.points} counted={counted} />
    </div>
  );
}

/** A row's points: boxed when they count, else plain (the row greys them). */
function RowPoints({ points, counted }: { points: number | string; counted: boolean }) {
  return <span className="points__breakdown-points num">{counted ? <b className="points__breakdown-counted counted">{points}</b> : points}</span>;
}

/** The coach's row under a series' games: `Series win  [+3]` or `Series loss  [−1]` (Craig, 17 Nov 2026). */
function CoachRow({ result, counts }: { result: number; counts: boolean }) {
  return (
    <div className={cx("points__breakdown-game", "points__breakdown-coach", !counts && "points__breakdown-game--dropped")}>
      <span className="points__breakdown-coach-what">{result > 0 ? WORDS.seriesWin : WORDS.seriesLoss}</span>
      <RowPoints points={signed(result)} counted={counts} />
    </div>
  );
}

/**
 * A tapped player's week, as FPL's points breakdown (Craig, 16 Nov 2026): a 544 sheet over the
 * page. Crest, name, hangul and C; his week's points; then each series (opening its Series
 * page) over its games, a coach's result row under them, and Full stats. The Captain's total is
 * his result, the ×1.5 hidden. A bench player's points that don't count are grey; one with no
 * games says Didn't play (Craig, 17 Nov 2026).
 */
export function BreakdownSheet({ player, onClose }: { player: PointsPlayer & Partial<Pick<PointsStarter, "plays" | "captain">>; onClose: () => void }) {
  const coach = player.role === "coach";
  const role = ROLE_NAME[player.plays ?? player.role];
  const final = player.series.every((s) => s.state === "final");
  const head = (
    <header className="points__breakdown-head">
      <Crest team={player.team} size="crestSheet" />
      <div>
        <h2 className="points__breakdown-name">
          {player.name}
          <span className="points__breakdown-hangul">{player.hangul}</span>
          {player.mark && <MarkBadge mark={player.mark} size="sheet" className="points__breakdown-mark" />}
        </h2>
        <span className="points__breakdown-mid">
          {player.team}
          {dot}
          {role}
        </span>
      </div>
      <div className={cx("points__breakdown-total", !player.counts && "points__breakdown-total--off")}>
        <b className="num">{player.points ?? NONE}</b>
        <span className="points__breakdown-total-note quiet">
          {!final && <NotFinalTag />}
          {!final && player.captain && dot}
          {player.captain && averaged(MARK_NAME.C, player.captain.average)}
        </span>
      </div>
    </header>
  );
  return (
    <Modal kind="sheet" title={player.name} head={head} onClose={onClose}>
      {player.series.map((s) => (
        <section key={s.id} className="points__breakdown-series" aria-label={versus(s.opponent)}>
          <h3 className="points__breakdown-series-head">
            <GoLink go={seriesGo(s.id)} className="points__breakdown-series-go hover-line">
              <span className="points__breakdown-day quiet">{s.day}</span> {versus(s.opponent)} <SeriesResult s={s} /> ›
            </GoLink>
            <b className="points__breakdown-series-points num">{s.points}</b>
          </h3>
          {s.games.map((g) => (
            <GameRow key={g.game} g={g} counts={player.counts} />
          ))}
          {s.coachResult !== undefined && <CoachRow result={s.coachResult} counts={player.counts} />}
        </section>
      ))}
      {player.series.length === 0 && <p className="points__breakdown-none quiet">{WORDS.didntPlay}</p>}
      <footer className="points__breakdown-foot">
        <LinkGo go={cardGo(player.cardId, coach)}>{WORDS.fullStats}</LinkGo>
      </footer>
    </Modal>
  );
}

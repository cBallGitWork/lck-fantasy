import { Crest, cx, gameNo, GoLink, LinkGo, LiveTag, Modal, NONE, NotFinalTag, outcome, seriesResult, signed } from "../../parts";
import { cardGo, seriesGo } from "../../paths";
import { MARK_NAME, MarkBadge, ROLE_NAME } from "../../rift";
import "./BreakdownSheet.css";
import type { PointsGame, PointsPlayer, PointsSeries, PointsStarter } from "./types";

/** A series' result: `W 2–1`, `1–0` while live (its game row says Live), a Not final tag till it is; the coach's `· +3`. */
function SeriesResult({ s }: { s: PointsSeries }) {
  const shown = seriesResult(s.score, s.state === "live");
  const coach = s.coachResult === undefined ? "" : ` · ${signed(s.coachResult)}`;
  return (
    <span className="points__breakdown-result num">
      {shown}
      {coach}
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
function GameRow({ g }: { g: PointsGame }) {
  return (
    <div className={cx("points__breakdown-game", !g.counted && "points__breakdown-game--dropped")}>
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
      <span className="quiet">{g.lines.join(" · ")}</span>
      <span className="points__breakdown-points num">{g.counted ? <b className="points__breakdown-counted counted">{g.points}</b> : g.points}</span>
    </div>
  );
}

/**
 * A tapped player's week, as FPL's points breakdown (Craig, 16 Nov 2026): a 544 sheet over the
 * page. Crest, name, hangul and C or V; his week's points; then each series (opening its Series
 * page) over its games, and Full stats. The Carry's total is his result, the ×1.5 hidden.
 */
export function BreakdownSheet({ player, onClose }: { player: PointsPlayer & Partial<Pick<PointsStarter, "plays" | "carry">>; onClose: () => void }) {
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
          {player.mark && (
            <MarkBadge mark={player.mark} size="sheet" className="points__breakdown-mark" />
          )}
        </h2>
        <span className="points__breakdown-mid">
          {player.team} · {role}
        </span>
      </div>
      <div className="points__breakdown-total">
        <b className="num">{player.points ?? NONE}</b>
        <span className="points__breakdown-total-note quiet">
          {!final && <NotFinalTag />}
          {!final && player.carry && " · "}
          {player.carry && `Average ${MARK_NAME.C} ${player.carry.average}`}
        </span>
      </div>
    </header>
  );
  return (
    <Modal kind="sheet" title={player.name} head={head} onClose={onClose}>
      {player.series.map((s) => (
        <section key={s.id} className="points__breakdown-series" aria-label={`v ${s.opponent}`}>
          <h3 className="points__breakdown-series-head">
            <GoLink go={seriesGo(s.id)} className="points__breakdown-series-go hover-line">
              <span className="points__breakdown-day quiet">{s.day}</span> v {s.opponent} <SeriesResult s={s} /> ›
            </GoLink>
            <b className="points__breakdown-series-points num">{s.points}</b>
          </h3>
          {s.games.map((g) => (
            <GameRow key={g.game} g={g} />
          ))}
        </section>
      ))}
      <footer className="points__breakdown-foot">
        <LinkGo go={cardGo(player.cardId, coach)}>Full stats</LinkGo>
      </footer>
    </Modal>
  );
}

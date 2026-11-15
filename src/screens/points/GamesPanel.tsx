import { LinkGo, Tag } from "../../parts";
import { PATHS, type Go } from "../../paths";
import { MARK_NAME, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PointsGame, PointsPlayer, PointsSeries, PointsStarter } from "./types";

/** `W 2–1 · final`, `1–0 · game 2 live`, or `W 2–1` and a Not final tag. */
function SeriesResult({ s }: { s: PointsSeries }) {
  const score = `${s.score[0]}–${s.score[1]}`;
  if (s.state === "live") return <span>{`${score} · game ${s.liveGame} live`}</span>;
  const result = `${s.score[0] > s.score[1] ? "W" : "L"} ${score}`;
  if (s.state === "notFinal")
    return (
      <span>
        {result} <Tag kind="notFinal">Not final</Tag>
      </span>
    );
  return <span>{`${result} · final`}</span>;
}

const outcome = (won?: boolean) => (won === undefined ? undefined : won ? "W" : "L");

/** `G1  Azir · W  [5]`: a counted game's points boxed; a live game shows its clock and Live. */
function GameRow({ g }: { g: PointsGame }) {
  const what = [g.champion, g.clock ?? outcome(g.won)].filter(Boolean).join(" · ");
  return (
    <div className={g.counted ? "points__game" : "points__game points__game--dropped"}>
      <span className="points__game-no">G{g.game}</span>
      <span className="points__game-what">
        {what}
        {g.clock && <Tag kind="live">Live</Tag>}
      </span>
      <span className="points__game-points num">{g.counted ? <span className="points__counted">{g.points}</span> : g.points}</span>
    </div>
  );
}

function cardGo(p: PointsPlayer): Go {
  return p.role === "coach" ? { to: PATHS.coachCard, params: { coachId: p.cardId } } : { to: PATHS.playerCard, params: { playerId: p.cardId } };
}

/** The tapped player's games: each series and its games, the counted ones boxed; the Carry's sum; Full stats. */
export function GamesPanel({ player, onClose }: { player: PointsPlayer & Partial<Pick<PointsStarter, "plays" | "carry">>; onClose: () => void }) {
  const meta = [player.team, ROLE_NAME[player.plays ?? player.role], player.mark && MARK_NAME[player.mark]].filter(Boolean).join(" · ");
  const carry = player.carry;
  return (
    <PlayerPanel name={player.name} meta={meta} onClose={onClose}>
      {player.series.map((s) => (
        <div key={s.id} className="points__series">
          <h4 className="points__series-head">
            {s.day} · v {s.opponent}
            <SeriesResult s={s} />
          </h4>
          {s.games.map((g) => (
            <GameRow key={g.game} g={g} />
          ))}
        </div>
      ))}
      {carry && (
        <div className="points__carry">
          <span>
            <span className="points__carry-label">Your {MARK_NAME.C}</span>
            <br />
            {`${player.series.map((s) => s.points).join(" + ")} = ${carry.raw} × ${carry.multiplier}`}
            <br />
            <span className="points__carry-label">
              Average {MARK_NAME.C} {carry.average}
            </span>
          </span>
          <b className="points__carry-points num">{player.points}</b>
        </div>
      )}
      <div className="points__full">
        <LinkGo go={cardGo(player)}>Full stats</LinkGo>
      </div>
    </PlayerPanel>
  );
}

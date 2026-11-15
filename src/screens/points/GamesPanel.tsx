import { carryWorking, outcome, result, score, Tag } from "../../parts";
import { cardGo } from "../../paths";
import { MARK_NAME, PanelFoot, PanelGame, PanelSeries, PanelSum, PanelSumLabel, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PointsPlayer, PointsSeries, PointsStarter } from "./types";

/** `W 2–1 · final`, `1–0 · game 2 live`, or `W 2–1` and a Not final tag. */
function SeriesResult({ s }: { s: PointsSeries }) {
  if (s.state === "live") return <span>{`${score(s.score)} · game ${s.liveGame} live`}</span>;
  const done = result(s.score);
  if (s.state === "notFinal")
    return (
      <span>
        {done} <Tag kind="notFinal">Not final</Tag>
      </span>
    );
  return <span>{`${done} · final`}</span>;
}

/** The tapped player's games: each series and its games, the counted ones boxed; the Carry's sum; Full stats. */
export function GamesPanel({ player, onClose }: { player: PointsPlayer & Partial<Pick<PointsStarter, "plays" | "carry">>; onClose: () => void }) {
  const meta = [player.team, ROLE_NAME[player.plays ?? player.role], player.mark && MARK_NAME[player.mark]].filter(Boolean).join(" · ");
  const carry = player.carry;
  return (
    <PlayerPanel name={player.name} meta={meta} onClose={onClose}>
      {player.series.map((s) => (
        <PanelSeries key={s.id} title={`${s.day} · v ${s.opponent}`} result={<SeriesResult s={s} />}>
          {s.games.map((g) => (
            // A live game shows its clock and Live.
            <PanelGame
              key={g.game}
              no={g.game}
              what={[g.champion, g.clock ?? (g.won === undefined ? undefined : outcome(g.won))].filter(Boolean).join(" · ")}
              points={g.points}
              counted={g.counted}
              live={g.clock && <Tag kind="live">Live</Tag>}
            />
          ))}
        </PanelSeries>
      ))}
      {carry && (
        <PanelSum
          lines={
            <>
              <PanelSumLabel>Your {MARK_NAME.C}</PanelSumLabel>
              <br />
              {carryWorking(player.series.map((s) => s.points), carry.raw, carry.multiplier)}
              <br />
              <PanelSumLabel>
                Average {MARK_NAME.C} {carry.average}
              </PanelSumLabel>
            </>
          }
          figure={player.points}
        />
      )}
      <PanelFoot go={cardGo(player.cardId, player.role === "coach")} />
    </PlayerPanel>
  );
}

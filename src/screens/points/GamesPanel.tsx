import { outcome, result, score, Tag } from "../../parts";
import { cardGo, PATHS } from "../../paths";
import { MARK_NAME, PanelFoot, PanelGame, PanelSeries, PanelSum, PanelSumLabel, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PointsPlayer, PointsSeries, PointsStarter } from "./types";

/** `W 2–1 · final`, `1–0` while live (its game row says Live), or `W 2–1` and a Not final tag. */
function SeriesResult({ s }: { s: PointsSeries }) {
  if (s.state === "live") return <span>{score(s.score)}</span>;
  const done = result(s.score);
  if (s.state === "notFinal")
    return (
      <span>
        {done} <Tag kind="notFinal">Not final</Tag>
      </span>
    );
  return <span>{`${done} · final`}</span>;
}

/** The tapped player's games: each series (opening its Series page) and its games, the counted ones boxed; the Carry's result; Full stats. */
export function GamesPanel({ player, onClose }: { player: PointsPlayer & Partial<Pick<PointsStarter, "plays" | "carry">>; onClose: () => void }) {
  const meta = [player.team, ROLE_NAME[player.plays ?? player.role], player.mark && MARK_NAME[player.mark]].filter(Boolean).join(" · ");
  const carry = player.carry;
  return (
    <PlayerPanel name={player.name} meta={meta} onClose={onClose}>
      {player.series.map((s) => (
        <PanelSeries key={s.id} title={`v ${s.opponent}`} result={<SeriesResult s={s} />} go={{ to: PATHS.series, params: { seriesId: s.id } }}>
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

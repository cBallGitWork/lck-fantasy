import { fromSide, seriesById } from "../../fixtures/series";
import type { Series } from "../../fixtures/week3";
import { outcome, result, seriesTitle } from "../../parts";
import { cardGo } from "../../paths";
import { MARK_NAME, PanelFoot, PanelGame, PanelSeries, PanelSum, PanelSumLabel, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PerfectPlayer, PlayerSeries } from "./types";

/** `Wed · v HLE` and `W 2–1`, from the side of the series the player's team was on. */
function seriesHead(team: string, s: PlayerSeries, week: readonly Series[]) {
  const series = seriesById(week, s.id);
  const side = fromSide(series, team);
  return { title: seriesTitle(series.day, side.opponent), outcome: side.score && result(side.score) };
}

/** A tapped starter's games: each series, each game boxed if it counted, then his sum (the Carry's result only) and Full stats. */
export function GamesPanel({
  player,
  week,
  onClose,
}: {
  player: PerfectPlayer;
  week: readonly Series[];
  onClose?: () => void;
}) {
  const role = ROLE_NAME[player.slot];
  // The Carry is named by his C and his sum's label, so the meta leaves it out.
  const meta = `${player.team} · ${role}`;
  const sum = player.series.map((s) => s.points).join(" + ");
  return (
    <PlayerPanel name={player.name} meta={meta} onClose={onClose}>
      {player.series.map((s) => {
        const head = seriesHead(player.team, s, week);
        return (
          <PanelSeries
            key={s.id}
            title={head.title}
            result={
              <>
                {" "}
                <span>{head.outcome}</span>
              </>
            }
          >
            {s.games?.map((g, i) => (
              <PanelGame key={i} no={i + 1} what={`${g.champion} · ${outcome(g.won)}`} points={g.points} counted={g.counted} />
            ))}
          </PanelSeries>
        );
      })}
      <PanelSum lines={player.carry ? <PanelSumLabel>{MARK_NAME.C}</PanelSumLabel> : sum} figure={player.points} />
      <PanelFoot go={cardGo(player.id, player.slot === "coach")} />
    </PlayerPanel>
  );
}

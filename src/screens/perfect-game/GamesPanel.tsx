import { fromSide, seriesById } from "../../fixtures/series";
import type { Series } from "../../fixtures/week3";
import { carryWorking, outcome, result } from "../../parts";
import { cardGo } from "../../paths";
import { MARK_NAME, PanelFoot, PanelGame, PanelSeries, PanelSum, PanelSumLabel, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PerfectPlayer, PlayerSeries } from "./types";

/** `Wed · v HLE` and `W 2–1`, from the side of the series the player's team was on. */
function seriesHead(team: string, s: PlayerSeries, week: readonly Series[]) {
  const series = seriesById(week, s.id);
  const side = fromSide(series, team);
  return { title: `${series.day} · v ${side.opponent}`, outcome: side.score && result(side.score) };
}

/** A tapped starter's games: each series, each game boxed if it counted, then his sum and Full stats. */
export function GamesPanel({
  player,
  week,
  carryTimes,
  onClose,
}: {
  player: PerfectPlayer;
  week: readonly Series[];
  carryTimes: number;
  onClose?: () => void;
}) {
  const role = ROLE_NAME[player.slot];
  const meta = [player.team, role, player.carry && MARK_NAME.C].filter(Boolean).join(" · ");
  const points = player.series.map((s) => s.points);
  const sum = points.join(" + ");
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
      <PanelSum
        lines={
          <>
            {player.carry && (
              <>
                <PanelSumLabel>{MARK_NAME.C}</PanelSumLabel>
                <br />
              </>
            )}
            {player.carry && player.raw !== undefined ? carryWorking(points, player.raw, carryTimes) : sum}
          </>
        }
        figure={player.points}
      />
      <PanelFoot go={cardGo(player.id, player.slot === "coach")} />
    </PlayerPanel>
  );
}

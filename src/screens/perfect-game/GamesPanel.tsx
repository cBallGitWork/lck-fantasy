import type { Series } from "../../fixtures/week3";
import { cx, LinkGo } from "../../parts";
import { PATHS } from "../../paths";
import { MARK_NAME, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PerfectPlayer, PlayerSeries } from "./types";

/** A win or a loss, as a letter. */
const outcomeLetter = (won: boolean) => (won ? "W" : "L");

/** `Wed · v HLE` and `W 2–1`, from the side of the series the player's team was on. */
function seriesHead(team: string, s: PlayerSeries, week: readonly Series[]) {
  const series = week.find((w) => w.id === s.id);
  if (!series) throw new Error(`Series ${s.id} is not in the week`);
  const home = series.home === team;
  const opponent = home ? series.away : series.home;
  const result = series.score && (home ? series.score : ([series.score[1], series.score[0]] as const));
  const outcome = result && `${outcomeLetter(result[0] > result[1])} ${result[0]}–${result[1]}`;
  return { title: `${series.day} · v ${opponent}`, outcome };
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
  const sum = player.series.map((s) => s.points).join(" + ");
  const go =
    player.slot === "coach"
      ? { to: PATHS.coachCard, params: { coachId: player.id } }
      : { to: PATHS.playerCard, params: { playerId: player.id } };
  return (
    <PlayerPanel name={player.name} meta={meta} onClose={onClose}>
      {player.series.map((s) => {
        const head = seriesHead(player.team, s, week);
        return (
          <div key={s.id} className="perfect-game__series">
            <h4 className="perfect-game__series-head">
              {head.title} <span>{head.outcome}</span>
            </h4>
            {s.games?.map((g, i) => (
              <div key={i} className={cx("perfect-game__game", !g.counted && "perfect-game__game--drop")}>
                <span className="perfect-game__game-no">G{i + 1}</span>
                <span>
                  {g.champion} · {outcomeLetter(g.won)}
                </span>
                <span className="perfect-game__game-points num">
                  {g.counted ? <span className="perfect-game__box">{g.points}</span> : g.points}
                </span>
              </div>
            ))}
          </div>
        );
      })}
      <div className="perfect-game__sum">
        <span>
          {player.carry && (
            <>
              <span className="perfect-game__sum-key">{MARK_NAME.C}</span>
              <br />
            </>
          )}
          {player.carry ? `${sum} = ${player.raw} × ${carryTimes}` : sum}
        </span>
        <b className="num">{player.points}</b>
      </div>
      <div className="perfect-game__panel-foot">
        <LinkGo go={go}>Full stats</LinkGo>
      </div>
    </PlayerPanel>
  );
}

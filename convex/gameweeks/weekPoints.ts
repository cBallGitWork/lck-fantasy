// A manager's gameweek, scored by the game's own code (spec/01, 04, 05, 06): each pick's games, his
// series' best games, auto-subs or the buff's line-up, the multipliers, and his hits. The season
// check (convex/admin/seasonCheck.ts) re-derives the same week by other code and compares.
import { scoreCoachGame, scorePlayerGame, total, type CoachTable, type PlayerGameStats, type PlayerTable, type TeamGameStats } from "../scoring/game";
import { coachSeriesPoints, playerSeriesPoints, type SeriesRules } from "../scoring/series";
import { buffLineup, type PlayedBuff } from "../squads/buffs";
import { lineupPoints, type Armband } from "../squads/carry";
import { pickKey, playerKey, type Squad } from "../squads/squad";
import { sum } from "../../src/parts/util/sum";

/** One series a pick played in the gameweek: a player's games, or the coach's team's and whether it
 *  won the series. */
export type PickSeries =
  | { games: PlayerGameStats[] }
  | { games: TeamGameStats[]; wonSeries: boolean };

/** Each pick's series this gameweek, by `pickKey`; a pick with none played no game. */
export type WeekGames = ReadonlyMap<string, readonly PickSeries[]>;

/** The competition's scoring data. */
export interface ScoringRules {
  player: PlayerTable;
  coach: CoachTable;
  series: SeriesRules;
  captainMultiplier: number;
  /** What a paid transfer costs (spec/03). */
  hitPoints: number;
}

/** A manager's gameweek, as he left it at the deadline. */
export interface ManagerWeek {
  /** Who it is, for an alert: his team name. */
  manager: string;
  gameweek: number;
  squad: Squad;
  armband: Armband;
  buff: PlayedBuff | null;
  /** Transfers he paid for. */
  hits: number;
}

/** A manager's gameweek points, and the parts the season check compares (Craig, 19 Nov 2026, #401). */
export interface WeekScore {
  total: number;
  /** Each pick's points in each game he played, in order, by `pickKey`. */
  gamePoints: Map<string, number[]>;
  /** What the armband adds to the Captain's points. */
  captainShare: number;
  /** What the buff adds: the bench's points under Bench Boost, the second Captain's under Double
   *  Captain, and the coach's multiplied extra under Coach Diff. */
  buffShare: number;
}

export function scoreWeek(week: ManagerWeek, games: WeekGames, rules: ScoringRules): WeekScore {
  const gamePoints = new Map<string, number[]>();
  const weekPoints = new Map<string, number>();
  for (const [key, series] of games) {
    const perSeries = series.map((one) => {
      const points = "wonSeries" in one
        ? one.games.map((game) => total(scoreCoachGame(game, rules.coach)))
        : one.games.map((game) => total(scorePlayerGame(game, rules.player)));
      gamePoints.set(key, [...(gamePoints.get(key) ?? []), ...points]);
      return "wonSeries" in one ? coachSeriesPoints(points, one.wonSeries, rules.series) : playerSeriesPoints(points, rules.series);
    });
    weekPoints.set(key, sum(perSeries));
  }
  const played = new Set([...games].filter(([, series]) => series.length > 0).map(([key]) => key));
  const { lineup, multipliers } = buffLineup(week.buff, week.squad, week.armband, played, rules.captainMultiplier);
  const scored = lineupPoints(lineup, weekPoints, multipliers);
  const extra = (key: string) => {
    const slot = scored.find((one) => pickKey(one.pick) === key);
    return slot === undefined ? 0 : slot.points - (weekPoints.get(key) ?? 0);
  };
  const benchPoints = sum(scored.filter((one) => one.slot === "bench").map((one) => one.points));
  const coach = week.squad.starters.find((starter) => starter.slot === "coach");
  const buffShare = {
    none: 0,
    benchBoost: benchPoints,
    doubleCaptain: week.armband.secondCaptain === undefined ? 0 : extra(playerKey(week.armband.secondCaptain)),
    coachMultiplier: coach === undefined ? 0 : extra(pickKey(coach.pick)),
  }[week.buff?.effect ?? "none"];
  return {
    total: sum(scored.map((one) => one.points)) - week.hits * rules.hitPoints,
    gamePoints,
    captainShare: extra(playerKey(week.armband.captain)),
    buffShare,
  };
}

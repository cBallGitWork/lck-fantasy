// The Captain (spec/04-captain.md): FPL's captain, with no vice-captain.
import { pickKey, playerKey, type Pick, type ScoringPick, type Squad } from "./squad";

/** A player id: the armband is only ever on a player, never the coach. */
export interface Armband {
  captain: string;
}

export type ArmbandProblem = { rule: "armbandOffStarters"; pickId: string };

/** The armband's rule: on one of the six starting players, the five roles and the flex, never the
 *  coach or the bench (spec/04, The armband). */
export function armbandProblems(squad: Squad, armband: Armband): ArmbandProblem[] {
  const startingPlayers = new Set(
    squad.starters.filter((starter) => starter.slot !== "coach").map((starter) => starter.pick.id),
  );
  return startingPlayers.has(armband.captain) ? [] : [{ rule: "armbandOffStarters", pickId: armband.captain }];
}

/** Who takes the multiplier: the Captain if he played, else nobody (spec/04, The armband). */
export function carryingPlayers(armband: Armband, played: ReadonlySet<string>): Set<string> {
  return new Set(played.has(playerKey(armband.captain)) ? [armband.captain] : []);
}

/** Whether a pick takes the multiplier: a player in `carrying`, never the coach. */
export function isCarrying(pick: Pick, carrying: ReadonlySet<string>): boolean {
  return pick.role !== "coach" && carrying.has(pick.id);
}

/** Points multiplied and rounded towards zero: ×1.5 makes a 9 a 13 and a −3 a −4 (spec/05, The Captain). */
export function multiplied(points: number, multiplier: number): number {
  return Math.trunc(points * multiplier) + 0;
}

export interface SlotPoints extends ScoringPick {
  points: number;
}

/** Each scoring pick's points, the carrying players' multiplied. `points` holds each pick's
 *  gameweek points by `pickKey`; a pick with none scores 0. */
export function lineupPoints(
  lineup: readonly ScoringPick[],
  points: ReadonlyMap<string, number>,
  carrying: ReadonlySet<string>,
  carryMultiplier: number,
): SlotPoints[] {
  return lineup.map((scoring) => {
    const base = points.get(pickKey(scoring.pick)) ?? 0;
    return { ...scoring, points: isCarrying(scoring.pick, carrying) ? multiplied(base, carryMultiplier) : base };
  });
}

// The Captain (spec/04-captain.md): FPL's captain, with no vice-captain.
import { pickKey, playerKey, type Pick, type ScoringPick, type Squad } from "./squad";

/** Player ids: the armband is only ever on a player, never the coach. `secondCaptain` is the
 *  Double Captain buff's (spec/04, spec/06). */
export interface Armband {
  captain: string;
  secondCaptain?: string;
}

export type ArmbandProblem =
  | { rule: "armbandOffStarters"; pickId: string }
  | { rule: "sameCaptainTwice"; pickId: string };

/** The armband's rule: on one of the six starting players, the five roles and the flex, never the
 *  coach or the bench; a second Captain by the same rules, and not the first (spec/04, The armband). */
export function armbandProblems(squad: Squad, armband: Armband): ArmbandProblem[] {
  const startingPlayers = new Set(
    squad.starters.filter((starter) => starter.slot !== "coach").map((starter) => starter.pick.id),
  );
  const problems: ArmbandProblem[] = captainsOf(armband)
    .filter((pickId) => !startingPlayers.has(pickId))
    .map((pickId) => ({ rule: "armbandOffStarters", pickId }));
  if (armband.secondCaptain === armband.captain) problems.push({ rule: "sameCaptainTwice", pickId: armband.captain });
  return problems;
}

/** The Captain, then the second Captain if there is one. */
export function captainsOf(armband: Armband): string[] {
  return armband.secondCaptain === undefined ? [armband.captain] : [armband.captain, armband.secondCaptain];
}

/** Who takes the multiplier: each Captain who played; one who played no game passes it to nobody
 *  (spec/04, The armband). */
export function carryingPlayers(armband: Armband, played: ReadonlySet<string>): Set<string> {
  return new Set(captainsOf(armband).filter((id) => played.has(playerKey(id))));
}

/** Each multiplied pick's multiplier, by `pickKey`: the Captains', and the coach's under Coach Diff. */
export type Multipliers = ReadonlyMap<string, number>;

/** Whether a pick is a Captain taking the multiplier: a player, never the coach. */
export function isCarrying(pick: Pick, multipliers: Multipliers): boolean {
  return pick.role !== "coach" && multipliers.has(pickKey(pick));
}

/** Points multiplied and rounded towards zero: ×1.5 makes a 9 a 13 and a −3 a −4 (spec/05, The Captain). */
export function multiplied(points: number, multiplier: number): number {
  return Math.trunc(points * multiplier) + 0;
}

export interface SlotPoints extends ScoringPick {
  points: number;
}

/** Each scoring pick's points, the multiplied picks' multiplied. `points` holds each pick's
 *  gameweek points by `pickKey`; a pick with none scores 0. */
export function lineupPoints(
  lineup: readonly ScoringPick[],
  points: ReadonlyMap<string, number>,
  multipliers: Multipliers,
): SlotPoints[] {
  return lineup.map((scoring) => {
    const key = pickKey(scoring.pick);
    const base = points.get(key) ?? 0;
    const multiplier = multipliers.get(key);
    return { ...scoring, points: multiplier === undefined ? base : multiplied(base, multiplier) };
  });
}

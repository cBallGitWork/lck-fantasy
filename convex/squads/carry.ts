// The Carry and Vice-carry (spec/04-captain.md): FPL's captain and vice-captain.
import { pickKey, playerKey, type ScoringPick, type Squad } from "./squad";

/** Player ids: the armband is only ever on a player, never the coach. */
export interface Armband {
  carry: string;
  viceCarry: string;
}

export type ArmbandProblem =
  | { rule: "armbandOffStarters"; band: keyof Armband; pickId: string }
  | { rule: "carryIsViceCarry"; pickId: string };

/** The armband's rules: both on the six starting players, the five roles and the flex, never the
 *  coach or the bench (spec/04, The armband), and on two different players, as in FPL. */
export function armbandProblems(squad: Squad, armband: Armband): ArmbandProblem[] {
  const startingPlayers = new Set(
    squad.starters.filter((starter) => starter.slot !== "coach").map((starter) => starter.pick.id),
  );
  const problems: ArmbandProblem[] = [];
  for (const band of ["carry", "viceCarry"] as const) {
    if (!startingPlayers.has(armband[band])) problems.push({ rule: "armbandOffStarters", band, pickId: armband[band] });
  }
  if (armband.carry === armband.viceCarry) problems.push({ rule: "carryIsViceCarry", pickId: armband.carry });
  return problems;
}

/** Who takes the multiplier: the Carry if he played, else the Vice-carry if he did, else nobody.
 *  With Dual Carry both take it if they played, and nobody steps in for a Carry who didn't
 *  (spec/06, Dual Carry). */
export function carryingPlayers(armband: Armband, played: ReadonlySet<string>, dualCarry: boolean): Set<string> {
  const carryPlayed = played.has(playerKey(armband.carry));
  const vicePlayed = played.has(playerKey(armband.viceCarry));
  if (dualCarry) return new Set([...(carryPlayed ? [armband.carry] : []), ...(vicePlayed ? [armband.viceCarry] : [])]);
  if (carryPlayed) return new Set([armband.carry]);
  return new Set(vicePlayed ? [armband.viceCarry] : []);
}

/** Points multiplied and rounded towards zero: ×1.5 makes a 9 a 13 and a −3 a −4 (spec/05, The Carry). */
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
    const isCarrying = scoring.pick.role !== "coach" && carrying.has(scoring.pick.id);
    return { ...scoring, points: isCarrying ? multiplied(base, carryMultiplier) : base };
  });
}

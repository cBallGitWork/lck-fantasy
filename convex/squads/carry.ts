// The Carry and Vice-carry (spec/04-captain.md): FPL's captain and vice-captain.
import { pickKey, playerKey, type Squad, type SquadPick } from "./squad";

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

/** Who takes the multiplier: the Carry if he played, else the Vice-carry if he did, else nobody. */
export function carryingPlayer(armband: Armband, played: ReadonlySet<string>): string | null {
  if (played.has(playerKey(armband.carry))) return armband.carry;
  if (played.has(playerKey(armband.viceCarry))) return armband.viceCarry;
  return null;
}

/** Points multiplied and rounded down to a whole number: ×1.5 makes a 9 a 13 (spec/05, The Carry). */
export function multiplied(points: number, multiplier: number): number {
  return Math.floor(points * multiplier);
}

export interface SlotPoints extends SquadPick {
  points: number;
}

/** Each slot's points for the scoring line-up (after auto-subs), the Carry's multiplied. `points`
 *  holds each pick's gameweek points by `pickKey`; a pick with none scores 0. */
export function lineupPoints(
  lineup: SquadPick[],
  points: ReadonlyMap<string, number>,
  armband: Armband,
  played: ReadonlySet<string>,
  carryMultiplier: number,
): SlotPoints[] {
  const carrying = carryingPlayer(armband, played);
  return lineup.map((starter) => {
    const base = points.get(pickKey(starter.pick)) ?? 0;
    const isCarrying = starter.pick.role !== "coach" && starter.pick.id === carrying;
    return { ...starter, points: isCarrying ? multiplied(base, carryMultiplier) : base };
  });
}

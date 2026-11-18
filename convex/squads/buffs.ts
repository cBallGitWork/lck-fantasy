// Buffs (spec/06-buffs.md). A buff is data: a name, one effect from the list below, its multiplier
// where the effect has one, how many a manager gets each split, and the stages that allow it. The
// effects are the code's. No buff changes a limit or the transfers.
import { autoSubs, type AutoSub } from "./autoSubs";
import { carryingPlayers, type Armband, type Multipliers } from "./carry";
import { pickKey, playerKey, type ScoringPick, type Squad } from "./squad";

/** The effects the code offers; an admin makes a buff by picking one (spec/06, Buffs are data):
 *  the bench scores too; a second Captain, both taking the buff's multiplier; the coach takes it. */
export const BUFF_EFFECTS = ["benchBoost", "doubleCaptain", "coachMultiplier"] as const;
export type BuffEffect = (typeof BUFF_EFFECTS)[number];

export interface Buff {
  id: string;
  name: string;
  effect: BuffEffect;
  /** Double Captain's ×2 and Coach Diff's ×3: data, never code. Bench Boost has none. */
  multiplier?: number;
  perSplit: number;
  stageIds: string[];
}

/** What scoring needs of a played buff. */
export type PlayedBuff = Pick<Buff, "effect" | "multiplier">;

export interface BuffPlay {
  buffId: string;
  gameweekId: string;
  splitId: string;
}

export interface BuffGameweek {
  id: string;
  splitId: string;
  stageId: string;
}

export type BuffProblem =
  | { rule: "oneBuffPerGameweek"; playedBuffId: string }
  | { rule: "noneLeftThisSplit"; perSplit: number }
  | { rule: "notInThisStage"; stageId: string };

/** Whether a manager may play `buff` this gameweek, given the buffs he has played: one buff a
 *  gameweek, `perSplit` of it each split (so they reset at the split, and one unplayed is lost), in
 *  the stages it allows. */
export function buffProblems(buff: Buff, plays: readonly BuffPlay[], gameweek: BuffGameweek): BuffProblem[] {
  const problems: BuffProblem[] = [];
  const thisGameweek = plays.find((play) => play.gameweekId === gameweek.id);
  if (thisGameweek) problems.push({ rule: "oneBuffPerGameweek", playedBuffId: thisGameweek.buffId });
  const usedThisSplit = plays.filter((play) => play.buffId === buff.id && play.splitId === gameweek.splitId).length;
  if (usedThisSplit >= buff.perSplit) problems.push({ rule: "noneLeftThisSplit", perSplit: buff.perSplit });
  if (!buff.stageIds.includes(gameweek.stageId)) problems.push({ rule: "notInThisStage", stageId: gameweek.stageId });
  return problems;
}

export interface BuffLineup {
  lineup: ScoringPick[];
  subs: AutoSub[];
  /** Who is multiplied, and by what (`lineupPoints`). */
  multipliers: Multipliers;
}

/** Who scores and who is multiplied. Bench Boost: the bench scores too, so nobody is subbed, as in
 *  FPL. Double Captain: both Captains take its multiplier in place of the Captain's. Coach Diff: the
 *  coach takes its multiplier. A Captain who played no game takes nothing (spec/04, spec/06). */
export function buffLineup(
  buff: PlayedBuff | null,
  squad: Squad,
  armband: Armband,
  played: ReadonlySet<string>,
  captainMultiplier: number,
): BuffLineup {
  const effect = buff?.effect ?? null;
  if (effect === "doubleCaptain" && armband.secondCaptain === undefined) {
    throw new Error("Double Captain is played with no second Captain.");
  }
  if (effect !== "doubleCaptain" && armband.secondCaptain !== undefined) {
    throw new Error("A second Captain is named without Double Captain.");
  }
  const multipliers = new Map<string, number>();
  const captainTakes = effect === "doubleCaptain" ? buffMultiplier(buff!) : captainMultiplier;
  for (const id of carryingPlayers(armband, played)) multipliers.set(playerKey(id), captainTakes);
  if (effect === "coachMultiplier") {
    const coach = squad.starters.find((starter) => starter.slot === "coach");
    if (coach) multipliers.set(pickKey(coach.pick), buffMultiplier(buff!));
  }
  if (effect === "benchBoost") {
    const bench = squad.bench.map((pick): ScoringPick => ({ slot: "bench", pick }));
    return { lineup: [...squad.starters, ...bench], subs: [], multipliers };
  }
  return { ...autoSubs(squad, played), multipliers };
}

function buffMultiplier(buff: PlayedBuff): number {
  if (buff.multiplier === undefined) throw new Error(`The ${buff.effect} buff has no multiplier in its data.`);
  return buff.multiplier;
}

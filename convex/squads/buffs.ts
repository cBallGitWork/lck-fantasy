// Buffs (spec/06-buffs.md). A buff is data: a name, one effect from the list below, how many a
// manager gets each split, and the stages that allow it. The effects are the code's.
import { autoSubs, type AutoSub } from "./autoSubs";
import { carryingPlayers, type Armband } from "./carry";
import type { ScoringPick, Squad, SquadSettings } from "./squad";

/** The effects the code offers; an admin makes a buff by picking one (spec/06, Buffs are data). */
export const BUFF_EFFECTS = ["remake", "limitless", "benchBoost", "dualCarry"] as const;
export type BuffEffect = (typeof BUFF_EFFECTS)[number];

export interface Buff {
  id: string;
  name: string;
  effect: BuffEffect;
  perSplit: number;
  stageIds: string[];
}

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
 *  gameweek, `perSplit` of it each split (so they reset at the split), in the stages it allows. */
export function buffProblems(buff: Buff, plays: readonly BuffPlay[], gameweek: BuffGameweek): BuffProblem[] {
  const problems: BuffProblem[] = [];
  const thisGameweek = plays.find((play) => play.gameweekId === gameweek.id);
  if (thisGameweek) problems.push({ rule: "oneBuffPerGameweek", playedBuffId: thisGameweek.buffId });
  const usedThisSplit = plays.filter((play) => play.buffId === buff.id && play.splitId === gameweek.splitId).length;
  if (usedThisSplit >= buff.perSplit) problems.push({ rule: "noneLeftThisSplit", perSplit: buff.perSplit });
  if (!buff.stageIds.includes(gameweek.stageId)) problems.push({ rule: "notInThisStage", stageId: gameweek.stageId });
  return problems;
}

/** Remake and Limitless make the gameweek's transfers free and unlimited (spec/06). */
export function transfersUnlimited(effect: BuffEffect | null): boolean {
  return effect === "remake" || effect === "limitless";
}

/** The squad rules for a gameweek: Limitless lifts the budget and the team cap; the roles still
 *  apply, one per role, the flex and the coach (spec/06). */
export function buffSquadRules(
  effect: BuffEffect | null,
  settings: SquadSettings,
  budget: number | null,
): { settings: SquadSettings; budget: number | null } {
  if (effect !== "limitless") return { settings, budget };
  return { settings: { ...settings, teamCap: null }, budget: null };
}

/** The squad a manager starts the next gameweek with: Limitless's goes back to the one before it. */
export function squadAfterGameweek(effect: BuffEffect | null, before: Squad, played: Squad): Squad {
  return effect === "limitless" ? before : played;
}

export interface BuffLineup {
  lineup: ScoringPick[];
  subs: AutoSub[];
  carrying: Set<string>;
}

/** Who scores and who is multiplied. Bench Boost: the bench scores too, so nobody is subbed, as in
 *  FPL. Dual Carry: the Vice-carry takes the multiplier too (spec/06). */
export function buffLineup(effect: BuffEffect | null, squad: Squad, armband: Armband, played: ReadonlySet<string>): BuffLineup {
  const carrying = carryingPlayers(armband, played, effect === "dualCarry");
  if (effect === "benchBoost") {
    const bench = squad.bench.map((pick): ScoringPick => ({ slot: "bench", pick }));
    return { lineup: [...squad.starters, ...bench], subs: [], carrying };
  }
  return { ...autoSubs(squad, played), carrying };
}

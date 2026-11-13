// Chips (spec/06-chips.md). A chip is data: a name, one effect from the list below, how many a
// manager gets each split, and the stages that allow it. The effects are the code's.
import { autoSubs, type AutoSub } from "./autoSubs";
import { carryingPlayers, type Armband } from "./carry";
import type { ScoringPick, Squad, SquadSettings } from "./squad";

/** The effects the code offers; an admin makes a chip by picking one (spec/06, Chips are data). */
export const CHIP_EFFECTS = ["remake", "limitless", "benchBoost", "dualCarry"] as const;
export type ChipEffect = (typeof CHIP_EFFECTS)[number];

export interface Chip {
  id: string;
  name: string;
  effect: ChipEffect;
  perSplit: number;
  stageIds: string[];
}

export interface ChipPlay {
  chipId: string;
  gameweekId: string;
  splitId: string;
}

export interface ChipGameweek {
  id: string;
  splitId: string;
  stageId: string;
}

export type ChipProblem =
  | { rule: "oneChipPerGameweek"; playedChipId: string }
  | { rule: "noneLeftThisSplit"; perSplit: number }
  | { rule: "notInThisStage"; stageId: string };

/** Whether a manager may play `chip` this gameweek, given the chips he has played: one chip a
 *  gameweek, `perSplit` of it each split (so they reset at the split), in the stages it allows. */
export function chipProblems(chip: Chip, plays: readonly ChipPlay[], gameweek: ChipGameweek): ChipProblem[] {
  const problems: ChipProblem[] = [];
  const thisGameweek = plays.find((play) => play.gameweekId === gameweek.id);
  if (thisGameweek) problems.push({ rule: "oneChipPerGameweek", playedChipId: thisGameweek.chipId });
  const usedThisSplit = plays.filter((play) => play.chipId === chip.id && play.splitId === gameweek.splitId).length;
  if (usedThisSplit >= chip.perSplit) problems.push({ rule: "noneLeftThisSplit", perSplit: chip.perSplit });
  if (!chip.stageIds.includes(gameweek.stageId)) problems.push({ rule: "notInThisStage", stageId: gameweek.stageId });
  return problems;
}

/** Remake and Limitless make the gameweek's transfers free and unlimited (spec/06). */
export function transfersUnlimited(effect: ChipEffect | null): boolean {
  return effect === "remake" || effect === "limitless";
}

/** The squad rules for a gameweek: Limitless lifts the budget and the team cap; the roles still
 *  apply, one per role, the flex and the coach (spec/06). */
export function chipSquadRules(
  effect: ChipEffect | null,
  settings: SquadSettings,
  budget: number | null,
): { settings: SquadSettings; budget: number | null } {
  if (effect !== "limitless") return { settings, budget };
  return { settings: { ...settings, teamCap: null }, budget: null };
}

/** The squad a manager starts the next gameweek with: Limitless's goes back to the one before it. */
export function squadAfterGameweek(effect: ChipEffect | null, before: Squad, played: Squad): Squad {
  return effect === "limitless" ? before : played;
}

export interface ChipLineup {
  lineup: ScoringPick[];
  subs: AutoSub[];
  carrying: Set<string>;
}

/** Who scores and who is multiplied. Bench Boost: the bench scores too, so nobody is subbed, as in
 *  FPL. Dual Carry: the Vice-carry takes the multiplier too (spec/06). */
export function chipLineup(effect: ChipEffect | null, squad: Squad, armband: Armband, played: ReadonlySet<string>): ChipLineup {
  const carrying = carryingPlayers(armband, played, effect === "dualCarry");
  if (effect === "benchBoost") {
    const bench = squad.bench.map((pick): ScoringPick => ({ slot: "bench", pick }));
    return { lineup: [...squad.starters, ...bench], subs: [], carrying };
  }
  return { ...autoSubs(squad, played), carrying };
}

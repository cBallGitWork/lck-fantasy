// Pick Team's rules, kept apart from the page so they are tested without a browser (spec/12,
// Pick Team; the picture's README, Controls). Swaps, the Carry, the Vice-carry and buffs change
// only the draft; Save makes the draft the saved team, Reset drops it.

import type { RoleKey, SlotKey } from "../../rift";

export type BenchSlot = "bench1" | "bench2";
export type SquadSlot = SlotKey | BenchSlot;

export const STARTER_SLOTS: readonly SlotKey[] = ["top", "jng", "mid", "bot", "sup", "flex", "coach"];
export const BENCH_SLOTS: readonly BenchSlot[] = ["bench1", "bench2"];

/** The two buffs played on this page; Remake and Limitless are played on Transfers. */
export type PickBuff = "benchBoost" | "dualCarry";

/** A manager's team as the page edits it: who stands in each slot, the marks, the buff. */
export interface PickTeam {
  /** Each slot's player id. */
  slots: Record<SquadSlot, string>;
  carry: string;
  vice: string;
  buff?: PickBuff;
}

export type PickView = "rift" | "cards";

export interface PickState {
  saved: PickTeam;
  draft: PickTeam;
  view: PickView;
  /** The tapped player, whose card is open. */
  selected?: string;
  /** The starter going out while a swap is under way. */
  swapping?: string;
}

/** The role a player plays, or coach. */
export type PlayerRole = RoleKey | "coach";

export type PickAction =
  | { type: "select"; id: string }
  | { type: "close" }
  | { type: "view"; view: PickView }
  | { type: "makeCarry"; id: string }
  | { type: "makeVice"; id: string }
  | { type: "startSwap"; id: string }
  | { type: "cancelSwap" }
  | { type: "swapIn"; id: string }
  | { type: "swapBench" }
  | { type: "playBuff"; buff: PickBuff }
  | { type: "cancelBuff" }
  | { type: "reset" }
  | { type: "save" };

/** The slot a player stands in. */
export function slotOf(team: PickTeam, id: string): SquadSlot | undefined {
  return (Object.keys(team.slots) as SquadSlot[]).find((slot) => team.slots[slot] === id);
}

export const isBench = (slot: SquadSlot | undefined): slot is BenchSlot => slot === "bench1" || slot === "bench2";

/** A bench player fits a starter's slot when he plays its role; the Flex takes any role (spec/01). */
export function fits(slot: SlotKey, benchRole: PlayerRole): boolean {
  if (slot === "coach" || benchRole === "coach") return false;
  return slot === "flex" || slot === benchRole;
}

/** The ids of the bench players who could come on for the starter going out. */
export function fitIds(team: PickTeam, outId: string, roleOf: (id: string) => PlayerRole): Set<string> {
  const slot = slotOf(team, outId);
  if (!slot || isBench(slot)) return new Set();
  return new Set(BENCH_SLOTS.map((b) => team.slots[b]).filter((id) => fits(slot, roleOf(id))));
}

/** Who can take the Carry, the Vice-carry or a swap: a starter who isn't the coach (spec/01, spec/04). */
const isMarkable = (team: PickTeam, id: string) => {
  const slot = slotOf(team, id);
  return slot !== undefined && !isBench(slot) && slot !== "coach";
};

/** Whether a starter can go to the bench: any but the coach. */
export const canSwap = isMarkable;

/** The Carry and Vice-carry stay on the field: whoever comes on takes the mark of whoever goes off (spec/04). */
const passMark = (mark: string, out: string, inId: string) => (mark === out ? inId : mark);

/** How many things the draft changes from the saved team: each swap, the bench order, each mark moved, the buff. */
export function changeCount(saved: PickTeam, draft: PickTeam): number {
  const starters = STARTER_SLOTS.filter((s) => saved.slots[s] !== draft.slots[s]).length;
  const savedBench = BENCH_SLOTS.map((b) => saved.slots[b]);
  const draftBench = BENCH_SLOTS.map((b) => draft.slots[b]);
  const sameBench = [...savedBench].sort().join() === [...draftBench].sort().join();
  const benchOrder = sameBench && savedBench.join() !== draftBench.join() ? 1 : 0;
  // A mark counts when it moves to another slot, so a swap that hands it on is one change.
  const moved = (mark: "carry" | "vice") => Number(slotOf(saved, saved[mark]) !== slotOf(draft, draft[mark]));
  const marks = moved("carry") + moved("vice");
  return starters + benchOrder + marks + Number(saved.buff !== draft.buff);
}

const withDraft = (state: PickState, draft: PickTeam): PickState => ({ ...state, draft });

/** The page's state after one action; the roles say who fits a swap. */
export function pickReducer(roleOf: (id: string) => PlayerRole) {
  return (state: PickState, action: PickAction): PickState => {
    const { draft } = state;
    switch (action.type) {
      case "select":
        return state.swapping ? state : { ...state, selected: action.id };
      case "close":
        return { ...state, selected: undefined, swapping: undefined };
      case "view":
        return { ...state, view: action.view };
      case "makeCarry": {
        if (!isMarkable(draft, action.id) || draft.carry === action.id) return state;
        // As FPL's armband: making the Vice-carry the Carry hands the old Carry the V.
        const vice = draft.vice === action.id ? draft.carry : draft.vice;
        return withDraft(state, { ...draft, carry: action.id, vice });
      }
      case "makeVice": {
        if (!isMarkable(draft, action.id) || draft.vice === action.id) return state;
        const carry = draft.carry === action.id ? draft.vice : draft.carry;
        return withDraft(state, { ...draft, vice: action.id, carry });
      }
      case "startSwap":
        return canSwap(draft, action.id) ? { ...state, selected: action.id, swapping: action.id } : state;
      case "cancelSwap":
        return { ...state, swapping: undefined };
      case "swapIn": {
        const out = state.swapping;
        if (!out || !fitIds(draft, out, roleOf).has(action.id)) return state;
        const outSlot = slotOf(draft, out) as SquadSlot;
        const inSlot = slotOf(draft, action.id) as SquadSlot;
        const slots = { ...draft.slots, [outSlot]: action.id, [inSlot]: out };
        const carry = passMark(draft.carry, out, action.id);
        const vice = passMark(draft.vice, out, action.id);
        return { ...state, draft: { ...draft, slots, carry, vice }, swapping: undefined, selected: action.id };
      }
      case "swapBench": {
        const slots = { ...draft.slots, bench1: draft.slots.bench2, bench2: draft.slots.bench1 };
        return withDraft(state, { ...draft, slots });
      }
      case "playBuff":
        return draft.buff ? state : withDraft(state, { ...draft, buff: action.buff });
      case "cancelBuff":
        return withDraft(state, { ...draft, buff: undefined });
      case "reset":
        return { ...state, draft: state.saved, swapping: undefined };
      case "save":
        return { ...state, saved: draft, swapping: undefined };
    }
  };
}

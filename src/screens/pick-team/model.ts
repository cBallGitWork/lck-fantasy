// Pick Team's rules, kept apart from the page so they are tested without a browser (spec/12,
// Pick Team; the picture's README, Controls). Swaps, the Captain and buffs change
// only the draft; Save makes the draft the saved team, Reset drops it.

import { SAVED_NEWS } from "../../parts";
import { isBench, markNews, type PersonRole, type SquadSlot } from "../../rift";
import type { BuffEffect } from "../../../convex/squads/buffs";

/** The buffs, each played and cancelled on this page (spec/06). */
export type PickBuff = BuffEffect;

/** A manager's team as the page edits it: who stands in each slot, the marks, the buff. */
export interface PickTeam {
  /** Each slot's player id. */
  slots: Record<SquadSlot, string>;
  captain: string;
  buff?: PickBuff;
}

export type PickView = "rift" | "cards";

export interface PickState {
  saved: PickTeam;
  draft: PickTeam;
  view: PickView;
  /** The tapped player: his card is open and those he can swap with light up (FPL's one-tap swap). */
  selected?: string;
}

export type PickAction =
  | { type: "select"; id: string }
  | { type: "close" }
  | { type: "view"; view: PickView }
  | { type: "makeCaptain"; id: string }
  | { type: "playBuff"; buff: PickBuff }
  | { type: "cancelBuff" }
  | { type: "reset" }
  | { type: "save" };

/** The slot a player stands in. */
export function slotOf(team: PickTeam, id: string): SquadSlot | undefined {
  return (Object.keys(team.slots) as SquadSlot[]).find((slot) => team.slots[slot] === id);
}

/** Whether a player can stand in a slot: a role slot takes its own role, the Flex and the bench any role, the coach's slot only the coach (spec/01). */
function fits(slot: SquadSlot, role: PersonRole): boolean {
  if (slot === "coach" || role === "coach") return false;
  return slot === "flex" || isBench(slot) || slot === role;
}

/**
 * The ids of the players a tapped player can swap with: two of the squad trade places when each fits
 * the other's slot. A role starter swaps with a bench player or a Flex of his role; the Flex with
 * anyone whose slot his role fits; the two bench players with each other, as FPL sets its bench
 * order (Craig, 16 Nov 2026); the coach with nobody.
 */
export function swapIds(team: PickTeam, id: string, roleOf: (id: string) => PersonRole): Set<string> {
  const from = slotOf(team, id);
  if (!from) return new Set();
  const partners = (Object.keys(team.slots) as SquadSlot[]).filter((to) => {
    if (to === from) return false;
    return fits(to, roleOf(id)) && fits(from, roleOf(team.slots[to]));
  });
  return new Set(partners.map((to) => team.slots[to]));
}

/** Who can be Captain: a starter who isn't the coach (spec/01, spec/04). */
const isMarkable = (team: PickTeam, id: string) => {
  const slot = slotOf(team, id);
  return slot !== undefined && !isBench(slot) && slot !== "coach";
};

/**
 * How many things the draft changes from the saved team: each swap (the fewest that turn the saved
 * places into the draft's, bench order included), the C handed to another player in another slot,
 * the buff.
 */
export function changeCount(saved: PickTeam, draft: PickTeam): number {
  const seen = new Set<SquadSlot>();
  let swaps = 0;
  for (const start of Object.keys(saved.slots) as SquadSlot[]) {
    let at: SquadSlot | undefined = start;
    let length = 0;
    while (at && !seen.has(at)) {
      seen.add(at);
      length += 1;
      at = slotOf(draft, saved.slots[at]);
    }
    swaps += Math.max(length - 1, 0);
  }
  // The C counts when both its player and his slot change, so a swap that hands it on, or one that moves him, is one change.
  const moved = Number(saved.captain !== draft.captain && slotOf(saved, saved.captain) !== slotOf(draft, draft.captain));
  return swaps + moved + Number(saved.buff !== draft.buff);
}

const withDraft = (state: PickState, draft: PickTeam): PickState => ({
  ...state,
  draft,
});

/** The draft after two players trade places. The Captain stays on the field: whoever comes on takes the C of whoever goes off (spec/04). */
function swap(draft: PickTeam, a: string, b: string): PickTeam {
  const aSlot = slotOf(draft, a) as SquadSlot;
  const bSlot = slotOf(draft, b) as SquadSlot;
  const slots = { ...draft.slots, [aSlot]: b, [bSlot]: a };
  const { captain } = draft;
  return { ...draft, slots, captain: captain === a && isBench(bSlot) ? b : captain === b && isBench(aSlot) ? a : captain };
}

/**
 * What the live region says after an action: `Saved` for a save, the new Captain when the key
 * moved the C (`Faker is your Captain`); nothing else.
 */
export function pickNews(action: PickAction, before: PickState, after: PickState, nameOf: (id: string) => string): string | undefined {
  if (action.type === "save") return SAVED_NEWS;
  if (action.type === "makeCaptain" && after.draft.captain !== before.draft.captain) return markNews(nameOf(after.draft.captain), "C");
  return undefined;
}

/** The page's state after one action; the roles say who can swap with whom. */
export function pickReducer(roleOf: (id: string) => PersonRole) {
  return (state: PickState, action: PickAction): PickState => {
    const { draft, selected } = state;
    switch (action.type) {
      case "select":
        // As FPL: tap a player, then one of those lit up to swap them; tap him again, or another, to change your mind.
        if (selected === action.id) return { ...state, selected: undefined };
        if (selected && swapIds(draft, selected, roleOf).has(action.id))
          return {
            ...state,
            draft: swap(draft, selected, action.id),
            selected: undefined,
          };
        return { ...state, selected: action.id };
      case "close":
        return { ...state, selected: undefined };
      case "view":
        return { ...state, view: action.view };
      case "makeCaptain":
        if (!isMarkable(draft, action.id) || draft.captain === action.id) return state;
        return withDraft(state, { ...draft, captain: action.id });
      case "playBuff":
        return draft.buff ? state : withDraft(state, { ...draft, buff: action.buff });
      case "cancelBuff":
        return withDraft(state, { ...draft, buff: undefined });
      case "reset":
        return { ...state, draft: state.saved, selected: undefined };
      case "save":
        return { ...state, saved: draft, selected: undefined };
    }
  };
}

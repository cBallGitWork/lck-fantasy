// The roles and lineup slots, named once (spec/01; plate.md, Card view). Their names are words.ts's.

export type RoleKey = "top" | "jng" | "mid" | "bot" | "sup";
export type SlotKey = RoleKey | "flex" | "coach";
/** The role a player plays, or coach. */
export type PersonRole = RoleKey | "coach";
/** The squad's two bench places, after the seven starters (spec/01). */
type BenchSlot = "bench1" | "bench2";
export const BENCH_SLOTS: readonly BenchSlot[] = ["bench1", "bench2"];
/** Any of the nine places in a squad. */
export type SquadSlot = SlotKey | BenchSlot;
export const isBench = (slot: SquadSlot | undefined): slot is BenchSlot => slot === "bench1" || slot === "bench2";
/** What a role icon can show. */
export type IconKey = SlotKey;

/** The five player roles, in lineup order. */
export const ROLE_KEYS: readonly RoleKey[] = ["top", "jng", "mid", "bot", "sup"];

/** The five player roles, then the coach. */
export const PERSON_ROLES: readonly PersonRole[] = [...ROLE_KEYS, "coach"];

/** The seven starters in the LCK broadcast's lineup order. */
export const LINEUP_ORDER: readonly SlotKey[] = [...ROLE_KEYS, "flex", "coach"];

/** A squad's nine: the seven starters and the bench. */
export const SQUAD_SIZE = LINEUP_ORDER.length + BENCH_SLOTS.length;

/** The role a Flex plays; every other slot, and the coach, plays none. */
export function flexPlays(slot: SquadSlot, role: PersonRole): RoleKey | undefined {
  return slot === "flex" && role !== "coach" ? role : undefined;
}

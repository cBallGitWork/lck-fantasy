// The transfers a manager is making before he confirms: who he sold, who he bought, what it costs.
// Pure, so the page's every control is tested without a browser. The rules themselves are built
// in convex/squads/; this is only what the page shows while the manager is still choosing.

import { isBench, type Mark, type PersonRole, type SquadSlot } from "../../rift";

/** One of the nine, as the page shows him: his sell price in won. */
export interface SquadPlayer {
  slot: SquadSlot;
  id: string;
  name: string;
  team: string;
  role: PersonRole;
  price: number;
  ownedPct: number;
  mark?: Mark;
}

/** A player or coach in the list: price in won, last price move, season points. */
export interface ListPlayer {
  id: string;
  name: string;
  team: string;
  role: PersonRole;
  price: number;
  /** −1 a fall, 0 none yet, 1 a rise. */
  move: -1 | 0 | 1;
  points: number;
  ownedPct: number;
}

/** What the manager has done: each slot he sold, with who he bought (null until he picks). */
export interface Plan {
  sold: Partial<Record<SquadSlot, ListPlayer | null>>;
  /** The slot the list is filling. */
  replacing: SquadSlot | null;
}

export const EMPTY_PLAN: Plan = { sold: {}, replacing: null };

/** The rules for this week, as data from the backend (spec/03, spec/01). */
export interface TransferRules {
  /** Free transfers left before any made now. */
  freeTransfers: number;
  /** Points each transfer past the free ones costs. */
  hitPoints: number;
  /** Players and coach from one LCK team, at most. */
  teamCap: number;
  /** The bank before any transfer made now, in won. */
  bank: number;
}

export type Why = "Team full" | "Over budget";

/** A list row: the player, and why he can't be bought, if he can't. */
export interface Row {
  player: ListPlayer;
  why?: Why;
}

/** Tapping a squad player sells him, or, once sold, makes his slot the one the list fills. */
export function sell(plan: Plan, slot: SquadSlot): Plan {
  const sold = slot in plan.sold ? plan.sold : { ...plan.sold, [slot]: null };
  return { sold, replacing: slot };
}

/** A row's `+` buys him into the slot the list is filling. */
export function buy(plan: Plan, player: ListPlayer): Plan {
  if (!plan.replacing) return plan;
  return { ...plan, sold: { ...plan.sold, [plan.replacing]: player } };
}

const soldSlots = (plan: Plan) => Object.keys(plan.sold) as SquadSlot[];

function outOf(squad: SquadPlayer[], slot: SquadSlot): SquadPlayer {
  const out = squad.find((p) => p.slot === slot);
  if (!out) throw new Error(`Transfers: no squad player in the ${slot} slot`);
  return out;
}

/**
 * Each sold slot with who went out and who came in. Selling a player and buying him back cancels out
 * (spec/03): no transfer, no hit, his old price kept, so it is no move at all.
 */
export function moves(squad: SquadPlayer[], plan: Plan): { out: SquadPlayer; in: ListPlayer | null }[] {
  return soldSlots(plan)
    .map((slot) => ({ out: outOf(squad, slot), in: plan.sold[slot] ?? null }))
    .filter((m) => m.in?.id !== m.out.id);
}

/** Transfers made: a sale with its buy. */
export const transfersMade = (squad: SquadPlayer[], plan: Plan) => moves(squad, plan).filter((m) => m.in !== null).length;

/** Slots sold and not yet filled. */
export const emptySlots = (plan: Plan) => soldSlots(plan).filter((slot) => !plan.sold[slot]).length;

export function freeLeft(rules: TransferRules, made: number): number {
  return Math.max(0, rules.freeTransfers - made);
}

/** The points the transfers made now cost: each past the free ones. */
export function pendingHit(rules: TransferRules, made: number): number {
  return Math.max(0, made - rules.freeTransfers) * rules.hitPoints;
}

/** The bank now: every sale in, every buy out. */
export function bankNow(squad: SquadPlayer[], plan: Plan, bank: number): number {
  return moves(squad, plan).reduce((sum, m) => sum + m.out.price - (m.in?.price ?? 0), bank);
}

/** Who stands in a slot now: the one bought into it, or the one there before. */
export function inSlot(squad: SquadPlayer[], plan: Plan, slot: SquadSlot): SquadPlayer | ListPlayer | null {
  if (slot in plan.sold) return plan.sold[slot] ?? null;
  return squad.find((p) => p.slot === slot) ?? null;
}

/** The roles a slot takes: its own, any player's for the Flex and the bench, a coach for the Coach. */
export function fits(slot: SquadSlot, role: PersonRole): boolean {
  if (slot === "coach") return role === "coach";
  if (slot === "flex" || isBench(slot)) return role !== "coach";
  return role === slot;
}

/** Why a player can't go into the slot: his team already at the cap, or more than the bank. */
export function whyNot(squad: SquadPlayer[], plan: Plan, slot: SquadSlot, player: ListPlayer, rules: TransferRules): Why | undefined {
  const others = squad.map((p) => p.slot).filter((s) => s !== slot).map((s) => inSlot(squad, plan, s));
  if (others.filter((p) => p?.team === player.team).length >= rules.teamCap) return "Team full";
  const inHand = bankNow(squad, plan, rules.bank) + (plan.sold[slot]?.price ?? 0);
  if (player.price > inHand) return "Over budget";
  return undefined;
}

export type RoleFilter = PersonRole | "all";
export type SortKey = "points" | "price" | "owned";

export interface ListFilters {
  role: RoleFilter;
  search: string;
  team: string | "all";
  sort: SortKey;
}

const SORT_VALUE: Record<SortKey, (p: ListPlayer) => number> = {
  points: (p) => p.points,
  price: (p) => p.price,
  owned: (p) => p.ownedPct,
};

/** The role chip a slot opens the list on: his role, or All roles where any fits. */
export function roleFilterFor(slot: SquadSlot): RoleFilter {
  return slot === "flex" || isBench(slot) ? "all" : slot;
}

/**
 * The list: players not standing in another slot who fit the slot being filled and the filters, best first by
 * the sort; those who can't be bought stay, with why, last (spec/12).
 */
export function listRows(squad: SquadPlayer[], plan: Plan, players: ListPlayer[], filters: ListFilters, rules: TransferRules): Row[] {
  const slot = plan.replacing;
  const standing = new Set(squad.map((p) => p.slot).filter((s) => s !== slot).map((s) => inSlot(squad, plan, s)?.id));
  const query = filters.search.trim().toLowerCase();
  const rows = players
    .filter((p) => !standing.has(p.id))
    .filter((p) => (slot ? fits(slot, p.role) : true))
    .filter((p) => filters.role === "all" || p.role === filters.role)
    .filter((p) => filters.team === "all" || p.team === filters.team)
    .filter((p) => p.name.toLowerCase().includes(query))
    .map((player): Row => ({ player, why: slot ? whyNot(squad, plan, slot, player, rules) : undefined }));
  const value = SORT_VALUE[filters.sort];
  return rows.sort((a, b) => Number(a.why !== undefined) - Number(b.why !== undefined) || value(b.player) - value(a.player));
}

/** One of a team's series this week: who against, and the day. */
export interface Fixture {
  against: string;
  day: string;
}

/** One confirm this week: when, who went out and came in, its hit (0 is free), and the buff it was under. */
export interface Confirm {
  id: string;
  local: string;
  kst: string;
  moves: { out: string; in: string }[];
  hit: number;
  buff?: string;
}

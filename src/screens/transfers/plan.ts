// The transfers a manager is making before he confirms: who he sold, who he bought, what it costs.
// Pure, so the page's every control is tested without a browser. The rules themselves are built
// in convex/squads/; this is only what the page shows while the manager is still choosing.

import { BENCH_SLOTS, isBench, LINEUP_ORDER, ROLE_KEYS, ROLE_NAME, type Mark, type PersonRole, type SquadSlot } from "../../rift";
import { added, removed, restored, roleEmpty, teamFull, WORDS } from "./words";

/** A player or coach as Transfers shows him: price in won, the last week's points, form, season total. */
export interface ListPlayer {
  id: string;
  name: string;
  team: string;
  role: PersonRole;
  priceWon: number;
  /** The last week's points. */
  weekPoints: number;
  form: number;
  /** Season points. */
  points: number;
  ownedPct: number;
}

/** One of the nine: his slot, his sell price, his C. */
export interface SquadPlayer extends ListPlayer {
  slot: SquadSlot;
  mark?: Mark;
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

/** A step's outcome: the plan after it, and the toast that says what happened or why not. */
export interface Step {
  plan: Plan;
  toast: string;
}

/** The nine slots in squad order. */
export const SQUAD_SLOTS: readonly SquadSlot[] = [...LINEUP_ORDER, ...BENCH_SLOTS];

const soldSlots = (plan: Plan) => SQUAD_SLOTS.filter((slot) => slot in plan.sold);
const isEmpty = (plan: Plan, slot: SquadSlot) => slot in plan.sold && !plan.sold[slot];
const emptyList = (plan: Plan) => SQUAD_SLOTS.filter((slot) => isEmpty(plan, slot));

export function outOf(squad: SquadPlayer[], slot: SquadSlot): SquadPlayer {
  const out = squad.find((p) => p.slot === slot);
  if (!out) throw new Error(`Transfers: no squad player in the ${slot} slot`);
  return out;
}

/** Who stands in a slot now: the one bought into it, the one there before, or no one while it is empty. */
export function inSlot(squad: SquadPlayer[], plan: Plan, slot: SquadSlot): ListPlayer | null {
  if (slot in plan.sold) return plan.sold[slot] ?? null;
  return squad.find((p) => p.slot === slot) ?? null;
}

/** The coach's slot takes a coach; any other takes a player of any role (the squad rule, 16 Nov 2026). */
export const fits = (slot: SquadSlot, role: PersonRole) => (slot === "coach") === (role === "coach");

/** Takes the one standing in a slot out: an original sold, or a buy undone. The list then fills that slot. */
export function remove(squad: SquadPlayer[], plan: Plan, slot: SquadSlot): Step {
  const who = inSlot(squad, plan, slot) ?? outOf(squad, slot);
  return { plan: { sold: { ...plan.sold, [slot]: null }, replacing: slot }, toast: removed(who.name) };
}

/** Puts a sold player back in his slot, as if never sold. */
export function restore(squad: SquadPlayer[], plan: Plan, slot: SquadSlot): Step {
  const sold = { ...plan.sold };
  delete sold[slot];
  const next = { sold, replacing: plan.replacing };
  if (plan.replacing === slot) next.replacing = emptyList(next)[0] ?? null;
  return { plan: next, toast: restored(outOf(squad, slot).name) };
}

/** The slot a buy goes into: the one being filled if it is empty and he fits it, else the first empty one he fits. */
function targetFor(plan: Plan, role: PersonRole): SquadSlot | undefined {
  const open = emptyList(plan).filter((slot) => fits(slot, role));
  return open.find((slot) => slot === plan.replacing) ?? open[0];
}

/**
 * Why a buy into a slot can never be valid, or nothing: his team at the cap, or a role left with no one
 * that the other empty slots can't still fill (the squad keeps at least one of each role). Over the
 * budget is allowed while choosing; it only stops the confirm, as FPL.
 */
function refusal(squad: SquadPlayer[], plan: Plan, slot: SquadSlot, player: ListPlayer, rules: TransferRules): string | undefined {
  const others = SQUAD_SLOTS.filter((s) => s !== slot).map((s) => inSlot(squad, plan, s));
  if (others.filter((p) => p?.team === player.team).length >= rules.teamCap) return teamFull(rules.teamCap, player.team);
  if (player.role === "coach") return undefined;
  const roles = new Set([...others.map((p) => p?.role), player.role]);
  const missing = ROLE_KEYS.filter((role) => !roles.has(role));
  const stillOpen = emptyList(plan).filter((s) => s !== slot && s !== "coach").length;
  return missing.length > stillOpen ? roleEmpty(ROLE_NAME[missing[0]!]) : undefined;
}

/** No empty slot he fits: remove a player, or the coach, first. */
const noRoom = (role: PersonRole) => (role === "coach" ? WORDS.removeCoach : WORDS.removePlayer);

/**
 * A row's `+`: buys him into the slot being filled, or the first empty one he fits, then moves on to the
 * next empty slot, if any. Refused, with why, when no slot is open or the move can never be valid.
 */
export function add(squad: SquadPlayer[], plan: Plan, player: ListPlayer, rules: TransferRules): Step {
  const slot = targetFor(plan, player.role);
  if (!slot) return { plan, toast: noRoom(player.role) };
  const why = refusal(squad, plan, slot, player, rules);
  if (why) return { plan, toast: why };
  const sold = { ...plan.sold, [slot]: player };
  return { plan: { sold, replacing: SQUAD_SLOTS.find((s) => s in sold && !sold[s]) ?? null }, toast: added(player.name) };
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
export const emptySlots = (plan: Plan) => emptyList(plan).length;

export function freeLeft(rules: TransferRules, made: number): number {
  return Math.max(0, rules.freeTransfers - made);
}

/** The free transfers the transfers made now use. */
export const freeUsed = (rules: TransferRules, made: number) => Math.min(rules.freeTransfers, made);

/** The points the transfers made now cost: each past the free ones. */
export function pendingHit(rules: TransferRules, made: number): number {
  return Math.max(0, made - rules.freeTransfers) * rules.hitPoints;
}

/** The bank now: every sale in, every buy out. Below zero while over the budget. */
export function bankNow(squad: SquadPlayer[], plan: Plan, bank: number): number {
  return moves(squad, plan).reduce((sum, m) => sum + m.out.priceWon - (m.in?.priceWon ?? 0), bank);
}

/** Why Review and confirm is off: a slot still empty, nothing to confirm, or over the budget. */
export function reviewBlock(squad: SquadPlayer[], plan: Plan, rules: TransferRules): string | undefined {
  if (emptySlots(plan) > 0) return WORDS.slotEmpty;
  if (transfersMade(squad, plan) === 0) return WORDS.noChanges;
  if (bankNow(squad, plan, rules.bank) < 0) return WORDS.overBudget;
  return undefined;
}

/** The list's no-filter value, for role and team alike. */
export const ALL = "all";
export type RoleFilter = PersonRole | typeof ALL;
export type SortKey = "points" | "price" | "owned";

export interface ListFilters {
  role: RoleFilter;
  search: string;
  team: string | typeof ALL;
  sort: SortKey;
}

const SORT_VALUE: Record<SortKey, (p: ListPlayer) => number> = {
  points: (p) => p.points,
  price: (p) => p.priceWon,
  owned: (p) => p.ownedPct,
};

/** The role chip a slot opens the list on: his role, or All roles where any fits. */
export function roleFilterFor(squad: SquadPlayer[], slot: SquadSlot): RoleFilter {
  return slot === "coach" ? "coach" : slot === "flex" || isBench(slot) ? ALL : outOf(squad, slot).role;
}

/**
 * The list: everyone not standing in the squad who matches the filters, best first by the sort. None is
 * greyed: a buy that can't be made is refused when tried, with why (Craig, 16 Nov 2026).
 */
export function listRows(squad: SquadPlayer[], plan: Plan, players: ListPlayer[], filters: ListFilters): ListPlayer[] {
  const inSquad = new Set(SQUAD_SLOTS.map((s) => inSlot(squad, plan, s)?.id));
  const query = filters.search.trim().toLowerCase();
  const value = SORT_VALUE[filters.sort];
  return players
    .filter((p) => !inSquad.has(p.id))
    .filter((p) => filters.role === ALL || p.role === filters.role)
    .filter((p) => filters.team === ALL || p.team === filters.team)
    .filter((p) => p.name.toLowerCase().includes(query))
    .sort((a, b) => value(b) - value(a));
}

/** One of a team's series this week: who against, and the day. */
export interface Fixture {
  opponent: string;
  day: string;
}

/** `v DK`: a team's next opponent alone, or nothing. */
export const nextAgainst = (fixtures: Record<string, Fixture[]>, team: string) => {
  const next = fixtures[team]?.[0];
  return next ? `${WORDS.versus} ${next.opponent}` : "";
};

/** One confirm this week: when, who went out and came in, its hit (0 is free), and the buff it was under. */
export interface Confirm {
  id: string;
  local: string;
  kst: string;
  moves: { out: string; in: string }[];
  hit: number;
  buff?: string;
}

/** The week after a confirm: the nine as arranged, the bank and free transfers left, and the line Confirmed lists. */
export interface AfterConfirm {
  squad: SquadPlayer[];
  rules: TransferRules;
  moves: Confirm["moves"];
  hit: number;
}

/**
 * A confirm applied, as the page hands it over: each transfer by id and the nine by slot. A player kept
 * keeps his C; one bought comes at his list price. Free transfers and the bank are what is left.
 */
export function confirmTransfers(
  squad: SquadPlayer[],
  players: ListPlayer[],
  rules: TransferRules,
  transfers: { out: string; in: string }[],
  lineup: Record<SquadSlot, string>,
): AfterConfirm {
  const byId = new Map<string, ListPlayer>([...squad, ...players].map((p) => [p.id, p]));
  const find = (id: string) => {
    const p = byId.get(id);
    if (!p) throw new Error(`Transfers: no player ${id}`);
    return p;
  };
  const pairs = transfers.map((t) => ({ out: find(t.out), in: find(t.in) }));
  return {
    squad: SQUAD_SLOTS.map((slot) => ({ ...find(lineup[slot]), slot })),
    rules: { ...rules, freeTransfers: freeLeft(rules, pairs.length), bank: pairs.reduce((sum, m) => sum + m.out.priceWon - m.in.priceWon, rules.bank) },
    moves: pairs.map((m) => ({ out: m.out.name, in: m.in.name })),
    hit: pendingHit(rules, pairs.length),
  };
}

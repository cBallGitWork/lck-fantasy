// Transfers' words, named once. Every word a player reads on this screen lives here.

import { ordinal } from "../../parts";
import type { PersonRole } from "../../rift";
import type { SortKey } from "./plan";

export const WORDS = {
  title: "Transfers",
  hangul: "이적",
  view: "View",
  listView: "List view",
  yourTransfers: "Your transfers",
  freeTransfers: "Free transfers",
  cost: "Cost",
  bank: "Bank",
  reset: "Reset",
  review: "Review and confirm ›",
  sheetTitle: "Confirm your transfers",
  out: "Out",
  in: "In",
  freeUsed: "Free transfers used",
  back: "Back",
  confirm: "Confirm",
  /** A move's arrow, for a reader. */
  for: "for",
  free: "No cost",
  undo: "Undo",
  players: "Players",
  allRoles: "All roles",
  search: "Find a player",
  all: "All",
  noPlayers: "No players found",
  price: "Price",
  pts: "Pts",
  owned: "Owned",
  next: "Next",
  buy: "Buy",
  form: "Form",
  total: "Total",
  sell: "Sell",
  restore: "Restore",
  versus: "v",
  /** Why Review and confirm is off. */
  noChanges: "No changes",
  overBudget: "Over budget",
  /** Once a confirm goes through. */
  confirmed: "Transfers confirmed",
  /** No empty slot he fits. */
  sellPlayer: "Sell a player first",
  sellCoach: "One coach only. Sell your coach first",
  /** The tapped player's card under the Rift. */
  sellKey: "× Sell",
  buyKey: "+ Buy",
  fullCard: "Full card",
  goldLead: "Gold lead at 15",
  soloKills: "Solo kills",
  killsPerGame: "Kills per game",
  deathsPerGame: "Deaths per game",
  assistsPerGame: "Assists per game",
  firstBlood: "First blood",
  last3: "Last 3",
  next3: "Next 3",
  sponsor: "Sponsor",
} as const;

export const SORT_WORDS = { points: "Points", price: "Price", owned: "Owned" } as const satisfies Record<SortKey, string>;

/** A role's players, for the group a card's ranks are among. */
const ROLE_PLURAL: Record<PersonRole, string> = { top: "tops", jng: "junglers", mid: "mids", bot: "bots", sup: "supports", coach: "coaches" };

/** `Season points · 4th of 10 tops`: before the card's season points, their rank among his role. */
export const seasonRank = (rank: number, n: number, role: PersonRole) => `Season points · ${ordinal(rank)} of ${n} ${ROLE_PLURAL[role]}`;

/** `Kingen added`, `Siwoo removed`, `Siwoo restored`: what a step did. */
export const added = (name: string) => `${name} added`;
export const removed = (name: string) => `${name} removed`;
export const restored = (name: string) => `${name} restored`;

/** `1 player to buy`: why Review and confirm is off while a slot is empty. */
export const toBuy = (n: number) => `${n} ${n === 1 ? "player" : "players"} to buy`;

/** `Max 2 from T1`. */
export const teamFull = (cap: number, team: string) => `Max ${cap} from ${team}`;

/** `You'd have no Top`: the buy would leave the squad without one. */
export const roleEmpty = (role: string) => `You'd have no ${role}`;

/** `Replacing Siwoo`: the list's title while it fills his slot. */
export const replacing = (name: string) => `Replacing ${name}`;

/** `Sort: Points ▾`. */
export const sortLabel = (sort: string) => `Sort: ${sort} ▾`;

/** `Team: All ▾`. */
export const teamLabel = (team: string) => `Team: ${team} ▾`;

/** `Buy Chovy`, `Sell Zeus`, `Restore Zeus`: a key's name for a reader. */
export const keyFor = (key: string, name: string) => `${key} ${name}`;

/** `Buy a Top`: an empty slot's `+`, for a reader. */
export const buyA = (role: string) => `Buy a ${role}`;

/** `↺ Siwoo`: an empty slot's way back. */
export const putBack = (name: string) => `↺ ${name}`;

/** `Week 3`: the List view's last-week column. */
export const weekHead = (n: number) => `Week ${n}`;

/** `Confirmed · Week 4`. */
export const confirmedIn = (week: string) => `Confirmed · ${week}`;

/** `v DK, NS`: the week's opponents, in the order played. */
export const against = (teams: readonly string[]) => (teams.length ? `${WORDS.versus} ${teams.join(", ")}` : "");

/** `Tue 9:10pm · −6`: when a confirm was made and what it cost. */
export const whenCost = (when: string, cost: string) => `${when} · ${cost}`;

/** `5 of 10`: games with a gold lead at 15, of those played. */
export const of = (n: number, total: number) => `${n} of ${total}`;


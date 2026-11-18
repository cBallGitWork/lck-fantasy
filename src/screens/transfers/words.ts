// Transfers' words, named once. Every word a player reads on this screen lives here.

import type { SortKey } from "./plan";

export const WORDS = {
  title: "Transfers",
  hangul: "이적",
  view: "View",
  listView: "List view",
  freeTransfers: "Free transfers",
  cost: "Cost",
  bank: "Bank",
  reset: "Reset",
  review: "Review and confirm ›",
  sheetTitle: "Confirm your transfers",
  freeUsed: "Free transfers used",
  back: "Back",
  confirm: "Confirm",
  /** A move's arrow, for a reader. */
  for: "for",
  free: "No cost",
  kst: "KST",
  undo: "Undo",
  players: "Players",
  allRoles: "All roles",
  search: "Find a player",
  all: "All",
  noPlayers: "No players found",
  role: "Role",
  player: "Player",
  price: "Price",
  pts: "Pts",
  owned: "Owned",
  next: "Next",
  buy: "Buy",
  shirt: "Jersey",
  form: "Form",
  total: "Total",
  sell: "Sell",
  restore: "Restore",
  versus: "v",
  /** Why Review and confirm is off. */
  slotEmpty: "Fill every slot",
  noChanges: "No changes",
  overBudget: "Over budget",
  /** The toast once a confirm goes through. */
  confirmed: "Transfers confirmed",
  /** No empty slot he fits. */
  removePlayer: "Squad's full. Remove a player first",
  removeCoach: "One coach only. Remove yours first",
} as const;

export const SORT_WORDS = { points: "Points", price: "Price", owned: "Owned" } as const satisfies Record<SortKey, string>;

/** `Kingen added`, `Siwoo removed`, `Siwoo restored`: the live region's news. */
export const added = (name: string) => `${name} added`;
export const removed = (name: string) => `${name} removed`;
export const restored = (name: string) => `${name} restored`;

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

/** `Buy Chovy`, `Sell Zeus`, `Restore Zeus`: a row key's name for a reader. */
export const keyFor = (key: string, name: string) => `${key} ${name}`;

/** `Week 3`: the List view's last-week column. */
export const weekHead = (n: number) => `Week ${n}`;

/** `Confirmed · Week 4`. */
export const confirmedIn = (week: string) => `Confirmed · ${week}`;

/** `0 of 2`: free transfers used of those had. */
export const usedOf = (used: number, had: number) => `${used} of ${had}`;

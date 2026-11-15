// The Stats list's rules (docs/design/approved/stats/README.md; spec/12, Stats): which rows show,
// in what order, and on which page. Pure, so the page and its tests share them.

import type { TeamCode } from "../../fixtures/week3";
import type { Score } from "../../parts";
import type { PersonRole, RoleKey } from "../../rift";

export const TABS = ["Players", "Coaches"] as const;
export type Tab = (typeof TABS)[number];

export const FIGURES = ["Totals", "Per game"] as const;
export type Figures = (typeof FIGURES)[number];

/** A line's column: its key in a row's `lines`, and its head. */
export interface Line {
  key: string;
  head: string;
}

/** The player lines, each a count, in the picture's order. */
export const PLAYER_LINES: readonly Line[] = [
  { key: "kills", head: "K" },
  { key: "deaths", head: "D" },
  { key: "assists", head: "A" },
  { key: "gd15", head: "GD@15" },
  { key: "soloKills", head: "Solo kills" },
  { key: "firstBlood", head: "First blood" },
  { key: "deathless", head: "Deathless" },
  { key: "quadra", head: "Quadra+" },
  { key: "steals", head: "Obj. steals" },
];

/** The coach lines after Series, in the picture's order. */
export const COACH_LINES: readonly Line[] = [
  { key: "firstTower", head: "First tower" },
  { key: "drakes", head: "Most drakes" },
  { key: "barons", head: "Most barons" },
  { key: "elders", head: "Most elders" },
  { key: "quickWins", head: "Quick wins" },
];

export const linesFor = (tab: Tab) => (tab === "Players" ? PLAYER_LINES : COACH_LINES);

/** One player or coach in the list, over the chosen span. */
export interface StatsRow {
  /** His card's id: `/player/faker`, `/coach/kkoma`. */
  id: string;
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceEok: number;
  /** The last move in 억: above 0 a rise, below a fall, 0 none. */
  moveEok: number;
  form: number;
  ownedPct: number;
  points: number;
  games: number;
  /** In your squad. */
  mine: boolean;
  /** Each line's count, by its key. */
  lines: Readonly<Record<string, number>>;
  /** A coach's series won and lost. */
  series?: Score;
}

/** The columns that sort, besides the lines. */
export const FIXED_SORTS = ["priceEok", "form", "ownedPct", "points", "games"] as const;
export type SortKey = (typeof FIXED_SORTS)[number] | string;

/** Every column a tab can sort by. */
export const sortKeys = (tab: Tab): readonly SortKey[] => [...FIXED_SORTS, ...linesFor(tab).map((l) => l.key)];

export const ALL = "all";

/** Everything the controls set. */
export interface StatsView {
  tab: Tab;
  figures: Figures;
  role: RoleKey | typeof ALL;
  team: TeamCode | typeof ALL;
  /** The highest price shown, in 억; null for any. */
  maxPrice: number | null;
  span: string;
  search: string;
  sort: SortKey;
  page: number;
}

export const SEASON = "season";

export const START_VIEW: StatsView = {
  tab: "Players",
  figures: "Totals",
  role: ALL,
  team: ALL,
  maxPrice: null,
  span: SEASON,
  search: "",
  sort: "points",
  page: 1,
};

/** A control's change: any but a page turn starts the list at page 1; a tab without the sorted column sorts by points. */
export function nextView(view: StatsView, change: Partial<StatsView>): StatsView {
  const next = { ...view, page: 1, ...change };
  return sortKeys(next.tab).includes(next.sort) ? next : { ...next, sort: START_VIEW.sort };
}

/** The rows a page holds. */
export const PAGE_SIZE = 20;

/** A count over a row's games; 0 for a player with none. */
export const perGame = (count: number, games: number) => (games === 0 ? 0 : count / games);

/** Points and the lines divide by games under Per game; price, form, owned and games never do. */
export function sortValue(row: StatsRow, key: SortKey, figures: Figures): number {
  const divide = (n: number) => (figures === "Per game" ? perGame(n, row.games) : n);
  switch (key) {
    case "priceEok":
    case "form":
    case "ownedPct":
    case "games":
      return row[key];
    case "points":
      return divide(row.points);
    default:
      return divide(row.lines[key] ?? 0);
  }
}

/** The rows the filters keep, highest first by the sorted column; academy players (no games) last. */
export function listRows(rows: readonly StatsRow[], view: StatsView): StatsRow[] {
  const find = view.search.trim().toLowerCase();
  return rows
    .filter(
      (r) =>
        (view.tab === "Coaches" || view.role === ALL || r.role === view.role) &&
        (view.team === ALL || r.team === view.team) &&
        (view.maxPrice === null || r.priceEok <= view.maxPrice) &&
        r.name.toLowerCase().includes(find),
    )
    .sort(
      (a, b) =>
        Number(a.games === 0) - Number(b.games === 0) || sortValue(b, view.sort, view.figures) - sortValue(a, view.sort, view.figures),
    );
}

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));

/** One page of the list, each row with its rank in the whole list. */
export function pageRows(rows: readonly StatsRow[], page: number): (StatsRow & { rank: number })[] {
  const start = (page - 1) * PAGE_SIZE;
  return rows.slice(start, start + PAGE_SIZE).map((row, i) => ({ ...row, rank: start + i + 1 }));
}

/** `1–20 of 104`; nothing for an empty list. */
export function pageLabel(total: number, page: number): string {
  if (total === 0) return "";
  const start = (page - 1) * PAGE_SIZE + 1;
  return `${start}–${Math.min(page * PAGE_SIZE, total)} of ${total}`;
}

/** Max price's choices: each price the list holds, highest first, as FPL's Max cost lists them. */
export const priceChoices = (rows: readonly StatsRow[]) => [...new Set(rows.map((r) => r.priceEok))].sort((a, b) => b - a);

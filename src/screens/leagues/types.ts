// What the Leagues page is fed: the backend's shapes (convex/leagues/tables.ts), as props.

/** A table's tab: the whole season or a split, as the competition names them. */
export type TableTab = string;

/** One of Overall's groups on its grouped tab (spec/08). */
export type OverallGroup = string;

/** The competition's tabs and Overall's groups: competition data, fed in as props, never held here. */
export interface CompetitionTabs {
  /** Every table's tabs, in order. */
  tabs: readonly TableTab[];
  /** The whole season's tab, which names no split. */
  seasonTab: TableTab;
  /** The tab that splits Overall into its groups; none in a competition with no Split 2. */
  groupedTab?: TableTab;
  /** Overall's groups on the grouped tab. */
  groups: readonly OverallGroup[];
}

/** The chase tag on your own row: points to the rank above, or the lead when 1st (`chaseTag`). */
export type ChaseTag = { kind: "chasing"; points: number; rank: number } | { kind: "clear"; points: number };

/** A league in the list: your rank in it, how it moved, and how many managers it holds. */
export interface LeagueSummary {
  id: string;
  name: string;
  /** Overall, country and team leagues are general; the rest private. */
  kind: "general" | "private";
  rank: number;
  /** Places gained (+) or lost (−); null when it held. */
  move: number | null;
  size: number;
}

/** A row of a league's table. */
export interface StandingRow {
  rank: number;
  move: number | null;
  team: string;
  manager: string;
  managerId: string;
  /** The manager's Carry this week. */
  carry: string;
  week: number;
  total: number;
  /** The grouped split's points, beside season points on a group's table. */
  split?: number;
  mine: boolean;
  chase: ChaseTag | null;
}

/** One table: runs of consecutive rows, a gap (`⋯`) between runs, and how many pages it holds. */
export interface Standings {
  runs: StandingRow[][];
  pages: number;
  /** The split's column beside Total on a group's table, headed with the split's name. */
  splitColumn?: TableTab;
}

interface LeagueBase {
  id: string;
  name: string;
  /** The week in the Week column. */
  week: number;
  /** Carry shows once the week's deadline has passed (`carryShown`). */
  carryShown: boolean;
  openTab: TableTab;
  /** Tables by tab, and on Overall's grouped tab by `tab/group` (`tableKey`). */
  tables: Partial<Record<string, Standings>>;
}

export type LeagueView =
  | (LeagueBase & { kind: "private"; code: string; scoringFrom: number; role: "maker" | "member" })
  | (LeagueBase & { kind: "overall"; season: string; openGroup?: OverallGroup })
  | (LeagueBase & { kind: "general" });

export type PrivateLeague = Extract<LeagueView, { kind: "private" }>;

/** A private league as both halves of the page hold it: its line in the list and its table. */
export interface PrivateEntry {
  summary: LeagueSummary;
  view: PrivateLeague;
}

/** How a league made or joined here opens: its week, Carry, and its first tab. */
export type NewTable = Pick<LeagueBase, "week" | "carryShown" | "openTab">;

/** A week a new league's scoring can start from, with its first day (`Week 3 · Wed 13 Jan`). */
export interface ScoringWeek {
  week: number;
  starts: string;
}

/** This week, then each later one: never empty. */
export type ScoringWeeks = [ScoringWeek, ...ScoringWeek[]];

/** Where a table sits in `LeagueView.tables`: by tab, and by group on the grouped tab. */
export const tableKey = (tabs: CompetitionTabs, tab: TableTab, group?: OverallGroup) => (group && tab === tabs.groupedTab ? `${tab}/${group}` : tab);

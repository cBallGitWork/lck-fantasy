// What the Leagues page is fed: the backend's shapes (convex/leagues/tables.ts), as props.

export const TABLE_TABS = ["Season", "Split 1", "Split 2"] as const;
export type TableTab = (typeof TABLE_TABS)[number];

/** Overall's groups in Split 2 (spec/08, Legend and Rise). */
export const OVERALL_GROUPS = ["Legend", "Rise", "All"] as const;
export type OverallGroup = (typeof OVERALL_GROUPS)[number];

/** The whole season's tab, which names no split. */
export const SEASON_TAB: TableTab = "Season";

/** The tab that splits Overall into its groups. */
export const GROUPED_TAB: TableTab = "Split 2";

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
  /** Split 2 points, beside season points on Legend and Rise. */
  split?: number;
  mine: boolean;
  chase: ChaseTag | null;
}

/** One table: runs of consecutive rows, a gap (`⋯`) between runs, and how many pages it holds. */
export interface Standings {
  runs: StandingRow[][];
  pages: number;
  /** A Split 2 column beside Total (Legend and Rise). */
  splitColumn?: boolean;
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
  | (LeagueBase & { kind: "overall"; season: string; openGroup: OverallGroup })
  | (LeagueBase & { kind: "general" });

/** Where a table sits in `LeagueView.tables`. */
export const tableKey = (tab: TableTab, group?: OverallGroup) => (group && tab === GROUPED_TAB ? `${tab}/${group}` : tab);

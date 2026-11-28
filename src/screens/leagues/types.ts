// What the Leagues page is fed: the backend's shapes (convex/leagues/tables.ts), as props.

import type { BuffEffect } from "../../../convex/squads/buffs";
import type { Tier, TierName } from "../../../convex/leagues/tiers";

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
  /** The tab that splits Overall into its groups. */
  groupedTab: TableTab;
  /** Overall's groups on the grouped tab. */
  groups: readonly OverallGroup[];
}

/** The chase tag on your own row: points to the rank above, or the lead when 1st (`chaseTag`). */
export type ChaseTag = { kind: "chasing"; points: number; rank: number } | { kind: "clear"; points: number };

/** The 20px mark before a league in the list (plate.md, A league's mark): Overall's tier shield, a country's flag, a team's crest, a private league's group. */
export type LeagueMark = { kind: "tier"; tier: Tier } | { kind: "flag"; country: string } | { kind: "crest"; team: string } | { kind: "group" };

/** A league in the list: your rank in it, how it moved, and how many managers it holds. */
export interface LeagueSummary {
  id: string;
  name: string;
  /** Overall, country and team leagues are general; the rest private. */
  kind: "general" | "private";
  mark: LeagueMark;
  /** None until gameweek 1 is final (spec/08, Overall tiers). */
  rank: number | null;
  /** Places gained (+) or lost (−); null when it held. */
  move: number | null;
  size: number;
}

/** A player named in a row, as his tile's plate: his team's code, then his name (plate.md, Parts). */
export interface NamedPlayer {
  team: string;
  name: string;
}

/** A row of a league's table. */
export interface StandingRow {
  rank: number;
  move: number | null;
  team: string;
  manager: string;
  managerId: string;
  /** The manager's Captain this week. */
  captain: NamedPlayer;
  week: number;
  total: number;
  /** The grouped split's points, beside season points on a group's table. */
  split?: number;
  mine: boolean;
  chase: ChaseTag | null;
  /** On Overall: the manager's tier for the season, shown on its season table (spec/08). */
  tier?: Tier;
}

/** One table: runs of consecutive rows, a gap (`⋯`) between runs (`firstPage`), and how many pages it holds. */
export interface Standings {
  runs: StandingRow[][];
  pages: number;
  /** The split's column beside Total on a group's table, headed with the split's name. */
  splitColumn?: TableTab;
}

/** A tier's row on Overall's panel of Captains and buffs (spec/08): its most picked Captain and his share, its most played buff and its share; null where nobody played one. */
export interface TierPick {
  tier: TierName;
  captain: NamedPlayer;
  /** Of every manager in the tier, as a percentage. */
  captainShare: number;
  buff: { name: string; effect: BuffEffect; share: number } | null;
  /** The tier you held at the deadline. */
  mine: boolean;
}

/** A week a league's scoring can start from, with its first day (`Week 14 · Wed 10 Feb`). */
export interface ScoringWeek {
  week: number;
  starts: string;
}

interface LeagueBase {
  id: string;
  name: string;
  /** The week in the Week column. */
  week: number;
  /** The Week and Captain columns, and Overall's tier panel, show once the week's deadline has passed (spec/08; `carryShown`). */
  deadlinePassed: boolean;
  openTab: TableTab;
  /** Tables by tab, and on Overall's grouped tab by `tab/group` (`tableKey`). */
  tables: Partial<Record<string, Standings>>;
  /** While it has no table yet: the week it starts and that week's first day (a league whose scoring hasn't started; everyone Unranked). */
  startsOn?: ScoringWeek;
}

export type LeagueView =
  | (LeagueBase & { kind: "private"; code: string; scoringFrom: number; role: "maker" | "member" })
  | (LeagueBase & { kind: "overall"; season: string; openGroup: OverallGroup; tierPicks: TierPick[] })
  | (LeagueBase & { kind: "general" });

export type PrivateLeague = Extract<LeagueView, { kind: "private" }>;

/** A private league as both halves of the page hold it: its line in the list and its table. */
export interface PrivateEntry {
  summary: LeagueSummary;
  view: PrivateLeague;
}

/** How many private leagues you're in, and the cap. */
export interface PrivateCount {
  count: number;
  cap: number;
}

/** How a league made or joined here opens: its week, the deadline, and its first tab. */
export type NewTable = Pick<LeagueBase, "week" | "deadlinePassed" | "openTab">;

/** This week, then each later one: never empty. */
export type ScoringWeeks = [ScoringWeek, ...ScoringWeek[]];

/** Where a table sits in `LeagueView.tables`: by tab, and by group on the grouped tab. */
export const tableKey = (tabs: CompetitionTabs, tab: TableTab, group?: OverallGroup) => (group && tab === tabs.groupedTab ? `${tab}/${group}` : tab);

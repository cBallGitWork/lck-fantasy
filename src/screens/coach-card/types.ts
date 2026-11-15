// What the coach card shows, as props: the made-up fixture feeds it until the backend does.
import type { TeamCode } from "../../fixtures/week3";
import type { Score } from "../../parts";
import type { RoleKey } from "../../rift";

/** Where the card was opened: from Pick Team it can transfer the coach out; from Points it only compares. */
export type CoachFrom = "pickTeam" | "points";

/** The card's tabs, in order; Roster replaces the player card's Champions (spec/12). */
export const COACH_TABS = ["This week", "Fixtures", "History", "Roster"] as const;
export type CoachTab = (typeof COACH_TABS)[number];

/** A place among the coaches, written 1st, 2nd, 3rd. */
export type Rank = number;

export interface CoachHead {
  team: TeamCode;
  name: string;
  hangul: string;
  /** The head coach's legal name. */
  legal: string;
}

export interface CoachMeta {
  priceEok: number;
  /** The last price move, in 억. */
  moveEok: number;
  form: number;
  formRank: Rank;
  ownedPct: number;
  ownedRank: Rank;
  transfersIn: number;
  transfersOut: number;
}

/** The season's points and their rank among the coaches. */
export interface CoachSeason {
  points: number;
  rank: Rank;
  of: number;
  games: number;
  lines: SeasonLine[];
}

/** A coach line's season: how many times, and the points it scored. A series line has no per game. */
export interface SeasonLine {
  name: string;
  total: number;
  points: number;
  series?: boolean;
}

/** A series in the strip: the last ones with points (Live while live), then the next ones. */
export interface StripPast {
  week: number;
  day: string;
  opponent: TeamCode;
  points: number;
  live?: boolean;
}

export interface StripNext {
  week: number;
  day: string;
  opponent: TeamCode;
  format: string;
}

/** One game of a series this week: its result, the coach lines it scored and its points. */
export interface WeekGame {
  result?: "W" | "L";
  lines: string[];
  points: number;
  /** Among the best games that count; a game that doesn't is struck through. */
  counts: boolean;
  /** The clock, while the game is live. */
  clock?: string;
}

export interface WeekSeries {
  id: string;
  day: string;
  opponent: TeamCode;
  /** The coach's team's games first. */
  score: Score;
  state: "final" | "live";
  /** The game being played, while live. */
  liveGame?: number;
  games: WeekGame[];
  points: number;
}

export interface CoachWeek {
  week: number;
  series: WeekSeries[];
  total: number;
  /** The series line's values, held per competition (spec/05). */
  seriesWon: number;
  seriesLost: number;
}

export interface FixtureRow {
  week: number;
  day: string;
  opponent: TeamCode;
  format: string;
  local: string;
  kst: string;
}

export interface HistoryRow {
  week: number;
  day: string;
  opponent: TeamCode;
  score: Score;
  games: number;
  priceEok: number;
  points: number;
}

export interface PastSeason {
  season: string;
  games: number;
  points: number;
}

export interface CoachHistory {
  competition: string;
  rows: HistoryRow[];
  past: PastSeason[];
}

export interface RosterRow {
  role: RoleKey;
  name: string;
  priceEok: number;
  points: number;
  ownedPct: number;
  /** In your team. */
  mine?: boolean;
}

/** Everything one opening of the card shows. A tab with no data shows its empty state. */
export interface CoachCardData {
  head: CoachHead;
  meta: CoachMeta;
  season: CoachSeason;
  past: StripPast[];
  next: StripNext[];
  week?: CoachWeek;
  fixtures?: FixtureRow[];
  history?: CoachHistory;
  roster?: RosterRow[];
  /** The news line, written by an admin, as on the player card. */
  news?: string;
}

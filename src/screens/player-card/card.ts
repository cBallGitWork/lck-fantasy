// What a player card shows, as props: the backend feeds these once it is wired (#36, #22, #23, #20, #19).

import type { TeamCode } from "../../fixtures/week3";
import type { Score } from "../../parts";
import type { Mark, RoleKey } from "../../rift";
import { TABS } from "./words";

export const CARD_TABS = TABS;
export type CardTab = (typeof CARD_TABS)[number];

/** A series already played, in the strip: his points, `live` while it is. */
export interface PastSeries {
  id: string;
  week: number;
  day: string;
  opponent: TeamCode;
  points: number;
  live?: boolean;
}

/** A series to come, in the strip. */
export interface NextSeries {
  id: string;
  week: number;
  day: string;
  bestOf: number;
  opponent: TeamCode;
}

/** One game in This week. `counts` is false for a game whose points don't count, struck through. */
export interface CardGame {
  champion: string;
  /** The result once the game is over. */
  outcome?: "W" | "L";
  /** The live game's clock. */
  clock?: string;
  kda: string;
  points: number;
  counts: boolean;
}

/** A series in This week once it has started: his team's score first. */
export interface PlayedSeries {
  id: string;
  day: string;
  opponent: TeamCode;
  score: Score;
  state: "final" | "live";
  games: CardGame[];
}

/** A series in This week not yet started: its time, yours then the league's, and no points yet (spec/12, The player card). */
export interface UpcomingSeries {
  id: string;
  day: string;
  opponent: TeamCode;
  state: "upcoming";
  local: string;
  kst: string;
}

export type WeekSeries = PlayedSeries | UpcomingSeries;

export interface CardWeek {
  week: number;
  series: WeekSeries[];
  /** The Captain's multiplier, when he is your Captain. */
  captain?: number;
  /** The week's points, after the Captain. */
  total: number;
}

export interface FixtureRow {
  id: string;
  week: number;
  day: string;
  opponent: TeamCode;
  bestOf: number;
  local: string;
  kst: string;
}

/** A series in History: his points, and that week's price. */
export interface HistoryRow {
  id: string;
  week: number;
  day: string;
  opponent: TeamCode;
  score: Score;
  games: number;
  kda: string;
  priceM: number;
  points: number;
}

/** A past LCK season, scored by Flol. */
export interface PastSeason {
  name: string;
  games: number;
  kda: string;
  points: number;
}

export interface CardHistory {
  competition: string;
  rows: HistoryRow[];
  pastSeasons: PastSeason[];
}

export interface ChampionRow {
  champion: string;
  games: number;
  wins: number;
  losses: number;
  /** Average points over every game on him. */
  average: number;
}

/** A scoring line's season total, and the points it gave. */
export interface SeasonLine {
  line: string;
  total: number;
  points: number;
}

export interface PlayerCardData {
  name: string;
  hangul: string;
  legalName: string;
  role: RoleKey;
  team: TeamCode;
  /** His media-day portrait for the split; his team's crest until it is saved. */
  photo?: string;
  /** An admin's news line, shown as a bar over the card. */
  news?: string;
  season: { points: number; place: number; field: string; games: number; lines: SeasonLine[] };
  priceM: number;
  /** The last move, in m. */
  priceMove: number;
  form: number;
  formPlace: number;
  ownedPct: number;
  ownedPlace: number;
  transfersIn: number;
  transfersOut: number;
  /** The last 3 series, then the next 3. */
  past: PastSeries[];
  next: NextSeries[];
  /** Each tab's content; a tab without it shows nothing yet. */
  thisWeek?: CardWeek;
  fixtures?: FixtureRow[];
  history?: CardHistory;
  champions?: ChampionRow[];
}

/** Your Captain's C, as Pick Team holds it. */
export type CardMark = Mark | undefined;

/** The Pick Team keys, shown when the card opens from Pick Team; from Points there are none. */
export interface CardActions {
  mark: CardMark;
  onMark: (mark: Mark) => void;
  onSwap: () => void;
  onTransferOut: () => void;
}

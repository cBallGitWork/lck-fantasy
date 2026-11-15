// What a player card shows, as props: the backend feeds these once it is wired (#36, #22, #23, #20, #19).

import type { TeamCode } from "../../fixtures/week3";
import type { Score } from "../../parts";
import type { RoleKey } from "../../rift";

export const CARD_TABS = ["This week", "Fixtures", "History", "Champions"] as const;
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

/** A series in This week: his team's score first. */
export interface WeekSeries {
  id: string;
  day: string;
  opponent: TeamCode;
  score: Score;
  state: "final" | "live";
  /** The game being played, while live. */
  liveGame?: number;
  games: CardGame[];
}

export interface CardWeek {
  week: number;
  series: WeekSeries[];
  /** The Carry's multiplier, when he is your Carry. */
  carry?: number;
  /** The week's points, after the Carry. */
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
  priceEok: number;
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
  /** An admin's news line, shown as a bar over the card. */
  news?: string;
  season: { points: number; place: number; field: string; games: number; lines: SeasonLine[] };
  priceEok: number;
  /** The last move, in 억. */
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

/** Your Carry and Vice-carry marks, as Pick Team holds them. */
export type CardMark = "C" | "V" | undefined;

/** The Pick Team keys, shown when the card opens from Pick Team; from Points there are none. */
export interface CardActions {
  mark: CardMark;
  onMark: (mark: "C" | "V") => void;
  onSwap: () => void;
  onTransferOut: () => void;
}

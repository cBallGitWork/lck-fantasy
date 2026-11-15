import type { Score, SeriesRow, SeriesState, WeekNav } from "../../parts";
import type { Mark, PersonRole, RoleKey, SlotKey } from "../../rift";

/** One game a player played: its champion, won or lost (neither while live), its points, and whether it counts. */
export interface PointsGame {
  game: number;
  champion?: string;
  won?: boolean;
  /** The live game's clock. */
  clock?: string;
  points: number;
  counted: boolean;
}

/** One series a player played this week, from his team's side. */
export interface PointsSeries {
  id: string;
  day: string;
  opponent: string;
  /** Games won, his team's first. */
  score: Score;
  state: SeriesState;
  liveGame?: number;
  points: number;
  games: PointsGame[];
}

export interface PointsPlayer {
  name: string;
  team: string;
  role: PersonRole;
  /** The id his player or coach card is reached by. */
  cardId: string;
  mark?: Mark;
  birthday?: boolean;
  /** Who he came on for. */
  subbedInFor?: string;
  /** The week's points; absent when he didn't play. */
  points?: number;
  series: PointsSeries[];
}

export interface PointsStarter extends PointsPlayer {
  slot: SlotKey;
  /** The role a Flex plays. */
  plays?: RoleKey;
  /** The Carry's week: his points before the multiplier, the multiplier, and the average Carry's points. */
  carry?: { raw: number; multiplier: number; average: number };
}

/** A line of Your week: Star, Flop or Killer. */
export interface WeekPick {
  label: string;
  name: string;
  points: number;
  ownedPct: number;
  /** One of your players. */
  mine: boolean;
}

export interface LeagueRank {
  name: string;
  rank: string;
  /** Places moved: up when positive. */
  move: number;
}

/** Everything Points shows; the backend feeds it once a later issue wires it. */
export interface PointsData {
  team: string;
  hangul: string;
  week: WeekNav;
  total: number;
  /** All the week's points are final. */
  final: boolean;
  average: number;
  highest: number;
  /** The series being played now, if one is. */
  live?: { home: string; away: string; game: number };
  starters: PointsStarter[];
  bench: PointsPlayer[];
  yourWeek: WeekPick[];
  leagues: LeagueRank[];
  /** The points to your Overall tier's next step. */
  nextTier: { points: number; tier: string };
  series: readonly SeriesRow[];
}

export const POINTS_VIEWS = ["Rift view", "Card view"] as const;
export type PointsView = (typeof POINTS_VIEWS)[number];

/** A player with no games this week, on his tile and his bench tile. */
export const DIDNT_PLAY = "Didn't play";

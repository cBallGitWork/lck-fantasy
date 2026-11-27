import type { Fact, Score, SeriesRow, SeriesState, WeekNav } from "../../parts";
import type { Mark, PersonRole, RoleKey, SlotKey } from "../../rift";
import type { Kda, LineWord } from "../../fixtures/week3";
import type { Tier, TierLine } from "../../../convex/leagues/tiers";

/** One game a player played: its champion, won or lost (neither while live), its points, and whether it counts. */
export interface PointsGame {
  game: number;
  champion?: string;
  /** His K/D/A; a coach has none. */
  kda?: Kda;
  /** The scoring lines that gave points, as words; empty when none did or none are known. */
  lines: readonly LineWord[];
  won?: boolean;
  /** The live game's clock. */
  clock?: string;
  points: number;
  counted: boolean;
}

/** One series a player played this week, from his team's side. */
export interface PointsSeries {
  id: string;
  /** `Wed`. */
  day: string;
  opponent: string;
  /** Games won, his team's first. */
  score: Score;
  state: SeriesState;
  /** The coach's +3 for a series won or −1 for one lost, once it's over. */
  coachResult?: number;
  points: number;
  games: PointsGame[];
}

export interface PointsPlayer {
  name: string;
  hangul: string;
  team: string;
  role: PersonRole;
  /** The id his player or coach card is reached by. */
  cardId: string;
  mark?: Mark;
  birthday?: boolean;
  /** The week's points; absent when he didn't play. */
  points?: number;
  /** His points count towards the total: false for a bench player with no Bench Boost and no auto-sub (spec/12, Points). */
  counts: boolean;
  series: PointsSeries[];
}

export interface PointsStarter extends PointsPlayer {
  slot: SlotKey;
  /** The role a Flex plays. */
  plays?: RoleKey;
  /** The Captain's week: his points before the multiplier, the multiplier, and the average Captain's points. His own points are already the result. */
  captain?: { before: number; by: number; average: number };
}

/** A line of Your week: Star, Flop or Killer. */
export interface WeekPick {
  label: Fact;
  name: string;
  team: string;
  points: number;
  ownedPct: number;
  /** One of your players. */
  mine: boolean;
}

export interface LeagueRank {
  name: string;
  /** Overall's tier after its name (`Overall · Emerald I`). */
  tier?: Tier;
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
  /** The points to your Overall tier's next step; at Challenger, your room over the tier below (spec/08). None while Unranked. */
  tierLine: TierLine | null;
  series: readonly SeriesRow[];
}

export { VIEWS as POINTS_VIEWS, type BoardView as PointsView } from "../../rift";

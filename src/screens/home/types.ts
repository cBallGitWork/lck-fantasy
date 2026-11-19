// What Home shows, as the backend will feed it (issue #80's one query). Fixtures fill it until then.

import type { Stream } from "../../fixtures/streams";
import type { CheerKind, Score } from "../../parts";
import type { IconKey, Mark, RoleKey, SlotKey } from "../../rift";

/** Overall as a LoL tier with divisions (spec/08): the tier with its division, its hangul, the rank and move. */
export interface OverallTier {
  tier: string;
  hangul: string;
  rank: number;
  /** Places moved: up positive, down negative. */
  move: number;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

export interface HomeDeadline {
  week: number;
  competition: string;
  local: string;
}

/** A Following card item (spec/14): a manager's series points, a big Captain, or a cheer or jeer received. */
export type FeedItem =
  | { kind: "series"; id: string; managerId: string; manager: string; series: string; points: number }
  | { kind: "captain"; id: string; managerId: string; manager: string; player: string; series: string; points: number }
  | { kind: "received"; cheer: CheerKind; id: string; line: string; from: string; week: number };

/** One of your leagues: its rank and move. A private league's rank reads as a place (`2nd`). */
export interface HomeLeague {
  id: string;
  name: string;
  kind: "country" | "team" | "private";
  rank: number;
  move: number;
}

/** A player or coach on a side list: role icon, name, C, team, a stat line, points. */
export interface SidePlayer {
  role: IconKey;
  name: string;
  team: string;
  mark?: Mark;
  stat?: string;
  points: number;
  /** Effective ownership in per cent, beside the points for star and flop: `22 · 31%`. */
  eoPct?: number;
}

export interface WeekPoints {
  label: string;
  final: boolean;
  points: number;
  average: number;
  highest: number;
}

export interface HomeShared {
  team: string;
  hangul: string;
  overall: OverallTier;
  deadline: HomeDeadline;
  countdown: Countdown;
  freeTransfers: number;
  following: FeedItem[];
  leagues: HomeLeague[];
}

export interface LiveSeries {
  home: string;
  away: string;
  score: Score;
  game: number;
  bestOf: number;
  /** `Split 1 Week 3`. */
  label: string;
}

export interface HomeLiveData extends HomeShared {
  state: "live";
  series: LiveSeries;
  streams: Stream[];
  /** The manager's remembered pick. */
  pickedStream: string;
  week: WeekPoints;
  inSeries: SidePlayer[];
  stillToPlay: SidePlayer[];
}

export interface LineupStarter {
  slot: SlotKey;
  name: string;
  team: string;
  /** The role a Flex plays. */
  plays?: RoleKey;
  mark?: Mark;
}

export interface NextSeries {
  home: string;
  away: string;
  day: string;
  local: string;
  startsIn: Omit<Countdown, "minutes">;
}

export interface HomeIdleData extends HomeShared {
  state: "idle";
  lineupWeek: number;
  lineup: LineupStarter[];
  next: NextSeries;
  week: WeekPoints;
  /** Last week's star and flop, the same for every manager (spec/12); more than one each when still tied. */
  stars: SidePlayer[];
  flops: SidePlayer[];
}

export type HomeData = HomeLiveData | HomeIdleData;

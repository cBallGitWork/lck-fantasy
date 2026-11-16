// What Home shows, as the backend will feed it (issue #80's one query). Fixtures fill it until then.

import type { Score } from "../../parts";
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
  kst: string;
}

/** A Following card item (spec/14): a manager's series points, a big Carry, or a truck received. */
export type FeedItem =
  | { kind: "series"; id: string; manager: string; series: string; points: number }
  | { kind: "carry"; id: string; manager: string; player: string; series: string; points: number }
  | { kind: "truck"; id: string; line: string; from: string; week: number };

/** One of your leagues: its rank and move. A private league's rank reads as a place (`2nd`). */
export interface HomeLeague {
  id: string;
  name: string;
  kind: "country" | "team" | "private";
  rank: number;
  move: number;
}

/** A player or coach on a side list: role icon, name, C or V, team, a stat line, points. */
export interface SidePlayer {
  role: IconKey;
  name: string;
  team: string;
  mark?: Mark;
  stat?: string;
  points: number;
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

/** A stream on the picker (spec/12, Live): admin data; one not live is greyed out. */
export interface Stream {
  id: string;
  name: string;
  platform: string;
  live: boolean;
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
  kst: string;
  startsIn: Omit<Countdown, "minutes">;
}

export interface HomeIdleData extends HomeShared {
  state: "idle";
  lineupWeek: number;
  lineup: LineupStarter[];
  next: NextSeries;
  week: WeekPoints;
  star: SidePlayer;
  flop: SidePlayer;
}

export type HomeData = HomeLiveData | HomeIdleData;

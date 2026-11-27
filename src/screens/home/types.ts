// What Home shows, as the backend will feed it (issue #80's one query). Fixtures fill it until then.

import type { BuffEffect } from "../../../convex/squads/buffs";
import type { Stream } from "../../fixtures/streams";
import type { CheerKind, FactKind as DrawnFact, Score, SeriesRow, Standing } from "../../parts";
import type { Mark, PersonRole, RoleKey, SlotKey } from "../../rift";

/** Every fact Home names with its mark: Star, Flop and All managers' (approved/home/, What binds 7). */
export type FactKind = Exclude<DrawnFact, "killer"> | "captained";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

/** A player named in a row: his team's bar and code, then his name, `T1 Faker`; a dot when he is yours. */
export interface Named {
  name: string;
  team: string;
  mine?: boolean;
}

/** A buff played: its effect and its name. */
export interface PlayedBuff {
  effect: BuffEffect;
  name: string;
}

/** A starter who may not play: his role (a Flex's own), the admin's flag and its note, `Not starting` `Wed`. */
export interface Doubt extends Named {
  role: PersonRole;
  flag: string;
  note: string;
}

/** The side column's first panel (What binds 6). */
export interface HomeDeadline {
  week: number;
  /** The manager's time: `Wed 7:45am`. */
  local: string;
  countdown: Countdown;
  freeTransfers: number;
  /** The buff played for this week, before its deadline. */
  buff?: PlayedBuff;
  /** Each starter who may not play; never the bench. */
  doubts: Doubt[];
  /** The three deadlines after this one. */
  next: { week: number; local: string }[];
}

/** A followed manager's series in the week, as the Following panel lists it. */
export interface FeedItem {
  id: string;
  managerId: string;
  manager: string;
  /** `GEN v KT`. */
  series: string;
  points: number;
}

/** The latest cheer or jeer received, on its LED panel. */
export interface Received {
  cheer: CheerKind;
  line: string;
  from: string;
  week: number;
}

export interface HomeFollowing {
  week: number;
  final: boolean;
  items: FeedItem[];
  received?: Received;
}

/** One of All managers' facts: Most captained as a share of managers, Most bought and Most sold as counts. */
export interface ManagersFact extends Named {
  kind: "captained" | "bought" | "sold";
  /** A share in per cent for Most captained; a count of managers otherwise. */
  value: number;
}

/** All managers' facts for one week: Most captained under the week it was set for; bought and sold under `Week N so far`. */
export interface ManagersWeek {
  week: number;
  soFar: boolean;
  facts: ManagersFact[];
}

/** A star or flop: his points and effective ownership, in per cent. */
export interface WeekPick extends Named {
  points: number;
  eoPct: number;
}

/** The side column's week panel (What binds 7). */
export interface HomeWeek {
  week: number;
  final: boolean;
  points: number;
  average: number;
  highest: number;
  /** The buff on in this week, a tag by the total. */
  buff?: string;
  /** The last finished week's star and flop, the same for every manager (spec/12); more than one each when still tied. */
  starFlop: { week: number; stars: WeekPick[]; flops: WeekPick[] };
}

/** One of your leagues: its rank and move. A private league's rank reads as a place (`2nd`). */
export interface HomeLeague {
  id: string;
  name: string;
  kind: "country" | "team" | "private";
  rank: number;
  move: number;
}

export interface HomeShared {
  team: string;
  hangul: string;
  /** Overall as a LoL tier (spec/08): the tier, its rank and move. */
  overall: Standing;
  deadline: HomeDeadline;
  /** The week's series, as Points' panel. */
  series: { week: number; rows: SeriesRow[] };
  following: HomeFollowing;
  managers: ManagersWeek[];
  week: HomeWeek;
  leagues: HomeLeague[];
}

export interface LiveSeries {
  home: string;
  away: string;
  score: Score;
  game: number;
  bestOf: number;
}

/** Your player in the live series: his points so far, the Captain's before ×1.5, as Points shows a series. */
export interface InSeries extends Named {
  mark?: Mark;
  points: number;
}

export interface HomeLiveData extends HomeShared {
  state: "live";
  live: LiveSeries;
  streams: Stream[];
  /** The manager's remembered pick. */
  pickedStream: string;
  inSeries: InSeries[];
}

/** A lineup card: Card view's, with the week's opponents. */
export interface LineupPlayer {
  slot: SlotKey;
  name: string;
  team: string;
  /** The role a Flex plays. */
  plays?: RoleKey;
  mark?: Mark;
  /** His news flag: `Not starting`. */
  news?: string;
  /** The coach's multiplier while Coach Diff is on. */
  times?: number;
  opponents: string[];
}

/** A bench player, in his order. */
export interface BenchPlayer {
  role: PersonRole;
  name: string;
  team: string;
  opponents: string[];
}

export interface HomeIdleData extends HomeShared {
  state: "idle";
  lineupWeek: number;
  lineup: LineupPlayer[];
  bench: BenchPlayer[];
}

export type HomeData = HomeLiveData | HomeIdleData;

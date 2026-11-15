// The league forms' made-up data (docs/design/approved/leagues/), at Pick Team's moment: Week 4,
// before its deadline. League names, codes and counts are the pictures' own; weeks are the LCK Cup's.

import { WEEK4_SERIES } from "../../fixtures/week3";

/** A private league the manager is in, as its header and the forms show it. */
export interface PrivateLeague {
  id: string;
  name: string;
  code: string;
  /** The week its scoring starts from. */
  scoringFrom: number;
  managers: number;
  /** The manager's rank in it. */
  rank: number;
  /** The manager made it: Admin in place of Leave. */
  maker: boolean;
}

/** A week a new league's scoring can start from, with its first day (`Week 4 · Wed 20 Jan`). */
export interface ScoringWeek {
  week: number;
  starts: string;
}

/** This week, then each later one: never empty. */
export type ScoringWeeks = [ScoringWeek, ...ScoringWeek[]];

/** How many private leagues a manager can be in (spec/08). Data, per competition. */
export const PRIVATE_LEAGUE_CAP = 25;

/** The longest league name, as the Create sheet counts it (create.html, `11 / 30`). */
export const LEAGUE_NAME_MAX = 30;

export const PRIVATE_LEAGUES: PrivateLeague[] = [
  { id: "pub-league", name: "Pub League", code: "PUB-7K2Q", scoringFrom: 1, managers: 12, rank: 2, maker: true },
  { id: "flol-discord", name: "Flol Discord", code: "FLOL-22XB", scoringFrom: 3, managers: 86, rank: 14, maker: false },
];

const week4Starts = `${WEEK4_SERIES[0]?.day} ${WEEK4_SERIES[0]?.date}`;

/** This week on, this week first: scoring can start no earlier (spec/08). */
export const SCORING_WEEKS: ScoringWeeks = [
  { week: 4, starts: week4Starts },
  { week: 5, starts: "Wed 27 Jan" },
  { week: 6, starts: "Wed 3 Feb" },
];

/** The league the Create picture makes, and the code it is given (create.html, created.html). */
export const NEW_LEAGUE = { name: "Office Rift", code: "OFF-9R3D" } as const;

/** A league the Join picture's code finds (join.html). Its rank and size are made up. */
export const JOINABLE_LEAGUES: PrivateLeague[] = [
  { id: "gank-squad", name: "Gank Squad", code: "GANK-4TQ1", scoringFrom: 2, managers: 9, rank: 9, maker: false },
];

/** Made up: the pictures draw no wrong code. */
export const NO_SUCH_CODE = "No league has that code";

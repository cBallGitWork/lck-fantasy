// What the Series page is fed (docs/design/approved/series/). The fixture feeds it until the
// backend does: series and lines (#36), best 2 and coach lines (#30), live points (#34).

import type { RoleKey } from "../../rift";

/** When and what the series is: `Bo3 · LCK Cup · Week 3 · Sat 16 Jan`, then the time. */
export interface SeriesWhen {
  format: string;
  competition: string;
  week: number;
  day: string;
  date: string;
  local: string;
  kst: string;
}

/** A team in the scorebug: code, name and record as of when the page is opened. */
export interface Side {
  code: string;
  name: string;
  record: string;
}

/** A player or coach, who opens his card. */
export interface Person {
  /** His card's id (`/player/$playerId`, `/coach/$coachId`). */
  id: string;
  name: string;
  hangul: string;
  /** One of your players: the dot after his name. */
  mine?: boolean;
}

/** One player's game: champion, K/D/A and points; `counts` boxes it as one of his best 2. */
export interface GameCell {
  champion: string;
  kda: string;
  points: number;
  counts: boolean;
  /** Player of the Game. */
  pog?: boolean;
}

/** The coach's game: the coach lines that scored, and points. */
export interface CoachCell {
  lines: string[];
  points: number;
  counts: boolean;
}

export interface PlayerLine extends Person {
  role: RoleKey;
  /** A sub: `· sub` beside his role. */
  sub?: boolean;
  /** One per game; null where he sat out. */
  games: (GameCell | null)[];
  /** His best-2 total. */
  total: number;
}

export interface CoachLine extends Person {
  games: CoachCell[];
  /** His best-2 total, the series result included once final. */
  total: number;
  /** The series result's points once final (`W +3`, `L −1`). */
  result?: number;
}

export interface TeamSheet extends Side {
  players: PlayerLine[];
  coach: CoachLine;
}

/** A game played (its winner, length and VOD), or the one being played (its clock). */
export type Game = { winner: string; length: string; vod: string } | { clock: string };

/** A series under way or over: the games, and both teams' grids. */
export interface PlayedSeries {
  id: string;
  when: SeriesWhen;
  games: Game[];
  home: TeamSheet;
  away: TeamSheet;
}

export interface Roster extends Side {
  players: (Person & { role: RoleKey })[];
  coach: Person;
}

/** A series before it starts: both rosters. */
export interface NextSeries {
  id: string;
  when: SeriesWhen;
  home: Roster;
  away: Roster;
}

/** The page in each state its picture draws. */
export type SeriesView = { state: "final"; series: PlayedSeries } | { state: "live"; series: PlayedSeries } | { state: "next"; series: NextSeries };

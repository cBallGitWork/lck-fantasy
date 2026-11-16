// T1's made-up Split 1 at Week 4's Tuesday, Weeks 1 to 3 final (src/fixtures/weeks.ts), and the season figures of Faker and
// kkOma, as their cards and Compare share them. Every number is an example.

import type { Score } from "../parts";
import { BEST_OF, type TeamCode } from "./competition";
import { opponent, playedFromSide, seriesOf } from "./series";
import { gamesOf } from "./standings";
import { EARLY, LATE, WEEK1_SERIES, WEEK2_SERIES, WEEK3_SERIES_FINAL, WEEK4_SERIES } from "./weeks";

const T1: TeamCode = "T1";

/** A series T1 have played or will play. */
export interface T1Series {
  id: string;
  week: number;
  day: string;
  opponent: TeamCode;
}

/** A series T1 have played, with the score from their side. */
export interface T1Played extends T1Series {
  score: Score;
  /** The games played: the score's two sides added. */
  games: number;
}

/** A series to come, with its times, London then KST. */
export interface T1Fixture extends T1Series {
  bestOf: number;
  local: string;
  kst: string;
}

const played = (id: string, week: number, day: string, opponent: TeamCode, score: Score): T1Played => ({
  id,
  week,
  day,
  opponent,
  score,
  games: score[0] + score[1],
});

/** T1's series so far, newest first, from each week's results. */
export const T1_PLAYED: readonly T1Played[] = (
  [
    [3, WEEK3_SERIES_FINAL],
    [2, WEEK2_SERIES],
    [1, WEEK1_SERIES],
  ] as const
).flatMap(([week, list]) =>
  seriesOf(list, T1)
    .reverse()
    .map((s) => {
      const side = playedFromSide(s, T1);
      return played(s.id, week, s.day, side.opponent, side.score);
    }),
);

/** T1's series to come: Week 4's from its fixtures, then Weeks 5 and 6. */
export const T1_FIXTURES: readonly T1Fixture[] = [
  ...seriesOf(WEEK4_SERIES, T1).map((s) => ({ id: s.id, week: 4, day: s.day, opponent: opponent(s, T1), bestOf: BEST_OF, local: s.local, kst: s.kst })),
  { id: "w5-thu-2", week: 5, day: "Thu", opponent: "BRO", bestOf: BEST_OF, ...EARLY },
  { id: "w5-sun-2", week: 5, day: "Sun", opponent: "KRX", bestOf: BEST_OF, ...LATE },
  { id: "w6-wed-1", week: 6, day: "Wed", opponent: "DK", bestOf: BEST_OF, ...EARLY },
  { id: "w6-sat-2", week: 6, day: "Sat", opponent: "HLE", bestOf: BEST_OF, ...LATE },
];

/** T1's next three series. */
export const T1_NEXT3 = T1_FIXTURES.slice(0, 3);

/** A scoring line's season total and the points it gave. A coach's series line has no per-game figure. */
export interface SeasonLine {
  line: string;
  total: number;
  points: number;
  series?: boolean;
}

/** A T1 member's season at Week 4's Tuesday, as his card and Compare show it. */
export interface T1MemberSeason {
  name: string;
  games: number;
  /** His place by season points, and how many he is placed among. */
  place: number;
  of: number;
  /** This week's price rise in m. */
  riseM: number;
  /** His points in each of T1's series, in T1_PLAYED's order (newest first). */
  points: readonly number[];
  lines: readonly SeasonLine[];
}

export const FAKER_SEASON: T1MemberSeason = {
  name: "Faker",
  games: gamesOf(T1),
  place: 2,
  of: 10,
  riseM: 0.5,
  points: [10, 12, 10, 12, 11, 3],
  lines: [
    { line: "Kills", total: 73, points: 22 },
    { line: "Assists", total: 86, points: 16 },
    { line: "Deaths", total: 26, points: -4 },
    { line: "Gold lead at 15", total: 9, points: 9 },
    { line: "Solo kills", total: 5, points: 5 },
    { line: "First bloods", total: 3, points: 3 },
    { line: "Deathless", total: 4, points: 4 },
    { line: "Quadra kills", total: 1, points: 1 },
    { line: "Steals", total: 2, points: 2 },
  ],
};

export const KKOMA_SEASON: T1MemberSeason = {
  name: "kkOma",
  games: gamesOf(T1),
  place: 1,
  of: 10,
  riseM: 0.5,
  points: [8, 8, 4, 4, 3, 0],
  lines: [
    { line: "First tower", total: 8, points: 6 },
    { line: "Most drakes", total: 7, points: 5 },
    { line: "Most barons", total: 3, points: 2 },
    { line: "Most elders", total: 1, points: 0 },
    { line: "Quick win", total: 0, points: 0 },
    { line: "Series won", total: 5, points: 15, series: true },
    { line: "Series lost", total: 1, points: -1, series: true },
  ],
};

/** A member's points in T1's last three series, oldest first, with each series. */
export const last3 = (season: T1MemberSeason) => playedBy(season).slice(0, 3).reverse();

/** Each of T1's series with a member's points in it, newest first; a series with no points is a broken fixture. */
export function playedBy(season: T1MemberSeason): (T1Played & { points: number })[] {
  return T1_PLAYED.map((s, i) => {
    const points = season.points[i];
    if (points === undefined) throw new Error(`${season.name} has no points for ${s.id}`);
    return { ...s, points };
  });
}

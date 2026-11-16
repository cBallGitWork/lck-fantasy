// The made-up LCK Cup's Weeks 1 to 4: their series and deadlines, Weeks 3 and 4 at the pictures' moments.

import type { SeriesRow } from "../parts";
import type { TeamCode } from "./competition";

/** A series as the pictures show it: a list's row, with its date, and while live its game and clock. */
export type Series = SeriesRow & {
  home: TeamCode;
  away: TeamCode;
  date: string;
  /** The game being played, while live. */
  liveGame?: number;
  /** The live game's clock. */
  clock?: string;
};

/** A day's two series times, London then KST. */
export const EARLY = { local: "08:00", kst: "17:00" } as const;
export const LATE = { local: "10:30", kst: "19:30" } as const;

/** Week 1, final, as Points' earlier weeks and T1's season show it. */
export const WEEK1_SERIES: Series[] = [
  { id: "w1-wed-1", day: "Wed", date: "30 Dec", ...EARLY, home: "HLE", away: "KT", score: [2, 1], state: "final" },
  { id: "w1-wed-2", day: "Wed", date: "30 Dec", ...LATE, home: "T1", away: "GEN", score: [1, 2], state: "final" },
  { id: "w1-thu-1", day: "Thu", date: "31 Dec", ...EARLY, home: "DK", away: "BRO", score: [2, 1], state: "final" },
  { id: "w1-thu-2", day: "Thu", date: "31 Dec", ...LATE, home: "DNS", away: "KRX", score: [2, 0], state: "final" },
  { id: "w1-fri-1", day: "Fri", date: "1 Jan", ...EARLY, home: "BFX", away: "NS", score: [0, 2], state: "final" },
  { id: "w1-fri-2", day: "Fri", date: "1 Jan", ...LATE, home: "GEN", away: "DK", score: [2, 0], state: "final" },
  { id: "w1-sat-1", day: "Sat", date: "2 Jan", ...EARLY, home: "T1", away: "NS", score: [2, 0], state: "final" },
  { id: "w1-sat-2", day: "Sat", date: "2 Jan", ...LATE, home: "HLE", away: "BFX", score: [2, 0], state: "final" },
  { id: "w1-sun-1", day: "Sun", date: "3 Jan", ...EARLY, home: "KT", away: "DNS", score: [2, 1], state: "final" },
  { id: "w1-sun-2", day: "Sun", date: "3 Jan", ...LATE, home: "KRX", away: "BRO", score: [2, 1], state: "final" },
];

/** Week 2, final, as Points' earlier weeks and T1's season show it. */
export const WEEK2_SERIES: Series[] = [
  { id: "w2-wed-1", day: "Wed", date: "6 Jan", ...EARLY, home: "T1", away: "DNS", score: [2, 0], state: "final" },
  { id: "w2-wed-2", day: "Wed", date: "6 Jan", ...LATE, home: "GEN", away: "BRO", score: [2, 0], state: "final" },
  { id: "w2-thu-1", day: "Thu", date: "7 Jan", ...EARLY, home: "DK", away: "KT", score: [2, 1], state: "final" },
  { id: "w2-thu-2", day: "Thu", date: "7 Jan", ...LATE, home: "HLE", away: "NS", score: [2, 0], state: "final" },
  { id: "w2-fri-1", day: "Fri", date: "8 Jan", ...EARLY, home: "KRX", away: "DNS", score: [0, 2], state: "final" },
  { id: "w2-fri-2", day: "Fri", date: "8 Jan", ...LATE, home: "T1", away: "BFX", score: [2, 1], state: "final" },
  { id: "w2-sat-1", day: "Sat", date: "9 Jan", ...EARLY, home: "GEN", away: "KRX", score: [2, 1], state: "final" },
  { id: "w2-sat-2", day: "Sat", date: "9 Jan", ...LATE, home: "HLE", away: "DK", score: [2, 1], state: "final" },
  { id: "w2-sun-1", day: "Sun", date: "10 Jan", ...EARLY, home: "KT", away: "BFX", score: [2, 0], state: "final" },
  { id: "w2-sun-2", day: "Sun", date: "10 Jan", ...LATE, home: "BRO", away: "NS", score: [1, 2], state: "final" },
];

/** Week 3 at the Points picture's moment: Saturday 21:10 KST, T1 v DK game 2 live. */
export const WEEK3_SERIES_AT_POINTS: Series[] = [
  { id: "w3-wed-1", day: "Wed", date: "13 Jan", ...EARLY, home: "T1", away: "HLE", score: [2, 1], state: "final" },
  { id: "w3-wed-2", day: "Wed", date: "13 Jan", ...LATE, home: "GEN", away: "KT", score: [2, 0], state: "final" },
  { id: "w3-thu-1", day: "Thu", date: "14 Jan", ...EARLY, home: "DK", away: "NS", score: [2, 0], state: "final" },
  { id: "w3-thu-2", day: "Thu", date: "14 Jan", ...LATE, home: "BRO", away: "DNS", score: [1, 2], state: "final" },
  { id: "w3-fri-1", day: "Fri", date: "15 Jan", ...EARLY, home: "KT", away: "BFX", score: [2, 1], state: "final" },
  { id: "w3-fri-2", day: "Fri", date: "15 Jan", ...LATE, home: "NS", away: "KRX", score: [0, 2], state: "final" },
  { id: "w3-sat-1", day: "Sat", date: "16 Jan", ...EARLY, home: "GEN", away: "HLE", score: [2, 1], state: "notFinal" },
  {
    id: "w3-sat-2",
    day: "Sat",
    date: "16 Jan",
    ...LATE,
    home: "T1",
    away: "DK",
    score: [1, 0],
    state: "live",
    liveGame: 2,
    clock: "14:20",
  },
  { id: "w3-sun-1", day: "Sun", date: "17 Jan", ...EARLY, home: "KRX", away: "BRO", state: "next" },
  { id: "w3-sun-2", day: "Sun", date: "17 Jan", ...LATE, home: "BFX", away: "DNS", state: "next" },
];

/** Week 3 final, as Perfect game, the LCK hub's Results and the Series page show it. */
export const WEEK3_SERIES_FINAL: Series[] = [
  { id: "w3-wed-1", day: "Wed", date: "13 Jan", ...EARLY, home: "T1", away: "HLE", score: [2, 1], state: "final" },
  { id: "w3-wed-2", day: "Wed", date: "13 Jan", ...LATE, home: "GEN", away: "KT", score: [2, 0], state: "final" },
  { id: "w3-thu-1", day: "Thu", date: "14 Jan", ...EARLY, home: "DK", away: "NS", score: [2, 0], state: "final" },
  { id: "w3-thu-2", day: "Thu", date: "14 Jan", ...LATE, home: "BRO", away: "DNS", score: [1, 2], state: "final" },
  { id: "w3-fri-1", day: "Fri", date: "15 Jan", ...EARLY, home: "KT", away: "BFX", score: [2, 1], state: "final" },
  { id: "w3-fri-2", day: "Fri", date: "15 Jan", ...LATE, home: "NS", away: "KRX", score: [0, 2], state: "final" },
  { id: "w3-sat-1", day: "Sat", date: "16 Jan", ...EARLY, home: "GEN", away: "HLE", score: [2, 1], state: "final" },
  { id: "w3-sat-2", day: "Sat", date: "16 Jan", ...LATE, home: "T1", away: "DK", score: [2, 0], state: "final" },
  { id: "w3-sun-1", day: "Sun", date: "17 Jan", ...EARLY, home: "KRX", away: "BRO", score: [2, 1], state: "final" },
  { id: "w3-sun-2", day: "Sun", date: "17 Jan", ...LATE, home: "BFX", away: "DNS", score: [0, 2], state: "final" },
];

/** Week 4's fixtures, as Pick Team and the LCK hub show them. */
export const WEEK4_SERIES: Series[] = [
  { id: "w4-wed-1", day: "Wed", date: "20 Jan", ...EARLY, home: "HLE", away: "DK", state: "next" },
  { id: "w4-wed-2", day: "Wed", date: "20 Jan", ...LATE, home: "T1", away: "KT", state: "next" },
  { id: "w4-thu-1", day: "Thu", date: "21 Jan", ...EARLY, home: "GEN", away: "BRO", state: "next" },
  { id: "w4-thu-2", day: "Thu", date: "21 Jan", ...LATE, home: "NS", away: "DNS", state: "next" },
  { id: "w4-fri-1", day: "Fri", date: "22 Jan", ...EARLY, home: "KRX", away: "BFX", state: "next" },
  { id: "w4-fri-2", day: "Fri", date: "22 Jan", ...LATE, home: "DK", away: "KT", state: "next" },
  { id: "w4-sat-1", day: "Sat", date: "23 Jan", ...EARLY, home: "T1", away: "GEN", state: "next" },
  { id: "w4-sat-2", day: "Sat", date: "23 Jan", ...LATE, home: "HLE", away: "NS", state: "next" },
  { id: "w4-sun-1", day: "Sun", date: "24 Jan", ...EARLY, home: "BRO", away: "BFX", state: "next" },
  { id: "w4-sun-2", day: "Sun", date: "24 Jan", ...LATE, home: "KRX", away: "DNS", state: "next" },
];

/** Week 3's deadline, 15 minutes before its first series. */
export const WEEK3_DEADLINE = { day: "Wed", date: "13 Jan", time: "07:45", kst: "16:45" } as const;

/** Week 4's deadline, 15 minutes before its first series (pick.html). */
export const WEEK4_DEADLINE = { local: "Wed 07:45", kst: "16:45", countdown: "9h 45m", at: "2027-01-20T07:45:00Z" } as const;

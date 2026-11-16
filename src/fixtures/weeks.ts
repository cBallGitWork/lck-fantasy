// The made-up LCK Cup's Weeks 3 and 4: their series and deadlines, at the pictures' moments.

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

/** The pictures' moments as instants: Points' (Saturday 21:10 KST) and Pick Team's (Week 4, Tuesday 22:00 London). */
export const POINTS_AT = "2027-01-16T12:10:00Z";
export const PICK_TEAM_AT = "2027-01-19T22:00:00Z";

/** The time from one instant to a later one, in whole minutes. */
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

const MINUTE_MS = 60_000;

/** The countdown from `from` to `to`; a `to` before `from` is a broken fixture. */
export function countdown(from: string, to: string): Countdown {
  const minutes = Math.floor((Date.parse(to) - Date.parse(from)) / MINUTE_MS);
  if (!(minutes >= 0)) throw new Error(`${to} is not after ${from}`);
  return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60 };
}

/** A countdown in words: `9h 45m`, with days when there are any: `3d 19h 35m`. */
export const countdownText = ({ days, hours, minutes }: Countdown) => `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m`;

const MONTHS: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03" };

/** When a series starts, as an instant: its date and London time (UTC in January to March). */
export function startOf(s: Series): string {
  const [day, month] = s.date.split(" ");
  const mm = month && MONTHS[month];
  if (!day || !mm) throw new Error(`Series ${s.id} has no date this season`);
  return `2027-${mm}-${day.padStart(2, "0")}T${s.local}:00Z`;
}

const WEEK4_DEADLINE_AT = "2027-01-20T07:45:00Z";

/** Week 4's deadline, 15 minutes before its first series (pick.html), counted down from Pick Team's moment. */
export const WEEK4_DEADLINE = {
  local: "Wed 07:45",
  kst: "16:45",
  countdown: countdownText(countdown(PICK_TEAM_AT, WEEK4_DEADLINE_AT)),
  at: WEEK4_DEADLINE_AT,
} as const;

/** Free transfers Baron Steal FC has for Week 4 before he makes any. */
export const WEEK4_FREE_TRANSFERS = 2;

// The made-up LCK Cup Week 3 the approved pictures share (docs/design/approved/). Every name, score
// and price is an example, not roster data. Pages are built on it until the backend wires real data.
//
// The pictures catch the season at three moments, kept apart where they differ rather than merged:
// - Points (points.html): Week 3, Saturday 21:10 KST, T1 v DK game 2 live, GEN v HLE not final.
// - Perfect game (perfect.html) and the LCK hub: Week 3 final, seen on Week 4's Tuesday.
// - Pick Team (pick.html) and Stats (stats.html): Week 4, Tuesday 22:00 London, before the deadline.
// Times show in the manager's zone (London, UTC+0 in January), then KST.

import type { SeriesRow } from "../parts";
import type { Mark, PersonRole, SlotKey, SquadSlot } from "../rift";

export const TEAMS = {
  T1: "T1",
  GEN: "Gen.G",
  HLE: "Hanwha Life",
  DK: "Dplus KIA",
  KT: "KT Rolster",
  DNS: "DN SOOPers",
  NS: "Nongshim RedForce",
  KRX: "Kiwoom DRX",
  BRO: "HANJIN BRION",
  BFX: "BNK FEARX",
} as const;

export type TeamCode = keyof typeof TEAMS;

export const COMPETITION = "LCK Cup";

/**
 * The competition's values the pictures share: the Carry's multiplier, each series' length, the
 * most players from one team, the points a transfer over the free ones costs, the four buffs (spec/06).
 */
export const CARRY_MULTIPLIER = 1.5;
export const BEST_OF = 3;
export const TEAM_CAP = 2;
export const HIT_POINTS = 6;
export const BUFFS = ["Bench Boost", "Dual Carry", "Remake", "Limitless"] as const;
export type BuffName = (typeof BUFFS)[number];

/** The sample manager every picture shows. */
export const MANAGER = {
  team: "Baron Steal FC",
  hangul: "바론 스틸 FC",
  name: "Sam Lee",
} as const;

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

const EARLY = { local: "08:00", kst: "17:00" } as const;
const LATE = { local: "10:30", kst: "19:30" } as const;

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

/** A squad member at the Points picture's moment, with his points game by game. */
export interface PointsPick {
  slot: SlotKey | "bench";
  name: string;
  team: TeamCode;
  /** The role he plays: his slot's, save the Flex and the bench. */
  role: PersonRole;
  mark?: Mark;
  /** Each series he played this week: its id and points per game. A live series' last game is live. */
  series: { id: string; games: number[]; coachResult?: number }[];
  birthday?: boolean;
  /** Who he came on for, or that he went off unplayed. */
  subbedInFor?: string;
  subbedOut?: boolean;
}

/** Baron Steal FC at the Points picture's moment (points.html). */
export const POINTS_SQUAD: PointsPick[] = [
  { slot: "top", name: "Zeus", team: "HLE", role: "top", series: [{ id: "w3-wed-1", games: [4, 1, 3] }, { id: "w3-sat-1", games: [2, 5, 0] }] },
  { slot: "jng", name: "Canyon", team: "GEN", role: "jng", series: [{ id: "w3-wed-2", games: [3, 4] }, { id: "w3-sat-1", games: [2, 3, 4] }] },
  { slot: "mid", name: "Faker", team: "T1", role: "mid", mark: "C", series: [{ id: "w3-wed-1", games: [5, 2, 7] }, { id: "w3-sat-2", games: [4, 1] }] },
  { slot: "bot", name: "Ruler", team: "GEN", role: "bot", mark: "V", series: [{ id: "w3-wed-2", games: [3, 4] }, { id: "w3-sat-1", games: [3, 1, 4] }] },
  { slot: "sup", name: "Delight", team: "HLE", role: "sup", birthday: true, series: [{ id: "w3-wed-1", games: [2, 3, 1] }, { id: "w3-sat-1", games: [1, 2, 2] }] },
  { slot: "flex", name: "Siwoo", team: "DK", role: "top", subbedInFor: "Bdd", series: [{ id: "w3-thu-1", games: [3, 2] }, { id: "w3-sat-2", games: [2, 1] }] },
  {
    slot: "coach",
    name: "kkOma",
    team: "T1",
    role: "coach",
    series: [{ id: "w3-wed-1", games: [2, 0, 3], coachResult: 3 }, { id: "w3-sat-2", games: [2, 0] }],
  },
  { slot: "bench", name: "Bdd", team: "KT", role: "mid", subbedOut: true, series: [] },
  { slot: "bench", name: "Cuzz", team: "KT", role: "jng", series: [{ id: "w3-wed-2", games: [1, 0] }, { id: "w3-fri-1", games: [3, 2, 5] }] },
];

/** The Points picture's head: Average and Highest beside the total. */
export const POINTS_WEEK = { week: 3, average: 74, highest: 131 } as const;

/** Week 3's Average and Highest once final (Home, Live, Perfect game, Profile). */
export const WEEK3_FINAL = { average: 79, highest: 136 } as const;

/** A squad member at the Pick Team picture's moment, with Week 4's price in 억 and form. */
export interface PickTeamPick {
  slot: SquadSlot;
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceEok: number;
  form: number;
  mark?: Mark;
  news?: string;
}

/** Baron Steal FC at the Pick Team picture's moment (pick.html). */
export const PICK_TEAM_SQUAD: PickTeamPick[] = [
  { slot: "top", name: "Zeus", team: "HLE", role: "top", priceEok: 16.0, form: 14.0 },
  { slot: "jng", name: "Canyon", team: "GEN", role: "jng", priceEok: 15.5, form: 14.7 },
  { slot: "mid", name: "Faker", team: "T1", role: "mid", priceEok: 18.5, form: 19.3, mark: "C" },
  { slot: "bot", name: "Ruler", team: "GEN", role: "bot", priceEok: 17.0, form: 15.3, mark: "V" },
  { slot: "sup", name: "Delight", team: "HLE", role: "sup", priceEok: 9.0, form: 9.3 },
  { slot: "flex", name: "Siwoo", team: "DK", role: "top", priceEok: 7.5, form: 7.7, news: "Not starting Wed" },
  { slot: "coach", name: "kkOma", team: "T1", role: "coach", priceEok: 7.0, form: 9.0 },
  { slot: "bench1", name: "Bdd", team: "KT", role: "mid", priceEok: 5.0, form: 5.3 },
  { slot: "bench2", name: "Cuzz", team: "KT", role: "jng", priceEok: 4.0, form: 7.7 },
];

/** A player's or coach's id, as his card is reached by: his name in lower case. */
export const playerId = (name: string) => name.toLowerCase();

/** The sample manager's nine: the same names in the Points and Pick Team squads. */
export const MY_PLAYERS: ReadonlySet<string> = new Set(PICK_TEAM_SQUAD.map((p) => p.name));

/** A player in the Stats picture's list: Week 4 price in 억, its move, owned %, season points. */
export interface StatsPlayer {
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceEok: number;
  /** −1 a fall, 0 none, 1 a rise. */
  move: -1 | 0 | 1;
  ownedPct: number;
  points: number;
}

/** The Stats picture's players and coaches (stats.html). Its prices differ from Pick Team's; both are kept. */
export const STATS_PLAYERS: StatsPlayer[] = [
  { role: "mid", name: "Chovy", team: "GEN", priceEok: 17.5, move: 1, ownedPct: 41, points: 61 },
  { role: "mid", name: "Faker", team: "T1", priceEok: 18.5, move: 1, ownedPct: 46, points: 58 },
  { role: "bot", name: "Ruler", team: "GEN", priceEok: 16.0, move: 0, ownedPct: 38, points: 56 },
  { role: "bot", name: "Peyz", team: "T1", priceEok: 15.0, move: 1, ownedPct: 33, points: 52 },
  { role: "sup", name: "Keria", team: "T1", priceEok: 12.0, move: 0, ownedPct: 47, points: 52 },
  { role: "jng", name: "Canyon", team: "GEN", priceEok: 15.5, move: 0, ownedPct: 29, points: 50 },
  { role: "top", name: "Zeus", team: "HLE", priceEok: 14.0, move: 0, ownedPct: 31, points: 48 },
  { role: "top", name: "Doran", team: "T1", priceEok: 12.5, move: -1, ownedPct: 18, points: 45 },
  { role: "jng", name: "Oner", team: "T1", priceEok: 14.0, move: 0, ownedPct: 22, points: 43 },
  { role: "bot", name: "Gumayusi", team: "HLE", priceEok: 15.5, move: -1, ownedPct: 26, points: 42 },
  { role: "mid", name: "Zeka", team: "HLE", priceEok: 15.0, move: 0, ownedPct: 15, points: 41 },
  { role: "top", name: "Kiin", team: "GEN", priceEok: 13.5, move: 0, ownedPct: 21, points: 40 },
  { role: "sup", name: "Delight", team: "HLE", priceEok: 10.0, move: 0, ownedPct: 19, points: 38 },
  { role: "mid", name: "BuLLDoG", team: "DNS", priceEok: 11.0, move: 1, ownedPct: 6, points: 36 },
  { role: "top", name: "Siwoo", team: "DK", priceEok: 11.5, move: 1, ownedPct: 12, points: 35 },
  { role: "sup", name: "Duro", team: "GEN", priceEok: 9.5, move: 0, ownedPct: 14, points: 35 },
  { role: "mid", name: "ShowMaker", team: "DK", priceEok: 13.0, move: -1, ownedPct: 9, points: 33 },
  { role: "jng", name: "Kanavi", team: "HLE", priceEok: 13.0, move: 0, ownedPct: 11, points: 32 },
  { role: "bot", name: "Aiming", team: "DK", priceEok: 13.5, move: -1, ownedPct: 8, points: 31 },
  { role: "jng", name: "Pyosik", team: "DNS", priceEok: 10.5, move: 0, ownedPct: 4, points: 30 },
  { role: "coach", name: "kkOma", team: "T1", priceEok: 7.0, move: 0, ownedPct: 24, points: 27 },
  { role: "coach", name: "Ryu", team: "GEN", priceEok: 7.0, move: 0, ownedPct: 21, points: 26 },
  { role: "coach", name: "Homme", team: "HLE", priceEok: 6.5, move: 0, ownedPct: 9, points: 18 },
  { role: "coach", name: "Ssong", team: "DNS", priceEok: 5.5, move: 1, ownedPct: 3, points: 14 },
  { role: "coach", name: "cvMax", team: "DK", priceEok: 6.0, move: 0, ownedPct: 5, points: 13 },
  { role: "coach", name: "Score", team: "KT", priceEok: 5.5, move: 0, ownedPct: 2, points: 12 },
  { role: "coach", name: "Joker", team: "KRX", priceEok: 5.0, move: 0, ownedPct: 2, points: 11 },
];

/** A starter in the Perfect game picture: Week 3's best team, final. */
export interface PerfectPick {
  slot: SlotKey;
  name: string;
  team: TeamCode;
  role: PersonRole;
  points: number;
  /** Before ×1.5, for the Carry. */
  raw?: number;
  carry?: boolean;
  /** One of the sample manager's players. */
  mine?: boolean;
  line: string;
}

/** Week 3's perfect game (perfect.html). */
export const PERFECT_GAME: PerfectPick[] = [
  { slot: "top", role: "top", name: "Zeus", mine: true, team: "HLE", points: 14, line: "v T1 7 · v GEN 7" },
  { slot: "jng", role: "jng", name: "Pyosik", team: "DNS", points: 24, line: "v BRO 11 · v BFX 13" },
  { slot: "mid", role: "mid", name: "Faker", mine: true, team: "T1", points: 40, raw: 27, carry: true, line: "v HLE 12 · v DK 15" },
  { slot: "bot", role: "bot", name: "Ruler", mine: true, team: "GEN", points: 14, line: "v KT 7 · v HLE 7" },
  { slot: "sup", role: "sup", name: "Duro", team: "GEN", points: 13, line: "v KT 6 · v HLE 7" },
  { slot: "flex", role: "mid", name: "BuLLDoG", team: "DNS", points: 21, line: "v BRO 9 · v BFX 12" },
  { slot: "coach", role: "coach", name: "kkOma", mine: true, team: "T1", points: 16, line: "v HLE 8 · v DK 8" },
];

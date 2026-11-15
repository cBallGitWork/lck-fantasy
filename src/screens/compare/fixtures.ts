// Compare's made-up data, as its approved picture draws it (docs/design/approved/compare/):
// LCK Cup Week 4, Tuesday, Weeks 1 to 3 final. Faker and kkOma are the cards' own; Chovy and Ryu
// are the Stats and Transfers pictures'. Only these four have lines until the backend (#36).

import { STATS_PLAYERS, type TeamCode } from "../../fixtures/week3";
import type { RoleKey } from "../../rift";

export type CompareRole = RoleKey | "coach";

/** A series already played: its week and day, the opponent, his points. */
export interface PastSeries {
  when: string;
  opp: TeamCode;
  points: number;
}

/** A series to come: its week and day, the opponent. */
export interface NextSeries {
  when: string;
  opp: TeamCode;
}

/** One scoring line: its season total and points. A series line (a coach's won or lost) has no per-game figure. */
export interface ScoringLine {
  line: string;
  total: number;
  points: number;
  series?: boolean;
}

/** One side of Compare. */
export interface ComparePlayer {
  /** His card's param (`/player/faker`, `/coach/kkoma`). */
  id: string;
  name: string;
  hangul: string;
  team: TeamCode;
  role: CompareRole;
  games: number;
  /** Season points, his rank and how many he is ranked among (`2nd of 10 mids`). */
  season: { points: number; rank: number; among: number };
  form: number;
  priceEok: number;
  /** This week's price rise in 억, if any. */
  riseEok?: number;
  ownedPct: number;
  last3: PastSeries[];
  next3: NextSeries[];
  lines: ScoringLine[];
}

const NEXT_T1: NextSeries[] = [
  { when: "W4 · Wed", opp: "KT" },
  { when: "W4 · Sat", opp: "GEN" },
  { when: "W5 · Thu", opp: "BRO" },
];
const NEXT_GEN: NextSeries[] = [
  { when: "W4 · Thu", opp: "BRO" },
  { when: "W4 · Sat", opp: "T1" },
  { when: "W5 · Wed", opp: "DNS" },
];

export const FAKER: ComparePlayer = {
  id: "faker",
  name: "Faker",
  hangul: "이상혁",
  team: "T1",
  role: "mid",
  games: 15,
  season: { points: 58, rank: 2, among: 10 },
  form: 19.3,
  priceEok: 18.5,
  riseEok: 0.5,
  ownedPct: 46,
  last3: [
    { when: "W2 · Fri", opp: "BFX", points: 10 },
    { when: "W3 · Wed", opp: "HLE", points: 12 },
    { when: "W3 · Sat", opp: "DK", points: 10 },
  ],
  next3: NEXT_T1,
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

export const CHOVY: ComparePlayer = {
  id: "chovy",
  name: "Chovy",
  hangul: "정지훈",
  team: "GEN",
  role: "mid",
  games: 16,
  season: { points: 61, rank: 1, among: 10 },
  form: 20.3,
  priceEok: 17.5,
  riseEok: 0.5,
  ownedPct: 41,
  last3: [
    { when: "W2 · Sat", opp: "BRO", points: 11 },
    { when: "W3 · Wed", opp: "KT", points: 9 },
    { when: "W3 · Sat", opp: "HLE", points: 8 },
  ],
  next3: NEXT_GEN,
  lines: [
    { line: "Kills", total: 70, points: 24 },
    { line: "Assists", total: 74, points: 12 },
    { line: "Deaths", total: 9, points: -2 },
    { line: "Gold lead at 15", total: 11, points: 11 },
    { line: "Solo kills", total: 8, points: 8 },
    { line: "First bloods", total: 3, points: 3 },
    { line: "Deathless", total: 4, points: 4 },
    { line: "Quadra kills", total: 1, points: 1 },
    { line: "Steals", total: 0, points: 0 },
  ],
};

export const KKOMA: ComparePlayer = {
  id: "kkoma",
  name: "kkOma",
  hangul: "김정균",
  team: "T1",
  role: "coach",
  games: 15,
  season: { points: 27, rank: 1, among: 10 },
  form: 9.0,
  priceEok: 7.0,
  riseEok: 0.5,
  ownedPct: 22,
  last3: [
    { when: "W2 · Fri", opp: "BFX", points: 4 },
    { when: "W3 · Wed", opp: "HLE", points: 8 },
    { when: "W3 · Sat", opp: "DK", points: 8 },
  ],
  next3: NEXT_T1,
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

export const RYU: ComparePlayer = {
  id: "ryu",
  name: "Ryu",
  hangul: "류상욱",
  team: "GEN",
  role: "coach",
  games: 16,
  season: { points: 26, rank: 2, among: 10 },
  form: 8.7,
  priceEok: 7.0,
  ownedPct: 21,
  last3: [
    { when: "W2 · Sat", opp: "BRO", points: 5 },
    { when: "W3 · Wed", opp: "KT", points: 6 },
    { when: "W3 · Sat", opp: "HLE", points: 9 },
  ],
  next3: NEXT_GEN,
  lines: [
    { line: "First tower", total: 7, points: 5 },
    { line: "Most drakes", total: 6, points: 4 },
    { line: "Most barons", total: 4, points: 3 },
    { line: "Most elders", total: 0, points: 0 },
    { line: "Quick win", total: 1, points: 0 },
    { line: "Series won", total: 5, points: 15, series: true },
    { line: "Series lost", total: 1, points: -1, series: true },
  ],
};

/** Every player Compare has lines for, by name. */
export const COMPARE_PLAYERS: Record<string, ComparePlayer> = Object.fromEntries([FAKER, CHOVY, KKOMA, RYU].map((p) => [p.name, p]));

/** A row of the second player's search: name, team, price in 억, season points. */
export interface SearchRow {
  name: string;
  team: TeamCode;
  role: CompareRole;
  priceEok: number;
  points: number;
}

/** The search's players: the Stats picture's list. */
export const SEARCH_ROWS: SearchRow[] = STATS_PLAYERS.map(({ name, team, role, priceEok, points }) => ({ name, team, role, priceEok, points }));

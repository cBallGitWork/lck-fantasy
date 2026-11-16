// Compare's made-up data, as its approved picture draws it (docs/design/approved/compare/):
// LCK Cup Week 4, Tuesday, Weeks 1 to 3 final. Faker and kkOma are the cards' own; Chovy and Ryu
// are the Stats and Transfers pictures'. Only these four have lines until the backend (#36).

import { hangulOf } from "../../fixtures/rosters";
import { FAKER_SEASON, KKOMA_OWNED_PCT, KKOMA_SEASON, last3, T1_NEXT3, type T1MemberSeason, type T1Series } from "../../fixtures/t1Season";
import { pickedAt, playerId, statsOf, STATS_PLAYERS, type TeamCode } from "../../fixtures/week3";
import type { PersonRole } from "../../rift";


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
  role: PersonRole;
  games: number;
  /** Season points, his rank and how many he is ranked among (`2nd of 10 mids`). */
  season: { points: number; rank: number; among: number };
  form: number;
  priceEok: number;
  /** This week's price rise in m, if any. */
  riseEok?: number;
  ownedPct: number;
  last3: PastSeries[];
  next3: NextSeries[];
  lines: ScoringLine[];
}

/** A series' week and day: `W4 · Wed`. */
const when = (s: T1Series) => `W${s.week} · ${s.day}`;

const NEXT_T1: NextSeries[] = T1_NEXT3.map((s) => ({ when: when(s), opp: s.opponent }));

/** A T1 member's side, from his card's season figures, his Pick Team price and form, and Stats. */
function t1Member(season: T1MemberSeason, role: PersonRole, ownedPct: number): ComparePlayer {
  const { name } = season;
  const pick = pickedAt(name);
  return {
    id: playerId(name),
    name,
    hangul: hangulOf(name),
    team: "T1",
    role,
    games: season.games,
    season: { points: statsOf(name).points, rank: season.place, among: season.of },
    form: pick.form,
    priceEok: pick.priceEok,
    riseEok: season.riseEok,
    ownedPct,
    last3: last3(season).map((s) => ({ when: when(s), opp: s.opponent, points: s.points })),
    next3: NEXT_T1,
    lines: [...season.lines],
  };
}
const NEXT_GEN: NextSeries[] = [
  { when: "W4 · Thu", opp: "BRO" },
  { when: "W4 · Sat", opp: "T1" },
  { when: "W5 · Wed", opp: "DNS" },
];

export const FAKER: ComparePlayer = t1Member(FAKER_SEASON, "mid", statsOf("Faker").ownedPct);

export const CHOVY: ComparePlayer = {
  id: "chovy",
  name: "Chovy",
  hangul: hangulOf("Chovy"),
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

export const KKOMA: ComparePlayer = t1Member(KKOMA_SEASON, "coach", KKOMA_OWNED_PCT);

export const RYU: ComparePlayer = {
  id: "ryu",
  name: "Ryu",
  hangul: hangulOf("Ryu"),
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

/** A row of the second player's search: name, team, price in m, season points. */
export interface SearchRow {
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceEok: number;
  points: number;
}

/** The search's players: the Stats picture's list. */
export const SEARCH_ROWS: SearchRow[] = STATS_PLAYERS.map(({ name, team, role, priceEok, points }) => ({ name, team, role, priceEok, points }));

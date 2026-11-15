// The Stats picture's made-up list (docs/design/approved/stats/stats.html), at its moment: LCK Cup
// Week 4, Tuesday, Weeks 1 to 3 final. The first 20 players and the 10 coaches are the picture's.
// The rest of the LCK's starters and a few academy players are made up here so the pages and
// filters have something to work on; so is each week's share of the season, for Span.

import { PICK_TEAM_SQUAD, STATS_PLAYERS, WEEK3_SERIES_FINAL, type TeamCode } from "../../fixtures/week3";
import type { RoleKey } from "../../rift";
import { COACH_LINES, PLAYER_LINES, SEASON, type StatsRow } from "./stats";

/** A price move is half a 억 in the picture. */
const MOVE_EOK = 0.5;

/** Games played by each team, Weeks 1 to 3, as the LCK hub's standings have them. */
const GAMES: Record<TeamCode, number> = { T1: 15, GEN: 16, HLE: 15, DK: 15, KRX: 15, NS: 13, BRO: 15, DNS: 16, KT: 15, BFX: 13 };

/** Series won and lost by each team, Weeks 1 to 3. */
const RECORD: Record<TeamCode, readonly [number, number]> = {
  T1: [5, 1],
  GEN: [5, 1],
  HLE: [4, 2],
  DK: [3, 3],
  KRX: [3, 3],
  NS: [2, 4],
  BRO: [1, 5],
  DNS: [3, 3],
  KT: [3, 3],
  BFX: [1, 5],
};

/** The picture's player lines, by name, in PLAYER_LINES' order. */
const PICTURE_LINES: Record<string, number[]> = {
  Chovy: [70, 9, 74, 11, 8, 3, 4, 1, 0],
  Faker: [66, 16, 87, 10, 6, 3, 3, 1, 0],
  Ruler: [83, 11, 60, 10, 3, 2, 4, 1, 0],
  Peyz: [75, 15, 66, 8, 3, 2, 3, 1, 0],
  Keria: [10, 18, 144, 8, 0, 2, 3, 0, 0],
  Canyon: [50, 12, 92, 10, 5, 3, 4, 0, 2],
  Zeus: [48, 12, 50, 8, 10, 2, 3, 0, 0],
  Doran: [43, 18, 62, 8, 8, 2, 3, 0, 0],
  Oner: [40, 19, 94, 8, 3, 4, 2, 0, 1],
  Gumayusi: [58, 14, 44, 6, 2, 2, 3, 0, 0],
  Zeka: [53, 15, 45, 6, 5, 2, 2, 0, 0],
  Kiin: [35, 14, 56, 8, 6, 0, 3, 0, 0],
  Delight: [6, 16, 106, 6, 0, 0, 3, 0, 0],
  BuLLDoG: [54, 20, 52, 6, 5, 2, 2, 0, 0],
  Siwoo: [38, 22, 39, 6, 11, 2, 0, 0, 0],
  Duro: [8, 12, 111, 6, 0, 0, 4, 0, 0],
  ShowMaker: [45, 19, 56, 6, 3, 2, 2, 0, 0],
  Kanavi: [29, 16, 66, 6, 2, 3, 2, 0, 1],
  Aiming: [53, 18, 42, 5, 2, 0, 2, 0, 0],
  Pyosik: [34, 22, 69, 6, 2, 3, 0, 0, 1],
};

/** The picture's coach lines, by name, in COACH_LINES' order. */
const PICTURE_COACH_LINES: Record<string, number[]> = {
  kkOma: [6, 5, 5, 0, 2],
  Ryu: [6, 5, 4, 0, 2],
  Homme: [5, 4, 3, 0, 1],
  Ssong: [5, 4, 3, 0, 1],
  cvMax: [4, 4, 3, 0, 1],
  Score: [4, 3, 3, 1, 0],
  Joker: [4, 3, 2, 0, 1],
  DanDy: [3, 3, 2, 0, 0],
  Edgar: [3, 3, 3, 0, 0],
  Mowgli: [3, 3, 2, 0, 0],
};

type Made = [RoleKey, string, TeamCode, number, -1 | 0 | 1, number, number, number[]];

/** Made up past the picture's first page, each below its last row by points and per game: [role, name, team, price, move, owned %, points, lines]. */
const MORE_PLAYERS: Made[] = [
  ["top", "Kingen", "NS", 9.5, 0, 3, 24, [30, 18, 33, 5, 6, 1, 1, 0, 0]],
  ["jng", "Cuzz", "KT", 4.0, 0, 7, 23, [24, 17, 51, 5, 2, 2, 1, 0, 1]],
  ["mid", "Clozer", "BRO", 9.0, 1, 2, 28, [41, 24, 30, 4, 4, 1, 0, 0, 0]],
  ["bot", "Teddy", "KRX", 10.0, 0, 4, 28, [47, 17, 38, 5, 1, 1, 2, 0, 0]],
  ["sup", "Peter", "KT", 7.5, 0, 2, 27, [7, 20, 88, 5, 0, 0, 1, 0, 0]],
  ["top", "PerfecT", "KT", 9.0, 0, 3, 27, [31, 19, 35, 6, 7, 1, 1, 0, 0]],
  ["mid", "Ucal", "KRX", 10.5, -1, 3, 26, [42, 18, 41, 5, 3, 1, 1, 0, 0]],
  ["jng", "Lucid", "DK", 11.0, 0, 5, 26, [27, 18, 62, 5, 2, 2, 1, 0, 1]],
  ["bot", "deokdam", "KT", 9.5, 0, 2, 25, [44, 16, 37, 4, 1, 1, 1, 0, 0]],
  ["sup", "BeryL", "DK", 8.5, 0, 4, 25, [5, 19, 90, 5, 0, 0, 1, 0, 0]],
  ["top", "Rich", "KRX", 8.5, 0, 1, 24, [28, 20, 34, 5, 5, 1, 0, 0, 0]],
  ["jng", "Willer", "KRX", 8.0, 0, 1, 23, [25, 20, 58, 4, 2, 2, 0, 0, 1]],
  ["top", "DuDu", "DNS", 8.5, 1, 2, 23, [29, 22, 36, 4, 6, 1, 0, 0, 0]],
  ["bot", "Berserker", "DNS", 10.0, 0, 3, 22, [46, 21, 33, 4, 1, 0, 1, 0, 0]],
  ["sup", "Andil", "KRX", 7.0, 0, 1, 21, [6, 21, 80, 4, 0, 0, 1, 0, 0]],
  ["sup", "Life", "DNS", 7.0, 0, 1, 20, [6, 23, 82, 4, 0, 0, 0, 0, 0]],
  ["mid", "Bdd", "KT", 5.0, 0, 5, 16, [33, 19, 36, 4, 2, 1, 0, 0, 0]],
  ["jng", "GIDEON", "NS", 7.5, 0, 1, 19, [20, 19, 48, 3, 1, 2, 0, 0, 0]],
  ["mid", "Calix", "NS", 8.0, -1, 1, 18, [30, 18, 31, 3, 3, 0, 0, 0, 0]],
  ["bot", "Jiwoo", "NS", 8.5, 0, 2, 18, [36, 17, 27, 3, 1, 0, 1, 0, 0]],
  ["sup", "Lehends", "NS", 7.0, 0, 1, 17, [5, 18, 66, 3, 0, 0, 0, 0, 0]],
  ["top", "Casting", "BRO", 7.0, 0, 1, 16, [24, 25, 28, 3, 4, 0, 0, 0, 0]],
  ["jng", "HamBak", "BRO", 6.5, 0, 1, 15, [19, 24, 50, 3, 1, 1, 0, 0, 0]],
  ["bot", "Hype", "BRO", 7.5, -1, 1, 15, [37, 22, 26, 2, 1, 0, 0, 0, 0]],
  ["sup", "Pollu", "BRO", 6.0, 0, 1, 14, [4, 24, 64, 2, 0, 0, 0, 0, 0]],
  ["top", "Clear", "BFX", 7.0, 0, 1, 14, [22, 20, 25, 3, 4, 0, 0, 0, 0]],
  ["jng", "Raptor", "BFX", 6.5, 0, 1, 13, [17, 21, 44, 2, 1, 1, 0, 0, 0]],
  ["mid", "VicLa", "BFX", 7.5, 0, 1, 13, [28, 20, 27, 2, 2, 0, 0, 0, 0]],
  ["bot", "Diable", "BFX", 7.0, -1, 1, 12, [31, 19, 22, 2, 1, 0, 0, 0, 0]],
  ["sup", "Kellin", "BFX", 6.0, 0, 1, 11, [3, 20, 55, 2, 0, 0, 0, 0, 0]],
];

/** Made-up academy (LCK CL) players with no games yet: [role, name, team, price]. */
const ACADEMY: [RoleKey, string, TeamCode, number][] = [
  ["bot", "Smash", "T1", 4.5],
  ["mid", "Guwon", "T1", 4.5],
  ["top", "Sajin", "GEN", 4.0],
  ["jng", "Sylvie", "HLE", 4.0],
];

/** Baron Steal FC's squad, as on Pick Team: their rows carry the dot. */
const MINE = new Set(PICK_TEAM_SQUAD.map((p) => p.name));

const byKeys = (keys: readonly { key: string }[], counts: readonly number[]) =>
  Object.fromEntries(keys.map((l, i) => [l.key, counts[i] ?? 0]));

const idOf = (name: string) => name.toLowerCase();

/** Form, the last 4 weeks' average, is points ÷ 3 until Week 4 is final. */
const formOf = (points: number) => Math.round((points / 3) * 10) / 10;

function row(
  role: StatsRow["role"],
  name: string,
  team: TeamCode,
  priceEok: number,
  move: number,
  ownedPct: number,
  points: number,
): StatsRow {
  return {
    id: idOf(name),
    name,
    team,
    role,
    priceEok,
    moveEok: move * MOVE_EOK,
    form: formOf(points),
    ownedPct,
    points,
    games: GAMES[team],
    mine: MINE.has(name),
    lines: {},
  };
}

const PICTURE_PLAYERS = STATS_PLAYERS.filter((p) => p.role !== "coach");

/** Every player over the season: the picture's first, then the rest, then the academy. */
export const SEASON_PLAYERS: StatsRow[] = [
  ...PICTURE_PLAYERS.map((p) => ({
    ...row(p.role, p.name, p.team, p.priceEok, p.move, p.ownedPct, p.points),
    lines: byKeys(PLAYER_LINES, PICTURE_LINES[p.name] ?? []),
  })),
  ...MORE_PLAYERS.map(([role, name, team, price, move, owned, points, lines]) => ({
    ...row(role, name, team, price, move, owned, points),
    lines: byKeys(PLAYER_LINES, lines),
  })),
  ...ACADEMY.map(([role, name, team, price]) => ({ ...row(role, name, team, price, 0, 0, 0), games: 0, lines: byKeys(PLAYER_LINES, []) })),
];

/** The coaches past the shared fixture's seven: [name, team, price, move, owned %, points]. */
const MORE_COACHES: [string, TeamCode, number, -1 | 0 | 1, number, number][] = [
  ["DanDy", "NS", 5.0, -1, 1, 7],
  ["Edgar", "BRO", 4.5, -1, 1, 4],
  ["Mowgli", "BFX", 4.5, 0, 1, 3],
];

/** Every coach over the season, as the picture lists them. */
export const SEASON_COACHES: StatsRow[] = [
  ...STATS_PLAYERS.filter((p) => p.role === "coach").map((p) => [p.name, p.team, p.priceEok, p.move, p.ownedPct, p.points] as const),
  ...MORE_COACHES,
].map(([name, team, price, move, owned, points]) => ({
  ...row("coach", name, team, price, move, owned, points),
  lines: byKeys(COACH_LINES, PICTURE_COACH_LINES[name] ?? []),
  series: RECORD[team],
}));

// Span: each week's share of the season, made up. Week 3's games and series are its real
// results (WEEK3_SERIES_FINAL); Weeks 1 and 2 split what is left, the odd one to Week 1.

const WEEKS = [1, 2, 3] as const;

function week3Results(team: TeamCode) {
  let games = 0;
  let won = 0;
  let lost = 0;
  for (const s of WEEK3_SERIES_FINAL) {
    if (s.home !== team && s.away !== team) continue;
    const [h, a] = s.score ?? [0, 0];
    const mine = s.home === team ? h : a;
    const theirs = s.home === team ? a : h;
    games += h + a;
    if (mine > theirs) won += 1;
    else lost += 1;
  }
  return { games, won, lost };
}

const half = (n: number) => [Math.ceil(n / 2), Math.floor(n / 2)];

/** A team's games and series, week by week. */
function teamWeeks(team: TeamCode) {
  const w3 = week3Results(team);
  const [g1, g2] = half(GAMES[team] - w3.games);
  const [won1, won2] = half(RECORD[team][0] - w3.won);
  const [lost1, lost2] = half(RECORD[team][1] - w3.lost);
  return [
    { games: g1 ?? 0, series: [won1 ?? 0, lost1 ?? 0] as const },
    { games: g2 ?? 0, series: [won2 ?? 0, lost2 ?? 0] as const },
    { games: w3.games, series: [w3.won, w3.lost] as const },
  ];
}

/** A season count split by each week's share of the games, the rest to Week 3. */
function split(total: number, games: readonly number[]): number[] {
  const all = games.reduce((a, b) => a + b, 0);
  const early = games.slice(0, -1).map((g) => (all === 0 ? 0 : Math.round((total * g) / all)));
  return [...early, total - early.reduce((a, b) => a + b, 0)];
}

function weekRows(season: readonly StatsRow[], week: number): StatsRow[] {
  return season.map((r) => {
    const weeks = teamWeeks(r.team);
    const games = r.games === 0 ? [0, 0, 0] : weeks.map((w) => w.games);
    const at = (total: number) => split(total, games)[week - 1] ?? 0;
    return {
      ...r,
      points: at(r.points),
      games: games[week - 1] ?? 0,
      lines: Object.fromEntries(Object.entries(r.lines).map(([k, v]) => [k, at(v)])),
      series: r.series && weeks[week - 1]?.series,
    };
  });
}

/** Span's choices: the season, then each final week. */
export const SPANS = [{ value: SEASON, label: "Season" }, ...WEEKS.map((w) => ({ value: `week-${w}`, label: `Week ${w}` }))];

/** The list for each span, players and coaches. */
export const STATS_BY_SPAN: Record<string, { players: StatsRow[]; coaches: StatsRow[] }> = {
  [SEASON]: { players: SEASON_PLAYERS, coaches: SEASON_COACHES },
  ...Object.fromEntries(WEEKS.map((w) => [`week-${w}`, { players: weekRows(SEASON_PLAYERS, w), coaches: weekRows(SEASON_COACHES, w) }])),
};

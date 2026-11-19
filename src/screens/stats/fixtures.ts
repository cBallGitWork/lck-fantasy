// The Stats picture's made-up list (docs/design/approved/stats/stats.html), at its moment: Split 1
// Week 4, Tuesday, Weeks 1 to 3 final. The first 20 players and the 10 coaches are the picture's.
// The rest of the LCK's starters and a few academy players are made up here so the pages and
// filters have something to work on; so is each week's share of the season, for Span.

import { sum } from "../../parts";
import { fromSide, seriesOf } from "../../fixtures/series";
import { gamesOf, standingOf } from "../../fixtures/standings";
import { FAKER_SEASON, KKOMA_SEASON, type T1MemberSeason } from "../../fixtures/t1Season";
import { formOf, MY_PLAYERS, OFF_PAGE_PLAYERS, playerId, STATS_PLAYERS, WEEK3_SERIES_FINAL, type TeamCode } from "../../fixtures/week3";
import type { RoleKey } from "../../rift";
import { COACH_LINES, PLAYER_LINES, SEASON, type StatsRow } from "./stats";
import { weekSpan, WORDS } from "./words";

/** A price move is 0.5m in the picture. */
const MOVE_M = 0.5;

/** Each season line's key in a row's `lines`, by the name the cards give it. */
const LINE_KEYS: Record<string, string> = {
  Kills: "kills",
  Deaths: "deaths",
  Assists: "assists",
  "Gold lead at 15": "gd15",
  "Solo kills": "soloKills",
  "First bloods": "firstBlood",
  Deathless: "deathless",
  "Quadra kills": "quadra",
  Steals: "steals",
  "First tower": "firstTower",
  "Most drakes": "drakes",
  "Most barons": "barons",
  "Most elders": "elders",
  "Quick win": "quickWins",
};

/** A T1 member's season totals from his card's lines, in `lines`' order; a line with no key is a broken fixture. */
function fromCard(season: T1MemberSeason, lines: readonly { key: string }[]): number[] {
  const totals = new Map(
    season.lines.flatMap((l) => {
      if (l.series) return [];
      const key = LINE_KEYS[l.line];
      if (!key) throw new Error(`No Stats column for ${season.name}'s ${l.line}`);
      return [[key, l.total] as const];
    }),
  );
  return lines.map((l) => totals.get(l.key) ?? 0);
}

/** The picture's player lines, by name, in PLAYER_LINES' order; Faker's are his card's. */
const PICTURE_LINES: Record<string, number[]> = {
  Chovy: [70, 9, 74, 11, 8, 3, 4, 1, 0],
  Faker: fromCard(FAKER_SEASON, PLAYER_LINES),
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
  Cuzz: [24, 17, 51, 5, 2, 2, 1, 0, 1],
  Bdd: [33, 19, 36, 4, 2, 1, 0, 0, 0],
};

/** The picture's coach lines, by name, in COACH_LINES' order; kkOma's are his card's. */
const PICTURE_COACH_LINES: Record<string, number[]> = {
  kkOma: fromCard(KKOMA_SEASON, COACH_LINES),
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

/** Each made-up player's season lines, by name (OFF_PAGE_PLAYERS gives the rest of his row). */
const MORE_LINES: Record<string, number[]> = {
  Kingen: [30, 18, 33, 5, 6, 1, 1, 0, 0],
  Clozer: [41, 24, 30, 4, 4, 1, 0, 0, 0],
  Teddy: [47, 17, 38, 5, 1, 1, 2, 0, 0],
  Peter: [7, 20, 88, 5, 0, 0, 1, 0, 0],
  PerfecT: [31, 19, 35, 6, 7, 1, 1, 0, 0],
  ucal: [42, 18, 41, 5, 3, 1, 1, 0, 0],
  Lucid: [27, 18, 62, 5, 2, 2, 1, 0, 1],
  deokdam: [44, 16, 37, 4, 1, 1, 1, 0, 0],
  BeryL: [5, 19, 90, 5, 0, 0, 1, 0, 0],
  Rich: [28, 20, 34, 5, 5, 1, 0, 0, 0],
  Willer: [25, 20, 58, 4, 2, 2, 0, 0, 1],
  DuDu: [29, 22, 36, 4, 6, 1, 0, 0, 0],
  Berserker: [46, 21, 33, 4, 1, 0, 1, 0, 0],
  Andil: [6, 21, 80, 4, 0, 0, 1, 0, 0],
  Life: [6, 23, 82, 4, 0, 0, 0, 0, 0],
  GIDEON: [20, 19, 48, 3, 1, 2, 0, 0, 0],
  Scout: [30, 18, 31, 3, 3, 0, 0, 0, 0],
  Taeyoon: [36, 17, 27, 3, 1, 0, 1, 0, 0],
  Lehends: [5, 18, 66, 3, 0, 0, 0, 0, 0],
  Casting: [24, 25, 28, 3, 4, 0, 0, 0, 0],
  Sponge: [19, 24, 50, 3, 1, 1, 0, 0, 0],
  Hype: [37, 22, 26, 2, 1, 0, 0, 0, 0],
  Pollu: [4, 24, 64, 2, 0, 0, 0, 0, 0],
  Clear: [22, 20, 25, 3, 4, 0, 0, 0, 0],
  Raptor: [17, 21, 44, 2, 1, 1, 0, 0, 0],
  VicLa: [28, 20, 27, 2, 2, 0, 0, 0, 0],
  Diable: [31, 19, 22, 2, 1, 0, 0, 0, 0],
  Kellin: [3, 20, 55, 2, 0, 0, 0, 0, 0],
};

/** Made-up academy (LCK CL) players with no games yet: [role, name, team, price]. */
const ACADEMY: [RoleKey, string, TeamCode, number][] = [
  ["bot", "Smash", "T1", 4.5],
  ["mid", "Guwon", "T1", 4.5],
  ["top", "Sajin", "GEN", 4.0],
  ["jng", "Sylvie", "HLE", 4.0],
];

const byKeys = (keys: readonly { key: string }[], counts: readonly number[]) =>
  Object.fromEntries(keys.map((l, i) => [l.key, counts[i] ?? 0]));

function row(
  role: StatsRow["role"],
  name: string,
  team: TeamCode,
  priceM: number,
  move: number,
  ownedPct: number,
  points: number,
): StatsRow {
  return {
    id: playerId(name),
    name,
    team,
    role,
    priceM,
    moveM: move * MOVE_M,
    form: formOf(points),
    ownedPct,
    points,
    games: gamesOf(team),
    mine: MY_PLAYERS.has(name),
    lines: {},
  };
}

const PICTURE_PLAYERS = STATS_PLAYERS.filter((p) => p.role !== "coach");

/** Every player over the season: the picture's first, then the rest, then the academy. */
export const SEASON_PLAYERS: StatsRow[] = [
  ...PICTURE_PLAYERS.map((p) => ({
    ...row(p.role, p.name, p.team, p.priceM, p.move, p.ownedPct, p.points),
    lines: byKeys(PLAYER_LINES, PICTURE_LINES[p.name] ?? []),
  })),
  ...OFF_PAGE_PLAYERS.filter((p) => p.role !== "coach").map((p) => ({
    ...row(p.role, p.name, p.team, p.priceM, p.move, p.ownedPct, p.points),
    lines: byKeys(PLAYER_LINES, MORE_LINES[p.name] ?? []),
  })),
  ...ACADEMY.map(([role, name, team, price]) => ({ ...row(role, name, team, price, 0, 0, 0), games: 0, lines: byKeys(PLAYER_LINES, []) })),
];

/** Every coach over the season, as the picture lists them. */
export const SEASON_COACHES: StatsRow[] = [
  ...STATS_PLAYERS,
  ...OFF_PAGE_PLAYERS,
]
  .filter((p) => p.role === "coach")
  .map((p) => ({
    ...row("coach", p.name, p.team, p.priceM, p.move, p.ownedPct, p.points),
    lines: byKeys(COACH_LINES, PICTURE_COACH_LINES[p.name] ?? []),
    series: [standingOf(p.team).won, standingOf(p.team).lost] as const,
  }));

// Span: each week's share of the season, made up. Week 3's games and series are its real
// results (WEEK3_SERIES_FINAL); Weeks 1 and 2 split what is left, the odd one to Week 1.

const WEEKS = [1, 2, 3] as const;

function week3Results(team: TeamCode) {
  let games = 0;
  let won = 0;
  let lost = 0;
  for (const s of seriesOf(WEEK3_SERIES_FINAL, team)) {
    const [mine, theirs] = fromSide(s, team).score ?? [0, 0];
    games += mine + theirs;
    if (mine > theirs) won += 1;
    else lost += 1;
  }
  return { games, won, lost };
}

const half = (n: number) => [Math.ceil(n / 2), Math.floor(n / 2)];

/** A team's games and series, week by week. */
function teamWeeks(team: TeamCode) {
  const w3 = week3Results(team);
  const { won, lost } = standingOf(team);
  const [g1, g2] = half(gamesOf(team) - w3.games);
  const [won1, won2] = half(won - w3.won);
  const [lost1, lost2] = half(lost - w3.lost);
  return [
    { games: g1 ?? 0, series: [won1 ?? 0, lost1 ?? 0] as const },
    { games: g2 ?? 0, series: [won2 ?? 0, lost2 ?? 0] as const },
    { games: w3.games, series: [w3.won, w3.lost] as const },
  ];
}

/** A season count split by each week's share of the games, the rest to Week 3. */
function split(total: number, games: readonly number[]): number[] {
  const all = sum(games);
  const early = games.slice(0, -1).map((g) => (all === 0 ? 0 : Math.round((total * g) / all)));
  return [...early, total - sum(early)];
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
export const SPANS = [{ value: SEASON, label: WORDS.season }, ...WEEKS.map((w) => ({ value: `week-${w}`, label: weekSpan(w) }))];

/** The list for each span, players and coaches. */
export const STATS_BY_SPAN: Record<string, { players: StatsRow[]; coaches: StatsRow[] }> = {
  [SEASON]: { players: SEASON_PLAYERS, coaches: SEASON_COACHES },
  ...Object.fromEntries(WEEKS.map((w) => [`week-${w}`, { players: weekRows(SEASON_PLAYERS, w), coaches: weekRows(SEASON_COACHES, w) }])),
};

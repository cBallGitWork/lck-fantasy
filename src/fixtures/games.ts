// The made-up games, Weeks 1 to 3: each game's winner, and Week 3's games for Baron Steal FC's squad
// (champion, K/D/A, the lines that scored) as every page shows them: Points' sheet, Series, Live,
// Home and the cards. Their points are the squad's (squads.ts).

import type { TeamCode } from "./competition";
import { LIVE_SERIES_ID, POINTS_SQUAD } from "./squads";

/** Each game's winner, in each series that a squad member played, Weeks 1 to 3. */
const GAME_WINNERS: Record<string, TeamCode[]> = {
  "w1-wed-1": ["HLE", "KT", "HLE"],
  "w1-wed-2": ["GEN", "T1", "GEN"],
  "w1-thu-1": ["DK", "BRO", "DK"],
  "w1-fri-2": ["GEN", "GEN"],
  "w1-sat-1": ["T1", "T1"],
  "w1-sat-2": ["HLE", "HLE"],
  "w1-sun-1": ["KT", "DNS", "KT"],
  "w2-wed-1": ["T1", "T1"],
  "w2-wed-2": ["GEN", "GEN"],
  "w2-thu-1": ["DK", "KT", "DK"],
  "w2-thu-2": ["HLE", "HLE"],
  "w2-fri-2": ["T1", "BFX", "T1"],
  "w2-sat-1": ["KRX", "GEN", "GEN"],
  "w2-sat-2": ["HLE", "DK", "HLE"],
  "w2-sun-1": ["KT", "KT"],
  "w3-wed-1": ["T1", "HLE", "T1"],
  "w3-wed-2": ["GEN", "GEN"],
  "w3-thu-1": ["DK", "DK"],
  "w3-fri-1": ["KT", "BFX", "KT"],
  "w3-sat-1": ["GEN", "HLE", "GEN"],
  "w3-sat-2": ["T1"],
};

/** The scoring lines a game can show on the sheet, as words (spec/05: the player and coach tables). */
export const LINE = {
  gold: "Gold",
  solo: "Solo",
  firstBlood: "First blood",
  deathless: "Deathless",
  steal: "Steal",
  firstTower: "First tower",
  drakes: "Most drakes",
  baron: "Most barons",
} as const;

export type LineWord = (typeof LINE)[keyof typeof LINE];

/** Kills, deaths and assists. */
export type Kda = readonly [kills: number, deaths: number, assists: number];

/** One game as the sheet shows it: a player's champion and K/D/A, and the lines that scored. A coach's has lines alone. */
export interface GameDetail {
  champion?: string;
  kda?: Kda;
  lines: readonly LineWord[];
}

const { gold, solo, firstBlood, deathless, steal, firstTower, drakes, baron } = LINE;
const game = (champion: string, kda: Kda, ...lines: LineWord[]): GameDetail => ({ champion, kda, lines });
const coachGame = (...lines: LineWord[]): GameDetail => ({ lines });

/**
 * Week 3's games, series by series in the order each squad member played them. Each game's points
 * (src/fixtures/squads.ts) are what spec/05's tables give its K/D/A and lines; points.test.tsx checks.
 */
export const WEEK3_GAMES: Record<string, GameDetail[][]> = {
  Zeus: [
    [game("Jax", [4, 2, 3], gold, solo), game("Gnar", [2, 2, 3]), game("Rumble", [3, 2, 6], gold)],
    [game("Aatrox", [2, 2, 4], gold), game("Renekton", [5, 1, 5], gold, solo), game("Jayce", [1, 2, 2])],
  ],
  Canyon: [
    [game("Vi", [3, 1, 8], gold), game("Sejuani", [2, 0, 12], deathless, steal)],
    [game("Xin Zhao", [4, 2, 6]), game("Maokai", [1, 2, 7], gold, firstBlood), game("Lee Sin", [5, 1, 10], gold)],
  ],
  Faker: [
    [game("Azir", [6, 1, 9], gold, solo), game("Taliyah", [2, 4, 5], gold, firstBlood), game("Galio", [4, 0, 14], gold, firstBlood, solo, deathless)],
    [game("Orianna", [5, 2, 8], gold, firstBlood), game("Sylas", [1, 0, 2], solo)],
  ],
  Ruler: [
    [game("Kai'Sa", [5, 1, 6], gold), game("Varus", [6, 0, 4], gold, deathless)],
    [game("Ezreal", [4, 1, 7], gold), game("Jinx", [2, 2, 3], gold), game("Xayah", [8, 1, 5], gold)],
  ],
  Delight: [
    [game("Rakan", [0, 3, 10]), game("Nautilus", [1, 1, 14], gold), game("Alistar", [0, 3, 6])],
    [game("Rell", [0, 2, 7]), game("Leona", [1, 1, 12]), game("Braum", [0, 3, 8], gold)],
  ],
  Siwoo: [
    [game("Gragas", [2, 1, 6], gold), game("Ornn", [1, 0, 8], deathless)],
    [game("K'Sante", [2, 2, 4], gold), game("Rumble", [2, 1, 1])],
  ],
  kkOma: [
    [coachGame(firstTower, drakes), coachGame(), coachGame(firstTower, drakes, baron)],
    [coachGame(firstTower, baron), coachGame()],
  ],
  Cuzz: [
    [game("Viego", [2, 2, 6]), game("Xin Zhao", [1, 2, 4])],
    [game("Sejuani", [3, 1, 9], gold), game("Vi", [2, 2, 5], gold), game("Maokai", [3, 0, 11], gold, deathless)],
  ],
};

/** T1 v DK's second game once over: Week 3's games are at Points' moment, with it live. */
const LIVE_SERIES_LAST_GAME: Record<string, GameDetail> = {
  Faker: game("Sylas", [7, 0, 6], gold, solo, deathless),
  Siwoo: game("Rumble", [4, 2, 3]),
  kkOma: coachGame(firstTower, drakes, baron),
};

/** T1 v DK's game winners once final: T1 2–0 (weeks.ts). */
const LIVE_SERIES_FINAL_WINNERS: TeamCode[] = ["T1", "T1"];

/** A game's winner, at Points' moment or once final; none for a game not yet won. */
export const winnerOf = (seriesId: string, index: number, final = false) =>
  (final && seriesId === LIVE_SERIES_ID ? LIVE_SERIES_FINAL_WINNERS : GAME_WINNERS[seriesId])?.[index];

/** A squad member's games in a Week 3 series, at Points' moment or once final. */
export function weekGamesOf(name: string, seriesId: string, final = false): GameDetail[] {
  const index = POINTS_SQUAD.find((p) => p.name === name)?.series.findIndex((s) => s.id === seriesId) ?? -1;
  const games = WEEK3_GAMES[name]?.[index];
  if (!games) throw new Error(`${name} has no Week 3 games in ${seriesId}`);
  if (!final || seriesId !== LIVE_SERIES_ID) return games;
  const last = LIVE_SERIES_LAST_GAME[name];
  if (!last) throw new Error(`${name} has no finished last game in ${seriesId}`);
  return [...games.slice(0, -1), last];
}

/** K/D/A as every page writes it: `5/2/8`. */
export const kdaText = (kda: Kda) => kda.join("/");

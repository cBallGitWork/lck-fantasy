// The made-up Split 1's teams and values, and the sample manager, as the approved pictures share
// them. Every name and number is an example.

import season from "../../data/lck/season-2027.json";

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

/** The split the pictures show, Split 1 the beta (spec/10). */
export const COMPETITION = "Split 1";

/** The season the splits belong to, as Overall's head names it. */
export const SEASON = "LCK 2027";

/** The split with its year, as the LCK hub and the cards title it. */
export const COMPETITION_TITLE = `${COMPETITION} 2027`;

/**
 * The competition's values the pictures share: the Carry's multiplier, each series' length, the
 * most players from one team, the points a transfer over the free ones costs, the four buffs (spec/06).
 * The multiplier, team cap and hit are data/lck/season-2027.json's settings.
 */
export const CARRY_MULTIPLIER = season.settings.carryMultiplier;
/** The games that count in a series: its best two (spec/05). */
const COUNTED_PER_SERIES = 2;
export const BEST_OF = 3;
export const TEAM_CAP = season.settings.squad.teamCap;
export const HIT_POINTS = season.settings.transfers.hitPoints;
export const BUFFS = ["Bench Boost", "Dual Carry", "Remake", "Limitless"] as const;
export type BuffName = (typeof BUFFS)[number];

/** The Carry's points: ×1.5, rounded down, a minus towards zero (spec/05, The Carry). */
export const carried = (points: number) => Math.trunc(points * CARRY_MULTIPLIER);

/** The games of a series that count, by index: its best ones (spec/05). */
export function countedGames(games: readonly number[]): Set<number> {
  const best = games
    .map((points, index) => ({ points, index }))
    .sort((a, b) => b.points - a.points)
    .slice(0, COUNTED_PER_SERIES);
  return new Set(best.map((g) => g.index));
}

/** A series' points: its counted games' sum, and a coach's series result (spec/05). */
export function seriesPoints(games: readonly number[], coachResult = 0): number {
  const counted = countedGames(games);
  return games.reduce((sum, p, i) => (counted.has(i) ? sum + p : sum), 0) + coachResult;
}

/** The sample manager every picture shows. */
export const MANAGER = {
  team: "Baron Steal FC",
  hangul: "바론 스틸 FC",
  name: "Sam Lee",
} as const;

/** A player's or coach's id, as his card is reached by: his name in lower case. */
export const playerId = (name: string) => name.toLowerCase();

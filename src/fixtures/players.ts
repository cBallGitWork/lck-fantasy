// The Stats picture's players and coaches (stats.html), and the made-up rest of the LCK: every
// page's price, owned %, season points and form for them, at Week 4's Tuesday, Weeks 1 to 3 final.
// Every name and number is an example.

import season from "../../data/lck/season-2027.json";
import { WON_PER_M } from "../parts/text/money";
import type { PersonRole } from "../rift";
import type { TeamCode } from "./competition";

/** A player or coach in the Stats list: Week 4 price in m, its move, owned %, season points. */
export interface StatsPlayer {
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceM: number;
  /** −1 a fall, 0 none, 1 a rise. */
  move: -1 | 0 | 1;
  ownedPct: number;
  points: number;
}

type Unpriced = Omit<StatsPlayer, "priceM">;

/** Each pick's made-up price, as data/lck/season-2027.json holds it: a player's by handle, a coach's by team. */
const PRICES_M = new Map(
  season.prices.flatMap(({ picks }) => picks).map((p) => [p.role === "coach" ? `coach:${p.team}` : p.handle, p.won / WON_PER_M]),
);

function priced(row: Unpriced): StatsPlayer {
  const priceM = PRICES_M.get(row.role === "coach" ? `coach:${row.team}` : row.name);
  if (priceM === undefined) throw new Error(`${row.name} has no price in data/lck/season-2027.json`);
  return { ...row, priceM };
}

/**
 * The Stats picture's players and its first seven coaches, then Baron Steal FC's two off its first
 * page.
 */
export const STATS_PLAYERS: StatsPlayer[] = ([
  { role: "mid", name: "Chovy", team: "GEN", move: 1, ownedPct: 41, points: 61 },
  { role: "mid", name: "Faker", team: "T1", move: 1, ownedPct: 46, points: 58 },
  { role: "bot", name: "Ruler", team: "GEN", move: 0, ownedPct: 38, points: 56 },
  { role: "bot", name: "Peyz", team: "T1", move: 1, ownedPct: 33, points: 52 },
  { role: "sup", name: "Keria", team: "T1", move: 0, ownedPct: 47, points: 52 },
  { role: "jng", name: "Canyon", team: "GEN", move: 0, ownedPct: 29, points: 50 },
  { role: "top", name: "Zeus", team: "HLE", move: 0, ownedPct: 31, points: 48 },
  { role: "top", name: "Doran", team: "T1", move: -1, ownedPct: 18, points: 45 },
  { role: "jng", name: "Oner", team: "T1", move: 0, ownedPct: 22, points: 43 },
  { role: "bot", name: "Gumayusi", team: "HLE", move: -1, ownedPct: 26, points: 42 },
  { role: "mid", name: "Zeka", team: "HLE", move: 0, ownedPct: 15, points: 41 },
  { role: "top", name: "Kiin", team: "GEN", move: 0, ownedPct: 21, points: 40 },
  { role: "sup", name: "Delight", team: "HLE", move: 0, ownedPct: 19, points: 38 },
  { role: "mid", name: "BuLLDoG", team: "DNS", move: 1, ownedPct: 6, points: 36 },
  { role: "top", name: "Siwoo", team: "DK", move: 1, ownedPct: 12, points: 35 },
  { role: "sup", name: "Duro", team: "GEN", move: 0, ownedPct: 14, points: 35 },
  { role: "mid", name: "ShowMaker", team: "DK", move: -1, ownedPct: 9, points: 33 },
  { role: "jng", name: "Kanavi", team: "HLE", move: 0, ownedPct: 11, points: 32 },
  { role: "bot", name: "Aiming", team: "DK", move: -1, ownedPct: 8, points: 31 },
  { role: "jng", name: "Pyosik", team: "DNS", move: 0, ownedPct: 4, points: 30 },
  { role: "coach", name: "kkOma", team: "T1", move: 0, ownedPct: 24, points: 27 },
  { role: "coach", name: "Ryu", team: "GEN", move: 0, ownedPct: 21, points: 26 },
  { role: "coach", name: "Homme", team: "HLE", move: 0, ownedPct: 9, points: 18 },
  { role: "coach", name: "Ssong", team: "DNS", move: 1, ownedPct: 3, points: 14 },
  { role: "coach", name: "cvMax", team: "DK", move: 0, ownedPct: 5, points: 13 },
  { role: "coach", name: "Score", team: "KT", move: 0, ownedPct: 2, points: 12 },
  { role: "coach", name: "Joker", team: "KRX", move: 0, ownedPct: 2, points: 11 },
  { role: "jng", name: "Cuzz", team: "KT", move: 0, ownedPct: 7, points: 23 },
  { role: "mid", name: "Bdd", team: "KT", move: 0, ownedPct: 5, points: 16 },
] satisfies Unpriced[]).map(priced);

/** Made up past the picture's first page, then the picture's last three coaches. */
export const OFF_PAGE_PLAYERS: StatsPlayer[] = ([
  { role: "top", name: "Kingen", team: "NS", move: 1, ownedPct: 3, points: 24 },
  { role: "mid", name: "Clozer", team: "BRO", move: 1, ownedPct: 2, points: 28 },
  { role: "bot", name: "Teddy", team: "BRO", move: 0, ownedPct: 4, points: 28 },
  { role: "sup", name: "Peter", team: "KT", move: 0, ownedPct: 2, points: 27 },
  { role: "top", name: "PerfecT", team: "KT", move: 0, ownedPct: 3, points: 27 },
  { role: "mid", name: "ucal", team: "KRX", move: -1, ownedPct: 3, points: 26 },
  { role: "jng", name: "Lucid", team: "DK", move: 1, ownedPct: 5, points: 26 },
  { role: "bot", name: "deokdam", team: "KT", move: 0, ownedPct: 2, points: 25 },
  { role: "sup", name: "BeryL", team: "DK", move: 0, ownedPct: 4, points: 25 },
  { role: "top", name: "Rich", team: "KRX", move: 0, ownedPct: 1, points: 24 },
  { role: "jng", name: "Willer", team: "KRX", move: 0, ownedPct: 1, points: 23 },
  { role: "top", name: "DuDu", team: "DNS", move: -1, ownedPct: 2, points: 23 },
  { role: "bot", name: "Berserker", team: "DNS", move: 0, ownedPct: 3, points: 22 },
  { role: "sup", name: "Andil", team: "KRX", move: 0, ownedPct: 1, points: 21 },
  { role: "sup", name: "Life", team: "DNS", move: 0, ownedPct: 1, points: 20 },
  { role: "jng", name: "GIDEON", team: "BRO", move: 0, ownedPct: 1, points: 19 },
  { role: "mid", name: "Scout", team: "NS", move: -1, ownedPct: 1, points: 18 },
  { role: "bot", name: "Taeyoon", team: "NS", move: 0, ownedPct: 2, points: 18 },
  { role: "sup", name: "Lehends", team: "NS", move: 0, ownedPct: 1, points: 17 },
  { role: "top", name: "Casting", team: "BRO", move: 0, ownedPct: 1, points: 16 },
  { role: "jng", name: "Sponge", team: "NS", move: 0, ownedPct: 1, points: 15 },
  { role: "bot", name: "Hype", team: "KRX", move: 1, ownedPct: 1, points: 15 },
  { role: "sup", name: "Pollu", team: "BRO", move: 0, ownedPct: 1, points: 14 },
  { role: "top", name: "Clear", team: "BFX", move: -1, ownedPct: 1, points: 14 },
  { role: "jng", name: "Raptor", team: "BFX", move: 0, ownedPct: 1, points: 13 },
  { role: "mid", name: "VicLa", team: "BFX", move: 0, ownedPct: 1, points: 13 },
  { role: "bot", name: "Diable", team: "BFX", move: -1, ownedPct: 1, points: 12 },
  { role: "sup", name: "Kellin", team: "BFX", move: 0, ownedPct: 1, points: 11 },
  { role: "coach", name: "DanDy", team: "NS", move: -1, ownedPct: 1, points: 7 },
  { role: "coach", name: "Edgar", team: "BRO", move: -1, ownedPct: 1, points: 4 },
  { role: "coach", name: "Mowgli", team: "BFX", move: 0, ownedPct: 1, points: 3 },
] satisfies Unpriced[]).map(priced);

/** Weeks 1 to 3 are final at the pictures' moment. */
const WEEKS_FINAL = 3;
/** Form is the average of his last few gameweeks, as the season's prices hold it. */
const FORM_WEEKS = season.settings.prices.formWeeks;

/** Form, the last 2 weeks' average: Weeks 2 and 3. The list holds season points only, made up as
 *  even over Weeks 1 to 3, so the last 2 weeks hold two thirds of them. */
export const formOf = (points: number) => Math.round(((points * FORM_WEEKS) / WEEKS_FINAL / FORM_WEEKS) * 10) / 10;

/** A player or coach in the Stats list; one missing from it is a broken fixture. */
export function statsOf(name: string): StatsPlayer {
  const found = [...STATS_PLAYERS, ...OFF_PAGE_PLAYERS].find((p) => p.name === name);
  if (!found) throw new Error(`${name} is not in the Stats list`);
  return found;
}

// The Stats picture's players and coaches (stats.html), and the made-up rest of the LCK: every
// page's price, owned %, season points and form for them, at Week 4's Tuesday, Weeks 1 to 3 final.
// Every name and number is an example.

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

/**
 * The Stats picture's players and its first seven coaches, then Baron Steal FC's two off its first
 * page.
 */
export const STATS_PLAYERS: StatsPlayer[] = [
  { role: "mid", name: "Chovy", team: "GEN", priceM: 17.5, move: 1, ownedPct: 41, points: 61 },
  { role: "mid", name: "Faker", team: "T1", priceM: 18.5, move: 1, ownedPct: 46, points: 58 },
  { role: "bot", name: "Ruler", team: "GEN", priceM: 16.0, move: 0, ownedPct: 38, points: 56 },
  { role: "bot", name: "Peyz", team: "T1", priceM: 15.0, move: 1, ownedPct: 33, points: 52 },
  { role: "sup", name: "Keria", team: "T1", priceM: 12.0, move: 0, ownedPct: 47, points: 52 },
  { role: "jng", name: "Canyon", team: "GEN", priceM: 15.5, move: 0, ownedPct: 29, points: 50 },
  { role: "top", name: "Zeus", team: "HLE", priceM: 14.0, move: 0, ownedPct: 31, points: 48 },
  { role: "top", name: "Doran", team: "T1", priceM: 12.5, move: -1, ownedPct: 18, points: 45 },
  { role: "jng", name: "Oner", team: "T1", priceM: 14.0, move: 0, ownedPct: 22, points: 43 },
  { role: "bot", name: "Gumayusi", team: "HLE", priceM: 15.5, move: -1, ownedPct: 26, points: 42 },
  { role: "mid", name: "Zeka", team: "HLE", priceM: 15.0, move: 0, ownedPct: 15, points: 41 },
  { role: "top", name: "Kiin", team: "GEN", priceM: 13.5, move: 0, ownedPct: 21, points: 40 },
  { role: "sup", name: "Delight", team: "HLE", priceM: 10.0, move: 0, ownedPct: 19, points: 38 },
  { role: "mid", name: "BuLLDoG", team: "DNS", priceM: 11.0, move: 1, ownedPct: 6, points: 36 },
  { role: "top", name: "Siwoo", team: "DK", priceM: 11.5, move: 1, ownedPct: 12, points: 35 },
  { role: "sup", name: "Duro", team: "GEN", priceM: 9.5, move: 0, ownedPct: 14, points: 35 },
  { role: "mid", name: "ShowMaker", team: "DK", priceM: 13.0, move: -1, ownedPct: 9, points: 33 },
  { role: "jng", name: "Kanavi", team: "HLE", priceM: 13.0, move: 0, ownedPct: 11, points: 32 },
  { role: "bot", name: "Aiming", team: "DK", priceM: 13.5, move: -1, ownedPct: 8, points: 31 },
  { role: "jng", name: "Pyosik", team: "DNS", priceM: 10.5, move: 0, ownedPct: 4, points: 30 },
  { role: "coach", name: "kkOma", team: "T1", priceM: 7.0, move: 0, ownedPct: 24, points: 27 },
  { role: "coach", name: "Ryu", team: "GEN", priceM: 7.0, move: 0, ownedPct: 21, points: 26 },
  { role: "coach", name: "Homme", team: "HLE", priceM: 6.5, move: 0, ownedPct: 9, points: 18 },
  { role: "coach", name: "Ssong", team: "DNS", priceM: 5.5, move: 1, ownedPct: 3, points: 14 },
  { role: "coach", name: "cvMax", team: "DK", priceM: 6.0, move: 0, ownedPct: 5, points: 13 },
  { role: "coach", name: "Score", team: "KT", priceM: 5.5, move: 0, ownedPct: 2, points: 12 },
  { role: "coach", name: "Joker", team: "KRX", priceM: 5.0, move: 0, ownedPct: 2, points: 11 },
  { role: "jng", name: "Cuzz", team: "KT", priceM: 4.0, move: 0, ownedPct: 7, points: 23 },
  { role: "mid", name: "Bdd", team: "KT", priceM: 5.0, move: 0, ownedPct: 5, points: 16 },
];

/** Made up past the picture's first page, then the picture's last three coaches. */
export const OFF_PAGE_PLAYERS: StatsPlayer[] = [
  { role: "top", name: "Kingen", team: "NS", priceM: 6.5, move: 1, ownedPct: 3, points: 24 },
  { role: "mid", name: "Clozer", team: "BRO", priceM: 5.0, move: 1, ownedPct: 2, points: 28 },
  { role: "bot", name: "Teddy", team: "BRO", priceM: 10.0, move: 0, ownedPct: 4, points: 28 },
  { role: "sup", name: "Peter", team: "KT", priceM: 7.5, move: 0, ownedPct: 2, points: 27 },
  { role: "top", name: "PerfecT", team: "KT", priceM: 7.0, move: 0, ownedPct: 3, points: 27 },
  { role: "mid", name: "Ucal", team: "KRX", priceM: 10.5, move: -1, ownedPct: 3, points: 26 },
  { role: "jng", name: "Lucid", team: "DK", priceM: 9.0, move: 1, ownedPct: 5, points: 26 },
  { role: "bot", name: "deokdam", team: "KT", priceM: 9.5, move: 0, ownedPct: 2, points: 25 },
  { role: "sup", name: "BeryL", team: "DK", priceM: 8.5, move: 0, ownedPct: 4, points: 25 },
  { role: "top", name: "Rich", team: "KRX", priceM: 8.5, move: 0, ownedPct: 1, points: 24 },
  { role: "jng", name: "Willer", team: "KRX", priceM: 8.0, move: 0, ownedPct: 1, points: 23 },
  { role: "top", name: "DuDu", team: "DNS", priceM: 6.0, move: -1, ownedPct: 2, points: 23 },
  { role: "bot", name: "Berserker", team: "DNS", priceM: 10.0, move: 0, ownedPct: 3, points: 22 },
  { role: "sup", name: "Andil", team: "KRX", priceM: 7.0, move: 0, ownedPct: 1, points: 21 },
  { role: "sup", name: "Life", team: "DNS", priceM: 7.0, move: 0, ownedPct: 1, points: 20 },
  { role: "jng", name: "GIDEON", team: "BRO", priceM: 7.5, move: 0, ownedPct: 1, points: 19 },
  { role: "mid", name: "Scout", team: "NS", priceM: 8.0, move: -1, ownedPct: 1, points: 18 },
  { role: "bot", name: "Taeyoon", team: "NS", priceM: 8.5, move: 0, ownedPct: 2, points: 18 },
  { role: "sup", name: "Lehends", team: "NS", priceM: 7.0, move: 0, ownedPct: 1, points: 17 },
  { role: "top", name: "Casting", team: "BRO", priceM: 7.0, move: 0, ownedPct: 1, points: 16 },
  { role: "jng", name: "Sponge", team: "NS", priceM: 6.5, move: 0, ownedPct: 1, points: 15 },
  { role: "bot", name: "Hype", team: "KRX", priceM: 5.5, move: 1, ownedPct: 1, points: 15 },
  { role: "sup", name: "Pollu", team: "BRO", priceM: 4.5, move: 0, ownedPct: 1, points: 14 },
  { role: "top", name: "Clear", team: "BFX", priceM: 5.5, move: -1, ownedPct: 1, points: 14 },
  { role: "jng", name: "Raptor", team: "BFX", priceM: 6.5, move: 0, ownedPct: 1, points: 13 },
  { role: "mid", name: "VicLa", team: "BFX", priceM: 7.5, move: 0, ownedPct: 1, points: 13 },
  { role: "bot", name: "Diable", team: "BFX", priceM: 7.0, move: -1, ownedPct: 1, points: 12 },
  { role: "sup", name: "Kellin", team: "BFX", priceM: 6.0, move: 0, ownedPct: 1, points: 11 },
  { role: "coach", name: "DanDy", team: "NS", priceM: 5.0, move: -1, ownedPct: 1, points: 7 },
  { role: "coach", name: "Edgar", team: "BRO", priceM: 4.5, move: -1, ownedPct: 1, points: 4 },
  { role: "coach", name: "Mowgli", team: "BFX", priceM: 4.5, move: 0, ownedPct: 1, points: 3 },
];

/** Form, the last 4 weeks' average, is season points ÷ 3 until Week 4 is final. */
export const formOf = (points: number) => Math.round((points / 3) * 10) / 10;

/** A player or coach in the Stats list; one missing from it is a broken fixture. */
export function statsOf(name: string): StatsPlayer {
  const found = [...STATS_PLAYERS, ...OFF_PAGE_PLAYERS].find((p) => p.name === name);
  if (!found) throw new Error(`${name} is not in the Stats list`);
  return found;
}

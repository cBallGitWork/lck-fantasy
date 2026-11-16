// The Stats picture's players and coaches (stats.html), at Week 4's Tuesday, Weeks 1 to 3 final, and
// the rest of Baron Steal FC's squad: every page's price, owned % and season points for them.
// Every name and number is an example.

import type { PersonRole } from "../rift";
import type { TeamCode } from "./competition";

/** A player in the Stats picture's list: Week 4 price in m, its move, owned %, season points. */
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

/** The Stats picture's players and coaches (stats.html), then Baron Steal FC's two off its first page. */
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
  { role: "jng", name: "Cuzz", team: "KT", priceEok: 4.0, move: 0, ownedPct: 7, points: 23 },
  { role: "mid", name: "Bdd", team: "KT", priceEok: 5.0, move: 0, ownedPct: 5, points: 16 },
];

/** Form, the last 4 weeks' average, is season points ÷ 3 until Week 4 is final. */
export const formOf = (points: number) => Math.round((points / 3) * 10) / 10;

/** A player in the Stats list; one missing from it is a broken fixture. */
export function statsOf(name: string): StatsPlayer {
  const found = STATS_PLAYERS.find((p) => p.name === name);
  if (!found) throw new Error(`${name} is not in the Stats list`);
  return found;
}

// Points' made-up games, Weeks 1 to 3: each game's winner, Week 3's champions, and each squad
// member's series and points game by game in Weeks 1 and 2. Made up to fit the weeks' scores.

import type { PointsPick, TeamCode } from "../../fixtures/week3";

/** Each game's winner, in each series that a squad member played, Weeks 1 to 3. */
export const GAME_WINNERS: Record<string, TeamCode[]> = {
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

/** Week 3's champions, series by series, in the order each player played them. The Coach has none. */
export const WEEK3_CHAMPIONS: Record<string, string[][]> = {
  Zeus: [["Jax", "Gnar", "Rumble"], ["Aatrox", "Renekton", "Jayce"]],
  Canyon: [["Vi", "Sejuani"], ["Xin Zhao", "Maokai", "Lee Sin"]],
  Faker: [["Azir", "Taliyah", "Galio"], ["Orianna", "Sylas"]],
  Ruler: [["Kai'Sa", "Varus"], ["Ezreal", "Jinx", "Xayah"]],
  Delight: [["Rakan", "Nautilus", "Alistar"], ["Rell", "Leona", "Braum"]],
  Siwoo: [["Gragas", "Ornn"], ["K'Sante", "Rumble"]],
  Cuzz: [["Viego", "Xin Zhao"], ["Sejuani", "Vi", "Maokai"]],
};

export type Played = PointsPick["series"];

/** Weeks 1 and 2: each squad member's series and points game by game; the coach's +3 or −1 a series. */
export const WEEK1_PLAYED: Record<string, Played> = {
  Zeus: [{ id: "w1-wed-1", games: [4, 2, 3] }, { id: "w1-sat-2", games: [5, 3] }],
  Canyon: [{ id: "w1-wed-2", games: [3, 1, 4] }, { id: "w1-fri-2", games: [4, 3] }],
  Faker: [{ id: "w1-wed-2", games: [6, 1, 3] }, { id: "w1-sat-1", games: [5, 4] }],
  Ruler: [{ id: "w1-wed-2", games: [2, 3, 5] }, { id: "w1-fri-2", games: [4, 4] }],
  Delight: [{ id: "w1-wed-1", games: [2, 1, 2] }, { id: "w1-sat-2", games: [3, 2] }],
  Siwoo: [{ id: "w1-thu-1", games: [2, 3, 1] }, { id: "w1-fri-2", games: [1, 0] }],
  kkOma: [{ id: "w1-wed-2", games: [1, 0, 2], coachResult: -1 }, { id: "w1-sat-1", games: [2, 2], coachResult: 3 }],
  Bdd: [{ id: "w1-wed-1", games: [2, 1, 3] }, { id: "w1-sun-1", games: [3, 2, 1] }],
  Cuzz: [{ id: "w1-wed-1", games: [1, 3, 0] }, { id: "w1-sun-1", games: [2, 2, 4] }],
};

export const WEEK2_PLAYED: Record<string, Played> = {
  Zeus: [{ id: "w2-thu-2", games: [3, 4] }, { id: "w2-sat-2", games: [2, 5, 3] }],
  Canyon: [{ id: "w2-wed-2", games: [5, 3] }, { id: "w2-sat-1", games: [1, 4, 3] }],
  Faker: [{ id: "w2-wed-1", games: [5, 4] }, { id: "w2-fri-2", games: [4, 7, 2] }],
  Ruler: [{ id: "w2-wed-2", games: [4, 2] }, { id: "w2-sat-1", games: [2, 3, 6] }],
  Delight: [{ id: "w2-thu-2", games: [2, 2] }, { id: "w2-sat-2", games: [1, 3, 2] }],
  Siwoo: [{ id: "w2-thu-1", games: [4, 1, 3] }, { id: "w2-sat-2", games: [2, 4, 1] }],
  kkOma: [{ id: "w2-wed-1", games: [2, 2], coachResult: 3 }, { id: "w2-fri-2", games: [2, 0, 3], coachResult: 3 }],
  Bdd: [{ id: "w2-thu-1", games: [3, 2, 2] }, { id: "w2-sun-1", games: [4, 3] }],
  Cuzz: [{ id: "w2-thu-1", games: [2, 1, 3] }, { id: "w2-sun-1", games: [3, 2] }],
};

// Points' made-up games, Weeks 1 to 3: each game's winner and Week 3's champions. The squad's
// games in Weeks 1 and 2 are the shared ones (src/fixtures/squads.ts).

import type { TeamCode } from "../../fixtures/week3";

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

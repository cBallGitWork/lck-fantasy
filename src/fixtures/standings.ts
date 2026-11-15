// The made-up LCK Cup's group standings after Week 3, as the LCK hub, the Series page and Stats
// share them. Every number is an example.

import type { TeamCode } from "./competition";

/** A team's series won and lost, sets won and lost, and its last five results, newest last. */
export interface Standing {
  team: TeamCode;
  won: number;
  lost: number;
  setsWon: number;
  setsLost: number;
  last5: string;
}

const row = (team: TeamCode, won: number, lost: number, setsWon: number, setsLost: number, last5: string): Standing => ({ team, won, lost, setsWon, setsLost, last5 });

/** A group's name, in English and hangul, and its rows in table order. */
export interface StandingsGroup {
  name: string;
  hangul: string;
  rows: readonly Standing[];
}

/** The two groups after Week 3, in table order. */
export const WEEK3_STANDINGS: readonly StandingsGroup[] = [
  {
    name: "Baron group",
    hangul: "바론 그룹",
    rows: [
      row("T1", 5, 1, 11, 4, "WWWWW"),
      row("DK", 3, 3, 8, 7, "WLWWL"),
      row("KRX", 3, 3, 7, 8, "LWLWW"),
      row("NS", 2, 4, 5, 8, "WWLLL"),
      row("BRO", 1, 5, 4, 11, "WLLLL"),
    ],
  },
  {
    name: "Elder group",
    hangul: "장로 그룹",
    rows: [
      row("GEN", 5, 1, 11, 5, "LWWWW"),
      row("HLE", 4, 2, 9, 6, "WWWLL"),
      row("DNS", 3, 3, 8, 8, "LWLWW"),
      row("KT", 3, 3, 7, 8, "LWLLW"),
      row("BFX", 1, 5, 4, 9, "LWLLL"),
    ],
  },
];

/** A team's standing after Week 3; a team in no group is a broken fixture. */
export function standingOf(team: TeamCode): Standing {
  const found = WEEK3_STANDINGS.flatMap((g) => g.rows).find((r) => r.team === team);
  if (!found) throw new Error(`${team} is in no Week 3 group`);
  return found;
}

/** A team's series record after Week 3: `5–1`. */
export function recordOf(team: TeamCode): string {
  const { won, lost } = standingOf(team);
  return `${won}–${lost}`;
}

/** The games a team has played, Weeks 1 to 3: its sets won and lost. */
export function gamesOf(team: TeamCode): number {
  const { setsWon, setsLost } = standingOf(team);
  return setsWon + setsLost;
}

// Baron Steal FC's leagues, as Home, Points and Leagues share them: rank, places moved and size,
// and his season at Points' moment. Every number is an example.

import { sum } from "../parts";
import { MY_EARLIER_WEEKS, MY_WEEK3 } from "./squads";

/** His season total at Points' moment: Weeks 1 and 2, and Week 3 so far. */
export const MY_SEASON_TOTAL = sum(MY_EARLIER_WEEKS) + MY_WEEK3.liveTotal;

/** His Overall rank, its move and the field, and the tier it falls in. */
export const MY_OVERALL = { rank: 48211, move: 6904, size: 212480, tier: "Emerald I", hangul: "에메랄드 1", division: "I" } as const;

/** One of his leagues past Overall. */
export interface MyLeague {
  id: string;
  name: string;
  kind: "country" | "team" | "private";
  rank: number;
  /** Places moved: up when positive. */
  move: number;
  size: number;
}

/** His leagues past Overall, in the order every page lists them. */
export const MY_LEAGUES: readonly MyLeague[] = [
  { id: "united-kingdom", name: "United Kingdom", kind: "country", rank: 1402, move: 233, size: 9377 },
  { id: "t1-supporters", name: "T1 supporters", kind: "team", rank: 3118, move: 510, size: 41902 },
  { id: "pub-league", name: "Pub League", kind: "private", rank: 2, move: 1, size: 12 },
  { id: "flol-discord", name: "Flol Discord", kind: "private", rank: 14, move: -2, size: 86 },
];

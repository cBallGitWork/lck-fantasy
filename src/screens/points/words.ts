// Points' words, named once. Every word a player reads on this screen lives here.

import type { WeekPick } from "./types";

export const WORDS = {
  seriesTitle: "This week's series",
  sponsor: "Sponsor",
  average: "Average",
  highest: "Highest",
  watch: "Watch",
  view: "View",
  /** A player with no games this week, on his tile and his bench tile. */
  didntPlay: "Didn't play",
  noWeek: "No points for this week",
  yourWeek: "Your week",
  leagues: "Leagues",
  allLeagues: "All leagues",
  fullStats: "Full stats",
  versus: "v",
  to: "to",
} as const;

/** Your week's lines. */
export const PICK_WORDS = { Star: "Star", Flop: "Flop", Killer: "Killer" } as const satisfies Record<WeekPick["label"], string>;

/** `T1 v DK, game 2`: the head's live bar. */
export const liveGame = (home: string, away: string, game: number) => `${home} ${WORDS.versus} ${away}, game ${game}`;

/** `v HLE`: a series by its opponent, for a reader and on its head. */
export const versus = (opponent: string) => `${WORDS.versus} ${opponent}`;

/** `25 · owned by 46%`, `15 · not yours · owned by 41%`: a Your week pick's points and who owns him. */
export const ownedBy = (points: number, pct: string, mine: boolean) => (mine ? `${points} · owned by ${pct}` : `${points} · not yours · owned by ${pct}`);

/** `≈6 pts`: the points to your next Overall tier; `to` and the tier follow. */
export const toTier = (points: number) => `≈${points} pts`;

/** `Captains averaged 19`: the average Captain's points, on the Captain's sheet. */
export const averaged = (who: string, points: number) => `${who}s averaged ${points}`;

export const dot = " · ";

// Points' words, named once. Every word a player reads on this screen lives here.

import type { WeekPick } from "./types";

export const WORDS = {
  seriesTitle: "This week's series",
  sponsor: "Sponsor",
  total: "Total",
  average: "Average",
  highest: "Highest",
  watch: "Watch",
  view: "View",
  /** A player with no games this week, on his tile, his bench tile and his card. */
  didntPlay: "Didn't play",
  noWeek: "No points for this week",
  yourWeek: "Your week",
  leagues: "Leagues",
  allLeagues: "All leagues",
  fullStats: "Full stats",
  /** The heads of the player's card's table; a coach's has no K, D and A. */
  game: "Game",
  kills: "K",
  deaths: "D",
  assists: "A",
  scored: "Scored",
  pts: "Pts",
  /** Your week's head over who owns each pick. */
  owned: "Owned",
  /** The coach's row under a series' games, before his +3 or −1. */
  seriesWin: "Series win",
  seriesLoss: "Series loss",
  versus: "v",
  /** Under Overall, after the bold `≈6`, before the tier above: `≈6 pts to Diamond IV`. */
  ptsTo: "pts to",
  /** Under Overall, before the tier below: `≈5 pts clear of Emerald II`. */
  ptsClearOf: "pts clear of",
} as const;

/** Your week's groups, each word on its group's first row. */
export const PICK_WORDS = { Star: "Stars", Flop: "Flop", Killer: "Killers" } as const satisfies Record<WeekPick["label"], string>;

/** `T1 v DK, game 2`: the live game, in the Total panel. */
export const liveGame = (home: string, away: string, game: number) => `${home} ${WORDS.versus} ${away}, game ${game}`;

/** `v HLE`: a series by its opponent, on the card and for a reader. */
export const versus = (opponent: string) => `${WORDS.versus} ${opponent}`;

/** `, v GEN`: after a tile's total, the series he still has to play. */
export const stillToPlay = (opponent: string) => `, ${versus(opponent)}`;

/** `≈6`: a tier gap's points, ≈ as others still score; `pts to` or `pts clear of` and the tier follow. */
export const approx = (points: number) => `≈${points}`;

/** `17 ×1.5 · Captains averaged 19`: the Captain's working and the average Captain, once, on his card. */
export const captainNote = (before: number, by: number, who: string, average: number) => `${before} ×${by}${dot}${who}s averaged ${average}`;

export const dot = " · ";

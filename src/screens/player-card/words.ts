// The player card's words, named once. Every word a player reads on this screen lives here.

import { REGION } from "../../region";

/** The card's tabs, in their order; each is also the tab's key. */
export const TABS = ["This week", "Fixtures", "History", "Champions"] as const;

export const WORDS = {
  /** The tab list's name, for a reader. */
  card: "Player card",
  compare: "Compare",
  swap: "Swap with bench",
  transferOut: "Transfer out",
  season: "Season",
  price: "price",
  champions: "Champions",
  champion: "Champion",
  fixtures: "Fixtures",
  week: "Week",
  series: "Series",
  games: "Games",
  kda: "K / D / A",
  /** History: his price that week, on the week's first row. */
  weekPrice: "Week price",
  pts: "Pts",
  /** History: the week's points, his own, on the week's first row. */
  weekPts: "Week pts",
  perGame: "Per game",
  total: "Total",
  record: "W–L",
  average: "Avg pts",
  /** Fixtures' league time column: its zone, as the league's data names it. */
  kst: REGION.timeZoneLabel,
  versus: "v",
  pastSeasons: "Past seasons",
  scoredBy: "LCK, scored by Flol",
} as const;

export const dot = " · ";

/** `Season · 2nd of 10 mids`: under the season's points. */
export const seasonPlace = (place: string) => `${WORDS.season}${dot}${place}`;

/** `form · 2nd`, `owned · 1st`: after the figure in the meta line. */
export const formPlace = (place: string) => `form${dot}${place}`;
export const ownedPlace = (place: string) => `owned${dot}${place}`;

/** `+1,204 / −310 transfers this week`: the week's transfers in and out. */
export const transfersThisWeek = (inOut: string) => `${inOut} transfers this week`;

/** `15 games`, `1 game`: beside the Season panel's head. */
export const gamesCount = (n: number) => `${n} ${n === 1 ? "game" : "games"}`;

/** `Week 3`: This week's total row. */
export const weekNo = (week: number) => `${WORDS.week} ${week}`;

/** `Captain 17 × 1.5, rounded down`: his points before the Captain, and the multiplier (spec/05). */
export const captainSum = (raw: number, multiplier: number) => `Captain ${raw} × ${multiplier}, rounded down`;

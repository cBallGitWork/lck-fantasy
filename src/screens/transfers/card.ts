// What the tapped player's card under Transfers' Rift shows (spec/12, Pick Team and Transfers): his
// season points and owned with their rank among his role, the scoring lines' season figures and no
// Form, his last 3 series each with its opponent, and his next 3.

/** A player's season in the scoring lines (spec/05): totals over his games. */
export interface SeasonLines {
  games: number;
  kills: number;
  deaths: number;
  assists: number;
  /** Games with a gold lead at 15. */
  goldLead: number;
  soloKills: number;
  firstBlood: number;
}

/** One person's card figures, as data from the backend (#36 until then). */
export interface CardFacts {
  /** How many of his role his ranks are among. */
  among: number;
  pointsRank: number;
  ownedRank: number;
  /** The players' scoring lines; none for a coach. */
  season?: SeasonLines;
  /** His last 3 series, oldest first: his points and who against. */
  last3: { points: number; opponent: string }[];
  /** His next 3 series: who against, the day and the series' length. */
  next3: { opponent: string; day: string; bestOf: number }[];
}

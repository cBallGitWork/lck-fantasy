// Price changes' words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  title: "Price changes",
  hangul: "가격 변동",
  /** The table's column heads. */
  player: "Player",
  was: "Was",
  now: "Now",
  owned: "Owned",
  /** The two lists' heads. */
  rises: "Rises",
  falls: "Falls",
  /** A list before the first move. */
  noMoves: "No moves yet",
  /** Before when the week's prices were set. */
  set: "Set",
  /** The way to the Help page's formula (spec/02). */
  howPricesMove: "How prices move",
  /** A week in the address with no prices, such as `/price-changes/99`. */
  noWeek: "No price changes for this week",
} as const;

/** `Week 4 prices`: the week the step bar shows. */
export const weekPrices = (week: number) => `Week ${week} prices`;

/** `T1 · Mid`: a row's team and role. */
export const teamRole = (team: string, role: string) => `${team} · ${role}`;

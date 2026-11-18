// Perfect game's words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  title: "Perfect game",
  hangul: "퍼펙트 게임",
  /** The head's figures: every manager's average, the week's highest, and your own. */
  average: "Average",
  highest: "Highest",
  yours: "Your points",
  view: "View",
  sponsor: "Sponsor",
  /** A week in the address with no perfect game: `/perfect-game/9`. */
  noWeek: "No perfect game for this week",
} as const;

/** `Split 1 Week 3`: the competition and week in the head (spec/12, The Broadcast voice). */
export const weekLine = (competition: string, week: number) => `${competition} Week ${week}`;

/** `Week 3 series`: the side column's series section. */
export const weekSeries = (week: number) => `Week ${week} series`;

/** `T1 · Mid`: a tapped starter's team and role. */
export const teamRole = (team: string, role: string) => `${team} · ${role}`;

/** A game in a tapped starter's series: `Azir · W`. */
export const championLine = (champion: string, outcome: string) => `${champion} · ${outcome}`;

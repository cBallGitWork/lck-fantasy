// The coach card's words, named once. Every word a player reads on this screen lives here.

/** The card's tabs, in their order; each is also the tab's key. Roster replaces the player card's Champions (spec/12). */
export const TABS = ["This week", "Fixtures", "History", "Roster"] as const;

export const WORDS = {
  /** The tab list's name, for a reader. */
  card: "Coach card",
  compare: "Compare",
  transferOut: "Transfer out",
  season: "Season",
  price: "price",
  fixtures: "Fixtures",
  roster: "Roster",
  pastSeasons: "Past seasons",
  week: "Week",
  series: "Series",
  games: "Games",
  /** History: his price that week, on the week's first row. */
  weekPrice: "Price",
  pts: "Pts",
  /** History: the week's points, on the week's first row. */
  weekPts: "Week",
  perGame: "Per game",
  total: "Total",
  kst: "KST",
  role: "Role",
  player: "Player",
  /** Roster: a player's price now. */
  rosterPrice: "Price",
  /** Roster: a player's season points. */
  seasonPts: "Season",
  owned: "Owned",
  seriesWon: "Series won",
  seriesLost: "Series lost",
} as const;

/** What a tab shows when this opening has no data for it, so the panel is never blank. */
export const EMPTY_TAB = {
  "This week": "No series yet",
  Fixtures: "No fixtures left",
  History: "No history yet",
  Roster: "No roster yet",
} as const satisfies Record<(typeof TABS)[number], string>;

export const dot = " · ";

/** `kkOma, coach`: the card's name, for a reader. */
export const cardTitle = (name: string) => `${name}, coach`;

/** `10 coaches`: what his season's place is among. */
export const coachesOf = (n: number) => `${n} coaches`;

/** `Season · 1st of 10 coaches`: under the season's points. */
export const seasonPlace = (place: string) => `${WORDS.season}${dot}${place}`;

/** `form · 1st`, `owned · 2nd`: after the figure in the meta line. */
export const formPlace = (place: string) => `form${dot}${place}`;
export const ownedPlace = (place: string) => `owned${dot}${place}`;

/** `+310 / −95 this week`: the week's transfers in and out. */
export const transfersThisWeek = (inOut: string) => `${inOut} this week`;

/** `15 games`: beside the Season panel's head. */
export const gamesCount = (n: string) => `${n} games`;

/** `Week 3`: This week's total row. */
export const weekNo = (week: number) => `${WORDS.week} ${week}`;

/** `Series · +3 if won, −1 if lost`: the series line while it is live. */
export const seriesIfs = (won: string, lost: string) => `${WORDS.series}${dot}${won} if won, ${lost} if lost`;

/** `T1 v KT`: a fixture, the coach's team first. */
export const versus = (team: string, opponent: string) => `${team} v ${opponent}`;

/** `T1, scored by Flol`: beside Past seasons. */
export const scoredBy = (team: string) => `${team}, scored by Flol`;

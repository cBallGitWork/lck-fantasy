// Stats' words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  title: "Stats",
  hangul: "통계",
  priceChanges: "Price changes",
  /** The tabs' name, for a reader. */
  tabsLabel: "Players or coaches",
  all: "All",
  role: "Role",
  team: "Team",
  maxPrice: "Max price",
  /** Max price's choice for no limit. */
  anyPrice: "Any",
  span: "Span",
  season: "Season",
  /** The Totals and Per game toggle's name, for a reader. */
  figuresLabel: "Totals or per game",
  player: "Player",
  coach: "Coach",
  price: "Price",
  form: "Form",
  owned: "Owned",
  pts: "Pts",
  games: "Games",
  series: "Series",
  pageBefore: "Page before",
  pageAfter: "Page after",
} as const;

/** The tabs, each its own word. */
export const TABS = ["Players", "Coaches"] as const;

/** The toggle's two ways to show a count. */
export const FIGURES = ["Totals", "Per game"] as const;

/** Each line's column head, by its key in a row's `lines`. */
export const LINE_HEADS = {
  kills: "K",
  deaths: "D",
  assists: "A",
  gd15: "GD@15",
  soloKills: "Solo kills",
  firstBlood: "First blood",
  deathless: "Deathless",
  quadra: "Quadra+",
  steals: "Obj. steals",
  firstTower: "First tower",
  drakes: "Most drakes",
  barons: "Most barons",
  elders: "Most elders",
  quickWins: "Quick wins",
} as const;

/** `Find a player`, `Find a coach`: the search's hint and its name for a reader. */
export const findA = (who: "player" | "coach") => `Find a ${who}`;

/** `Week 3`: a span over one week. */
export const weekSpan = (n: number) => `Week ${n}`;

/** `Page 3`: a page key's name, for a reader. */
export const pageName = (n: number) => `Page ${n}`;

/** `1–20 of 104`: the rows on this page, of all the list holds. */
export const rowsOf = (first: number, last: number, total: number) => `${first}–${last} of ${total}`;

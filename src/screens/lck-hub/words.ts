// The region hub's words, named once. Every word a player reads on this screen lives here; its
// name is the region's (#374), and a stage not yet started says when it starts (spec/12, LCK hub).

import { REGION } from "../../region";

export const WORDS = {
  /** The hub's name, as its tabs and a link to it say: `LCK hub`. */
  hub: `${REGION.name} hub`,
  /** The stage toggle's name, for a reader. */
  stage: "Stage",
  /** Fixtures' two time columns: the manager's own time, then Korea's. */
  yours: "Yours",
  kst: "KST",
  versus: "v",
  news: "News",
  /** A headline's picture until the news feed brings its own (#116). */
  thumbnail: "thumbnail",
  /** The team picker's name, for a reader. */
  team: "Team",
} as const;

/** The tabs, each its own word. */
export const HUB_TABS = ["Fixtures", "Results", "Standings", "Teams"] as const;

/** Standings' column heads, by column. */
export const STANDINGS_HEADS = {
  team: "Team",
  won: "W",
  lost: "L",
  gamesWon: "Sets W",
  gamesLost: "Sets L",
  diff: "+/−",
  pct: "Win %",
  last5: "Last 5",
} as const;

/** A stage not yet started, with its first day from the competition's data: `Starts Wed 10 Mar`. */
export const starts = (day: string) => `Starts ${day}`;

/** `More on Sheep Esports`: the news's last link, out to its source. */
export const moreOn = (source: string) => `More on ${source}`;

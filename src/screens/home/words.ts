// Home's words, named once. Every word a player reads on this screen lives here
// (approved/home/, as the pictures have them).

import type { FactKind } from "./types";

export const WORDS = {
  live: "Live",
  streams: "Streams",
  more: "More ▾",
  muted: "Muted",
  /** The picker's sub-band over your players in the live series, and its figures' head. */
  yourPlayers: "Your players",
  pts: "Pts",
  pickTeam: "Pick Team",
  transfers: "Transfers",
  freeTransfers: "Free transfers",
  /** The Deadline panel's row for the buff played for the coming week. */
  buff: "Buff",
  /** The sub-band over the next three deadlines. */
  next: "Next",
  bench: "Bench",
  points: "Points",
  average: "Average",
  highest: "Highest",
  owned: "Owned",
  following: "Following",
  allManagers: "All managers",
  leagues: "Leagues",
  allLeagues: "All leagues",
  sponsor: "Sponsor",
  /** The sponsor's badge by Overall's tier, its slot until its name is approved. */
  badge: "Badge",
  /** A stream's picker, for a screen reader. */
  stream: "Stream",
} as const;

/** Each fact's word, after its mark (approved/home/, What binds 7). */
export const FACT_WORD: Record<FactKind, string> = {
  star: "Star",
  flop: "Flop",
  captained: "Most captained",
  bought: "Most bought",
  sold: "Most sold",
};

/** The countdown's units, small after each figure: `3d 22h 45m`. */
export const COUNTDOWN_UNIT = { days: "d", hours: "h", minutes: "m" } as const;

export const dot = " · ";

/** `Week 4 deadline`: the Deadline panel's title. */
export const deadlineTitle = (week: number) => `Week ${week} deadline`;

/** `Week 4 lineup`: the lineup's title. */
export const lineupTitle = (week: number) => `Week ${week} lineup`;

/** `Week 3 series`: the series panel's title. */
export const seriesTitle = (week: number) => `Week ${week} series`;

/** `Week 3`: a panel's title or sub-band. */
export const weekName = (week: number) => `Week ${week}`;

/** `Week 4 so far`: All managers' sub-band over the coming week's transfers. */
export const weekSoFar = (week: number) => `Week ${week} so far`;

/** `Game 2 · Bo3`: the live series' game and length. */
export const gameOf = (game: number, bestOf: string) => `Game ${game}${dot}${bestOf}`;

/** `v HLE, KT`: a lineup card's week of opponents. */
export const versus = (opponents: readonly string[]) => `v ${opponents.join(", ")}`;

/** `Jeer from Minji · Week 3`: under a cheer or jeer received. */
export const fromLine = (kind: string, from: string) => `${kind} from ${from}`;

/** `×3`: the coach's multiplier on his card while Coach Diff is on. */
export const times = (by: number) => `×${by}`;

/** `Cheer sent`: a feed row's key once this week's cheer or jeer is sent. */
export const sentWord = (kind: string) => `${kind} sent`;

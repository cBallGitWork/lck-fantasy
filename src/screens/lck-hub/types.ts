// What the LCK hub is fed: today from fixtures.ts, later from the backend (#36, #116).

import type { Series, TeamCode } from "../../fixtures/week3";
import type { PersonRole } from "../../rift";

export const HUB_TABS = ["Fixtures", "Results", "Standings", "Teams"] as const;
export type HubTab = (typeof HUB_TABS)[number];

/** One week's series, as Fixtures or Results shows them. */
export interface HubWeek {
  label: string;
  /** `20–24 Jan`. */
  dates: string;
  series: Series[];
}

export type SeriesResult = "W" | "L";

/** A team's line in its group's table, in the group's order. */
export interface StandingsRow {
  team: TeamCode;
  won: number;
  lost: number;
  setsWon: number;
  setsLost: number;
  /** Oldest first. */
  last5: SeriesResult[];
}

export interface StandingsGroup {
  name: string;
  hangul: string;
  rows: StandingsRow[];
}

/** A stage of the competition (Groups, Play-In, Playoffs): data per competition (spec/10). */
export interface HubStage {
  name: string;
  fixtures: HubWeek[];
  results: HubWeek[];
  /** The week each tab opens on. */
  openFixtures: number;
  openResults: number;
  groups: StandingsGroup[];
}

export interface RosterMember {
  /** The player card's or coach card's id. */
  id: string;
  name: string;
  hangul: string;
  role: PersonRole;
  /** Absent until his price is set. */
  priceWon?: number;
}

/** One roster: the LCK team, or its academy in LCK CL. */
export interface Roster {
  name: string;
  league: string;
  members: RosterMember[];
}

export interface TeamRosters {
  team: TeamCode;
  lck: Roster;
  academy?: Roster;
}

export interface Headline {
  headline: string;
  date: string;
  url: string;
}

export interface HubNews {
  source: string;
  headlines: Headline[];
  moreUrl: string;
}

export interface LckHubData {
  title: string;
  hangul: string;
  /** A series is best of this many games: 3 shows `Bo3`. */
  bestOf: number;
  deadline: { local: string; kst: string; countdown: string };
  stages: HubStage[];
  teams: TeamRosters[];
  news: HubNews;
}

// Leagues' states as the pictures draw them (docs/design/approved/leagues/README.md, The states): the
// sample manager's leagues at the cap, with no private league, with one whose scoring hasn't started,
// before the next deadline, and before gameweek 1 is final. Each is fixtures.ts's leagues, changed.

import { POINTS_WEEK, WEEK1_SERIES } from "../../fixtures/week3";
import { COMPETITION, LEAGUE_LIST, LEAGUES, MY_LEAGUES_NOW, NEW_LEAGUE, NEW_TABLE, SCORING_WEEKS } from "./fixtures";
import type { MyLeagues } from "./forms";
import type { LeagueView, PrivateEntry, ScoringWeek } from "./types";

/** The names of the cap picture's private leagues past the sample manager's two (cap.html). */
const MORE_LEAGUES = [
  "Sunday Scrims",
  "Uni Mates",
  "LCK Nerds",
  "Mid Diff",
  "Top Gap",
  "Jungle Diff",
  "Bot Lane Besties",
  "Baron Buddies",
  "Family League",
  "Work Chat",
  "Pick Ban",
  "Solo Queue Survivors",
  "Inting Together",
  "Ward Bros",
  "Faker Fans UK",
  "Night Shift",
  "The Group Chat",
  "Drake Stakes",
  "Elder Gods",
  "Nexus Blitz",
  "Old School",
  "School Run",
  "Office Rift",
];

/** The moves the cap picture's leagues take in turn. */
const MOVES = [1, null, -2, 3, -1];

/** A private league the cap picture lists, its rank, move and size made up from its place. */
function another(name: string, i: number): PrivateEntry {
  const id = name.toLowerCase().replace(/\W+/g, "-");
  return {
    summary: { id, name, kind: "private", mark: { kind: "group" }, rank: 2 + ((i * 7) % 19), move: MOVES[i % MOVES.length] ?? null, size: 6 + ((i * 11) % 40) },
    view: { kind: "private", id, name, code: `CAP-${i + 1}`, scoringFrom: 1, role: "member", ...NEW_TABLE, tables: {} },
  };
}

/** At the cap: 25 private leagues (cap.html). */
export const AT_CAP: MyLeagues = MORE_LEAGUES.map(another).reduce(
  (mine, { summary, view }) => ({ list: [...mine.list, summary], views: { ...mine.views, [view.id]: view } }),
  MY_LEAGUES_NOW,
);

/** No private league yet (none.html). */
export const NO_PRIVATE: MyLeagues = {
  list: LEAGUE_LIST.filter((league) => league.kind === "general"),
  views: Object.fromEntries(Object.entries(LEAGUES).filter(([, view]) => view.kind !== "private")),
};

/** The week a league made this week counts from next week starts. */
const NEXT_WEEK: ScoringWeek = SCORING_WEEKS[1] ?? SCORING_WEEKS[0];

/** A league whose scoring hasn't started, made this week to count from next (soon.html). */
export const SOON_ID = NEW_LEAGUE.code.toLowerCase();
export const SOON: MyLeagues = {
  list: [...LEAGUE_LIST, { id: SOON_ID, name: NEW_LEAGUE.name, kind: "private", mark: { kind: "group" }, rank: null, move: null, size: 1 }],
  views: {
    ...LEAGUES,
    [SOON_ID]: { kind: "private", id: SOON_ID, name: NEW_LEAGUE.name, code: NEW_LEAGUE.code, scoringFrom: NEXT_WEEK.week, role: "maker", ...NEW_TABLE, tables: {}, startsOn: NEXT_WEEK },
  },
};

/** Overall before the next deadline: no Week or Captain column, no tier panel (before.html). */
export const BEFORE_DEADLINE: MyLeagues = {
  list: LEAGUE_LIST,
  views: { ...LEAGUES, overall: { ...LEAGUES.overall!, week: POINTS_WEEK.week + 1, deadlinePassed: false } },
};

/** Week 1's first series: nobody has a rank until its week is final. */
const WEEK1_FIRST = WEEK1_SERIES[0]!;

/** A league before gameweek 1 is final: no table yet, Week 1 to come. */
const beforeWeek1 = (view: LeagueView): LeagueView => ({
  ...view,
  week: 1,
  deadlinePassed: false,
  openTab: COMPETITION.seasonTab,
  tables: {},
  startsOn: { week: 1, starts: `${WEEK1_FIRST.day} ${WEEK1_FIRST.date}` },
});

/** Before gameweek 1 is final (unranked.html; spec/08): everyone Unranked, no league with a table or a rank. */
export const UNRANKED: MyLeagues = {
  list: LEAGUE_LIST.map((league) => ({
    ...league,
    rank: null,
    move: null,
    mark: league.mark.kind === "tier" ? { kind: "tier", tier: { tier: "unranked" } } : league.mark,
  })),
  views: Object.fromEntries(Object.entries(LEAGUES).map(([id, view]) => [id, beforeWeek1(view)])),
};

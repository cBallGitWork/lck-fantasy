// Leagues on the shared Week 3 of Split 1, at Points' moment (Saturday, T1 v DK game 2 live): after
// the deadline, so Captain shows. The pictures (docs/design/approved/leagues/) draw a made-up Split 2
// Week 14; they bind the layout, tabs and groups, and this file holds Week 3's figures. Names and numbers are
// examples. The sample manager and the Pub League's managers in MANAGERS are the shared ones. The backend feeds each of
// these once it is wired (#38); the panel of Captains and buffs by tier is #485's read.

import type { BuffEffect } from "../../../convex/squads/buffs";
import type { TierName } from "../../../convex/leagues/tiers";
import { MANAGERS, MINJI_WEEK3, type MadeUpManager } from "../../fixtures/managers";
import { MY_LEAGUES, MY_OVERALL, MY_SEASON_TOTAL, overallTierOf, type MyLeague } from "../../fixtures/myLeagues";
import { teamOf } from "../../fixtures/rosters";
import { seriesById } from "../../fixtures/series";
import { MANAGER, MY_WEEK3, POINTS_WEEK, SEASON, WEEK3_DEADLINE, WEEK4_SERIES, type BuffName } from "../../fixtures/week3";
import type { MyLeagues } from "./forms";
import type { CompetitionTabs, LeagueMark, LeagueSummary, LeagueView, NewTable, PrivateEntry, ScoringWeeks, Standings, StandingRow, TierPick } from "./types";

const WEEK = POINTS_WEEK.week;

/** The season's tabs and Overall's groups, as the competition's data will hold them (spec/08). */
export const COMPETITION: CompetitionTabs = {
  tabs: ["Season", "Split 1", "Split 2"],
  seasonTab: "Season",
  groupedTab: "Split 2",
  groups: ["Legend", "Rise", "All"],
};

/** The split being played at Week 3, where Overall opens. */
const THIS_SPLIT = "Split 1";

/** The league a bare /leagues opens, as the picture does. */
export const OPEN_LEAGUE_ID = "pub-league";

/** Each general league's mark past Overall's tier: the country's flag, the team's crest (plate.md, A league's mark). */
const GENERAL_MARKS: Record<string, LeagueMark> = {
  "united-kingdom": { kind: "flag", country: "United Kingdom" },
  "t1-supporters": { kind: "crest", team: "T1" },
};

function markOf({ id, kind }: MyLeague): LeagueMark {
  if (kind === "private") return { kind: "group" };
  const mark = GENERAL_MARKS[id];
  if (!mark) throw new Error(`${id} has no mark in GENERAL_MARKS`);
  return mark;
}

export const LEAGUE_LIST: LeagueSummary[] = [
  { id: "overall", name: "Overall", kind: "general", mark: { kind: "tier", tier: MY_OVERALL.tier }, rank: MY_OVERALL.rank, move: MY_OVERALL.move, size: MY_OVERALL.size },
  ...MY_LEAGUES.map((league): LeagueSummary => {
    const { id, name, kind, rank, move, size } = league;
    return { id, name, kind: kind === "private" ? "private" : "general", mark: markOf(league), rank, move, size };
  }),
];

type Line = [rank: number, move: number | null, team: string, manager: string, captain: string, week: number, total: number, split?: number];

/** A table's rows from its lines, each Captain with his team; the sample manager's row is marked yours, and with `chasing` tagged with the points to the row above. */
function rows(lines: Line[], chasing = false): StandingRow[] {
  return lines.map(([rank, move, team, manager, captain, week, total, split], i) => {
    const mine = team === MANAGER.team;
    const above = lines[i - 1];
    const chase: StandingRow["chase"] = mine && chasing && above ? { kind: "chasing", points: above[6] - total, rank: above[0] } : null;
    return {
      rank,
      move,
      team,
      manager,
      managerId: manager.toLowerCase().replace(/\W+/g, "-"),
      captain: { team: teamOf(captain), name: captain },
      week,
      total,
      split,
      mine,
      chase,
    };
  });
}

/** The sample manager's row in a league, its rank and move his: his Week 3 so far, and a total counted from the league's first week. */
function me(leagueId: MyLeague["id"] | "overall", total: number): Line {
  const league = leagueId === "overall" ? MY_OVERALL : MY_LEAGUES.find((l) => l.id === leagueId);
  if (!league) throw new Error(`Baron Steal FC is not in ${leagueId}`);
  return [league.rank, league.move, MANAGER.team, MANAGER.name, "Faker", MY_WEEK3.liveTotal, total];
}

/** A made-up manager's row: his team and name from MANAGERS. */
const theirs = ({ team, name }: MadeUpManager, rank: number, move: number | null, captain: string, week: number, total: number): Line => [rank, move, team, name, captain, week, total];

/** A row whose total counts only this week: a league scoring from Week 3. */
const fromThisWeek = (rank: number, move: number | null, team: string, manager: string, captain: string, week: number): Line => [rank, move, team, manager, captain, week, week];

const PUB_LEAGUE: LeagueView = {
  kind: "private",
  id: "pub-league",
  name: "Pub League",
  scoringFrom: 1,
  code: "PUB-7K2Q",
  role: "maker",
  week: WEEK,
  deadlinePassed: true,
  openTab: "Season",
  tables: {
    Season: {
      pages: 1,
      runs: [
        rows(
          [
            theirs(MANAGERS.minji, 1, null, "Ruler", MINJI_WEEK3.points, MINJI_WEEK3.total),
            me("pub-league", MY_SEASON_TOTAL),
            theirs(MANAGERS.dan, 3, -1, "Faker", 77, 296),
            theirs(MANAGERS.jae, 4, 2, "ucal", 66, 291),
            theirs(MANAGERS.tom, 5, null, "Chovy", 61, 284),
            theirs(MANAGERS.sam, 6, -2, "Gumayusi", 49, 277),
            theirs(MANAGERS.priya, 7, 1, "Zeus", 70, 270),
            [8, -1, "Smeb Nostalgia", "Liam Byrne", "Kiin", 58, 263],
            theirs(MANAGERS.ella, 9, null, "Aiming", 63, 255),
            theirs(MANAGERS.joe, 10, 1, "Keria", 72, 246),
            [11, -1, "Ambition FC", "Chris Lee", "Canyon", 41, 235],
            [12, null, "Gank Plank", "Ruth Ade", "Faker", 55, 223],
          ],
          true,
        ),
      ],
    },
  },
};

/** The row the Remove pictures pick (remove-pick, remove). */
export const REMOVE_PICK = PUB_LEAGUE.tables.Season?.runs[0]?.find((r) => r.manager === MANAGERS.priya.name);

/** Flol Discord's first page: 86 managers, yours 14th, so the top five, a gap, then 12th to 16th (spec/08's example; `firstPage`). */
const FLOL_DISCORD: LeagueView = {
  kind: "private",
  id: "flol-discord",
  name: "Flol Discord",
  scoringFrom: 3,
  code: "FLOL-22XB",
  role: "member",
  week: WEEK,
  deadlinePassed: true,
  openTab: "Season",
  tables: {
    Season: {
      pages: 2,
      runs: [
        rows([
          fromThisWeek(1, 2, "Canyon Diff", "Hye-jin Lim", "Canyon", 120),
          fromThisWeek(2, -1, "Smash Mouth Kiin", "Leo Grant", "Kiin", 116),
          fromThisWeek(3, null, "Ward Hoarders", "Ama Owusu", "Keria", 113),
          fromThisWeek(4, 1, "Lehends Never Die", "Rui Tan", "Faker", 109),
          fromThisWeek(5, -2, "T1 Til I Die", "Nadia Khan", "Faker", 106),
        ]),
        rows(
          [
            fromThisWeek(12, 3, "Bdd Wolf", "Owen Shaw", "Bdd", 97),
            fromThisWeek(13, null, "Siwoo Sweep", "Mei Lin", "Chovy", 96),
            me("flol-discord", MY_WEEK3.liveTotal),
            fromThisWeek(15, 1, "Oner Way Ticket", "Sean Doyle", "Oner", 92),
            fromThisWeek(16, -1, "Clid Was Here", "Ines Silva", "Zeka", 90),
          ],
          true,
        ),
      ],
    },
  },
};

/** Overall's rows, each with its manager's tier from the tier function (spec/08). Overall has no chase tag: Points shows the gap to the next tier. */
const tiered = (lines: Line[]): StandingRow[] => rows(lines).map((row) => ({ ...row, tier: overallTierOf(row.rank) }));

/** Overall at Week 3: the season and Split 1 are one table until Split 2 starts. */
const OVERALL_STANDINGS: Standings = {
  pages: 1063,
  runs: [
    tiered([
      [1, null, "Unkillable FC", "Ha-eun Seo", "Faker", 112, 352],
      [2, 3, "Bang Bang Bot", "Marco Ruiz", "Ruler", 121, 349],
      [3, -1, "Faker's Fan Club", "Yuna Choi", "Faker", 88, 347],
      [4, -1, "Showmaker's Shadow", "Ben Price", "ShowMaker", 94, 344],
      [5, 2, "GenG Got Game", "Kenji Sato", "Chovy", 109, 342],
      [6, null, "Faker Ate My Homework", "Ollie Dunn", "Faker", 97, 340],
      [7, -2, "Viper's Nest", "Mina Lee", "Chovy", 80, 338],
    ]),
    tiered([
      [MY_OVERALL.rank - 2, 6880, "Rookie Mistake", "Jon Park", "Bdd", 97, MY_SEASON_TOTAL + 1],
      [MY_OVERALL.rank - 1, 6901, "Smolder Shoulders", "Aisha Bello", "Aiming", 98, MY_SEASON_TOTAL],
      me("overall", MY_SEASON_TOTAL),
      [MY_OVERALL.rank + 1, -40, "Doran's Ring Bearer", "Tim Fox", "Doran", 52, MY_SEASON_TOTAL],
      [MY_OVERALL.rank + 2, 2114, "Moss Rock", "Ivy Moss", "Chovy", 61, MY_SEASON_TOTAL - 1],
    ]),
  ],
};

/** The buffs as the panel names them, with their icons. */
const BUFF: Record<BuffName, BuffEffect> = { "Bench Boost": "benchBoost", "Double Captain": "doubleCaptain", "Coach Diff": "coachMultiplier" };

type PickLine = [tier: TierName, captain: string, share: number, buff: BuffName | null, buffShare: number];

/** Week 3's Captains and buffs by tier, Challenger down to Iron, as the overall picture's; your tier's row marked. */
const TIER_PICKS: TierPick[] = (
  [
    ["challenger", "Chovy", 61, "Double Captain", 9],
    ["grandmaster", "Chovy", 54, "Double Captain", 7],
    ["master", "Faker", 47, "Bench Boost", 6],
    ["diamond", "Faker", 44, "Bench Boost", 5],
    ["emerald", "Faker", 41, "Coach Diff", 4],
    ["platinum", "Faker", 39, "Bench Boost", 4],
    ["gold", "Faker", 43, "Bench Boost", 3],
    ["silver", "Faker", 48, "Coach Diff", 3],
    ["bronze", "Faker", 52, "Bench Boost", 2],
    ["iron", "Faker", 58, null, 0],
  ] satisfies PickLine[]
).map(([tier, captain, captainShare, buff, buffShare]) => ({
  tier,
  captain: { team: teamOf(captain), name: captain },
  captainShare,
  buff: buff && { name: buff, effect: BUFF[buff], share: buffShare },
  mine: MY_OVERALL.tier.tier === tier,
}));

const OVERALL: Extract<LeagueView, { kind: "overall" }> = {
  kind: "overall",
  id: "overall",
  name: "Overall",
  season: SEASON,
  week: WEEK,
  deadlinePassed: true,
  openTab: THIS_SPLIT,
  openGroup: "Legend",
  tables: {
    [COMPETITION.seasonTab]: OVERALL_STANDINGS,
    [THIS_SPLIT]: OVERALL_STANDINGS,
  },
  tierPicks: TIER_PICKS,
};

/** Each league the list opens, by its id. The two general leagues past Overall have no picture yet. */
export const LEAGUES: Record<string, LeagueView> = {
  overall: OVERALL,
  "united-kingdom": { kind: "general", id: "united-kingdom", name: "United Kingdom", week: WEEK, deadlinePassed: true, openTab: "Season", tables: {} },
  "t1-supporters": { kind: "general", id: "t1-supporters", name: "T1 supporters", week: WEEK, deadlinePassed: true, openTab: "Season", tables: {} },
  "pub-league": PUB_LEAGUE,
  "flol-discord": FLOL_DISCORD,
};

/** Every league the sample manager is in. */
export const MY_LEAGUES_NOW: MyLeagues = { list: LEAGUE_LIST, views: LEAGUES };

/** How many private leagues a manager can be in (spec/08). Data, per competition. */
export const PRIVATE_LEAGUE_CAP = 25;

/** The longest league name, as the Create sheet counts it (create.html, `11 / 30`). */
export const LEAGUE_NAME_MAX = 30;

/** Week 4's first series, whose day its scoring starts on. */
const WEEK4_FIRST = seriesById(WEEK4_SERIES, "w4-wed-1");

/** This week on, this week first: scoring can start no earlier (spec/08). Week 5's day is made up. */
export const SCORING_WEEKS: ScoringWeeks = [
  { week: WEEK, starts: `${WEEK3_DEADLINE.day} ${WEEK3_DEADLINE.date}` },
  { week: WEEK + 1, starts: `${WEEK4_FIRST.day} ${WEEK4_FIRST.date}` },
  { week: WEEK + 2, starts: "Wed 27 Jan" },
];

/** The league the Create picture makes, and the code it is given (create.html, created.html). */
export const NEW_LEAGUE = { name: "Office Rift", code: "OFF-9R3D" } as const;

/** How a new or joined league's table opens: this week, Season, no rows yet. */
export const NEW_TABLE: NewTable = { week: WEEK, deadlinePassed: true, openTab: COMPETITION.seasonTab };

/** A league the Join picture's code finds (join.html), and one the sample manager was removed from. Ranks and sizes are made up. */
export const JOINABLE: PrivateEntry[] = [
  {
    summary: { id: "gank-squad", name: "Gank Squad", kind: "private", mark: { kind: "group" }, rank: 9, move: null, size: 9 },
    view: { kind: "private", id: "gank-squad", name: "Gank Squad", code: "GANK-4TQ1", scoringFrom: 2, role: "member", ...NEW_TABLE, tables: {} },
  },
  {
    summary: { id: "dragon-pit", name: "Dragon Pit", kind: "private", mark: { kind: "group" }, rank: 4, move: null, size: 15 },
    view: { kind: "private", id: "dragon-pit", name: "Dragon Pit", code: "DRGN-5PX3", scoringFrom: 1, role: "member", ...NEW_TABLE, tables: {} },
  },
];

/** The codes of the leagues the sample manager was removed from: Join finds nothing there (spec/08). */
export const REMOVED_FROM: ReadonlySet<string> = new Set(["DRGN-5PX3"]);

/** The code the join-bad picture types: one character off Gank Squad's. */
export const BAD_CODE = "GANK-4TQ9";


// Leagues on the shared Week 3 of Split 1, at Points' moment (Saturday, T1 v DK game 2 live): after
// the deadline, so Carry shows. The pictures (docs/design/approved/leagues/) draw a made-up Split 2
// Week 14; they bind the layout, tabs and groups, and this file holds Week 3's figures. Names and numbers are
// examples. The sample manager, Minji, Dan and Jae are the shared ones. The backend feeds each of
// these once it is wired (#38).

import { MANAGERS, MINJI_WEEK3 } from "../../fixtures/managers";
import { MY_LEAGUES, MY_OVERALL, MY_SEASON_TOTAL } from "../../fixtures/myLeagues";
import { seriesById } from "../../fixtures/series";
import { COMPETITION as CUP, MANAGER, MY_WEEK3, POINTS_WEEK, WEEK3_DEADLINE, WEEK4_SERIES } from "../../fixtures/week3";
import type { CompetitionTabs, PrivateEntry, LeagueSummary, LeagueView, NewTable, ScoringWeeks, Standings, StandingRow } from "./types";

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

export const LEAGUE_LIST: LeagueSummary[] = [
  { id: "overall", name: "Overall", kind: "general", rank: MY_OVERALL.rank, move: MY_OVERALL.move, size: MY_OVERALL.size },
  ...MY_LEAGUES.map(({ id, name, kind, rank, move, size }): LeagueSummary => ({ id, name, kind: kind === "private" ? "private" : "general", rank, move, size })),
];

type Line = [rank: number, move: number | null, team: string, manager: string, carry: string, week: number, total: number, split?: number];

/** A table's rows from its lines; the sample manager's row is marked yours, and with `chasing` tagged with the points to the row above. */
function rows(lines: Line[], chasing = false): StandingRow[] {
  return lines.map(([rank, move, team, manager, carry, week, total, split], i) => {
    const mine = team === MANAGER.team;
    const above = lines[i - 1];
    const chase: StandingRow["chase"] = mine && chasing && above ? { kind: "chasing", points: above[6] - total, rank: above[0] } : null;
    return { rank, move, team, manager, managerId: manager.toLowerCase().replace(/\W+/g, "-"), carry, week, total, split, mine, chase };
  });
}

/** The sample manager's row: his Week 3 so far, and a total counted from the league's first week. */
const me = (rank: number, move: number | null, total: number): Line => [rank, move, MANAGER.team, MANAGER.name, "Faker", MY_WEEK3.liveTotal, total];

/** A row whose total counts only this week: a league scoring from Week 3. */
const fromThisWeek = (rank: number, move: number | null, team: string, manager: string, carry: string, week: number): Line => [rank, move, team, manager, carry, week, week];

const PUB_LEAGUE: LeagueView = {
  kind: "private",
  id: "pub-league",
  name: "Pub League",
  scoringFrom: 1,
  code: "PUB-7K2Q",
  role: "maker",
  week: WEEK,
  carryShown: true,
  openTab: "Season",
  tables: {
    Season: {
      pages: 1,
      runs: [
        rows(
          [
            [1, null, MANAGERS.minji.team, MANAGERS.minji.name, "Ruler", MINJI_WEEK3.points, MINJI_WEEK3.total],
            me(2, 1, MY_SEASON_TOTAL),
            [3, -1, MANAGERS.dan.team, MANAGERS.dan.name, "Faker", 77, 231],
            [4, 2, MANAGERS.jae.team, MANAGERS.jae.name, "ucal", 66, 226],
            [5, null, "Kiin Bean", "Tom Reid", "Chovy", 61, 219],
            [6, -2, "Guma Gang", "Sam Hill", "Gumayusi", 49, 212],
            [7, 1, "Zeus Juice", "Priya Shah", "Zeus", 70, 205],
            [8, -1, "Smeb Nostalgia", "Liam Byrne", "Kiin", 58, 198],
            [9, null, "Ruler of None", "Ella Wong", "Aiming", 63, 190],
            [10, 1, "BeryL Backup Plan", "Joe Grant", "Keria", 72, 181],
            [11, -1, "Ambition FC", "Chris Lee", "Canyon", 41, 170],
            [12, null, "Gank Plank", "Ruth Ade", "Faker", 55, 158],
          ],
          true,
        ),
      ],
    },
  },
};

const FLOL_DISCORD: LeagueView = {
  kind: "private",
  id: "flol-discord",
  name: "Flol Discord",
  scoringFrom: 3,
  code: "FLOL-22XB",
  role: "member",
  week: WEEK,
  carryShown: true,
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
            me(14, -2, MY_WEEK3.liveTotal),
            fromThisWeek(15, 1, "Oner Way Ticket", "Sean Doyle", "Oner", 92),
            fromThisWeek(16, -1, "Clid Was Here", "Ines Silva", "Viper", 90),
          ],
          true,
        ),
      ],
    },
  },
};

/** Overall at Week 3: the season and Split 1 are one table until Split 2 starts. */
const OVERALL_STANDINGS: Standings = {
  pages: 1063,
  runs: [
    rows([
      [1, null, "Unkillable FC", "Ha-eun Seo", "Faker", 112, 341],
      [2, 3, "Bang Bang Bot", "Marco Ruiz", "Ruler", 121, 338],
      [3, -1, "Faker's Fan Club", "Yuna Choi", "Faker", 88, 336],
      [4, -1, "Showmaker's Shadow", "Ben Price", "ShowMaker", 94, 333],
      [5, 2, "GenG Got Game", "Kenji Sato", "Chovy", 109, 331],
      [6, null, "Faker Ate My Homework", "Ollie Dunn", "Faker", 97, 329],
      [7, -2, "Viper's Nest", "Mina Lee", "Viper", 80, 327],
    ]),
    rows([
      [MY_OVERALL.rank - 2, 6880, "Rookie Mistake", "Jon Park", "Bdd", 97, MY_SEASON_TOTAL + 1],
      [MY_OVERALL.rank - 1, 6901, "Smolder Shoulders", "Aisha Bello", "Aiming", 98, MY_SEASON_TOTAL],
      me(MY_OVERALL.rank, MY_OVERALL.move, MY_SEASON_TOTAL),
      [MY_OVERALL.rank + 1, -40, "Doran's Ring Bearer", "Tim Fox", "Doran", 52, MY_SEASON_TOTAL],
      [MY_OVERALL.rank + 2, 2114, "Moss Rock", "Ivy Moss", "Chovy", 61, MY_SEASON_TOTAL - 1],
    ]),
  ],
};

const OVERALL: LeagueView = {
  kind: "overall",
  id: "overall",
  name: "Overall",
  season: CUP,
  week: WEEK,
  carryShown: true,
  openTab: THIS_SPLIT,
  openGroup: "Legend",
  tables: {
    [COMPETITION.seasonTab]: OVERALL_STANDINGS,
    [THIS_SPLIT]: OVERALL_STANDINGS,
  },
};

/** Each league the list opens, by its id. The two general leagues past Overall have no picture yet. */
export const LEAGUES: Record<string, LeagueView> = {
  overall: OVERALL,
  "united-kingdom": { kind: "general", id: "united-kingdom", name: "United Kingdom", week: WEEK, carryShown: true, openTab: "Season", tables: {} },
  "t1-supporters": { kind: "general", id: "t1-supporters", name: "T1 supporters", week: WEEK, carryShown: true, openTab: "Season", tables: {} },
  "pub-league": PUB_LEAGUE,
  "flol-discord": FLOL_DISCORD,
};

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
export const NEW_TABLE: NewTable = { week: WEEK, carryShown: true, openTab: COMPETITION.seasonTab };

/** A league the Join picture's code finds (join.html). Its rank and size are made up. */
export const JOINABLE: PrivateEntry[] = [
  {
    summary: { id: "gank-squad", name: "Gank Squad", kind: "private", rank: 9, move: null, size: 9 },
    view: { kind: "private", id: "gank-squad", name: "Gank Squad", code: "GANK-4TQ1", scoringFrom: 2, role: "member", ...NEW_TABLE, tables: {} },
  },
];

/** Made up: the pictures draw no wrong code. */
export const NO_SUCH_CODE = "No league has that code";

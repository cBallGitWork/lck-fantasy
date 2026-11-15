// The Leagues picture's own made-up moment (docs/design/approved/leagues/): Split 2, Week 14, after
// the deadline, so Carry shows. Names and numbers are examples, not roster data. The sample manager
// is week3.ts's. The backend feeds each of these once it is wired (#38).

import { MANAGER } from "../../fixtures/week3";
import type { LeagueSummary, LeagueView, StandingRow } from "./types";

const SEASON = "LCK 2027";
const WEEK = 14;

/** The league a bare /leagues opens, as the picture does. */
export const OPEN_LEAGUE_ID = "pub-league";

export const LEAGUE_LIST: LeagueSummary[] = [
  { id: "overall", name: "Overall", kind: "general", rank: 48211, move: 6904, size: 212480 },
  { id: "united-kingdom", name: "United Kingdom", kind: "general", rank: 1402, move: 233, size: 9377 },
  { id: "t1-supporters", name: "T1 supporters", kind: "general", rank: 3118, move: 510, size: 41902 },
  { id: "pub-league", name: "Pub League", kind: "private", rank: 2, move: 1, size: 12 },
  { id: "flol-discord", name: "Flol Discord", kind: "private", rank: 14, move: -2, size: 86 },
];

type Line = [rank: number, move: number | null, team: string, manager: string, carry: string, week: number, total: number, split?: number];

/** A table's rows from the picture's lines; the sample manager's row is marked yours. */
function rows(lines: Line[], chase: StandingRow["chase"] = null): StandingRow[] {
  return lines.map(([rank, move, team, manager, carry, week, total, split]) => {
    const mine = team === MANAGER.team;
    return { rank, move, team, manager, managerId: manager.toLowerCase().replace(/\W+/g, "-"), carry, week, total, split, mine, chase: mine ? chase : null };
  });
}

const me = (rank: number, move: number | null, week: number, total: number, split?: number): Line => [rank, move, MANAGER.team, MANAGER.name, "Faker", week, total, split];

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
            [1, null, "Kiin Bean", "Tom Reid", "Chovy", 61, 1214],
            me(2, 1, 98, 1198),
            [3, -1, "Chovy Was Right There", "Minji Park", "Chovy", 54, 1187],
            [4, 2, "Peanut Butter Gank", "Dan Okafor", "Peyz", 77, 1160],
            [5, null, "Deft Tomorrow", "Jae Kim", "Ruler", 66, 1151],
            [6, -2, "Guma Gang", "Sam Hill", "Gumayusi", 49, 1139],
            [7, 1, "Zeus Juice", "Priya Shah", "Zeus", 70, 1122],
            [8, -1, "Smeb Nostalgia", "Liam Byrne", "Kiin", 58, 1108],
            [9, null, "Ruler of None", "Ella Wong", "Aiming", 63, 1097],
            [10, 1, "BeryL Backup Plan", "Joe Grant", "Keria", 72, 1080],
            [11, -1, "Ambition FC", "Chris Lee", "Canyon", 41, 1052],
            [12, null, "Gank Plank", "Ruth Ade", "Faker", 55, 1019],
          ],
          { kind: "chasing", points: 16, rank: 1 },
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
          [1, 2, "Canyon Diff", "Hye-jin Lim", "Canyon", 104, 1402],
          [2, -1, "Smash Mouth Kiin", "Leo Grant", "Kiin", 88, 1377],
          [3, null, "Ward Hoarders", "Ama Owusu", "Keria", 91, 1360],
          [4, 1, "Lehends Never Die", "Rui Tan", "Faker", 79, 1341],
          [5, -2, "T1 Til I Die", "Nadia Khan", "Faker", 70, 1330],
        ]),
        rows(
          [
            [12, 3, "Bdd Wolf", "Owen Shaw", "Bdd", 81, 1214],
            [13, null, "Siwoo Sweep", "Mei Lin", "Chovy", 64, 1209],
            me(14, -2, 98, 1198),
            [15, 1, "Oner Way Ticket", "Sean Doyle", "Oner", 77, 1190],
            [16, -1, "Clid Was Here", "Ines Silva", "Viper", 52, 1186],
          ],
          { kind: "chasing", points: 11, rank: 13 },
        ),
      ],
    },
  },
};

const OVERALL: LeagueView = {
  kind: "overall",
  id: "overall",
  name: "Overall",
  season: SEASON,
  week: WEEK,
  carryShown: true,
  openTab: "Split 2",
  openGroup: "Legend",
  tables: {
    "Split 2/Legend": {
      pages: 1063,
      splitColumn: true,
      runs: [
        rows([
          [1, null, "Unkillable FC", "Ha-eun Seo", "Faker", 112, 1642, 402],
          [2, 3, "Bang Bang Bot", "Marco Ruiz", "Ruler", 121, 1631, 415],
          [3, -1, "Faker's Fan Club", "Yuna Choi", "Faker", 88, 1628, 377],
          [4, -1, "Showmaker's Shadow", "Ben Price", "ShowMaker", 94, 1619, 390],
          [5, 2, "GenG Got Game", "Kenji Sato", "Chovy", 109, 1611, 398],
          [6, null, "Faker Ate My Homework", "Ollie Dunn", "Faker", 97, 1604, 371],
          [7, -2, "Viper's Nest", "Mina Lee", "Viper", 80, 1598, 366],
        ]),
        rows([
          [48209, 6880, "Rookie Mistake", "Jon Park", "Bdd", 97, 1199, 301],
          [48210, 6901, "Smolder Shoulders", "Aisha Bello", "Aiming", 98, 1198, 298],
          me(48211, 6904, 98, 1198, 298),
          [48212, -40, "Doran's Ring Bearer", "Tim Fox", "Doran", 52, 1198, 298],
          [48213, 2114, "Kiin Bean", "Tom Reid", "Chovy", 61, 1197, 260],
        ]),
      ],
    },
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

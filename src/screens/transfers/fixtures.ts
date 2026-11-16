// The Transfers picture's moment (transfers.html): Week 4, Tuesday night before the deadline,
// Siwoo sold and Kingen bought into the Flex at −6. Built on the shared made-up week
// (src/fixtures/week3.ts); the list's players and the week's confirms are the picture's own.

import { opponent, seriesOf } from "../../fixtures/series";
import {
  COMPETITION,
  finalPickOf,
  HIT_POINTS,
  MANAGER,
  PICK_TEAM_SQUAD,
  playerId,
  rawWeekOf,
  statsOf,
  STATS_PLAYERS,
  TEAM_CAP,
  WEEK4_DEADLINE,
  WEEK4_FREE_TRANSFERS,
  WEEK4_SERIES,
  type TeamCode,
} from "../../fixtures/week3";
import { mToWon } from "../../parts";
import type { Confirm, Fixture, ListPlayer, Plan, SquadPlayer, TransferRules } from "./plan";
import type { TransfersPageProps } from "./TransfersPage";


const TEAMS_PLAYING = [...new Set(WEEK4_SERIES.flatMap((s) => [s.home, s.away]))];

/** Each team's opponents this week, in order, with the day. */
const FIXTURES: Record<string, Fixture[]> = Object.fromEntries(
  TEAMS_PLAYING.map((team) => [
    team,
    seriesOf(WEEK4_SERIES, team).map((s) => ({ against: opponent(s, team), day: s.day })),
  ]),
);

/** Baron Steal FC before this week's unconfirmed changes (pick.html's squad and prices); owned %, season and Week 3 as Stats and Points give them. */
export const SQUAD: SquadPlayer[] = PICK_TEAM_SQUAD.map((p) => ({
  slot: p.slot,
  id: playerId(p.name),
  name: p.name,
  team: p.team,
  role: p.role,
  price: mToWon(p.priceM),
  weekPoints: rawWeekOf(finalPickOf(p.name)),
  form: p.form,
  points: statsOf(p.name).points,
  ownedPct: statsOf(p.name).ownedPct,
  mark: p.mark,
}));

/** A made-up list player; his form and last week's points follow from his season points. */
const player = (role: ListPlayer["role"], name: string, team: TeamCode, priceM: number, points: number, ownedPct: number): ListPlayer => ({
  id: playerId(name),
  name,
  team,
  role,
  price: mToWon(priceM),
  weekPoints: Math.round(points / 3),
  form: Math.round((points / 3) * 10) / 10,
  points,
  ownedPct,
});

/** A player in Stats' list, with its price, season points and owned %. */
const listed = (name: string) => {
  const p = statsOf(name);
  return player(p.role, p.name, p.team, p.priceM, p.points, p.ownedPct);
};

/** The picture's list (Stats' figures where Stats lists him), and Stats' coaches so the Coach can be sold too. */
export const PLAYERS: ListPlayer[] = [
  listed("Chovy"),
  listed("Keria"),
  listed("Aiming"),
  listed("ShowMaker"),
  listed("Lucid"),
  listed("Kingen"),
  listed("PerfecT"),
  listed("DuDu"),
  listed("Hype"),
  listed("Clear"),
  listed("Clozer"),
  listed("Pollu"),
  ...STATS_PLAYERS.filter((p) => p.role === "coach" && !SQUAD.some((s) => s.name === p.name)).map((p) =>
    player("coach", p.name, p.team, p.priceM, p.points, p.ownedPct),
  ),
];

/** The week's confirms, newest first. */
export const CONFIRMS: Confirm[] = [
  { id: "c2", local: "Tue 21:10", kst: "06:10", moves: [{ out: "Kiin", in: "Zeus" }], hit: HIT_POINTS },
  {
    id: "c1",
    local: "Mon 18:02",
    kst: "03:02",
    moves: [
      { out: "Peyz", in: "Ruler" },
      { out: "Lehends", in: "Delight" },
    ],
    hit: 0,
  },
];

/** Free transfers left: the week's, less every move confirmed so far. */
const freeLeft = Math.max(0, WEEK4_FREE_TRANSFERS - CONFIRMS.reduce((n, c) => n + c.moves.length, 0));

export const RULES: TransferRules = { freeTransfers: freeLeft, hitPoints: HIT_POINTS, teamCap: TEAM_CAP, bank: mToWon(0.5) };

/** Siwoo sold, Kingen in. */
export const PICTURE_PLAN: Plan = { sold: { flex: PLAYERS.find((p) => p.name === "Kingen") ?? null }, replacing: null };

/** Everything the picture shows, as the page's props. */
export const TRANSFERS_PICTURE: TransfersPageProps = {
  account: MANAGER.team,
  competition: COMPETITION,
  week: "Week 4",
  lastWeek: "Wk 3",
  deadline: WEEK4_DEADLINE,
  squad: SQUAD,
  players: PLAYERS,
  rules: RULES,
  confirms: CONFIRMS,
  fixtures: FIXTURES,
  teams: TEAMS_PLAYING,
  buffs: ["Remake", "Limitless"],
  initialPlan: PICTURE_PLAN,
};

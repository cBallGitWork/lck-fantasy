// The Transfers picture's moment (transfers.html): Week 4, Tuesday night before the deadline,
// Siwoo sold and Kingen bought into the Flex at −6. Built on the shared made-up week
// (src/fixtures/week3.ts); the list's players and the week's confirms are the picture's own.

import { opponent, seriesOf } from "../../fixtures/series";
import { COMPETITION, MANAGER, PICK_TEAM_SQUAD, playerId, STATS_PLAYERS, WEEK4_DEADLINE, WEEK4_SERIES, type TeamCode } from "../../fixtures/week3";
import { eokToWon } from "../../parts";
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

/** Owned % for the squad: Stats' figure where Stats shows him, else the picture's made-up one. */
const SQUAD_OWNED: Record<string, number> = { Bdd: 5, Cuzz: 7 };
const ownedOf = (name: string) => STATS_PLAYERS.find((p) => p.name === name)?.ownedPct ?? SQUAD_OWNED[name] ?? 0;

/** Baron Steal FC before this week's unconfirmed changes (pick.html's squad and prices). */
export const SQUAD: SquadPlayer[] = PICK_TEAM_SQUAD.map((p) => ({
  slot: p.slot,
  id: playerId(p.name),
  name: p.name,
  team: p.team,
  role: p.role,
  price: eokToWon(p.priceEok),
  ownedPct: ownedOf(p.name),
  mark: p.mark,
}));

const player = (role: ListPlayer["role"], name: string, team: TeamCode, priceEok: number, points: number, ownedPct: number, move: ListPlayer["move"] = 0): ListPlayer => ({
  id: playerId(name),
  name,
  team,
  role,
  price: eokToWon(priceEok),
  move,
  points,
  ownedPct,
});

/** The picture's list, and Stats' coaches so the Coach can be sold too. */
export const PLAYERS: ListPlayer[] = [
  player("mid", "Chovy", "GEN", 17.5, 61, 41, 1),
  player("sup", "Keria", "T1", 12.0, 52, 47),
  player("bot", "Aiming", "DK", 11.5, 46, 14, -1),
  player("mid", "ShowMaker", "DK", 10.5, 44, 18),
  player("jng", "Lucid", "DK", 9.0, 41, 11, 1),
  player("top", "Kingen", "NS", 6.5, 38, 9, 1),
  player("top", "PerfecT", "KT", 7.0, 36, 4),
  player("top", "DuDu", "DNS", 6.0, 33, 6, -1),
  player("bot", "Hype", "KRX", 5.5, 31, 4, 1),
  player("top", "Clear", "BFX", 5.5, 29, 3, -1),
  player("mid", "Clozer", "BRO", 5.0, 27, 5),
  player("sup", "Pollu", "BRO", 4.5, 26, 2),
  ...STATS_PLAYERS.filter((p) => p.role === "coach" && !SQUAD.some((s) => s.name === p.name)).map((p) =>
    player("coach", p.name, p.team, p.priceEok, p.points, p.ownedPct, p.move),
  ),
];

export const RULES: TransferRules = { freeTransfers: 0, hitPoints: 6, teamCap: 2, bank: eokToWon(0.5) };

/** The week's confirms, newest first. */
export const CONFIRMS: Confirm[] = [
  { id: "c2", local: "Tue 21:10", kst: "06:10", moves: [{ out: "Kiin", in: "Zeus" }], hit: 6 },
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

/** Siwoo sold, Kingen in. */
export const PICTURE_PLAN: Plan = { sold: { flex: PLAYERS.find((p) => p.name === "Kingen") ?? null }, replacing: "flex" };

/** Everything the picture shows, as the page's props. */
export const TRANSFERS_PICTURE: TransfersPageProps = {
  account: MANAGER.team,
  competition: COMPETITION,
  week: "Week 4",
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

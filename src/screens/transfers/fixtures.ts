// The Transfers picture's moment (transfers.html): Week 4, Tuesday night before the deadline,
// Siwoo sold and Kingen bought into the Flex at −6. Built on the shared made-up week
// (src/fixtures/week3.ts); the list's players and the week's confirms are the picture's own.

import { opponent, seriesOf } from "../../fixtures/series";
import {
  COMPETITION,
  finalPickOf,
  formOf,
  HIT_POINTS,
  MANAGER,
  OFF_PAGE_PLAYERS,
  PICK_TEAM_SQUAD,
  playerId,
  rawWeekOf,
  statsOf,
  STATS_PLAYERS,
  TEAM_CAP,
  WEEK1_SERIES,
  WEEK2_SERIES,
  WEEK3_SERIES_FINAL,
  WEEK4_DEADLINE,
  WEEK4_FREE_TRANSFERS,
  WEEK4_SERIES,
  type StatsPlayer,
  type TeamCode,
} from "../../fixtures/week3";
import { mToWon, sum } from "../../parts";
import { SEASON_PLAYERS } from "../stats/fixtures";
import type { CardFacts } from "./card";
import type { Confirm, Fixture, ListPlayer, Plan, SquadPlayer, TransferRules } from "./plan";
import type { TransfersPageProps } from "./TransfersPage";


const TEAMS_PLAYING = [...new Set(WEEK4_SERIES.flatMap((s) => [s.home, s.away]))];

/** Each team's opponents this week, in order, with the day. */
const FIXTURES: Record<string, Fixture[]> = Object.fromEntries(
  TEAMS_PLAYING.map((team) => [
    team,
    seriesOf(WEEK4_SERIES, team).map((s) => ({ opponent: opponent(s, team), day: s.day })),
  ]),
);

/** Baron Steal FC before this week's unconfirmed changes (pick.html's squad and prices); owned %, season and Week 3 as Stats and Points give them. */
export const SQUAD: SquadPlayer[] = PICK_TEAM_SQUAD.map((p) => ({
  slot: p.slot,
  id: playerId(p.name),
  name: p.name,
  team: p.team,
  role: p.role,
  priceWon: mToWon(p.priceM),
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
  priceWon: mToWon(priceM),
  weekPoints: Math.round(points / 3),
  form: formOf(points),
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
  listed("Oner"),
  listed("Lehends"),
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
  { id: "c2", local: "Tue 9:10pm", moves: [{ out: "Kiin", in: "Zeus" }], hit: HIT_POINTS },
  {
    id: "c1",
    local: "Mon 6:02pm",
    moves: [
      { out: "Peyz", in: "Ruler" },
      { out: "Lehends", in: "Delight" },
    ],
    hit: 0,
  },
];

/** Free transfers left: the week's, less every move confirmed so far. */
const freeLeft = Math.max(0, WEEK4_FREE_TRANSFERS - sum(CONFIRMS.map((c) => c.moves.length)));

export const RULES: TransferRules = { freeTransfers: freeLeft, hitPoints: HIT_POINTS, teamCap: TEAM_CAP, bank: mToWon(0.5) };

/** Siwoo sold, Kingen in. */
export const PICTURE_PLAN: Plan = { sold: { flex: PLAYERS.find((p) => p.name === "Kingen") ?? null }, replacing: null };

/** Every made-up player and coach, so a card's ranks are among his whole role. */
const EVERYONE = [...STATS_PLAYERS, ...OFF_PAGE_PLAYERS];

/** Where a figure ranks among his role: 1st for the most. */
function rankAmong(name: string, figure: (p: StatsPlayer) => number): number {
  const me = statsOf(name);
  return 1 + EVERYONE.filter((p) => p.role === me.role && figure(p) > figure(me)).length;
}

/** Weeks 1 to 3, final: the series a card's last 3 come from. */
const PLAYED = [...WEEK1_SERIES, ...WEEK2_SERIES, ...WEEK3_SERIES_FINAL];

/** Week 5's first series for each team, made up, so every card has its next 3. */
const WEEK5_FIRST: { teams: [TeamCode, TeamCode]; day: string }[] = [
  { teams: ["T1", "DK"], day: "Wed" },
  { teams: ["NS", "KRX"], day: "Wed" },
  { teams: ["KT", "BRO"], day: "Thu" },
  { teams: ["HLE", "GEN"], day: "Thu" },
  { teams: ["DNS", "BFX"], day: "Fri" },
];

/** His season points spread over his team's series so far, the odd ones to the latest; made up. */
function last3Of(name: string, team: string): CardFacts["last3"] {
  const series = seriesOf(PLAYED, team);
  const { points } = statsOf(name);
  const each = Math.floor(points / series.length);
  const extra = points % series.length;
  return series.map((s, i) => ({ points: each + (i >= series.length - extra ? 1 : 0), opponent: opponent(s, team) })).slice(-3);
}

/** His next 3: the week's series, then Week 5's first. */
function next3Of(team: string): CardFacts["next3"] {
  const week4 = seriesOf(WEEK4_SERIES, team).map((s) => ({ opponent: opponent(s, team), day: s.day }));
  const week5 = WEEK5_FIRST.filter((s) => s.teams.includes(team as TeamCode)).map((s) => ({ opponent: s.teams.find((t) => t !== team) ?? team, day: s.day }));
  return [...week4, ...week5].slice(0, 3);
}

/** A person's card figures: Stats' season lines for a player, his ranks among his role, his series. */
function cardOf(p: ListPlayer): CardFacts {
  const row = p.role === "coach" ? undefined : SEASON_PLAYERS.find((s) => s.name === p.name);
  const line = (key: string) => {
    const value = row?.lines[key];
    if (value === undefined) throw new Error(`No ${key} line for ${p.name}`);
    return value;
  };
  return {
    among: EVERYONE.filter((o) => o.role === p.role).length,
    pointsRank: rankAmong(p.name, (o) => o.points),
    ownedRank: rankAmong(p.name, (o) => o.ownedPct),
    season: row && {
      games: row.games,
      kills: line("kills"),
      deaths: line("deaths"),
      assists: line("assists"),
      goldLead: line("gd15"),
      soloKills: line("soloKills"),
      firstBlood: line("firstBlood"),
    },
    last3: last3Of(p.name, p.team),
    next3: next3Of(p.team),
  };
}

/** Everything the picture shows, as the page's props. */
export const TRANSFERS_PICTURE: TransfersPageProps = {
  account: MANAGER.team,
  competition: COMPETITION,
  week: "Week 4",
  lastWeek: 3,
  deadline: WEEK4_DEADLINE,
  squad: SQUAD,
  players: PLAYERS,
  rules: RULES,
  confirms: CONFIRMS,
  fixtures: FIXTURES,
  teams: TEAMS_PLAYING,
  initialPlan: PICTURE_PLAN,
  cards: Object.fromEntries([...SQUAD, ...PLAYERS].map((p) => [p.id, cardOf(p)])),
};

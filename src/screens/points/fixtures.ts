// Points' own made-up data: Weeks 1 and 2 final, and Week 3 at the picture's moment
// (docs/design/approved/points/points.html), built on src/fixtures/week3.ts, Week 3's games included.
// It stands in for the backend until a later issue wires real data (series and games #36,
// live points #34, final points and ranks #33).

import type { Ownership } from "../../../convex/gameweeks/starAndFlop";
import { pickFlop, pickKillers, pickStars } from "../../../convex/gameweeks/yourWeek";
import { CAPTAIN_MULTIPLIER, YOUR_WEEK_PICKS } from "../../fixtures/competition";
import { MY_LEAGUES, MY_OVERALL } from "../../fixtures/myLeagues";
import { playedFromSide, seriesById } from "../../fixtures/series";
import {
  captained,
  COMPETITION,
  countedGames,
  gameAt,
  MANAGER,
  playerId,
  POINTS_SQUAD,
  POINTS_WEEK,
  seriesPoints,
  squadIn,
  WEEK1_PLAYED,
  WEEK1_SERIES,
  WEEK2_PLAYED,
  WEEK2_SERIES,
  WEEK3_GAMES,
  WEEK3_SERIES_AT_POINTS,
  type GameDetail,
  type Played,
  type PointsPick,
  type Series,
} from "../../fixtures/week3";
import { count, ordinal, sum, weekSteps } from "../../parts";
import { PATHS, type Go } from "../../paths";
import { flexPlays } from "../../rift";
import { statsOf } from "../../fixtures/players";
import { hangulOf } from "../../fixtures/rosters";
import type { PointsData, PointsPlayer, PointsSeries, PointsStarter, WeekPick } from "./types";

function seriesOf(list: readonly Series[], pick: PointsPick, played: Played[number], details: GameDetail[] = []): PointsSeries {
  const row = seriesById(list, played.id);
  const side = playedFromSide(row, pick.team);
  const counted = countedGames(played.games);
  const games = played.games.map((points, index) => {
    const { won, clock } = gameAt(row, index, pick.team);
    return {
      game: index + 1,
      champion: details[index]?.champion,
      kda: details[index]?.kda,
      lines: details[index]?.lines ?? [],
      won,
      clock,
      points,
      counted: counted.has(index),
    };
  });
  return {
    id: row.id,
    day: row.day,
    opponent: side.opponent,
    score: side.score,
    state: row.state,
    coachResult: played.coachResult,
    points: seriesPoints(played.games, played.coachResult),
    games,
  };
}

function playerOf(list: readonly Series[], pick: PointsPick, games: Record<string, GameDetail[][]>): PointsPlayer {
  const series = pick.series.map((played, i) => seriesOf(list, pick, played, games[pick.name]?.[i]));
  return {
    name: pick.name,
    hangul: hangulOf(pick.name),
    team: pick.team,
    role: pick.role,
    cardId: playerId(pick.name),
    mark: pick.mark,
    birthday: pick.birthday,
    points: pick.subbedOut ? undefined : sum(series.map((s) => s.points)),
    // No week here plays a Bench Boost or makes an auto-sub, so only the seven count.
    counts: pick.slot !== "bench",
    series,
  };
}

/** Effective ownership % of the seven starters, the same each week. */
const OWNED_PCT: Record<string, number> = { Zeus: 30, Canyon: 38, Faker: 46, Ruler: 35, Delight: 12, Siwoo: 6, kkOma: 18 };

/** A player you don't own, as a week's Killers are picked from. */
interface Other {
  name: string;
  points: number;
  ownedPct: number;
}

/** Your week (spec/12, Points, Your own week): the backend's own picks, run on the week's figures. */
function yourWeekOf(played: readonly PointsStarter[], others: readonly Other[]): WeekPick[] {
  const teamOf = (name: string) => played.find((p) => p.name === name)?.team ?? statsOf(name).team;
  const row = (name: string, points: number, ownedPct: number): Ownership => ({ key: name, points, effectiveOwnership: ownedPct / 100 });
  const mine = played.map((p) => {
    const ownedPct = OWNED_PCT[p.name];
    if (ownedPct === undefined || p.points === undefined) throw new Error(`No Your week figures for ${p.name}`);
    return row(p.name, p.points, ownedPct);
  });
  const line = (label: WeekPick["label"]) => (one: Ownership): WeekPick => ({
    label,
    name: one.key,
    team: teamOf(one.key),
    points: one.points,
    ownedPct: Math.round(one.effectiveOwnership * 100),
  });
  const flop = pickFlop(mine);
  if (!flop) throw new Error("A week with no starter who played");
  return [
    ...pickStars(mine, YOUR_WEEK_PICKS).map(line("Star")),
    line("Flop")(flop),
    ...pickKillers(others.map((o) => row(o.name, o.points, o.ownedPct)), YOUR_WEEK_PICKS).map(line("Killer")),
  ];
}

/** What a week adds to its series and squad: its head's figures, the average Captain and the players you don't own. */
interface WeekFacts {
  week: number;
  series: readonly Series[];
  squad: PointsPick[];
  average: number;
  highest: number;
  averageCaptain: number;
  /** The players you don't own who scored: the Killers' field. */
  others: Other[];
  /** Each game's champion, K/D/A and lines, where the week has them. */
  games?: Record<string, GameDetail[][]>;
}

/** The weeks Points can show, first to latest; the latest is where `/points` opens. */
const WEEKS: WeekFacts[] = [
  {
    week: 1,
    series: WEEK1_SERIES,
    squad: squadIn(WEEK1_PLAYED),
    average: 61,
    highest: 118,
    averageCaptain: 20,
    others: [
      { name: "Chovy", points: 22, ownedPct: 41 },
      { name: "Peyz", points: 14, ownedPct: 28 },
      { name: "Kiin", points: 11, ownedPct: 33 },
      { name: "Zeka", points: 9, ownedPct: 22 },
    ],
  },
  {
    week: 2,
    series: WEEK2_SERIES,
    squad: squadIn(WEEK2_PLAYED),
    average: 70,
    highest: 124,
    averageCaptain: 23,
    others: [
      { name: "Peyz", points: 19, ownedPct: 28 },
      { name: "Zeka", points: 16, ownedPct: 22 },
      { name: "Chovy", points: 12, ownedPct: 41 },
      { name: "Kiin", points: 8, ownedPct: 33 },
    ],
  },
  {
    week: POINTS_WEEK.week,
    series: WEEK3_SERIES_AT_POINTS,
    squad: POINTS_SQUAD,
    average: POINTS_WEEK.average,
    highest: POINTS_WEEK.highest,
    averageCaptain: 19,
    // Peyz, 20 at 5%, is no Killer: Chovy, Zeka and Kiin each hurt more (spec/12).
    others: [
      { name: "Chovy", points: 15, ownedPct: 41 },
      { name: "Zeka", points: 14, ownedPct: 22 },
      { name: "Kiin", points: 12, ownedPct: 33 },
      { name: "Peyz", points: 20, ownedPct: 5 },
    ],
    games: WEEK3_GAMES,
  },
];

/** The week's ‹ and ›, by the router: the week in the path (`/points/2`). */
function weekNav(week: number, latest: number) {
  const to = (n: number): Go => ({ to: PATHS.pointsWeek, params: { week: String(n) } });
  return { label: `${COMPETITION} Week ${week}`, ...weekSteps(week, latest, to) };
}

function pointsWeek(facts: WeekFacts, latest: number): PointsData {
  const { series: list, squad, games = {} } = facts;
  const starters = squad.flatMap((pick): PointsStarter[] => {
    if (pick.slot === "bench") return [];
    const player = playerOf(list, pick, games);
    const plays = flexPlays(pick.slot, pick.role);
    if (pick.mark !== "C") return [{ ...player, slot: pick.slot, plays }];
    // The Captain's points ×1.5, a minus towards zero (spec/05-scoring.md); his own are already the result.
    if (player.points === undefined) return [{ ...player, slot: pick.slot, plays }];
    const captain = { before: player.points, by: CAPTAIN_MULTIPLIER, average: facts.averageCaptain };
    return [{ ...player, slot: pick.slot, plays, points: captained(player.points), captain }];
  });
  const live = list.find((s) => s.state === "live");
  return {
    team: MANAGER.team,
    hangul: MANAGER.hangul,
    week: weekNav(facts.week, latest),
    total: sum(starters.map((p) => p.points ?? 0)),
    final: list.every((s) => s.state === "final"),
    average: facts.average,
    highest: facts.highest,
    live: live?.liveGame ? { home: live.home, away: live.away, game: live.liveGame } : undefined,
    starters,
    bench: squad.filter((p) => p.slot === "bench").map((p) => playerOf(list, p, games)),
    yourWeek: yourWeekOf(starters.filter((p) => p.points !== undefined), facts.others),
    leagues: [
      { name: "Overall", tier: MY_OVERALL.tier, rank: count(MY_OVERALL.rank), move: MY_OVERALL.move },
      ...MY_LEAGUES.map((l) => ({ name: l.name, rank: l.kind === "private" ? ordinal(l.rank) : count(l.rank), move: l.move })),
    ],
    tierGaps: { promote: { points: 6, tier: { tier: "diamond", division: 4 } }, demote: { points: 5, tier: { tier: "emerald", division: 2 } } },
    series: list,
  };
}

/** The latest week, where `/points` opens. */
export const LATEST_WEEK = Math.max(...WEEKS.map((w) => w.week));

/** Points by week number, Weeks 1 to the latest. */
export const POINTS_WEEKS: ReadonlyMap<number, PointsData> = new Map(WEEKS.map((w) => [w.week, pointsWeek(w, LATEST_WEEK)]));

/** The latest week: Week 3 at the picture's moment. */
export const POINTS_FIXTURE: PointsData = (() => {
  const latest = POINTS_WEEKS.get(LATEST_WEEK);
  if (!latest) throw new Error("No latest Points week");
  return latest;
})();

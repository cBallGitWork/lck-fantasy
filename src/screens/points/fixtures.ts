// Points' own made-up data: Weeks 1 and 2 final, and Week 3 at the picture's moment
// (docs/design/approved/points/points.html), built on src/fixtures/week3.ts, Week 3's games included.
// It stands in for the backend until a later issue wires real data (series and games #36,
// live points #34, final points and ranks #33).

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
import { count, ordinal, sum } from "../../parts";
import { PATHS } from "../../paths";
import { flexPlays } from "../../rift";
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
    series,
  };
}

/** Owned % of the players a week's Star or Flop can be. */
const OWNED_PCT: Record<string, number> = { Faker: 46, Siwoo: 6, Delight: 18 };

function mine(label: string, p: PointsStarter): WeekPick {
  const ownedPct = OWNED_PCT[p.name];
  if (ownedPct === undefined || p.points === undefined) throw new Error(`No ${label} figures for ${p.name}`);
  return { label, name: p.name, points: p.points, ownedPct, mine: true };
}

/** What a week adds to its series and squad: its head's figures, the average Captain and the Killer. */
interface WeekFacts {
  week: number;
  series: readonly Series[];
  squad: PointsPick[];
  average: number;
  highest: number;
  averageCaptain: number;
  killer: { name: string; points: number; ownedPct: number };
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
    killer: { name: "Chovy", points: 22, ownedPct: 41 },
  },
  {
    week: 2,
    series: WEEK2_SERIES,
    squad: squadIn(WEEK2_PLAYED),
    average: 70,
    highest: 124,
    averageCaptain: 23,
    killer: { name: "Peyz", points: 19, ownedPct: 28 },
  },
  {
    week: POINTS_WEEK.week,
    series: WEEK3_SERIES_AT_POINTS,
    squad: POINTS_SQUAD,
    average: POINTS_WEEK.average,
    highest: POINTS_WEEK.highest,
    averageCaptain: 19,
    killer: { name: "Chovy", points: 15, ownedPct: 41 },
    games: WEEK3_GAMES,
  },
];

/** The competition's first week: no ‹ before it. */
const FIRST_WEEK = 1;

/** The week's ‹ and ›, by the router: the week in the path (`/points/2`); none before Week 1 or past the latest. */
function weekNav(week: number, latest: number) {
  const to = (n: number) => ({ to: PATHS.pointsWeek, params: { week: String(n) } });
  return {
    label: `${COMPETITION} · Week ${week}`,
    prev: week > FIRST_WEEK ? to(week - 1) : undefined,
    next: week < latest ? to(week + 1) : undefined,
  };
}

function pointsWeek(facts: WeekFacts, latest: number): PointsData {
  const { series: list, squad, games = {} } = facts;
  const starters = squad.flatMap((pick): PointsStarter[] => {
    if (pick.slot === "bench") return [];
    const player = playerOf(list, pick, games);
    const plays = flexPlays(pick.slot, pick.role);
    if (pick.mark !== "C") return [{ ...player, slot: pick.slot, plays }];
    // The Captain's points ×1.5, a minus towards zero (spec/05-scoring.md); his own are already the result.
    const points = player.points === undefined ? undefined : captained(player.points);
    return [{ ...player, slot: pick.slot, plays, points, captain: { average: facts.averageCaptain } }];
  });
  const played = starters.filter((p) => p.points !== undefined);
  const byPoints = [...played].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  const star = byPoints[0];
  const flop = byPoints[byPoints.length - 1];
  if (!star || !flop) throw new Error(`Week ${facts.week} has no starter who played`);
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
    yourWeek: [mine("Star", star), mine("Flop", flop), { label: "Killer", ...facts.killer, mine: false }],
    leagues: [
      { name: `Overall · ${MY_OVERALL.tier}`, rank: count(MY_OVERALL.rank), move: MY_OVERALL.move },
      ...MY_LEAGUES.map((l) => ({ name: l.name, rank: l.kind === "private" ? ordinal(l.rank) : count(l.rank), move: l.move })),
    ],
    nextTier: { points: 6, tier: "Diamond IV" },
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

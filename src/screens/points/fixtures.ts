// Points' own made-up data: Week 3 at the picture's moment (docs/design/approved/points/points.html),
// built on src/fixtures/week3.ts. It stands in for the backend until a later issue wires real data
// (series and games #36, live points #34, final points and ranks #33). The champions and each game's
// winner are made up, to fit the week's scores.

import { MY_LEAGUES, MY_OVERALL } from "../../fixtures/myLeagues";
import { fromSide, seriesById } from "../../fixtures/series";
import { COMPETITION, countedGames, livePointsOf, MANAGER, playerId, POINTS_SQUAD, POINTS_WEEK, seriesPoints, WEEK3_SERIES_AT_POINTS, type PointsPick, type TeamCode } from "../../fixtures/week3";
import { count, ordinal } from "../../parts";
import { PATHS } from "../../paths";
import { flexPlays, type SlotKey } from "../../rift";
import type { PointsData, PointsPlayer, PointsSeries, PointsStarter } from "./types";

/** Each game's winner, in each series of the week that a squad member played. */
const GAME_WINNERS: Record<string, TeamCode[]> = {
  "w3-wed-1": ["T1", "HLE", "T1"],
  "w3-wed-2": ["GEN", "GEN"],
  "w3-thu-1": ["DK", "DK"],
  "w3-fri-1": ["KT", "BFX", "KT"],
  "w3-sat-1": ["GEN", "HLE", "GEN"],
  "w3-sat-2": ["T1"],
};

/** Each player's champions, series by series, in the order he played them. The Coach has none. */
const CHAMPIONS: Record<string, string[][]> = {
  Zeus: [["Jax", "Gnar", "Rumble"], ["Aatrox", "Renekton", "Jayce"]],
  Canyon: [["Vi", "Sejuani"], ["Xin Zhao", "Maokai", "Lee Sin"]],
  Faker: [["Azir", "Taliyah", "Galio"], ["Orianna", "Sylas"]],
  Ruler: [["Kai'Sa", "Varus"], ["Ezreal", "Jinx", "Xayah"]],
  Delight: [["Rakan", "Nautilus", "Alistar"], ["Rell", "Leona", "Braum"]],
  Siwoo: [["Gragas", "Ornn"], ["K'Sante", "Rumble"]],
  Cuzz: [["Viego", "Xin Zhao"], ["Sejuani", "Vi", "Maokai"]],
};

function seriesOf(pick: PointsPick, played: PointsPick["series"][number], champions: string[] = []): PointsSeries {
  const row = seriesById(WEEK3_SERIES_AT_POINTS, played.id);
  const side = fromSide(row, pick.team);
  if (!side.score) throw new Error(`No played series ${played.id} in Week 3`);
  const counted = countedGames(played.games);
  const games = played.games.map((points, index) => {
    const live = row.state === "live" && index + 1 === row.liveGame;
    const winner = GAME_WINNERS[played.id]?.[index];
    return {
      game: index + 1,
      champion: champions[index],
      won: live || !winner ? undefined : winner === pick.team,
      clock: live ? row.clock : undefined,
      points,
      counted: counted.has(index),
    };
  });
  return {
    id: row.id,
    opponent: side.opponent,
    score: side.score,
    state: row.state,
    points: seriesPoints(played.games, played.coachResult),
    games,
  };
}

function playerOf(pick: PointsPick): PointsPlayer {
  const series = pick.series.map((played, i) => seriesOf(pick, played, CHAMPIONS[pick.name]?.[i]));
  return {
    name: pick.name,
    team: pick.team,
    role: pick.role,
    cardId: playerId(pick.name),
    mark: pick.mark,
    birthday: pick.birthday,
    points: pick.subbedOut ? undefined : series.reduce((sum, s) => sum + s.points, 0),
    series,
  };
}

/** The Carry's week as the picture shows it: 25 (17 before ×1.5), the average Carry 19. */
const CARRY = { points: livePointsOf(playerId("Faker")), average: 19 } as const;

function starterOf(pick: PointsPick, slot: SlotKey): PointsStarter {
  const player = playerOf(pick);
  const plays = flexPlays(slot, pick.role);
  if (pick.mark !== "C") return { ...player, slot, plays };
  const { points, ...carry } = CARRY;
  return { ...player, slot, plays, points, carry };
}

const starters = POINTS_SQUAD.flatMap((pick) => (pick.slot === "bench" ? [] : [starterOf(pick, pick.slot)]));

const pointsOf = (name: string) => starters.find((p) => p.name === name)?.points ?? 0;

const live = WEEK3_SERIES_AT_POINTS.find((s) => s.state === "live");

export const POINTS_FIXTURE: PointsData = {
  team: MANAGER.team,
  hangul: MANAGER.hangul,
  week: {
    label: `${COMPETITION} · Week ${POINTS_WEEK.week}`,
    // There is no week in a Points path yet: the arrow leads to Points until a later issue adds one.
    prev: { to: PATHS.points },
  },
  total: starters.reduce((sum, p) => sum + (p.points ?? 0), 0),
  final: false,
  average: POINTS_WEEK.average,
  highest: POINTS_WEEK.highest,
  live: live?.liveGame ? { home: live.home, away: live.away, game: live.liveGame } : undefined,
  starters,
  bench: POINTS_SQUAD.filter((p) => p.slot === "bench").map(playerOf),
  yourWeek: [
    { label: "Star", name: "Faker", points: pointsOf("Faker"), ownedPct: 46, mine: true },
    { label: "Flop", name: "Siwoo", points: pointsOf("Siwoo"), ownedPct: 6, mine: true },
    { label: "Killer", name: "Chovy", points: 15, ownedPct: 41, mine: false },
  ],
  leagues: [
    { name: `Overall · ${MY_OVERALL.tier}`, rank: count(MY_OVERALL.rank), move: MY_OVERALL.move },
    ...MY_LEAGUES.map((l) => ({ name: l.name, rank: l.kind === "private" ? ordinal(l.rank) : count(l.rank), move: l.move })),
  ],
  nextTier: { points: 6, tier: "Diamond IV" },
  series: WEEK3_SERIES_AT_POINTS,
};

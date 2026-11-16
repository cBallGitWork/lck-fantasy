// Perfect game's own made-up data: Week 3, final, seen on Week 4's Tuesday (perfect.html).
// The seven and their points are the shared PERFECT_GAME; this adds what only this page shows.
// Baron Steal FC's four come from his squad's games, so they agree with Points, Live and the cards.

import {
  COMPETITION,
  countedGames,
  finalPickOf,
  MY_WEEK3,
  PERFECT_GAME,
  playerId,
  seriesPoints,
  TEAM_CAP,
  WEEK3_FINAL,
  WEEK3_SERIES_FINAL,
  type PerfectPick,
} from "../../fixtures/week3";
import type { PerfectGameData, PerfectPlayer, PlayerSeries } from "./types";

/** Faker's champions and wins, game by game, where the picture draws them; his points are the shared squad's. */
const DRAWN_GAMES: Record<string, Record<string, { champion: string; won: boolean }[]>> = {
  Faker: {
    "w3-wed-1": [
      { champion: "Azir", won: true },
      { champion: "Taliyah", won: false },
      { champion: "Galio", won: true },
    ],
    "w3-sat-2": [
      { champion: "Orianna", won: true },
      { champion: "Sylas", won: true },
    ],
  },
};

/** A starter of Baron Steal FC's: his series from the shared final squad, with the drawn games. */
function mineSeries(name: string): PlayerSeries[] {
  return finalPickOf(name).series.map(({ id, games, coachResult }) => {
    const drawn = DRAWN_GAMES[name]?.[id];
    const counted = countedGames(games);
    return {
      id,
      points: seriesPoints(games, coachResult),
      games: drawn?.map((g, i) => {
        const points = games[i];
        if (points === undefined) throw new Error(`${name} has no game ${i + 1} in ${id}`);
        return { ...g, points, counted: counted.has(i) };
      }),
    };
  });
}

/** The others' series this week, the picture's own. */
const OTHERS_SERIES: Record<string, PlayerSeries[]> = {
  Pyosik: [{ id: "w3-thu-2", points: 10 }, { id: "w3-sun-2", points: 11 }],
  Duro: [{ id: "w3-wed-2", points: 6 }, { id: "w3-sat-1", points: 5 }],
  BuLLDoG: [{ id: "w3-thu-2", points: 9 }, { id: "w3-sun-2", points: 12 }],
};

const seriesFor = (pick: PerfectPick): PlayerSeries[] => {
  if (pick.mine) return mineSeries(pick.name);
  const own = OTHERS_SERIES[pick.name];
  if (!own) throw new Error(`No Week 3 series for ${pick.name}`);
  return own;
};

export const PERFECT_PLAYERS: PerfectPlayer[] = PERFECT_GAME.map((pick) => ({ ...pick, id: playerId(pick.name), series: seriesFor(pick) }));

/** Week 3's perfect game as the picture shows it: Faker tapped. */
export const PERFECT_WEEK3: PerfectGameData = {
  week: `${COMPETITION} · Week 3`,
  final: true,
  cap: TEAM_CAP,
  ...WEEK3_FINAL,
  yours: MY_WEEK3.finalTotal,
  seriesTitle: "Week 3 series",
  players: PERFECT_PLAYERS,
  series: WEEK3_SERIES_FINAL,
};

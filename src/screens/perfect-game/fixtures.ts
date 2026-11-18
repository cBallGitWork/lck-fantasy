// Perfect game's own made-up data: Week 3, final, seen on Week 4's Tuesday (perfect.html).
// The seven and their points are the shared PERFECT_GAME; this adds what only this page shows.
// Baron Steal FC's four come from his squad's games, so they agree with Points, Live and the cards.

import {
  COMPETITION,
  countedGames,
  finalPickOf,
  MY_WEEK3,
  PERFECT_GAME,
  PERFECT_OTHERS,
  playerId,
  seriesPoints,
  WEEK3_FINAL,
  WEEK3_SERIES_FINAL,
  weekGamesOf,
  winnerOf,
  type PerfectPick,
} from "../../fixtures/week3";
import type { PerfectGameData, PerfectPlayer, PlayerSeries } from "./types";

/** Whose games the picture draws, champion and win, from every page's games (src/fixtures/games.ts). */
const DRAWN = new Set(["Faker"]);

/** A starter of Baron Steal FC's: his series from the shared final squad, with the drawn games. */
function mineSeries(name: string): PlayerSeries[] {
  const pick = finalPickOf(name);
  return pick.series.map(({ id, games, coachResult }) => {
    const counted = countedGames(games);
    return {
      id,
      points: seriesPoints(games, coachResult),
      games: DRAWN.has(name)
        ? weekGamesOf(name, id, true).map((g, i) => {
            const points = games[i];
            if (points === undefined || !g.champion) throw new Error(`${name} has no game ${i + 1} in ${id}`);
            return { champion: g.champion, won: winnerOf(id, i, true) === pick.team, points, counted: counted.has(i) };
          })
        : undefined,
    };
  });
}

const seriesFor = (pick: PerfectPick): PlayerSeries[] => {
  if (pick.mine) return mineSeries(pick.name);
  const own = PERFECT_OTHERS[pick.name];
  if (!own) throw new Error(`No Week 3 series for ${pick.name}`);
  return own;
};

const PERFECT_PLAYERS: PerfectPlayer[] = PERFECT_GAME.map((pick) => ({ ...pick, id: playerId(pick.name), series: seriesFor(pick) }));

/** Week 3's perfect game as the picture shows it: Faker tapped. */
export const PERFECT_WEEK3: PerfectGameData = {
  week: `${COMPETITION} · Week 3`,
  final: true,
  ...WEEK3_FINAL,
  yours: MY_WEEK3.finalTotal,
  seriesTitle: "Week 3 series",
  players: PERFECT_PLAYERS,
  series: WEEK3_SERIES_FINAL,
};

/** Perfect game by week number: made-up Week 3 alone until the backend picks each week's. */
export const PERFECT_WEEKS: ReadonlyMap<number, PerfectGameData> = new Map([[3, PERFECT_WEEK3]]);

/** The current week, where `/perfect-game` opens. */
export const PERFECT_LATEST_WEEK = Math.max(...PERFECT_WEEKS.keys());

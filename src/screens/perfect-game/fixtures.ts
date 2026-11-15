// Perfect game's own made-up data: Week 3, final, seen on Week 4's Tuesday (perfect.html).
// The seven and their points are the shared PERFECT_GAME; this adds what only this page shows.

import { CARRY_MULTIPLIER, COMPETITION, PERFECT_GAME, TEAM_CAP, WEEK3_FINAL, WEEK3_SERIES_FINAL } from "../../fixtures/week3";
import type { PerfectGameData, PerfectPlayer, PlayerSeries } from "./types";

/** Each starter's series this week, and his games where the picture draws them (Faker's). */
const SERIES_BY_NAME: Record<string, { id: string; series: PlayerSeries[] }> = {
  Zeus: { id: "zeus", series: [{ id: "w3-wed-1", points: 7 }, { id: "w3-sat-1", points: 7 }] },
  Pyosik: { id: "pyosik", series: [{ id: "w3-thu-2", points: 11 }, { id: "w3-sun-2", points: 13 }] },
  Faker: {
    id: "faker",
    series: [
      {
        id: "w3-wed-1",
        points: 12,
        games: [
          { champion: "Azir", won: true, points: 5, counted: true },
          { champion: "Taliyah", won: false, points: 2, counted: false },
          { champion: "Galio", won: true, points: 7, counted: true },
        ],
      },
      {
        id: "w3-sat-2",
        points: 15,
        games: [
          { champion: "Orianna", won: true, points: 4, counted: true },
          { champion: "Sylas", won: true, points: 11, counted: true },
        ],
      },
    ],
  },
  Ruler: { id: "ruler", series: [{ id: "w3-wed-2", points: 7 }, { id: "w3-sat-1", points: 7 }] },
  Duro: { id: "duro", series: [{ id: "w3-wed-2", points: 6 }, { id: "w3-sat-1", points: 7 }] },
  BuLLDoG: { id: "bulldog", series: [{ id: "w3-thu-2", points: 9 }, { id: "w3-sun-2", points: 12 }] },
  kkOma: { id: "kkoma", series: [{ id: "w3-wed-1", points: 8 }, { id: "w3-sat-2", points: 8 }] },
};

export const PERFECT_PLAYERS: PerfectPlayer[] = PERFECT_GAME.map((pick) => {
  const own = SERIES_BY_NAME[pick.name];
  if (!own) throw new Error(`No Week 3 series for ${pick.name}`);
  return { ...pick, ...own };
});

/** Week 3's perfect game as the picture shows it: Faker tapped. */
export const PERFECT_WEEK3: PerfectGameData = {
  week: `${COMPETITION} · Week 3`,
  final: true,
  cap: TEAM_CAP,
  carryTimes: CARRY_MULTIPLIER,
  ...WEEK3_FINAL,
  yours: 117,
  seriesTitle: "Week 3 series",
  players: PERFECT_PLAYERS,
  series: WEEK3_SERIES_FINAL,
};

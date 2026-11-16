// Faker's card on the pictures' made-up Split 1 (docs/design/approved/player-card/card.html), built on
// src/fixtures/week3.ts. Every number is an example. Two moments, as the pictures draw them:
// - from Pick Team: Week 4, Tuesday, before the deadline (History, Fixtures, Champions);
// - from Points: Week 3, Saturday, T1 v DK game 2 live (This week).

import { CARRY_MULTIPLIER, COMPETITION_TITLE, countedGames, gameAt, kdaText, LIVE_SERIES_ID, livePointsOf, pickedAt, playerId, POINTS_SQUAD, statsOf, WEEK3_SERIES_AT_POINTS, weekGamesOf, type TeamCode } from "../../fixtures/week3";
import { hangulOf } from "../../fixtures/rosters";
import { playedFromSide, seriesById } from "../../fixtures/series";
import { FAKER_SEASON, last3, playedBy, T1_FIXTURES, T1_NEXT3 } from "../../fixtures/t1Season";
import type { CardGame, CardWeek, FixtureRow, NextSeries, PastSeries, PlayerCardData, WeekSeries } from "./card";

const NAME = "Faker";
const TEAM: TeamCode = "T1";

const AT_PICK_TEAM = pickedAt(NAME);
const IN_STATS = statsOf(NAME);
const AT_POINTS = POINTS_SQUAD.find((p) => p.name === NAME);
if (!AT_POINTS) throw new Error(`${NAME} is missing from the Points squad`);

const seriesAtPoints = (id: string) => seriesById(WEEK3_SERIES_AT_POINTS, id);

/** T1's next series, from the shared T1 season. */
const FIXTURES: FixtureRow[] = [...T1_FIXTURES];

const NEXT: NextSeries[] = T1_NEXT3.map(({ id, week, day, bestOf, opponent }) => ({ id, week, day, bestOf, opponent }));

/** His last three series before Week 4, oldest first. */
const PAST: PastSeries[] = last3(FAKER_SEASON).map(({ id, week, day, opponent, points }) => ({ id, week, day, opponent, points }));

/** Each played series' K/D/A and his price then, in T1_PLAYED's order (newest first). */
const HISTORY_KDA_PRICE: [kda: string, priceM: number][] = [
  ["12/1/15", 18.5],
  ["18/3/20", 18.5],
  ["13/6/14", 18.0],
  ["14/4/16", 18.0],
  ["9/3/11", 17.5],
  ["7/9/10", 17.5],
];

/** A game of his at the Points picture's moment, as every page shows it (src/fixtures/games.ts): W or L once over, the clock while live. */
function gameAtPoints(id: string, index: number, counted: ReadonlySet<number>): Omit<CardGame, "points"> {
  const detail = weekGamesOf(NAME, id)[index];
  if (!detail?.champion || !detail.kda) throw new Error(`Game ${index + 1} of ${id} has no champion or K/D/A`);
  const { clock, won } = gameAt(seriesAtPoints(id), index, TEAM);
  return {
    champion: detail.champion,
    kda: kdaText(detail.kda),
    counts: counted.has(index),
    ...(clock ? { clock } : won !== undefined ? { outcome: won ? "W" : "L" } : {}),
  };
}

const WEEK3_AT_POINTS: CardWeek = {
  week: 3,
  series: AT_POINTS.series.map(({ id, games }): WeekSeries => {
    const s = seriesAtPoints(id);
    const side = playedFromSide(s, TEAM);
    return {
      id,
      day: s.day,
      opponent: side.opponent,
      score: side.score,
      state: s.state === "live" ? "live" : "final",
      games: games.map((points, i) => ({ ...gameAtPoints(id, i, countedGames(games)), points })),
    };
  }),
  carry: CARRY_MULTIPLIER,
  total: livePointsOf(playerId(NAME)),
};

const FAKER = { name: NAME, hangul: hangulOf(NAME), legalName: "Lee Sang-hyeok", role: "mid", team: TEAM } as const;

/** Opened from Pick Team, Week 4 Tuesday: the History, Fixtures and Champions pictures. */
export const CARD_FROM_PICK_TEAM: PlayerCardData = {
  ...FAKER,
  season: {
    points: IN_STATS.points,
    place: FAKER_SEASON.place,
    field: `${FAKER_SEASON.of} mids`,
    games: FAKER_SEASON.games,
    lines: [...FAKER_SEASON.lines],
  },
  priceM: AT_PICK_TEAM.priceM,
  priceMove: FAKER_SEASON.riseM,
  form: AT_PICK_TEAM.form,
  formPlace: 2,
  ownedPct: IN_STATS.ownedPct,
  ownedPlace: 1,
  transfersIn: 1204,
  transfersOut: 310,
  past: PAST,
  next: NEXT,
  fixtures: FIXTURES,
  history: {
    competition: COMPETITION_TITLE,
    rows: playedBy(FAKER_SEASON).map((s, i) => {
      const [kda, priceM] = HISTORY_KDA_PRICE[i] ?? [];
      if (kda === undefined || priceM === undefined) throw new Error(`${NAME} has no K/D/A or price for ${s.id}`);
      return { ...s, kda, priceM };
    }),
    pastSeasons: [
      { name: "LCK 2026", games: 98, kda: "392/171/598", points: 412 },
      { name: "LCK 2025", games: 104, kda: "405/188/611", points: 455 },
    ],
  },
  champions: [
    { champion: "Azir", games: 4, wins: 3, losses: 1, average: 4.8 },
    { champion: "Galio", games: 3, wins: 3, losses: 0, average: 5.7 },
    { champion: "Orianna", games: 3, wins: 2, losses: 1, average: 4.3 },
    { champion: "Sylas", games: 2, wins: 2, losses: 0, average: 4.0 },
    { champion: "Taliyah", games: 2, wins: 0, losses: 2, average: 2.5 },
    { champion: "Ryze", games: 1, wins: 1, losses: 0, average: 1.0 },
  ],
};

/** The Fixtures picture: the same moment, with a news line. */
export const CARD_WITH_NEWS: PlayerCardData = { ...CARD_FROM_PICK_TEAM, news: "Rested for Wednesday's series" };

/** Opened from Points, Week 3 Saturday with T1 v DK game 2 live: the This week picture. Week 3 joins the season when final. */
export const CARD_FROM_POINTS: PlayerCardData = {
  ...FAKER,
  season: {
    points: 36,
    place: 2,
    field: "10 mids",
    games: 10,
    lines: [
      { line: "Kills", total: 43, points: 13 },
      { line: "Assists", total: 51, points: 9 },
      { line: "Deaths", total: 22, points: -3 },
      { line: "Gold lead at 15", total: 5, points: 5 },
      { line: "Solo kills", total: 4, points: 4 },
      { line: "First bloods", total: 2, points: 2 },
      { line: "Deathless", total: 4, points: 4 },
      { line: "Quadra kills", total: 1, points: 1 },
      { line: "Steals", total: 1, points: 1 },
    ],
  },
  priceM: AT_PICK_TEAM.priceM,
  priceMove: 0.5,
  form: 18.0,
  formPlace: 1,
  ownedPct: IN_STATS.ownedPct,
  ownedPlace: 1,
  transfersIn: 842,
  transfersOut: 126,
  past: [...PAST.slice(0, 2), { id: LIVE_SERIES_ID, week: 3, day: "Sat", opponent: "DK", points: 5, live: true }],
  next: NEXT,
  thisWeek: WEEK3_AT_POINTS,
  fixtures: FIXTURES,
};

/** His mark in Baron Steal FC at the Pick Team picture's moment. */
export const MARK_AT_PICK_TEAM = AT_PICK_TEAM.mark;

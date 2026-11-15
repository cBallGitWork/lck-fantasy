// Faker's card on the pictures' made-up LCK Cup (docs/design/approved/player-card/card.html), built on
// src/fixtures/week3.ts. Every number is an example. Two moments, as the pictures draw them:
// - from Pick Team: Week 4, Tuesday, before the deadline (History, Fixtures, Champions);
// - from Points: Week 3, Saturday, T1 v DK game 2 live (This week).

import {
  PICK_TEAM_SQUAD,
  POINTS_SQUAD,
  STATS_PLAYERS,
  WEEK3_SERIES_AT_POINTS,
  WEEK4_SERIES,
  type TeamCode,
} from "../../fixtures/week3";
import { fromSide, opponent, seriesById, seriesOf } from "../../fixtures/series";
import type { CardGame, CardWeek, FixtureRow, NextSeries, PlayerCardData, WeekSeries } from "./card";

const NAME = "Faker";
const TEAM: TeamCode = "T1";
const BEST_OF = 3;

const find = <T extends { name: string }>(list: readonly T[]): T => {
  const found = list.find((p) => p.name === NAME);
  if (!found) throw new Error(`${NAME} is missing from the shared Week 3 fixture`);
  return found;
};
const AT_PICK_TEAM = find(PICK_TEAM_SQUAD);
const IN_STATS = find(STATS_PLAYERS);
const AT_POINTS = find(POINTS_SQUAD);

const seriesAtPoints = (id: string) => seriesById(WEEK3_SERIES_AT_POINTS, id);

const T1_WEEK4 = seriesOf(WEEK4_SERIES, TEAM);

/** T1's next series: Week 4's from the shared fixture, then Weeks 5 and 6. */
const FIXTURES: FixtureRow[] = [
  ...T1_WEEK4.map((s) => ({ id: s.id, week: 4, day: s.day, opponent: opponent(s, TEAM), bestOf: BEST_OF, local: s.local, kst: s.kst })),
  { id: "w5-thu-2", week: 5, day: "Thu", opponent: "BRO", bestOf: BEST_OF, local: "08:00", kst: "17:00" },
  { id: "w5-sun-2", week: 5, day: "Sun", opponent: "KRX", bestOf: BEST_OF, local: "10:30", kst: "19:30" },
  { id: "w6-wed-1", week: 6, day: "Wed", opponent: "DK", bestOf: BEST_OF, local: "08:00", kst: "17:00" },
  { id: "w6-sat-2", week: 6, day: "Sat", opponent: "HLE", bestOf: BEST_OF, local: "10:30", kst: "19:30" },
];

const NEXT: NextSeries[] = FIXTURES.slice(0, 3).map(({ id, week, day, bestOf, opponent }) => ({ id, week, day, bestOf, opponent }));

/** Week 3 at the Points picture's moment: his games from the shared squad, with champion and K/D/A. */
const GAMES_AT_POINTS: Record<string, Omit<CardGame, "points">[]> = {
  "w3-wed-1": [
    { champion: "Azir", outcome: "W", kda: "6/1/7", counts: true },
    { champion: "Taliyah", outcome: "L", kda: "3/2/5", counts: false },
    { champion: "Galio", outcome: "W", kda: "9/0/8", counts: true },
  ],
  "w3-sat-2": [
    { champion: "Orianna", outcome: "W", kda: "5/1/9", counts: true },
    { champion: "Sylas", clock: seriesAtPoints("w3-sat-2").clock, kda: "3/0/2", counts: true },
  ],
};

const gameAtPoints = (id: string, index: number): Omit<CardGame, "points"> => {
  const game = GAMES_AT_POINTS[id]?.[index];
  if (!game) throw new Error(`Game ${index + 1} of ${id} has no champion in the card fixture`);
  return game;
};

const WEEK3_AT_POINTS: CardWeek = {
  week: 3,
  series: AT_POINTS.series.map(({ id, games }): WeekSeries => {
    const s = seriesAtPoints(id);
    const side = fromSide(s, TEAM);
    if (!side.score) throw new Error(`Series ${id} has no score in the shared Week 3 fixture`);
    return {
      id,
      day: s.day,
      opponent: side.opponent,
      score: side.score,
      state: s.state === "live" ? "live" : "final",
      liveGame: s.liveGame,
      games: games.map((points, i) => ({ ...gameAtPoints(id, i), points })),
    };
  }),
  carry: 1.5,
  total: 25,
};

const FAKER = { name: NAME, hangul: "이상혁", legalName: "Lee Sang-hyeok", role: "mid", team: TEAM } as const;

/** Opened from Pick Team, Week 4 Tuesday: the History, Fixtures and Champions pictures. */
export const CARD_FROM_PICK_TEAM: PlayerCardData = {
  ...FAKER,
  season: {
    points: IN_STATS.points,
    place: 2,
    field: "10 mids",
    games: 15,
    lines: [
      { line: "Kills", total: 73, points: 22 },
      { line: "Assists", total: 86, points: 16 },
      { line: "Deaths", total: 26, points: -4 },
      { line: "Gold lead at 15", total: 9, points: 9 },
      { line: "Solo kills", total: 5, points: 5 },
      { line: "First bloods", total: 3, points: 3 },
      { line: "Deathless", total: 4, points: 4 },
      { line: "Quadra kills", total: 1, points: 1 },
      { line: "Steals", total: 2, points: 2 },
    ],
  },
  priceEok: AT_PICK_TEAM.priceEok,
  priceMove: 0.5,
  form: AT_PICK_TEAM.form,
  formPlace: 2,
  ownedPct: IN_STATS.ownedPct,
  ownedPlace: 1,
  transfersIn: 1204,
  transfersOut: 310,
  past: [
    { id: "w2-fri-2", week: 2, day: "Fri", opponent: "BFX", points: 10 },
    { id: "w3-wed-1", week: 3, day: "Wed", opponent: "HLE", points: 12 },
    { id: "w3-sat-2", week: 3, day: "Sat", opponent: "DK", points: 10 },
  ],
  next: NEXT,
  fixtures: FIXTURES,
  history: {
    competition: "LCK Cup 2027",
    rows: [
      { id: "w3-sat-2", week: 3, day: "Sat", opponent: "DK", score: [2, 0], games: 2, kda: "12/1/15", priceEok: 18.5, points: 10 },
      { id: "w3-wed-1", week: 3, day: "Wed", opponent: "HLE", score: [2, 1], games: 3, kda: "18/3/20", priceEok: 18.5, points: 12 },
      { id: "w2-fri-2", week: 2, day: "Fri", opponent: "BFX", score: [2, 1], games: 3, kda: "13/6/14", priceEok: 18.0, points: 10 },
      { id: "w2-wed-1", week: 2, day: "Wed", opponent: "DNS", score: [2, 0], games: 2, kda: "14/4/16", priceEok: 18.0, points: 12 },
      { id: "w1-sat-1", week: 1, day: "Sat", opponent: "NS", score: [2, 0], games: 2, kda: "9/3/11", priceEok: 17.5, points: 11 },
      { id: "w1-wed-2", week: 1, day: "Wed", opponent: "GEN", score: [1, 2], games: 3, kda: "7/9/10", priceEok: 17.5, points: 3 },
    ],
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
  priceEok: AT_PICK_TEAM.priceEok,
  priceMove: 0.5,
  form: 18.0,
  formPlace: 1,
  ownedPct: IN_STATS.ownedPct,
  ownedPlace: 1,
  transfersIn: 842,
  transfersOut: 126,
  past: [
    { id: "w2-fri-2", week: 2, day: "Fri", opponent: "BFX", points: 10 },
    { id: "w3-wed-1", week: 3, day: "Wed", opponent: "HLE", points: 12 },
    { id: "w3-sat-2", week: 3, day: "Sat", opponent: "DK", points: 5, live: true },
  ],
  next: NEXT,
  thisWeek: WEEK3_AT_POINTS,
  fixtures: FIXTURES,
};

/** His mark in Baron Steal FC at the Pick Team picture's moment. */
export const MARK_AT_PICK_TEAM = AT_PICK_TEAM.mark;

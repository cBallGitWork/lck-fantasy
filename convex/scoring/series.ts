// A series' points from its games' (spec/05-scoring.md, How it works; The coach).
import { sum } from "../../src/parts/util/sum";

export interface SeriesRules {
  /** How many of a series' games score: the best 2 (spec/05). */
  bestGames: number;
  /** The coach's points for the series won, and for it lost (−1, so a coach can go below 0). */
  coachSeriesWin: number;
  coachSeriesLoss: number;
}

/** A player's series: the sum of his best games. One who played fewer scores what he played. */
export function playerSeriesPoints(gamePoints: number[], rules: SeriesRules): number {
  return sum([...gamePoints].sort((a, b) => b - a).slice(0, rules.bestGames));
}

/** The coach's series: its best games, plus the win or loss points. */
export function coachSeriesPoints(gamePoints: number[], wonSeries: boolean, rules: SeriesRules): number {
  return playerSeriesPoints(gamePoints, rules) + (wonSeries ? rules.coachSeriesWin : rules.coachSeriesLoss);
}

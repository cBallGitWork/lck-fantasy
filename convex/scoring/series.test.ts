import { describe, expect, test } from "vitest";
import { SPEC_SERIES_RULES } from "./fixtures";
import { coachSeriesPoints, playerSeriesPoints } from "./series";

describe("playerSeriesPoints", () => {
  test("a series scores a player's best 2 games", () => {
    expect(playerSeriesPoints([3, 7, 5], SPEC_SERIES_RULES)).toBe(12);
    expect(playerSeriesPoints([2, -1, 6, 4, 1], SPEC_SERIES_RULES)).toBe(10);
  });

  test("a 2–0 scores both games, low or not", () => {
    expect(playerSeriesPoints([-2, 1], SPEC_SERIES_RULES)).toBe(-1);
  });

  test("a player who played one game scores that game", () => {
    expect(playerSeriesPoints([4], SPEC_SERIES_RULES)).toBe(4);
  });
});

describe("coachSeriesPoints", () => {
  test("the coach's best 2 games plus 3 for a series won", () => {
    expect(coachSeriesPoints([3, 0, 2], true, SPEC_SERIES_RULES)).toBe(8);
  });

  test("minus 1 for a series lost, so a coach can go below 0", () => {
    expect(coachSeriesPoints([0, 0], false, SPEC_SERIES_RULES)).toBe(-1);
  });
});

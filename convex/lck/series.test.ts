import { describe, expect, test } from "vitest";
import { BRION, DRX, OE_SERIES_GAMES as games } from "../feeds/fixtures/oe";
import { HOUR_MS, SPEC_FINAL_AFTER_MS } from "./fixtures";
import { groupSeries, seriesState } from "./series";


describe("groupSeries", () => {
  test("three games of BRION v DRX are one series, DRX winning 2–1", () => {
    const { series: [series, ...rest], unplaced } = groupSeries([...games].reverse());
    expect(rest).toEqual([]);
    expect(unplaced).toEqual([]);
    expect(series!.teamIds).toEqual([BRION, DRX]);
    expect(series!.games.map((g) => g.gameNumber)).toEqual([1, 2, 3]);
    expect(series!.score).toEqual([1, 2]);
    expect(series!.endedAt).toBe(Date.UTC(2025, 0, 15, 9, 54, 37) + 2480 * 1000);
  });

  test("a game 1 opens a new series for the same pair", () => {
    const later = games.map((g) => ({ ...g, gameId: `${g.gameId}-b`, startedAt: g.startedAt + 24 * HOUR_MS }));
    expect(groupSeries([...games, ...later]).series.map((s) => s.games.length)).toEqual([3, 3]);
  });

  test("a game with no game before it in its series is set aside, and the rest still load", () => {
    const later = games.map((g) => ({ ...g, gameId: `${g.gameId}-b`, startedAt: g.startedAt + 24 * HOUR_MS }));
    const { series, unplaced } = groupSeries([...games.slice(1), ...later]);
    expect(unplaced.map((g) => g.gameId)).toEqual(["LOLTMNT03_183538", "LOLTMNT03_183544"]);
    expect(series.map((s) => s.games.length)).toEqual([3]);
  });
});

describe("seriesState", () => {
  const ended = Date.UTC(2025, 0, 15, 10, 36);
  test("final 3 hours after the series ends, once the settled stats are in", () => {
    expect(seriesState(ended, true, ended + SPEC_FINAL_AFTER_MS, SPEC_FINAL_AFTER_MS)).toBe("final");
    expect(seriesState(ended, true, ended + SPEC_FINAL_AFTER_MS - 1, SPEC_FINAL_AFTER_MS)).toBe("provisional");
  });

  test("provisional past 3 hours while the settled stats aren't in", () => {
    expect(seriesState(ended, false, ended + 10 * HOUR_MS, SPEC_FINAL_AFTER_MS)).toBe("provisional");
  });
});

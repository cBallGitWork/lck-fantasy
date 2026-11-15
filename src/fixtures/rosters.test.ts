import { expect, test } from "vitest";
import { hangulOf, ROSTERS, T1_PRICES_EOK } from "./rosters";
import { fromSide, seriesById, seriesOf } from "./series";
import { TEAMS, WEEK3_SERIES_FINAL } from "./week3";

test("every LCK team has six on its roster, and a rostered name gives its hangul", () => {
  for (const team of Object.keys(TEAMS) as (keyof typeof TEAMS)[]) expect(ROSTERS[team], team).toHaveLength(6);
  expect(hangulOf("Faker")).toBe("이상혁");
  expect(() => hangulOf("Nobody")).toThrow("Nobody is on no LCK roster");
  expect(T1_PRICES_EOK).toHaveLength(ROSTERS.T1.length);
});

test("a series is found by id and read from either team's side", () => {
  const s = seriesById(WEEK3_SERIES_FINAL, "w3-wed-1");
  expect(fromSide(s, "T1")).toEqual({ opponent: "HLE", score: [2, 1] });
  expect(fromSide(s, "HLE")).toEqual({ opponent: "T1", score: [1, 2] });
  expect(seriesOf(WEEK3_SERIES_FINAL, "T1").map((x) => x.id)).toEqual(["w3-wed-1", "w3-sat-2"]);
  expect(() => seriesById(WEEK3_SERIES_FINAL, "w9")).toThrow("Series w9 is not in the list");
});

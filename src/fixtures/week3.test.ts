import { expect, test } from "vitest";
import { sum } from "../parts";
import { playedBy, FAKER_SEASON } from "./t1Season";
import {
  carried,
  countdown,
  countdownText,
  finalPickOf,
  livePointsOf,
  MY_WEEK3,
  PERFECT_GAME,
  PICK_TEAM_AT,
  PICK_TEAM_SQUAD,
  POINTS_AT,
  POINTS_WEEK,
  rawWeekOf,
  seriesPoints,
  seriesPointsOf,
  statsOf,
  WEEK3_FINAL,
  WEEK4_DEADLINE,
} from "./week3";

test("a series counts its best two games and a coach's result; the Carry's ×1.5 rounds down, a minus towards zero", () => {
  expect(seriesPoints([5, 2, 7])).toBe(12);
  expect(seriesPoints([2, 0, 3], 3)).toBe(8);
  expect([carried(9), carried(17), carried(-3)]).toEqual([13, 25, -4]);
});

test("Faker's Week 3 is one set of games: Points, Live, his card's History and Perfect game agree", () => {
  const faker = finalPickOf("Faker");
  expect(livePointsOf("faker")).toBe(25);
  expect(MY_WEEK3.down.faker).toBe(18);
  expect(MY_WEEK3.final.faker).toBe(carried(rawWeekOf(faker)));
  const history = playedBy(FAKER_SEASON).filter((s) => s.week === 3);
  expect(history.map((s) => [s.id, s.points]).sort()).toEqual(seriesPointsOf(faker).map((s) => [s.id, s.points]).sort());
  const perfect = PERFECT_GAME.find((p) => p.name === "Faker");
  expect(perfect).toMatchObject({ raw: 22, points: 33, line: "v HLE 12 · v DK 10" });
});

test("the perfect game is a real best: its Carry tops every raw week, and its total tops the week's Highest", () => {
  const carry = PERFECT_GAME.find((p) => p.carry);
  for (const p of PERFECT_GAME) if (!p.carry) expect(p.points).toBeLessThanOrEqual(carry?.raw ?? 0);
  expect(sum(PERFECT_GAME.map((p) => p.points))).toBeGreaterThanOrEqual(WEEK3_FINAL.highest);
  expect(WEEK3_FINAL.highest).toBeGreaterThanOrEqual(POINTS_WEEK.highest);
});

test("Baron Steal FC's week totals are the pictures' 94, 82 and 109", () => {
  expect([MY_WEEK3.liveTotal, MY_WEEK3.downTotal, MY_WEEK3.finalTotal]).toEqual([94, 82, 109]);
});

test("every countdown is worked from a moment and the deadline", () => {
  expect(WEEK4_DEADLINE.countdown).toBe("9h 45m");
  expect(countdownText(countdown(POINTS_AT, WEEK4_DEADLINE.at))).toBe("3d 19h 35m");
  expect(() => countdown(WEEK4_DEADLINE.at, PICK_TEAM_AT)).toThrow();
});

test("the squad's prices and form are Stats'", () => {
  for (const p of PICK_TEAM_SQUAD) expect(p.priceM, p.name).toBe(statsOf(p.name).priceM);
  expect(PICK_TEAM_SQUAD.find((p) => p.name === "Siwoo")?.priceM).toBe(11.5);
});

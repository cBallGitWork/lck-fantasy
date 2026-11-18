import { expect, test } from "vitest";
import { bestOf, count, money, mToWon, inOut, MINUS, NONE, oneDecimal, ordinal, outcome, pct, perGame, perGameValue, placeOf, result, score, signed } from "..";

test("a count marks its thousands", () => {
  expect([0, 999, 1204, 48211].map(count)).toEqual(["0", "999", "1,204", "48,211"]);
});

test("a place takes st, nd, rd or th, the teens th, and marks its thousands", () => {
  expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101, 111, 1402].map(ordinal)).toEqual([
    "1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "101st", "111th", "1,402nd",
  ]);
});

test("signed points show + or the minus sign, zero bare", () => {
  expect([6, 0, -1].map(signed)).toEqual(["+6", "0", "−1"]);
  expect(MINUS).toBe("−");
  expect(inOut(1204, 310)).toBe("+1,204 / −310");
});

test("a score, its result and a per-game figure", () => {
  expect(score([2, 1])).toBe("2–1");
  expect([outcome(true), outcome(false)]).toEqual(["W", "L"]);
  expect([result([2, 1]), result([1, 2])]).toEqual(["W 2–1", "L 1–2"]);
  expect(perGame(49, 10)).toBe("4.9");
  expect(perGame(5, 0)).toBe("0.0");
  expect([perGameValue(49, 10), perGameValue(5, 0)]).toEqual([4.9, 0]);
});

test("one decimal, a per cent, absence and a series' length", () => {
  expect([oneDecimal(9), oneDecimal(19.25)]).toEqual(["9.0", "19.3"]);
  expect(pct(46)).toBe("46%");
  expect(NONE).toBe("—");
  expect(bestOf(3)).toBe("Bo3");
});

test("a place alone or among so many", () => {
  expect(placeOf(2)).toBe("2nd");
  expect(placeOf(2, "10 mids")).toBe("2nd of 10 mids");
});

test("a price held in m reads as money and as won", () => {
  expect(money(18.5)).toBe("₩18.5m");
  expect(mToWon(7.5)).toBe(7_500_000);
});

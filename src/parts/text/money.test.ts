import { expect, test } from "vitest";
import { formatWon, WON_PER_M } from "./money";

test("an amount reads in m to one decimal, as FPL (Craig, 16 Nov 2026)", () => {
  expect(formatWon(7.5 * WON_PER_M)).toBe("₩7.5m");
  expect(formatWon(8 * WON_PER_M)).toBe("₩8.0m");
  expect(formatWon(100 * WON_PER_M)).toBe("₩100.0m");
});

test("a bank below zero reads with a minus sign", () => {
  expect(formatWon(-4 * WON_PER_M)).toBe("−₩4.0m");
});

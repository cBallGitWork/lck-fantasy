import { expect, test } from "vitest";
import { formatEok, WON_PER_EOK } from "./money";

test("an amount reads in m to one decimal, as FPL (Craig, 16 Nov 2026)", () => {
  expect(formatEok(7.5 * WON_PER_EOK)).toBe("₩7.5m");
  expect(formatEok(8 * WON_PER_EOK)).toBe("₩8.0m");
  expect(formatEok(100 * WON_PER_EOK)).toBe("₩100.0m");
});

test("a bank below zero reads with a minus sign", () => {
  expect(formatEok(-4 * WON_PER_EOK)).toBe("−₩4.0m");
});

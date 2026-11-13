import { expect, test } from "vitest";
import { EOK_NOTE, formatEok, WON_PER_EOK } from "./money";

test("an amount reads in 억 to one decimal, as on the Transfers picture", () => {
  expect(formatEok(7.5 * WON_PER_EOK)).toBe("7.5억");
  expect(formatEok(8 * WON_PER_EOK)).toBe("8.0억");
  expect(formatEok(100 * WON_PER_EOK)).toBe("100.0억");
});

test("a bank below zero reads with a minus sign", () => {
  expect(formatEok(-4 * WON_PER_EOK)).toBe("−4.0억");
});

test("the note for overseas players says what 억 is", () => {
  expect(EOK_NOTE).toBe("1억 = 100 million won, game money only");
});

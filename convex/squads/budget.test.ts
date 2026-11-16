import { WON_PER_M } from "../../src/parts/text/money";
import { describe, expect, test } from "vitest";
import { bankAfterTransfers, budgetProblems } from "./budget";
import { chovy, coach, ktCoach, player, validSquad } from "./fixtures";
import { allPicks, pickKey } from "./squad";

const BUDGET = 100 * WON_PER_M;

/** Every pick of the valid squad at 10m, so the nine cost 90m. */
function pricesAt(won: number) {
  return new Map(allPicks(validSquad()).map((pick) => [pickKey(pick), won]));
}

describe("budgetProblems", () => {
  test("a squad within the budget is valid", () => {
    expect(budgetProblems(validSquad(), pricesAt(10 * WON_PER_M), BUDGET)).toEqual([]);
  });

  test("a squad costing more than the budget is refused", () => {
    expect(budgetProblems(validSquad(), pricesAt(12 * WON_PER_M), BUDGET)).toEqual([
      { rule: "overBudget", budget: BUDGET, cost: 108 * WON_PER_M },
    ]);
  });

  test("the coach costs money like a player", () => {
    const prices = pricesAt(10 * WON_PER_M);
    prices.set(pickKey(ktCoach), 21 * WON_PER_M);
    expect(budgetProblems(validSquad(), prices, BUDGET)).toEqual([
      { rule: "overBudget", budget: BUDGET, cost: 101 * WON_PER_M },
    ]);
  });

  test("a coach and a player sharing an id are priced apart", () => {
    const prices = pricesAt(10 * WON_PER_M);
    prices.set(pickKey(player("kt", "kt", "mid")), 50 * WON_PER_M);
    expect(budgetProblems(validSquad(), prices, BUDGET)).toEqual([]);
  });

  test("a stage with the budget off checks no budget", () => {
    expect(budgetProblems(validSquad(), pricesAt(50 * WON_PER_M), null)).toEqual([]);
  });

  test("a knockout's raised budget is just a higher budget", () => {
    expect(budgetProblems(validSquad(), pricesAt(12 * WON_PER_M), 110 * WON_PER_M)).toEqual([]);
  });

  test("a pick with no price is refused, never free", () => {
    const prices = pricesAt(10 * WON_PER_M);
    prices.delete(pickKey(chovy));
    expect(budgetProblems(validSquad(), prices, null)).toEqual([{ rule: "unpriced", pickId: "chovy" }]);
  });
});

describe("bankAfterTransfers", () => {
  test("selling pays the full current price, buying costs the new pick's", () => {
    // Bought at ₩7.5m, Chovy has risen to ₩9.0m: selling him pays all ₩9.0m.
    const prices = new Map([
      [pickKey(chovy), 9 * WON_PER_M],
      [pickKey(player("faker", "t1", "mid")), 8.5 * WON_PER_M],
    ]);
    const bank = bankAfterTransfers(0.5 * WON_PER_M, [{ out: chovy, in: player("faker", "t1", "mid") }], prices);
    expect(bank).toBe(1 * WON_PER_M);
  });

  test("swapping the coach moves the bank like a player", () => {
    const prices = new Map([
      [pickKey(ktCoach), 6 * WON_PER_M],
      [pickKey(coach("t1")), 7 * WON_PER_M],
    ]);
    expect(bankAfterTransfers(0, [{ out: ktCoach, in: coach("t1") }], prices)).toBe(-1 * WON_PER_M);
  });

  test("a swap with an unpriced pick throws rather than treat him as free", () => {
    expect(() => bankAfterTransfers(0, [{ out: chovy, in: ktCoach }], new Map())).toThrow("No current price for player:chovy.");
  });
});

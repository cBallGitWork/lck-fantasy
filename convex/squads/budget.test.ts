import { describe, expect, test } from "vitest";
import { bankAfterTransfers, budgetProblems } from "./budget";
import { chovy, coach, ktCoach, player, validSquad } from "./fixtures";
import { allPicks, pickKey } from "./squad";

const EOK = 100_000_000;
const BUDGET = 100 * EOK;

/** Every pick of the valid squad at 10억, so the nine cost 90억. */
function pricesAt(won: number) {
  return new Map(allPicks(validSquad()).map((pick) => [pickKey(pick), won]));
}

describe("budgetProblems", () => {
  test("a squad within the budget is valid", () => {
    expect(budgetProblems(validSquad(), pricesAt(10 * EOK), BUDGET)).toEqual([]);
  });

  test("a squad costing more than the budget is refused", () => {
    expect(budgetProblems(validSquad(), pricesAt(12 * EOK), BUDGET)).toEqual([
      { rule: "overBudget", budget: BUDGET, cost: 108 * EOK },
    ]);
  });

  test("the coach costs money like a player", () => {
    const prices = pricesAt(10 * EOK);
    prices.set(pickKey(ktCoach), 21 * EOK);
    expect(budgetProblems(validSquad(), prices, BUDGET)).toEqual([
      { rule: "overBudget", budget: BUDGET, cost: 101 * EOK },
    ]);
  });

  test("a coach and a player sharing an id are priced apart", () => {
    const prices = pricesAt(10 * EOK);
    prices.set(pickKey(player("kt", "kt", "mid")), 50 * EOK);
    expect(budgetProblems(validSquad(), prices, BUDGET)).toEqual([]);
  });

  test("a stage with the budget off checks no budget", () => {
    expect(budgetProblems(validSquad(), pricesAt(50 * EOK), null)).toEqual([]);
  });

  test("a knockout's raised budget is just a higher budget", () => {
    expect(budgetProblems(validSquad(), pricesAt(12 * EOK), 110 * EOK)).toEqual([]);
  });

  test("a pick with no price is refused, never free", () => {
    const prices = pricesAt(10 * EOK);
    prices.delete(pickKey(chovy));
    expect(budgetProblems(validSquad(), prices, null)).toEqual([{ rule: "unpriced", pickId: "chovy" }]);
  });
});

describe("bankAfterTransfers", () => {
  test("selling pays the full current price, buying costs the new pick's", () => {
    // Bought at 7.5억, Chovy has risen to 9.0억: selling him pays all 9.0억.
    const prices = new Map([
      [pickKey(chovy), 9 * EOK],
      [pickKey(player("faker", "t1", "mid")), 8.5 * EOK],
    ]);
    const bank = bankAfterTransfers(0.5 * EOK, [{ out: chovy, in: player("faker", "t1", "mid") }], prices);
    expect(bank).toBe(1 * EOK);
  });

  test("swapping the coach moves the bank like a player", () => {
    const prices = new Map([
      [pickKey(ktCoach), 6 * EOK],
      [pickKey(coach("t1")), 7 * EOK],
    ]);
    expect(bankAfterTransfers(0, [{ out: ktCoach, in: coach("t1") }], prices)).toBe(-1 * EOK);
  });

  test("a swap with an unpriced pick throws rather than treat him as free", () => {
    expect(() => bankAfterTransfers(0, [{ out: chovy, in: ktCoach }], new Map())).toThrow("No current price for player:chovy.");
  });
});

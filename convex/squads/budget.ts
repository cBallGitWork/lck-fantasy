// Money (spec/02-prices-and-budget.md). Amounts are whole won, so no sum ever rounds; screens show
// them in 억 (src/parts/money.ts). The budget and every price are data per competition.
import { allPicks, pickKey, type Pick, type Squad } from "./squad";

/** Current prices in won, keyed by `pickKey`: players and coaches alike (spec/02, Money). */
export type Prices = ReadonlyMap<string, number>;

export type BudgetProblem =
  | { rule: "unpriced"; pickId: string }
  | { rule: "overBudget"; budget: number; cost: number };

export function priceOf(pick: Pick, prices: Prices): number | undefined {
  return prices.get(pickKey(pick));
}

/** What a new squad breaks against the stage's budget; `budget` null means the stage has it off
 *  (spec/10, Stages and their settings). A pick with no price is refused, never counted as free. */
export function budgetProblems(squad: Squad, prices: Prices, budget: number | null): BudgetProblem[] {
  const picks = allPicks(squad);
  const unpriced = picks.filter((pick) => priceOf(pick, prices) === undefined);
  if (unpriced.length > 0) return unpriced.map((pick) => ({ rule: "unpriced", pickId: pick.id }));
  if (budget === null) return [];
  const cost = picks.reduce((sum, pick) => sum + priceOf(pick, prices)!, 0);
  return cost > budget ? [{ rule: "overBudget", budget, cost }] : [];
}

export interface Transfer {
  out: Pick;
  in: Pick;
}

/** The money bank after transfers: each pick out sells at his full current price (spec/02, Selling), each
 *  pick in costs his. It can fall below zero; whether that is allowed is the caller's rule.
 *  Throws on a pick with no price: a missing price is a data fault, never a free player. */
export function bankAfterTransfers(bank: number, transfers: Transfer[], prices: Prices): number {
  return transfers.reduce((total, transfer) => total + requirePrice(transfer.out, prices) - requirePrice(transfer.in, prices), bank);
}

/** A pick's price; throws when he has none, since a missing price is a data fault. */
export function requirePrice(pick: Pick, prices: Prices): number {
  const price = priceOf(pick, prices);
  if (price === undefined) throw new Error(`No current price for ${pickKey(pick)}.`);
  return price;
}

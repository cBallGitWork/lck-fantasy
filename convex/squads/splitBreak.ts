// Between the splits (spec/03-transfers.md): each split has fresh prices, so every squad is
// repriced and its bank reset, and a squad still over the budget or the cap at Split 2's first
// deadline is fixed by Flol, at no points cost.
import { sum } from "../../src/parts/util/sum";
import { priceOf, requirePrice, type Prices } from "./budget";
import { allPicks, pickKey, pickKeysOf, picksPerTeam, type Pick, type Squad } from "./squad";

/** The money bank when Split 2's transfers reopen: the split's budget less the squad's value at
 *  the split's fresh prices, so team value and the Road to MSI raise are gone. It may fall below
 *  zero: a ₩100m budget and a squad now worth ₩103m leave −₩3m (spec/03, spec/02). */
export function bankAtSplitStart(squad: Squad, freshPrices: Prices, budget: number): number {
  return budget - sum(allPicks(squad).map((pick) => requirePrice(pick, freshPrices)));
}

export interface SplitFix {
  squad: Squad;
  bank: number;
  sold: Pick[];
  bought: Pick[];
}

/** Flol's fix, in spec/03's order: (1) for each team over the cap, sell its most expensive extra
 *  (over by one at most, from a knockout cap of 3 to 2; more is sold if more are over); (2) while
 *  the bank is below zero, sell the most expensive player left of the squad he had, never the
 *  coach and never a pick Flol just bought, so the loop ends; (3) for each sale, buy the cheapest
 *  pick of the same role (a coach for a coach) that keeps the squad within the cap. The bank is
 *  read after each sale's buy. `pool` is every pick on sale. */
export function fixSquadForSplit(squad: Squad, bank: number, teamCap: number, pool: Pick[], prices: Prices): SplitFix {
  let current = squad;
  let money = bank;
  const sold: Pick[] = [];
  const bought: Pick[] = [];

  const swap = (out: Pick) => {
    const replacement = cheapestReplacement(current, out, teamCap, pool, prices);
    if (!replacement) throw new Error(`No pick on sale can replace ${pickKey(out)} within the cap.`);
    current = replacePick(current, out, replacement);
    money += requirePrice(out, prices) - requirePrice(replacement, prices);
    sold.push(out);
    bought.push(replacement);
  };

  for (const [teamId, count] of picksPerTeam(allPicks(squad))) {
    const extras = mostExpensiveFirst(allPicks(squad).filter((pick) => pick.teamId === teamId), prices);
    for (const extra of extras.slice(0, Math.max(0, count - teamCap))) swap(extra);
  }

  const original = pickKeysOf(squad);
  while (money < 0) {
    const left = allPicks(current).filter(
      (pick) => pick.role !== "coach" && original.has(pickKey(pick)),
    );
    const mostExpensive = mostExpensiveFirst(left, prices)[0];
    if (!mostExpensive) throw new Error("Selling every player left still leaves the bank below zero.");
    swap(mostExpensive);
  }
  return { squad: current, bank: money, sold, bought };
}

function cheapestReplacement(squad: Squad, out: Pick, teamCap: number, pool: Pick[], prices: Prices): Pick | undefined {
  const inSquad = pickKeysOf(squad);
  const perTeam = picksPerTeam(allPicks(squad).filter((pick) => pick !== out));
  const candidates = pool.filter(
    (pick) =>
      pick.role === out.role &&
      !inSquad.has(pickKey(pick)) &&
      (perTeam.get(pick.teamId) ?? 0) < teamCap &&
      priceOf(pick, prices) !== undefined,
  );
  return candidates.sort((a, b) => requirePrice(a, prices) - requirePrice(b, prices))[0];
}

function replacePick(squad: Squad, out: Pick, replacement: Pick): Squad {
  return {
    starters: squad.starters.map((starter) => (starter.pick === out ? { ...starter, pick: replacement } : starter)),
    bench: squad.bench.map((pick) => (pick === out ? replacement : pick)),
  };
}

function mostExpensiveFirst(picks: Pick[], prices: Prices): Pick[] {
  return [...picks].sort((a, b) => requirePrice(b, prices) - requirePrice(a, prices));
}

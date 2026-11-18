import { WON_PER_M } from "../../src/parts/text/money";
import { describe, expect, test } from "vitest";
import { byPick, chovy, coach, ktCoach, oner, player, REGULAR_SETTINGS, validSquad, withStarter } from "./fixtures";
import { bankAtSplitStart, fixSquadForSplit } from "./splitBreak";
import { allPicks, pickKey, squadProblems, type Pick } from "./squad";

const CAP = 2;

const cheapMid = player("cheapmid", "bro", "mid");
const cheaperMidOverCap = player("cheapermid", "hle", "mid"); // HLE already has 2 in validSquad
const cheapCoach = coach("bro");
const pool: Pick[] = [cheapMid, cheaperMidOverCap, cheapCoach, player("dearmid", "ns", "mid")];

/** Every pick at 10m, then the overrides in m. */
function pricesWith(picks: Pick[], overrides: [Pick, number][]) {
  const prices = byPick(picks.map((pick) => [pick, 10 * WON_PER_M]));
  for (const [pick, money] of overrides) prices.set(pickKey(pick), money * WON_PER_M);
  return prices;
}

describe("bankAtSplitStart", () => {
  const squad = validSquad();
  /** The squad's nine picks at Split 2's fresh prices: eight at 11m and Chovy at `chovyM`. */
  const fresh = (chovyM: number) => pricesWith(allPicks(squad), [...allPicks(squad).map((pick): [Pick, number] => [pick, 11]), [chovy, chovyM]]);

  test("the squad is repriced and the bank is the budget less its new value: ₩100m and ₩103m leave −₩3m", () => {
    expect(bankAtSplitStart(squad, fresh(15), 100 * WON_PER_M)).toBe(-3 * WON_PER_M);
  });

  test("whatever the bank was in Split 1, raise included, a squad now worth less leaves money over", () => {
    expect(bankAtSplitStart(squad, fresh(10), 100 * WON_PER_M)).toBe(2 * WON_PER_M);
  });

  test("a squad left at −₩3m by the deadline is then fixed by Flol: Chovy, the dearest, goes", () => {
    const prices = pricesWith([...allPicks(squad), ...pool], [...allPicks(squad).map((pick): [Pick, number] => [pick, 11]), [chovy, 15], [cheapMid, 6]]);
    const fix = fixSquadForSplit(squad, bankAtSplitStart(squad, prices, 100 * WON_PER_M), CAP, pool, prices);
    expect(fix.sold).toEqual([chovy]);
    expect(fix.bank).toBe(6 * WON_PER_M);
  });

  test("a pick with no fresh price is a data fault, never free", () => {
    expect(() => bankAtSplitStart(squad, new Map(), 100 * WON_PER_M)).toThrow("No current price");
  });
});

describe("fixSquadForSplit", () => {
  test("a valid squad with money in the bank is left alone", () => {
    const squad = validSquad();
    const fix = fixSquadForSplit(squad, 0, CAP, pool, pricesWith([...allPicks(squad), ...pool], []));
    expect(fix).toEqual({ squad, bank: 0, sold: [], bought: [] });
  });

  test("over the cap: the team's most expensive extra is sold for the cheapest same role within the cap", () => {
    // Three from GEN: Chovy (mid, 12m), Ruler and a GEN coach. Chovy is the dearest, so he goes.
    const squad = withStarter(validSquad(), "coach", coach("gen"));
    const prices = pricesWith([...allPicks(squad), ...pool], [[chovy, 12], [cheapMid, 6], [cheaperMidOverCap, 5]]);
    const fix = fixSquadForSplit(squad, 0, CAP, pool, prices);
    expect(fix.sold).toEqual([chovy]);
    expect(fix.bought).toEqual([cheapMid]); // the cheaper HLE mid would put HLE over the cap
    expect(fix.bank).toBe(6 * WON_PER_M);
    expect(squadProblems(fix.squad, REGULAR_SETTINGS)).toEqual([]);
  });

  test("a coach sold over the cap is replaced by the cheapest coach", () => {
    const squad = withStarter(validSquad(), "coach", coach("gen"));
    const prices = pricesWith([...allPicks(squad), ...pool], [[coach("gen"), 15], [cheapCoach, 4]]);
    const fix = fixSquadForSplit(squad, 0, CAP, pool, prices);
    expect(fix.sold).toEqual([coach("gen")]);
    expect(fix.bought).toEqual([cheapCoach]);
  });

  test("below zero: the most expensive player left is sold, never the coach, until the bank is zero or more", () => {
    const squad = validSquad();
    const prices = pricesWith([...allPicks(squad), ...pool], [[ktCoach, 30], [chovy, 14], [cheapMid, 6]]);
    const fix = fixSquadForSplit(squad, -4 * WON_PER_M, CAP, pool, prices);
    expect(fix.sold).toEqual([chovy]);
    expect(fix.bought).toEqual([cheapMid]);
    expect(fix.bank).toBe(4 * WON_PER_M);
  });

  test("it keeps selling while the bank stays below zero", () => {
    const squad = validSquad();
    const cheapJungler = player("cheapjungle", "bro", "jungle");
    const prices = pricesWith([...allPicks(squad), ...pool, cheapJungler], [
      [chovy, 14], [oner, 11], [cheapMid, 13], [pool[3]!, 16], [cheapJungler, 2],
    ]);
    const fix = fixSquadForSplit(squad, -3 * WON_PER_M, CAP, [...pool, cheapJungler], prices);
    // Chovy for the cheapest mid within the cap (13m) gains 1m, leaving −2m; the next dearest
    // left, Oner at 11m, goes for a 2m jungler: −2 + 9 = 7m.
    expect(fix.sold.map((pick) => pick.id)).toEqual(["chovy", "oner"]);
    expect(fix.bank).toBe(7 * WON_PER_M);
  });
});

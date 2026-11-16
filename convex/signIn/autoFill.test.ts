import { describe, expect, test } from "vitest";
import { budgetProblems } from "../squads/budget";
import { coach, player, REGULAR_SETTINGS, validSquad } from "../squads/fixtures";
import { allPicks, pickKey, PLAYER_ROLES, squadProblems, type Pick, type Squad } from "../squads/squad";
import { autoFill, type Chooser } from "./autoFill";

const EOK = 100_000_000;
const first: Chooser = (candidates) => candidates[0]!;
const dearestFirst: Chooser = (candidates) => [...candidates].sort((a, b) => prices.get(pickKey(b))! - prices.get(pickKey(a))!)[0]!;

// A pool of six teams: for each, a coach and one player per role. Team "a" is dearest.
const TEAMS = ["a", "b", "c", "d", "e", "f"];
const pool: Pick[] = TEAMS.flatMap((team) => [coach(team), ...PLAYER_ROLES.map((role) => player(`${team}-${role}`, team, role))]);
const prices = new Map(pool.map((pick) => [pickKey(pick), (pick.teamId === "a" ? 20 : 8) * EOK]));
const emptySquad: Squad = { starters: [], bench: [] };

function expectValid(squad: Squad, budget: number | null) {
  expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([]);
  expect(budgetProblems(squad, prices, budget)).toEqual([]);
}

describe("autoFill", () => {
  test("fills an empty squad with a valid nine under budget", () => {
    const squad = autoFill(emptySquad, pool, prices, REGULAR_SETTINGS, 100 * EOK, first);
    expect(allPicks(squad)).toHaveLength(9);
    expectValid(squad, 100 * EOK);
  });

  test("even choosing the dearest it can, it leaves money for the slots still empty", () => {
    const squad = autoFill(emptySquad, pool, prices, REGULAR_SETTINGS, 100 * EOK, dearestFirst);
    expectValid(squad, 100 * EOK);
    expect(allPicks(squad).filter((pick) => pick.teamId === "a").length).toBeGreaterThan(0);
  });

  test("a guest pick with no price throws, rather than count as free", () => {
    const partial: Squad = { starters: [{ slot: "mid", pick: player("unpriced-mid", "a", "mid") }], bench: [] };
    expect(() => autoFill(partial, pool, prices, REGULAR_SETTINGS, 100 * EOK, first)).toThrow("No current price for player:unpriced-mid");
  });

  test("keeps the guest's picks and fills only the empty slots", () => {
    const partial: Squad = { starters: [{ slot: "mid", pick: player("a-mid", "a", "mid") }], bench: [] };
    const squad = autoFill(partial, pool, prices, REGULAR_SETTINGS, 100 * EOK, first);
    expect(squad.starters[0]).toEqual(partial.starters[0]);
    expectValid(squad, 100 * EOK);
  });

  test("a full squad is left as it is", () => {
    const full = validSquad();
    expect(autoFill(full, pool, prices, REGULAR_SETTINGS, null, first)).toEqual(full);
  });

  test("throws when no valid fill fits the budget, never returning a broken squad", () => {
    expect(() => autoFill(emptySquad, pool, prices, REGULAR_SETTINGS, 50 * EOK, first)).toThrow(/Auto-fill found no pick/);
  });

  /** The valid squad's starters, free, with the bench to fill from `benchPool`. */
  function fillBench(benchPool: [Pick, number][], budgetEok: number) {
    const starters = validSquad().starters;
    const thinPrices = new Map<string, number>([
      ...starters.map((s) => [pickKey(s.pick), 0] as [string, number]),
      ...benchPool.map(([pick, eok]) => [pickKey(pick), eok * EOK] as [string, number]),
    ]);
    const thinPool = benchPool.map(([pick]) => pick);
    const priceOfPick = (pick: Pick) => thinPrices.get(pickKey(pick))!;
    const dearest: Chooser = (candidates) => [...candidates].sort((a, b) => priceOfPick(b) - priceOfPick(a))[0]!;
    const squad = autoFill({ starters, bench: [] }, thinPool, thinPrices, REGULAR_SETTINGS, budgetEok * EOK, dearest);
    expect(budgetProblems(squad, thinPrices, budgetEok * EOK)).toEqual([]);
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([]);
    return squad.bench.map((pick) => pick.id).sort();
  }

  test("a thin cheap pool: one cheap pick is never counted on for two empty slots", () => {
    // Flex-able bench picks at 1, 8, 15 and 20, budget 24. Holding back 1 for each of two slots
    // would allow the 20; only 15 + 8 + 1 fits.
    const starters = validSquad().starters.filter((s) => s.slot !== "flex");
    const benchPool: [Pick, number][] = [
      [player("cheap", "x", "top"), 1], [player("mid8", "y", "mid"), 8],
      [player("bot15", "z", "bot"), 15], [player("sup20", "w", "support"), 20],
    ];
    const prices24 = new Map<string, number>([
      ...starters.map((s) => [pickKey(s.pick), 0] as [string, number]),
      ...benchPool.map(([pick, eok]) => [pickKey(pick), eok * EOK] as [string, number]),
    ]);
    const dearest: Chooser = (candidates) => [...candidates].sort((a, b) => prices24.get(pickKey(b))! - prices24.get(pickKey(a))!)[0]!;
    const squad = autoFill({ starters, bench: [] }, benchPool.map(([pick]) => pick), prices24, REGULAR_SETTINGS, 24 * EOK, dearest);
    expect(allPicks(squad).filter((pick) => pick.teamId !== "kt" && prices24.get(pickKey(pick))! > 0).map((p) => p.id).sort())
      .toEqual(["bot15", "cheap", "mid8"]);
  });

  test("the reserve respects the team cap", () => {
    // T1 is at the cap of 2, so its 1m player can't be counted on: the 20 would leave 5 for the
    // last slot, which only the capped player fits. The fill takes 12 and 8 instead.
    expect(fillBench([[player("cheapt1", "t1", "top"), 1], [player("y8", "y", "mid"), 8],
      [player("e12", "e", "bot"), 12], [player("d20", "w", "support"), 20]], 25)).toEqual(["e12", "y8"]);
  });
});

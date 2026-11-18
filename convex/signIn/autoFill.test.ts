import { WON_PER_M } from "../../src/parts/text/money";
import { describe, expect, test } from "vitest";
import { sum } from "../../src/parts/util/sum";
import { budgetProblems, type Prices } from "../squads/budget";
import { byPick, coach, player, REGULAR_SETTINGS, validSquad } from "../squads/fixtures";
import { allPicks, pickKey, PLAYER_ROLES, squadProblems, type Pick, type Squad, type SquadPick } from "../squads/squad";
import { autoFill, randomChooser, type AutoFillMoney, type Chooser } from "./autoFill";

const first: Chooser = (candidates) => candidates[0]!;
const dearestFirst: Chooser = (candidates) => [...candidates].sort((a, b) => prices.get(pickKey(b))! - prices.get(pickKey(a))!)[0]!;

/** A budget in m with no aim: any spend under it will do. */
const anySpend = (budgetM: number): AutoFillMoney => ({ budget: budgetM * WON_PER_M, gap: budgetM * WON_PER_M });

// A pool of six teams: for each, a coach and one player per role. Team "a" is dearest.
const TEAMS = ["a", "b", "c", "d", "e", "f"];
const pool: Pick[] = TEAMS.flatMap((team) => [coach(team), ...PLAYER_ROLES.map((role) => player(`${team}-${role}`, team, role))]);
const prices = byPick(pool.map((pick) => [pick, (pick.teamId === "a" ? 20 : 8) * WON_PER_M]));
const emptySquad: Squad = { starters: [], bench: [] };

function expectValid(squad: Squad, budget: number | null, squadPrices: Prices = prices) {
  expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([]);
  expect(budgetProblems(squad, squadPrices, budget)).toEqual([]);
}

/** A seeded random in [0, 1) (mulberry32), so a test's "random" squads are the same each run. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("autoFill", () => {
  test("fills an empty squad with a valid nine under budget", () => {
    const squad = autoFill(emptySquad, pool, prices, REGULAR_SETTINGS, anySpend(100), first);
    expect(allPicks(squad)).toHaveLength(9);
    expectValid(squad, 100 * WON_PER_M);
  });

  test("even choosing the dearest it can, it leaves money for the slots still empty", () => {
    const squad = autoFill(emptySquad, pool, prices, REGULAR_SETTINGS, anySpend(100), dearestFirst);
    expectValid(squad, 100 * WON_PER_M);
    expect(allPicks(squad).filter((pick) => pick.teamId === "a").length).toBeGreaterThan(0);
  });

  test("a guest pick with no price throws, rather than count as free", () => {
    const partial: Squad = { starters: [{ slot: "mid", pick: player("unpriced-mid", "a", "mid") }], bench: [] };
    expect(() => autoFill(partial, pool, prices, REGULAR_SETTINGS, anySpend(100), first)).toThrow("No current price for player:unpriced-mid");
  });

  test("keeps the guest's picks and fills only the empty slots", () => {
    const partial: Squad = { starters: [{ slot: "mid", pick: player("a-mid", "a", "mid") }], bench: [] };
    const squad = autoFill(partial, pool, prices, REGULAR_SETTINGS, anySpend(100), first);
    expect(squad.starters[0]).toEqual(partial.starters[0]);
    expectValid(squad, 100 * WON_PER_M);
  });

  test("a full squad is left as it is", () => {
    const full = validSquad();
    expect(autoFill(full, pool, prices, REGULAR_SETTINGS, { budget: null, gap: 0 }, first)).toEqual(full);
  });

  test("throws when no valid fill fits the budget, never returning a broken squad", () => {
    expect(() => autoFill(emptySquad, pool, prices, REGULAR_SETTINGS, anySpend(50), first)).toThrow(/Auto-fill found no pick/);
  });

  /** The starters free, and each pick of `benchPool` at its price in m. */
  const freeStartersAnd = (starters: readonly SquadPick[], benchPool: readonly [Pick, number][]) =>
    byPick([...starters.map((s) => [s.pick, 0] as const), ...benchPool.map(([pick, money]) => [pick, money * WON_PER_M] as const)]);

  /** The valid squad's starters, free, with the bench to fill from `benchPool`. */
  function fillBench(benchPool: [Pick, number][], budgetM: number) {
    const starters = validSquad().starters;
    const thinPrices = freeStartersAnd(starters, benchPool);
    const thinPool = benchPool.map(([pick]) => pick);
    const priceOfPick = (pick: Pick) => thinPrices.get(pickKey(pick))!;
    const dearest: Chooser = (candidates) => [...candidates].sort((a, b) => priceOfPick(b) - priceOfPick(a))[0]!;
    const squad = autoFill({ starters, bench: [] }, thinPool, thinPrices, REGULAR_SETTINGS, anySpend(budgetM), dearest);
    expect(budgetProblems(squad, thinPrices, budgetM * WON_PER_M)).toEqual([]);
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
    const prices24 = freeStartersAnd(starters, benchPool);
    const dearest: Chooser = (candidates) => [...candidates].sort((a, b) => prices24.get(pickKey(b))! - prices24.get(pickKey(a))!)[0]!;
    const squad = autoFill({ starters, bench: [] }, benchPool.map(([pick]) => pick), prices24, REGULAR_SETTINGS, anySpend(24), dearest);
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

describe("autoFill spends close to the budget (spec/09: random, but a half-decent team)", () => {
  // Ten teams, each a coach and one player per role, at prices from 5m to 20m in 0.5m steps.
  const LEAGUE = Array.from({ length: 10 }, (_, i) => `t${i}`);
  const leaguePool: Pick[] = LEAGUE.flatMap((team) => [coach(team), ...PLAYER_ROLES.map((role) => player(`${team}-${role}`, team, role))]);
  const leaguePrices = byPick(leaguePool.map((pick, i) => [pick, (5 + ((i * 7) % 31) / 2) * WON_PER_M]));
  const money: AutoFillMoney = { budget: 100 * WON_PER_M, gap: 2 * WON_PER_M };
  const spend = (squad: Squad) => sum(allPicks(squad).map((pick) => leaguePrices.get(pickKey(pick))!));
  const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1);

  test("every press is a valid squad spending within the gap of the budget", () => {
    for (const seed of SEEDS) {
      const squad = autoFill(emptySquad, leaguePool, leaguePrices, REGULAR_SETTINGS, money, randomChooser(seeded(seed)));
      expectValid(squad, money.budget, leaguePrices);
      expect(spend(squad)).toBeGreaterThanOrEqual(money.budget! - money.gap);
    }
  });

  test("a different squad each press", () => {
    const squads = new Set(SEEDS.map((seed) =>
      allPicks(autoFill(emptySquad, leaguePool, leaguePrices, REGULAR_SETTINGS, money, randomChooser(seeded(seed)))).map(pickKey).sort().join()));
    expect(squads.size).toBeGreaterThan(SEEDS.length / 2);
  });

  test("around the guest's own picks too", () => {
    const partial: Squad = { starters: [{ slot: "mid", pick: player("t0-mid", "t0", "mid") }], bench: [] };
    for (const seed of SEEDS.slice(0, 10)) {
      const squad = autoFill(partial, leaguePool, leaguePrices, REGULAR_SETTINGS, money, randomChooser(seeded(seed)));
      expect(squad.starters).toContainEqual(partial.starters[0]);
      expectValid(squad, money.budget, leaguePrices);
      expect(spend(squad)).toBeGreaterThanOrEqual(money.budget! - money.gap);
    }
  });

  test("when no squad reaches the budget less the gap, it spends the most it can", () => {
    // Every pick 8m: nine of them are 72m, far short of 98m.
    const flat = byPick(leaguePool.map((pick) => [pick, 8 * WON_PER_M]));
    const squad = autoFill(emptySquad, leaguePool, flat, REGULAR_SETTINGS, money, randomChooser(seeded(1)));
    expectValid(squad, money.budget, flat);
    expect(sum(allPicks(squad).map((pick) => flat.get(pickKey(pick))!))).toBe(72 * WON_PER_M);
  });
});

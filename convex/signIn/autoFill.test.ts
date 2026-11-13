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
});

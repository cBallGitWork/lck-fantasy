import { WON_PER_M } from "../../src/parts/text/money";
import { describe, expect, test } from "vitest";
import { bdd, byPick, chovy, keria, ktCoach, REGULAR_SETTINGS, ruler, validSquad, zeus } from "../squads/fixtures";
import { allPicks, pickKey } from "../squads/squad";
import { firstCaptain, firstScoringGameweek, overBudgetBy, signUpProblems } from "./signUp";

const prices = byPick(allPicks(validSquad()).map((pick) => [pick, 10 * WON_PER_M]));
// Fixture values: FPL caps team names at 20 characters; the real cap and teams are data.
const RULES = { squad: REGULAR_SETTINGS, budget: 100 * WON_PER_M, teamNameMaxLength: 20, teamIds: ["t1", "gen", "hle"] };
const FIELDS = { teamName: "Faker's Chair", favouriteTeamId: "t1", country: "GB" };

describe("signUpProblems", () => {
  test("a valid squad with a team name, favourite team and country becomes an entry", () => {
    expect(signUpProblems(validSquad(), prices, FIELDS, RULES)).toEqual([]);
  });

  test("an invalid squad can't be saved", () => {
    const squad = { ...validSquad(), bench: [validSquad().bench[0]!] };
    expect(signUpProblems(squad, prices, FIELDS, RULES)).toEqual([
      { rule: "squad", problem: { rule: "slotCount", slot: "bench", expected: 2, actual: 1 } },
    ]);
  });

  test("a squad over budget can't be saved", () => {
    const dear = new Map(prices).set(pickKey(chovy), 30 * WON_PER_M);
    expect(signUpProblems(validSquad(), dear, FIELDS, RULES)).toEqual([
      { rule: "squad", problem: { rule: "overBudget", budget: 100 * WON_PER_M, cost: 110 * WON_PER_M } },
    ]);
  });

  test("each of the three fields is required", () => {
    const blank = { teamName: " ", favouriteTeamId: "", country: "" };
    expect(signUpProblems(validSquad(), prices, blank, RULES)).toEqual([
      { rule: "missing", field: "teamName" },
      { rule: "missing", field: "favouriteTeamId" },
      { rule: "missing", field: "country" },
    ]);
  });

  test("a team name is capped in length but need not be unique", () => {
    expect(signUpProblems(validSquad(), prices, { ...FIELDS, teamName: "x".repeat(21) }, RULES)).toEqual([
      { rule: "teamNameTooLong", maxLength: 20 },
    ]);
    // Two managers called Faker's Chair: nothing here checks other entries' names.
    expect(signUpProblems(validSquad(), prices, FIELDS, RULES)).toEqual([]);
  });

  test("the favourite team is one of the competition's teams", () => {
    expect(signUpProblems(validSquad(), prices, { ...FIELDS, favouriteTeamId: "lec-team" }, RULES)).toEqual([
      { rule: "unknownTeam", teamId: "lec-team" },
    ]);
  });
});

describe("Save team at today's prices (spec/09, Signing up)", () => {
  test("a squad picked before a deadline moved prices is checked at today's, and says by how much it is over", () => {
    const picked = signUpProblems(validSquad(), prices, FIELDS, RULES);
    expect(overBudgetBy(picked)).toBeNull();
    // Nine at 10m is 90m of 100m. Since the guest picked, Chovy rose to 20.3m: 100.3m, ₩0.3m over.
    const today = new Map(prices).set(pickKey(chovy), 20_300_000);
    expect(overBudgetBy(signUpProblems(validSquad(), today, FIELDS, RULES))).toBe(300_000);
  });

  test("a squad still under budget at today's prices saves", () => {
    const today = new Map(prices).set(pickKey(chovy), 19 * WON_PER_M);
    expect(signUpProblems(validSquad(), today, FIELDS, RULES)).toEqual([]);
  });
});

describe("firstCaptain (spec/09: after Save team)", () => {
  test("the highest-priced starter", () => {
    expect(firstCaptain(validSquad(), new Map(prices).set(pickKey(keria), 15 * WON_PER_M))).toBe(keria.id);
  });

  test("never the coach or a bench player, however dear", () => {
    const dear = new Map(prices).set(pickKey(ktCoach), 30 * WON_PER_M).set(pickKey(bdd), 30 * WON_PER_M).set(pickKey(ruler), 12 * WON_PER_M);
    expect(firstCaptain(validSquad(), dear)).toBe(ruler.id);
  });

  test("a tie goes to the first in slot order: top before flex", () => {
    const tied = new Map(prices).set(pickKey(ruler), 15 * WON_PER_M).set(pickKey(zeus), 15 * WON_PER_M);
    expect(firstCaptain(validSquad(), tied)).toBe(zeus.id);
  });
});

describe("firstScoringGameweek", () => {
  const gameweeks = [5, 6, 7].map((number) => ({ number, deadline: number * 1000 }));

  test("joining after gameweek 5's deadline scores from gameweek 6", () => {
    expect(firstScoringGameweek(5001, gameweeks)).toBe(6);
  });

  test("joining before a deadline scores from that gameweek", () => {
    expect(firstScoringGameweek(4999, gameweeks)).toBe(5);
  });

  test("after the last deadline there is none", () => {
    expect(firstScoringGameweek(7000, gameweeks)).toBeNull();
  });
});

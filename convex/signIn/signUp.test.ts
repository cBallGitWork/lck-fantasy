import { WON_PER_M } from "../../src/parts/text/money";
import { describe, expect, test } from "vitest";
import { chovy, REGULAR_SETTINGS, validSquad } from "../squads/fixtures";
import { allPicks, pickKey } from "../squads/squad";
import { firstScoringGameweek, signUpProblems } from "./signUp";

const prices = new Map(allPicks(validSquad()).map((pick) => [pickKey(pick), 10 * WON_PER_M]));
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

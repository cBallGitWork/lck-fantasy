import { describe, expect, test } from "vitest";
import { autoLeagues, canChangeFavouriteTeam, joinProblems, mayAct } from "./membership";

const FPL_LIKE = { privateLeagueCap: 25, privateLeagueSize: null }; // fixture values: the real ones are data

describe("autoLeagues", () => {
  test("a new manager joins Overall, their country's league and their team's", () => {
    expect(autoLeagues({ country: "GB", favouriteTeamId: "t1" })).toEqual([
      { kind: "overall" },
      { kind: "country", country: "GB" },
      { kind: "team", teamId: "t1" },
    ]);
  });
});

describe("canChangeFavouriteTeam", () => {
  test("open until the first gameweek scores, then fixed", () => {
    expect(canChangeFavouriteTeam(null)).toBe(true);
    expect(canChangeFavouriteTeam(3)).toBe(false);
  });
});

describe("joinProblems", () => {
  test("up to 25 private leagues, and no size cap", () => {
    expect(joinProblems(24, 10_000, FPL_LIKE)).toEqual([]);
    expect(joinProblems(25, 3, FPL_LIKE)).toEqual([{ rule: "privateLeagueCap", cap: 25 }]);
  });

  test("both numbers are data", () => {
    expect(joinProblems(2, 50, { privateLeagueCap: 3, privateLeagueSize: 50 })).toEqual([{ rule: "leagueFull", size: 50 }]);
  });
});

describe("mayAct", () => {
  test("the maker can rename, remove a manager and delete", () => {
    for (const action of ["rename", "remove", "delete"] as const) {
      expect(mayAct(action, "maker", "maker")).toBe(true);
      expect(mayAct(action, "member", "maker")).toBe(false);
    }
  });

  test("any other member can leave", () => {
    expect(mayAct("leave", "member", "maker")).toBe(true);
  });
});

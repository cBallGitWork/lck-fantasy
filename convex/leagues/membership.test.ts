import { describe, expect, test } from "vitest";
import { autoLeagues, canChangeFavouriteTeam, joinCode, joinProblems, mayAct, normalCode, startGameweekChoices } from "./membership";

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
  test("open until the first gameweek's deadline, then fixed", () => {
    const deadline = Date.UTC(2027, 0, 14, 9);
    expect(canChangeFavouriteTeam(deadline, deadline - 1)).toBe(true);
    expect(canChangeFavouriteTeam(deadline, deadline)).toBe(false);
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

describe("startGameweekChoices", () => {
  test("a league made in gameweek 4 counts from gameweek 4 by default, or a later one", () => {
    expect(startGameweekChoices(4, 7)).toEqual([4, 5, 6, 7]);
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

  test("the maker can't leave without deleting the league", () => {
    expect(mayAct("leave", "maker", "maker")).toBe(false);
  });
});

describe("joinCode", () => {
  const first = () => 0; // always the first character, A
  test("up to four letters of the name's first word, then four random characters", () => {
    expect(joinCode("Gank squad", first)).toBe("GANK-AAAA");
    expect(joinCode(" Pub League", first)).toBe("PUB-AAAA");
  });

  test("two random parts for a name with no Latin letters at its start", () => {
    expect(joinCode("한강 리그", first)).toBe("AAAA-AAAA");
  });

  test("a typed code matches in any case, spaces trimmed", () => {
    expect(normalCode(" gank-4tq1 ")).toBe("GANK-4TQ1");
  });
});

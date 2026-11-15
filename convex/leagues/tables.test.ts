import { describe, expect, test } from "vitest";
import { carryShown, chaseTag, leagueTable, legendAndRise, legendRiseTable, rankMovement, type LeagueMember } from "./tables";

// Fixture calendar: Split 1 is gameweeks 1–4 (Road to MSI is gameweek 4), Split 2 is 5–6.
const SEASON = { first: 1, last: 6 };
const SPLIT_1 = { first: 1, last: 4 };
const SPLIT_2 = { first: 5, last: 6 };

/** A member scoring `points[i]` in gameweek i + 1, with `transfers` each week. */
function member(entryId: string, points: number[], transfers = 0): LeagueMember {
  return { entryId, gameweeks: points.map((p, i) => ({ gameweek: i + 1, points: p, transfers })) };
}

const ids = (rows: { entryId: string }[]) => rows.map((row) => row.entryId);

describe("leagueTable", () => {
  test("ranks on total points", () => {
    const table = leagueTable([member("a", [10, 20]), member("b", [40, 1])], SEASON, 1, 2);
    expect(table).toEqual([
      { entryId: "b", rank: 1, gameweekPoints: 1, total: 41, transfers: 0 },
      { entryId: "a", rank: 2, gameweekPoints: 20, total: 30, transfers: 0 },
    ]);
  });

  test("each split's table counts only its own points; Road to MSI is in Split 1's", () => {
    const members = [member("a", [10, 10, 10, 30, 1, 1]), member("b", [12, 12, 12, 12, 20, 20])];
    expect(leagueTable(members, SPLIT_1, 1, 6).map((r) => [r.entryId, r.total])).toEqual([["a", 60], ["b", 48]]);
    expect(leagueTable(members, SPLIT_2, 1, 6).map((r) => [r.entryId, r.total])).toEqual([["b", 40], ["a", 2]]);
    expect(leagueTable(members, SEASON, 1, 6).map((r) => [r.entryId, r.total])).toEqual([["b", 88], ["a", 62]]);
  });

  test("a private league counts from the gameweek its maker picked", () => {
    const members = [member("a", [50, 5, 5, 5]), member("b", [0, 10, 10, 10])];
    expect(ids(leagueTable(members, SEASON, 4, 4))).toEqual(["b", "a"]);
    expect(leagueTable(members, SEASON, 4, 4)[0]!.total).toBe(10);
  });

  test("a member with no row for the latest gameweek throws, rather than show 0", () => {
    expect(() => leagueTable([member("a", [9, 4]), member("b", [7])], SEASON, 1, 2)).toThrow("No points row for b in gameweek 2.");
  });

  test("a tie on points goes to fewer transfers; still level, the rank is shared", () => {
    const table = leagueTable([member("a", [20], 2), member("b", [20], 1), member("c", [20], 2), member("d", [5])], SEASON, 1, 1);
    expect(table.map((r) => [r.entryId, r.rank])).toEqual([["b", 1], ["a", 2], ["c", 2], ["d", 4]]);
  });
});

describe("rankMovement", () => {
  test("up is positive, down negative, and a new member has none", () => {
    const members = [member("a", [10, 0]), member("b", [5, 20])];
    const before = leagueTable(members, SEASON, 1, 1);
    const after = leagueTable([...members, member("c", [0, 1])], SEASON, 1, 2);
    expect(rankMovement(before, after)).toEqual(new Map([["b", 1], ["a", -1], ["c", null]]));
  });
});

describe("legendRiseTable", () => {
  test("on the Split 2 tab the total is season points, with Split 2's beside it", () => {
    const members = [member("a", [30, 0, 0, 0, 1, 1]), member("b", [20, 0, 0, 0, 5, 5])];
    expect(legendRiseTable(members, SEASON, SPLIT_2, 6).map((r) => [r.entryId, r.total, r.splitTotal])).toEqual([
      ["a", 32, 2],
      ["b", 30, 10],
    ]);
  });
});

describe("chaseTag", () => {
  const table = leagueTable([member("a", [50]), member("b", [34]), member("c", [34], 1), member("d", [10])], SEASON, 1, 1);

  test("the points to the rank above: 16 pts to 1st", () => {
    expect(chaseTag(table, "b")).toEqual({ kind: "chasing", points: 16, rank: 1 });
    expect(chaseTag(table, "d")).toEqual({ kind: "chasing", points: 24, rank: 3 });
  });

  test("1st shows the lead over 2nd: +16 clear", () => {
    expect(chaseTag(table, "a")).toEqual({ kind: "clear", points: 16 });
  });

  test("nothing when level", () => {
    expect(chaseTag(table, "c")).toBeNull();
    const tiedTop = leagueTable([member("a", [20]), member("b", [20])], SEASON, 1, 1);
    expect(chaseTag(tiedTop, "a")).toBeNull();
    expect(chaseTag(tiedTop, "b")).toBeNull();
  });

  test("a manager not in the table throws", () => {
    expect(() => chaseTag(table, "z")).toThrow("z is not in this table.");
  });
});

describe("carryShown", () => {
  test("hidden until the gameweek's deadline, then shown", () => {
    expect(carryShown(1_000, 999)).toBe(false);
    expect(carryShown(1_000, 1_000)).toBe(true);
  });
});

describe("legendAndRise", () => {
  test("the top half of Split 1's Overall is Legend, the rest Rise", () => {
    const split1 = leagueTable([member("a", [9, 0, 0, 0]), member("b", [7, 0, 0, 0]), member("c", [5, 0, 0, 0]), member("d", [3, 0, 0, 0])], SPLIT_1, 1, 4);
    expect(legendAndRise(split1, ["a", "b", "c", "d"])).toEqual({ legend: ["a", "b"], rise: ["c", "d"] });
  });

  test("a manager who joins in Split 2 goes into Rise", () => {
    const split1 = leagueTable([member("a", [9, 0, 0, 0]), member("b", [7, 0, 0, 0])], SPLIT_1, 1, 4);
    expect(legendAndRise(split1, ["a", "b", "new"])).toEqual({ legend: ["a"], rise: ["b", "new"] });
  });

  test("Legend and Rise rank on season points, Split 1 included", () => {
    const members = [member("a", [30, 0, 0, 0, 1, 1]), member("b", [20, 0, 0, 0, 5, 5])];
    const legend = leagueTable(members, SEASON, 1, 6);
    expect(legend.map((r) => [r.entryId, r.total])).toEqual([["a", 32], ["b", 30]]);
  });
});
